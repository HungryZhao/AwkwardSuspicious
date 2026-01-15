import { useEffect } from 'react'
import * as pdfjsLib from 'pdfjs-dist'
import mammoth from 'mammoth'

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`

function PromptDetector({ file, onDetectionComplete, onStartProcessing }) {
  useEffect(() => {
    if (file) {
      processFile(file)
    }
  }, [file])

  const processFile = async (file) => {
    onStartProcessing()
    
    try {
      let extractedText = ''
      let hiddenTextInfo = []
      
      const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase()
      
      if (fileExtension === '.pdf') {
        const result = await processPDF(file)
        extractedText = result.text
        hiddenTextInfo = result.hiddenInfo
      } else if (fileExtension === '.docx') {
        const result = await processWord(file)
        extractedText = result.text
        hiddenTextInfo = result.hiddenInfo
      } else if (fileExtension === '.md' || fileExtension === '.txt') {
        extractedText = await processTextFile(file)
        hiddenTextInfo = []
      }
      
      const detectedPrompts = detectHiddenPrompts(extractedText, hiddenTextInfo)
      const cleanedText = removeHiddenPrompts(extractedText, detectedPrompts)
      
      onDetectionComplete({
        originalText: extractedText,
        cleanedText: cleanedText,
        detectedPrompts: detectedPrompts,
        hiddenTextInfo: hiddenTextInfo,
        fileType: fileExtension
      })
    } catch (error) {
      console.error('Error processing file:', error)
      onDetectionComplete({
        error: `处理文件时出错: ${error.message}\nError processing file: ${error.message}`
      })
    }
  }

  const processPDF = async (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader()
      
      fileReader.onload = async function() {
        try {
          const typedArray = new Uint8Array(this.result)
          const pdf = await pdfjsLib.getDocument(typedArray).promise
          
          let fullText = ''
          let hiddenInfo = []
          
          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i)
            const textContent = await page.getTextContent()
            
            textContent.items.forEach((item) => {
              const text = item.str
              
              // Check for hidden text indicators
              const isHidden = checkIfHidden(item)
              
              if (isHidden) {
                hiddenInfo.push({
                  text: text,
                  page: i,
                  reason: isHidden
                })
              }
              
              fullText += text + ' '
            })
            
            fullText += '\n'
          }
          
          resolve({ text: fullText, hiddenInfo })
        } catch (error) {
          reject(error)
        }
      }
      
      fileReader.onerror = () => reject(new Error('Failed to read PDF file'))
      fileReader.readAsArrayBuffer(file)
    })
  }

  const checkIfHidden = (item) => {
    // Check if text has white or transparent color
    if (item.transform) {
      const fontSize = Math.abs(item.transform[0])
      if (fontSize < 1) {
        return 'font-size-zero'
      }
    }
    
    // Check for white or near-white text color
    if (item.color) {
      const color = item.color
      if (Array.isArray(color) && color.length === 3) {
        const [r, g, b] = color
        if (r > 0.95 && g > 0.95 && b > 0.95) {
          return 'white-text'
        }
      }
    }
    
    return null
  }

  const processWord = async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      
      reader.onload = async (e) => {
        try {
          const arrayBuffer = e.target.result
          const result = await mammoth.extractRawText({ arrayBuffer })
          
          // Word documents don't easily expose style information in mammoth
          // We'll rely on text pattern detection
          resolve({ text: result.value, hiddenInfo: [] })
        } catch (error) {
          reject(error)
        }
      }
      
      reader.onerror = () => reject(new Error('Failed to read Word file'))
      reader.readAsArrayBuffer(file)
    })
  }

  const processTextFile = async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      
      reader.onload = (e) => {
        resolve(e.target.result)
      }
      
      reader.onerror = () => reject(new Error('Failed to read text file'))
      reader.readAsText(file, 'UTF-8')
    })
  }

  const detectHiddenPrompts = (text, hiddenTextInfo) => {
    const prompts = []
    
    // Add explicitly hidden text from PDF/Word analysis
    hiddenTextInfo.forEach(info => {
      if (info.text.length > 10) { // Only consider meaningful text
        prompts.push({
          text: info.text,
          type: 'hidden-style',
          reason: info.reason,
          page: info.page
        })
      }
    })
    
    // Pattern-based detection for AI prompts
    const aiPatterns = [
      // English patterns
      /if you are (an? )?(ai|artificial intelligence|language model|llm|gpt|assistant)/gi,
      /as an ai( assistant| model)?[,\s]+(?:please\s+)?(?:you\s+)?(?:should|must|need to|have to)\s+[^\n]{10,}/gi,
      /ignore (all )?previous (instructions|prompts|commands)/gi,
      /you (must|should|need to|have to) (include|add|write|output|say|mention)/gi,
      /in your (response|answer|output|reply)[,\s]+(include|add|write|say|mention)/gi,
      /hidden (instruction|prompt|message|text)/gi,
      /secret (instruction|prompt|message|text)/gi,
      /(?:please\s+)?(?:make sure to|be sure to|remember to)\s+(?:include|add|write|output|mention)\s+[^\n]{10,}/gi,
      
      // Chinese patterns
      /如果你是(一个)?ai|人工智能|语言模型|助手|机器人/gi,
      /作为(一个)?ai(助手|模型)?[，,\s]*(?:请)?(?:你)?(?:应该|必须|需要)[^\n]{10,}/gi,
      /忽略(所有)?(?:之前|前面|以前)的?(?:指令|提示|命令)/gi,
      /你(?:应该|必须|需要)(?:包含|添加|写入|输出|提到|说)/gi,
      /在你的(?:回答|回复|输出)中[，,\s]*(?:包含|添加|写入|提到|说)/gi,
      /隐藏(?:指令|提示|消息|文字|文本)/gi,
      /秘密(?:指令|提示|消息|文字|文本)/gi,
      /(?:请)?(?:确保|务必|记得)(?:包含|添加|写入|输出|提到)[^\n]{10,}/gi,
    ]
    
    aiPatterns.forEach(pattern => {
      const matches = text.matchAll(pattern)
      for (const match of matches) {
        // Get some context around the match
        const startIdx = Math.max(0, match.index - 50)
        const endIdx = Math.min(text.length, match.index + match[0].length + 50)
        const context = text.substring(startIdx, endIdx)
        
        prompts.push({
          text: match[0],
          context: context,
          type: 'pattern-match',
          pattern: pattern.source
        })
      }
    })
    
    return prompts
  }

  const removeHiddenPrompts = (text, detectedPrompts) => {
    let cleanedText = text
    
    // Remove detected prompt text
    detectedPrompts.forEach(prompt => {
      // Remove the exact matched text
      cleanedText = cleanedText.replace(prompt.text, '')
    })
    
    // Clean up extra whitespace
    cleanedText = cleanedText.replace(/\n\s*\n\s*\n/g, '\n\n')
    cleanedText = cleanedText.replace(/  +/g, ' ')
    
    return cleanedText.trim()
  }

  return null // This component doesn't render anything
}

export default PromptDetector
