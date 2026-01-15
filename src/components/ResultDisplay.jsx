import { saveAs } from 'file-saver'
import './ResultDisplay.css'

function ResultDisplay({ results, originalFile }) {
  if (results.error) {
    return (
      <div className="result-container error">
        <h3>❌ 错误 / Error</h3>
        <p>{results.error}</p>
      </div>
    )
  }

  const handleDownloadCleaned = () => {
    const fileExtension = results.fileType
    const baseName = originalFile.name.substring(0, originalFile.name.lastIndexOf('.'))
    const newFileName = `${baseName}_cleaned${fileExtension}`
    
    const blob = new Blob([results.cleanedText], { type: 'text/plain;charset=utf-8' })
    saveAs(blob, newFileName)
  }

  const handleDownloadReport = () => {
    const baseName = originalFile.name.substring(0, originalFile.name.lastIndexOf('.'))
    const reportFileName = `${baseName}_detection_report.txt`
    
    let report = '隐藏提示词检测报告 / Hidden Prompt Detection Report\n'
    report += '='.repeat(60) + '\n\n'
    report += `原始文件 / Original File: ${originalFile.name}\n`
    report += `检测时间 / Detection Time: ${new Date().toLocaleString()}\n\n`
    
    if (results.detectedPrompts.length === 0) {
      report += '✓ 未检测到隐藏提示词\n'
      report += '✓ No hidden prompts detected\n'
    } else {
      report += `检测到 ${results.detectedPrompts.length} 个可疑提示词\n`
      report += `Detected ${results.detectedPrompts.length} suspicious prompts\n\n`
      
      results.detectedPrompts.forEach((prompt, index) => {
        report += `\n[提示词 #${index + 1} / Prompt #${index + 1}]\n`
        report += `-`.repeat(40) + '\n'
        report += `类型 / Type: ${prompt.type}\n`
        if (prompt.reason) {
          report += `原因 / Reason: ${prompt.reason}\n`
        }
        if (prompt.page) {
          report += `页码 / Page: ${prompt.page}\n`
        }
        report += `内容 / Content:\n${prompt.text}\n`
        if (prompt.context) {
          report += `上下文 / Context:\n${prompt.context}\n`
        }
      })
    }
    
    const blob = new Blob([report], { type: 'text/plain;charset=utf-8' })
    saveAs(blob, reportFileName)
  }

  return (
    <div className="result-container">
      <h3>📊 检测结果 / Detection Results</h3>
      
      <div className="summary-section">
        {results.detectedPrompts.length === 0 ? (
          <div className="summary-box success">
            <div className="summary-icon">✅</div>
            <div className="summary-text">
              <h4>未检测到隐藏提示词</h4>
              <p>No hidden prompts detected</p>
            </div>
          </div>
        ) : (
          <div className="summary-box warning">
            <div className="summary-icon">⚠️</div>
            <div className="summary-text">
              <h4>检测到 {results.detectedPrompts.length} 个可疑提示词</h4>
              <p>Detected {results.detectedPrompts.length} suspicious prompt(s)</p>
            </div>
          </div>
        )}
      </div>

      {results.detectedPrompts.length > 0 && (
        <div className="prompts-section">
          <h4>🔍 检测到的提示词 / Detected Prompts</h4>
          {results.detectedPrompts.map((prompt, index) => (
            <div key={index} className="prompt-item">
              <div className="prompt-header">
                <span className="prompt-number">#{index + 1}</span>
                <span className="prompt-type">{prompt.type}</span>
                {prompt.page && <span className="prompt-page">Page {prompt.page}</span>}
              </div>
              <div className="prompt-content">
                <strong>内容 / Content:</strong>
                <pre>{prompt.text}</pre>
              </div>
              {prompt.context && (
                <div className="prompt-context">
                  <strong>上下文 / Context:</strong>
                  <pre>{prompt.context}</pre>
                </div>
              )}
              {prompt.reason && (
                <div className="prompt-reason">
                  <strong>检测原因 / Reason:</strong> {prompt.reason}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="actions-section">
        <h4>📥 下载选项 / Download Options</h4>
        <div className="action-buttons">
          <button onClick={handleDownloadCleaned} className="download-btn primary">
            📄 下载清理后的文件<br/>
            <span className="btn-subtitle">Download Cleaned File</span>
          </button>
          {results.detectedPrompts.length > 0 && (
            <button onClick={handleDownloadReport} className="download-btn secondary">
              📋 下载检测报告<br/>
              <span className="btn-subtitle">Download Detection Report</span>
            </button>
          )}
        </div>
      </div>

      <div className="preview-section">
        <details>
          <summary>🔎 查看原始文本 / View Original Text ({results.originalText.length} 字符 / characters)</summary>
          <pre className="text-preview">{results.originalText}</pre>
        </details>
        <details>
          <summary>✨ 查看清理后的文本 / View Cleaned Text ({results.cleanedText.length} 字符 / characters)</summary>
          <pre className="text-preview">{results.cleanedText}</pre>
        </details>
      </div>
    </div>
  )
}

export default ResultDisplay
