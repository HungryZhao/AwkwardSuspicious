import { useState, useRef } from 'react'
import './FileUploader.css'

function FileUploader({ onFileSelect }) {
  const [dragActive, setDragActive] = useState(false)
  const [selectedFileName, setSelectedFileName] = useState('')
  const fileInputRef = useRef(null)

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleChange = (e) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleFile = (file) => {
    const validExtensions = ['.pdf', '.docx', '.md', '.txt']
    const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase()
    
    if (validExtensions.includes(fileExtension)) {
      setSelectedFileName(file.name)
      onFileSelect(file)
    } else {
      alert('请上传支持的文件格式: PDF, Word (.docx), Markdown (.md), 或 TXT\nPlease upload a supported file format: PDF, Word (.docx), Markdown (.md), or TXT')
    }
  }

  const onButtonClick = () => {
    fileInputRef.current.click()
  }

  return (
    <div className="file-uploader">
      <div 
        className={`upload-area ${dragActive ? 'drag-active' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          id="file-input"
          accept=".pdf,.docx,.md,.txt"
          onChange={handleChange}
          style={{ display: 'none' }}
        />
        
        <div className="upload-content">
          <div className="upload-icon">📄</div>
          {selectedFileName ? (
            <div className="selected-file">
              <p className="file-name">已选择: {selectedFileName}</p>
              <button onClick={onButtonClick} className="change-file-btn">
                更换文件 / Change File
              </button>
            </div>
          ) : (
            <>
              <p className="upload-text">
                拖拽文件到此处或点击上传<br/>
                Drag & drop file here or click to upload
              </p>
              <button onClick={onButtonClick} className="upload-btn">
                选择文件 / Select File
              </button>
              <p className="upload-hint">
                支持格式: PDF, Word (.docx), Markdown (.md), TXT
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default FileUploader
