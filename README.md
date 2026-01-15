# 🔍 隐藏提示词检测工具 / Hidden Prompt Detector

一个用于检测和移除文档中隐藏AI提示词的Web应用程序。

A web application for detecting and removing hidden AI prompts from documents.

![Hidden Prompt Detector](https://github.com/user-attachments/assets/ee82bf95-7ea3-47bf-b064-2641ab096f76)

## 问题背景 / Background

有些教授会在PDF、Word等文档中使用零号字体、白色文字或透明文字来隐藏AI提示词。这些隐藏的指令会让AI在生成内容时包含特定标记，使得AI生成的作业容易被识别。

Some professors hide AI prompts in PDFs and Word documents using zero-size fonts, white text, or transparent text. These hidden instructions cause AI to include specific markers in generated content, making AI-generated assignments easily identifiable.

## 功能特性 / Features

- ✅ 支持多种文档格式：PDF, Word (.docx), Markdown (.md), TXT
- ✅ 检测中文和英文隐藏提示词
- ✅ 识别样式隐藏的文本（PDF中的零号字体、白色文字）
- ✅ 基于模式匹配检测常见AI提示词
- ✅ 显示检测到的所有可疑提示词及其上下文
- ✅ 生成清理后的文件供下载
- ✅ 生成详细的检测报告

- ✅ Supports multiple document formats: PDF, Word (.docx), Markdown (.md), TXT
- ✅ Detects Chinese and English hidden prompts
- ✅ Identifies style-hidden text (zero-size fonts, white text in PDFs)
- ✅ Pattern-based detection of common AI prompts
- ✅ Displays all detected suspicious prompts with context
- ✅ Generates cleaned files for download
- ✅ Generates detailed detection reports

## 检测示例 / Detection Examples

![Detection Results](https://github.com/user-attachments/assets/3024f6f3-4989-489b-9f95-75945d8f69cc)

该工具可以检测到以下类型的隐藏提示词：

The tool can detect the following types of hidden prompts:

### 中文模式 / Chinese Patterns
- "如果你是AI，请..."
- "作为AI助手，你应该..."
- "在你的回答中包含..."
- "隐藏指令/提示"

### English Patterns
- "If you are an AI, you must..."
- "As an AI assistant, please..."
- "You should include in your response..."
- "Hidden instruction/prompt"

## 快速开始 / Quick Start

### 安装依赖 / Install Dependencies

```bash
npm install
```

### 运行开发服务器 / Run Development Server

```bash
npm run dev
```

### 构建生产版本 / Build for Production

```bash
npm run build
```

### 预览生产版本 / Preview Production Build

```bash
npm run preview
```

## 使用方法 / How to Use

1. **上传文件 / Upload File**: 拖拽或点击上传按钮选择文件（支持PDF, Word, Markdown, TXT）
2. **自动检测 / Auto Detection**: 系统自动分析文件并检测隐藏提示词
3. **查看结果 / View Results**: 查看检测到的所有可疑提示词及其上下文
4. **下载文件 / Download Files**: 
   - 下载清理后的文件（已移除隐藏提示词）
   - 下载检测报告（包含所有检测细节）

## 技术栈 / Tech Stack

- **前端框架 / Frontend**: React + Vite
- **PDF处理 / PDF Processing**: PDF.js
- **Word处理 / Word Processing**: Mammoth.js
- **文件下载 / File Download**: FileSaver.js
- **样式 / Styling**: CSS3

## 检测原理 / Detection Methodology

### 样式分析 / Style Analysis
- 检测PDF中的零号或极小字体
- 检测白色或接近白色的文字颜色
- （计划支持更多Word样式检测）

### 模式匹配 / Pattern Matching
- 使用正则表达式匹配常见AI提示词模式
- 支持中英文双语检测
- 提供上下文以便人工确认

## 项目结构 / Project Structure

```
src/
├── components/
│   ├── FileUploader.jsx       # 文件上传组件
│   ├── PromptDetector.jsx     # 提示词检测逻辑
│   └── ResultDisplay.jsx      # 结果显示组件
├── App.jsx                    # 主应用组件
└── main.jsx                   # 应用入口
```

## 贡献 / Contributing

欢迎提交Issue和Pull Request！

Issues and Pull Requests are welcome!

## 许可证 / License

MIT License

## 致谢 / Acknowledgments

本项目旨在帮助学生识别并移除文档中可能存在的隐藏AI提示词，确保学术诚信。

This project aims to help students identify and remove potential hidden AI prompts in documents to ensure academic integrity.

