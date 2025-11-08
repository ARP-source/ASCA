# ASCA - Adaptive Student Coaching Agents

Multi-agent AI system helping students manage academic workload and wellness through intelligent collaboration.

## 🎯 Overview

ASCA uses three specialized AI agents powered by Google Gemini Pro that communicate with each other to provide comprehensive academic support:

1. **Assignment Analyzer Agent** - Analyzes workload complexity and estimates time requirements
2. **Schedule Optimizer Agent** - Creates optimized study schedules with breaks
3. **Wellness Monitor Agent** - Assesses student wellness and provides recommendations

## 🤖 Multi-Agent Architecture

```
Student Input → Assignment Analyzer → Schedule Optimizer → Wellness Monitor → Complete Analysis
                      ↓                      ↓                      ↓
                 Workload Data         Schedule Data         Wellness Data
```

Each agent sends structured JSON messages to the next, creating true multi-agent collaboration.

## 🚀 Quick Start

### Prerequisites
- Python 3.11+
- Google Gemini API key

### Installation

```bash
cd backend
pip install -r requirements.txt
```

### Run the Demo

```bash
# Test the multi-agent system
python test_agents.py

# Start the API server
python main.py
```

Visit http://localhost:8080/docs for API documentation.

### Run the Frontend

```bash
cd ..
python -m http.server 8000
```

Visit http://localhost:8000 for the web interface.

## 📡 API Endpoints

- `POST /api/analyze-assignment` - Analyze single assignment
- `POST /api/analyze-workload` - Analyze multiple assignments
- `POST /api/create-schedule` - Create optimized schedule (2 agents)
- `POST /api/wellness-check` - Wellness assessment (3 agents)
- `POST /api/full-analysis` - Complete multi-agent workflow

## 🏗️ Tech Stack

- **AI**: Google Gemini Pro API
- **Backend**: FastAPI (Python 3.11)
- **Deployment**: Google Cloud Run
- **Frontend**: HTML/CSS/JavaScript

## 🌐 Deployment

Deploy to Google Cloud Run:

```bash
cd backend
gcloud run deploy asca-backend \
  --source . \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars GEMINI_API_KEY=your_key_here
```

## 📁 Project Structure

```
ASCA/
├── backend/
│   ├── agents/
│   │   ├── assignment_analyzer.py
│   │   ├── schedule_optimizer.py
│   │   └── wellness_monitor.py
│   ├── main.py
│   ├── test_agents.py
│   ├── requirements.txt
│   └── Dockerfile
├── index.html
├── api-client.js
└── README.md
```

## 🎥 Demo

[Link to demo video]

## 📝 License

MIT License

## 🏆 Hackathon

Built for [Hackathon Name] - Multi-Agent AI Challenge
