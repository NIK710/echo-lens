# EchoLens

EchoLens is a Chrome extension + Python backend that analyzes Reddit threads for bias, echo chambers, and counterpoints using the Google Gemini API.

---

## What It Does

When you visit a Reddit thread and click the extension icon, EchoLens:
- Analyzes tone and bias across top comments
- Summarizes the dominant narrative
- Surfaces thoughtful counterpoints
- Explains the framing/language used and how it might shape your perspective

---

## Try the Demo (No Setup Needed)

Follow these quick steps to demo EchoLens using the deployed backend:

### 1. Clone or Download This Repo

```bash
git clone https://github.com/your-username/echo-lens.git
cd echo-lens
```

### 2. Load the Chrome Extension
- Open Google Chrome and go to chrome://extensions
- Enable Developer Mode (top right)
- Click “Load unpacked”
- Select the extension/ folder in this repo



### 3. Use the Extension
- Visit any Reddit thread
- Click the EchoLens extension icon
- Wait a few seconds while the backend fetches and analyzes comments

#### Built With: Gemini API, Python Reddit API Wrapper (PRAW), FastAPI, Chrome Extensions (Manifest V3)

