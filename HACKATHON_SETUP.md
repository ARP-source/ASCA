# ASCA Hackathon Setup Guide

## 🎯 What You Have

A **complete multi-agent system** ready for the Google Cloud hackathon:

- ✅ **3 AI Agents** that communicate with each other
- ✅ **Google Gemini API** integration
- ✅ **FastAPI backend** with REST endpoints
- ✅ **Cloud Run deployment** configuration
- ✅ **Frontend UI** (bonus - not required)

## 🚀 Quick Start (5 minutes)

### 1. Test Locally

```bash
cd backend
pip install -r requirements.txt
python test_agents.py
```

This will demonstrate all 3 agents working together!

### 2. Run the API Server

```bash
python main.py
```

Visit `http://localhost:8080/docs` to see the interactive API documentation.

### 3. Deploy to Cloud Run

```bash
# Set your project ID
gcloud config set project YOUR_PROJECT_ID

# Deploy
gcloud run deploy asca-backend \
  --source . \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars GEMINI_API_KEY=AIzaSyAGZ53ALwzqavGMlFxSenqbrG9aJHXOFBw
```

## 📡 Testing the Multi-Agent System

### Option 1: Use the test script
```bash
python test_agents.py
```

### Option 2: Use curl
```bash
curl -X POST http://localhost:8080/api/full-analysis \
  -H "Content-Type: application/json" \
  -d '{
    "assignments": [
      {
        "id": "hw1",
        "title": "History Essay",
        "description": "5-page essay on WWII",
        "due_date": "2025-11-15",
        "course": "History 101"
      }
    ]
  }'
```

### Option 3: Use the API docs
Go to `http://localhost:8080/docs` and try the `/api/full-analysis` endpoint

## 🤖 How the Agents Work Together

1. **Assignment Analyzer** receives student assignments
2. Analyzes complexity, estimates time, calculates stress level
3. **Sends message** to Schedule Optimizer with workload data
4. **Schedule Optimizer** creates optimized study schedule
5. **Sends message** to Wellness Monitor with schedule metrics
6. **Wellness Monitor** assesses student wellness
7. Provides recommendations based on workload + schedule
8. **Sends message** back to all agents with wellness alerts

## 📋 Hackathon Checklist

- [x] Multi-agent system (3 agents)
- [x] Agents communicate with each other
- [x] Uses Google Gemini API
- [x] Solves real-world problem (student academic success)
- [x] FastAPI server ready
- [x] Cloud Run deployment config
- [x] Documentation
- [x] Test script

## 🎥 Demo Flow

1. Show the test script output (agent communication)
2. Show API docs at `/docs`
3. Make a POST request to `/api/full-analysis`
4. Show the JSON response with all 3 agent outputs
5. Show Cloud Run deployment (if deployed)

## 📝 Key Points for Judges

- **Real agent communication**: Each agent sends structured messages to the next
- **Practical use case**: Helps students manage academic workload and mental health
- **Scalable architecture**: FastAPI + Cloud Run can handle production traffic
- **Complete workflow**: From assignment input to wellness recommendations

## 🔧 Troubleshooting

**API Key Error?**
- Make sure GEMINI_API_KEY is set in environment or .env file

**Import Error?**
- Run `pip install -r requirements.txt`

**Cloud Run Deploy Fails?**
- Make sure you're authenticated: `gcloud auth login`
- Check project ID: `gcloud config get-value project`

## 📞 Need Help?

Check the backend/README.md for detailed documentation!
