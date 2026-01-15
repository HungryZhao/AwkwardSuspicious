import { useState } from 'react'
import './App.css'
import FileUploader from './components/FileUploader'
import PromptDetector from './components/PromptDetector'
import ResultDisplay from './components/ResultDisplay'

function App() {
  const [file, setFile] = useState(null)
  const [detectionResults, setDetectionResults] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const handleFileSelect = (selectedFile) => {
    setFile(selectedFile)
    setDetectionResults(null)
  }

  const handleDetectionComplete = (results) => {
    setDetectionResults(results)
    setIsProcessing(false)
  }

  const handleStartProcessing = () => {
    setIsProcessing(true)
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>🔍 隐藏提示词检测工具</h1>
        <h2>Hidden Prompt Detector</h2>
        <p>检测并移除PDF、Word、Markdown和TXT文件中的隐藏AI提示词</p>
      </header>

      <main className="app-main">
        <FileUploader onFileSelect={handleFileSelect} />
        
        {file && (
          <PromptDetector 
            file={file} 
            onDetectionComplete={handleDetectionComplete}
            onStartProcessing={handleStartProcessing}
          />
        )}

        {isProcessing && (
          <div className="processing-indicator">
            <div className="spinner"></div>
            <p>正在处理文件... Processing file...</p>
          </div>
        )}

        {detectionResults && (
          <ResultDisplay results={detectionResults} originalFile={file} />
        )}
      </main>

      <footer className="app-footer">
        <p>支持格式: PDF, Word (.docx), Markdown (.md), TXT</p>
      </footer>
    </div>
  )
}

export default App
