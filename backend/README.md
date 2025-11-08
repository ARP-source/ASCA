# ASCA Multi-Agent System Backend

**Adaptive Student Coaching Agents** - A multi-agent system built with Google's Gemini API for academic success support.

## 🎯 Hackathon Requirements

✅ **Multi-Agent System**: 3 AI agents that communicate and collaborate
✅ **Google ADK**: Built using Google's Gemini API
✅ **Cloud Run Deployment**: Ready to deploy to Google Cloud Run
✅ **Real-World Problem**: Helps students manage academic workload and wellness

## 🤖 Agents

### 1. Assignment Analyzer Agent
- Analyzes assignment complexity and time requirements
- Calculates workload metrics and stress levels
- Provides prioritization recommendations
- **Communicates with**: Schedule Optimizer

### 2. Schedule Optimizer Agent
- Creates optimized study schedules based on workload analysis
- Balances work distribution across days
- Includes break scheduling
- **Communicates with**: Assignment Analyzer, Wellness Monitor

### 3. Wellness Monitor Agent
- Assesses student wellness based on workload and schedule
- Provides personalized wellness recommendations
- Suggests break activities and stress management
- **Communicates with**: Schedule Optimizer

## 🔄 Agent Communication Flow

```
Student Input (Assignments)
        ↓
Assignment Analyzer Agent
  - Analyzes complexity
  - Calculates workload
        ↓
Schedule Optimizer Agent
  - Creates optimal schedule
  - Distributes tasks
        ↓
Wellness Monitor Agent
  - Assesses wellness
  - Provides recommendations
        ↓
Comprehensive Output
```

## 🚀 Quick Start

### Local Development

1. **Install dependencies**:
```bash
cd backend
pip install -r requirements.txt
```

2. **Set up environment**:
```bash
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY
```

3. **Run the server**:
```bash
python main.py
```

4. **Test the API**:
```bash
# Visit http://localhost:8080
# API docs at http://localhost:8080/docs
```

### Deploy to Cloud Run

1. **Install Google Cloud SDK**:
```bash
# Follow: https://cloud.google.com/sdk/docs/install
```

2. **Authenticate**:
```bash
gcloud auth login
gcloud config set project YOUR_PROJECT_ID
```

3. **Deploy**:
```bash
chmod +x deploy.sh
./deploy.sh
```

Or use gcloud directly:
```bash
gcloud run deploy asca-backend \
  --source . \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars GEMINI_API_KEY=your_key_here
```

## 📡 API Endpoints

### Health Check
```
GET /
```

### Single Assignment Analysis
```
POST /api/analyze-assignment
Body: {
  "id": "hw1",
  "title": "History Essay",
  "description": "5-page essay on WWII",
  "due_date": "2025-11-15",
  "course": "History 101"
}
```

### Workload Analysis
```
POST /api/analyze-workload
Body: [
  { assignment objects }
]
```

### Create Schedule (2 agents)
```
POST /api/create-schedule
Body: {
  "assignments": [...],
  "preferences": {
    "daily_study_hours": 6,
    "preferred_start_time": "09:00"
  }
}
```

### Wellness Check (3 agents)
```
POST /api/wellness-check
Body: {
  "assignments": [...],
  "preferences": {...},
  "wellness_input": {
    "mood": "stressed",
    "stress_level": 7,
    "sleep_hours": 5
  }
}
```

### Full Multi-Agent Analysis (All 3 agents)
```
POST /api/full-analysis
Body: {
  "assignments": [...],
  "preferences": {...},
  "wellness_input": {...}
}
```

## 🧪 Testing

Run the test script:
```bash
python test_agents.py
```

Or use curl:
```bash
curl -X POST http://localhost:8080/api/full-analysis \
  -H "Content-Type: application/json" \
  -d @test_data.json
```

## 🏗️ Architecture

- **Framework**: FastAPI
- **AI Model**: Google Gemini Pro
- **Deployment**: Google Cloud Run
- **Language**: Python 3.11

## 📊 Agent Communication

Agents communicate through structured message passing:

```python
{
  "agent": "Assignment Analyzer",
  "message_type": "workload_analysis",
  "data": {...},
  "timestamp": "2025-11-08T03:00:00"
}
```

## 🔒 Security

- API key stored in environment variables
- CORS configured for frontend access
- Cloud Run handles authentication

## 📝 License

MIT License - Hackathon Project
