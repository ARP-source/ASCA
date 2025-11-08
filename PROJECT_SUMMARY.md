# ASCA - Adaptive Student Coaching Agents

## 🎯 Hackathon Project Summary

**A multi-agent AI system that helps students manage academic workload and wellness using Google's Gemini API**

---

## ✅ Hackathon Requirements Met

| Requirement | Status | Implementation |
|------------|--------|----------------|
| Multi-agent system | ✅ | 3 AI agents that communicate |
| Google ADK/Gemini | ✅ | Uses Gemini Pro API |
| Cloud Run deployment | ✅ | Dockerfile + deployment scripts |
| Real-world problem | ✅ | Student academic success & wellness |
| Agent communication | ✅ | Structured message passing between agents |

---

## 🤖 The Three Agents

### 1. Assignment Analyzer Agent
**Role**: Analyzes student assignments and calculates workload

**Capabilities**:
- Analyzes assignment complexity (1-10 scale)
- Estimates time requirements
- Calculates stress levels
- Provides prioritization recommendations

**Outputs**: Workload analysis with metrics and recommendations

**Communicates with**: Schedule Optimizer Agent

---

### 2. Schedule Optimizer Agent
**Role**: Creates optimized study schedules

**Capabilities**:
- Generates 7-day study schedules
- Balances workload distribution
- Includes break scheduling
- Respects student preferences

**Outputs**: Detailed daily schedules with time blocks

**Communicates with**: Assignment Analyzer (receives), Wellness Monitor (sends)

---

### 3. Wellness Monitor Agent
**Role**: Monitors student wellness and provides interventions

**Capabilities**:
- Assesses wellness based on workload + schedule
- Calculates wellness scores (1-100)
- Identifies risk factors
- Suggests break activities and stress management

**Outputs**: Wellness assessment with recommendations

**Communicates with**: Schedule Optimizer (receives), All agents (sends alerts)

---

## 🔄 Multi-Agent Workflow

```
Student Input
    ↓
┌─────────────────────────────┐
│ Assignment Analyzer Agent   │
│ - Analyzes assignments      │
│ - Calculates workload       │
└─────────────────────────────┘
    ↓ (sends workload_analysis message)
┌─────────────────────────────┐
│ Schedule Optimizer Agent    │
│ - Creates optimal schedule  │
│ - Distributes tasks         │
└─────────────────────────────┘
    ↓ (sends schedule_created message)
┌─────────────────────────────┐
│ Wellness Monitor Agent      │
│ - Assesses wellness         │
│ - Provides recommendations  │
└─────────────────────────────┘
    ↓ (sends wellness_assessment message)
Comprehensive Output
```

---

## 🏗️ Technical Architecture

**Backend Framework**: FastAPI (Python 3.11)
**AI Model**: Google Gemini Pro
**Deployment**: Google Cloud Run
**API Style**: RESTful JSON

### Key Endpoints

- `POST /api/full-analysis` - Complete multi-agent workflow
- `POST /api/analyze-workload` - Assignment analysis only
- `POST /api/create-schedule` - Schedule creation (2 agents)
- `POST /api/wellness-check` - Wellness assessment (3 agents)

---

## 📡 Agent Communication Protocol

Agents communicate using structured JSON messages:

```json
{
  "agent": "Assignment Analyzer",
  "message_type": "workload_analysis",
  "data": { ... },
  "timestamp": "2025-11-08T03:00:00"
}
```

Each agent:
1. Receives input from previous agent
2. Processes data using Gemini API
3. Generates output
4. Sends structured message to next agent

---

## 🚀 Quick Start

### Test Locally
```bash
cd backend
pip install -r requirements.txt
python test_agents.py
```

### Run API Server
```bash
python main.py
# Visit http://localhost:8080/docs
```

### Deploy to Cloud Run
```bash
gcloud run deploy asca-backend \
  --source . \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars GEMINI_API_KEY=your_key
```

---

## 📊 Example Output

**Input**: 3 assignments (History essay, Math problem set, Programming project)

**Agent 1 Output** (Assignment Analyzer):
- Total hours: 18
- Stress level: Medium
- High priority: 2 assignments

**Agent 2 Output** (Schedule Optimizer):
- 7-day schedule created
- 6 hours/day average
- Includes breaks every 60 minutes

**Agent 3 Output** (Wellness Monitor):
- Wellness score: 75/100
- Risk level: Medium
- Recommendations: Regular breaks, 7-8 hours sleep, exercise

---

## 🎥 Demo Script

1. **Show agent communication**:
   ```bash
   python test_agents.py
   ```
   Watch the 3 agents communicate in sequence

2. **Show API documentation**:
   Visit `http://localhost:8080/docs`

3. **Make API call**:
   ```bash
   curl -X POST http://localhost:8080/api/full-analysis \
     -H "Content-Type: application/json" \
     -d @sample_request.json
   ```

4. **Show results**:
   - Workload analysis from Agent 1
   - Schedule from Agent 2
   - Wellness assessment from Agent 3
   - Agent communication messages

---

## 💡 Innovation Points

1. **True multi-agent collaboration**: Not just parallel agents, but sequential communication
2. **Holistic approach**: Combines academic AND wellness support
3. **Practical application**: Solves real student problems
4. **Scalable architecture**: Production-ready with Cloud Run
5. **Intelligent scheduling**: AI-powered optimization, not just rule-based

---

## 📁 Project Structure

```
ASCA/
├── backend/
│   ├── agents/
│   │   ├── assignment_analyzer.py    # Agent 1
│   │   ├── schedule_optimizer.py     # Agent 2
│   │   └── wellness_monitor.py       # Agent 3
│   ├── main.py                       # FastAPI server
│   ├── test_agents.py                # Demo script
│   ├── requirements.txt              # Dependencies
│   ├── Dockerfile                    # Cloud Run config
│   └── README.md                     # Documentation
├── index.html                        # Frontend (bonus)
├── HACKATHON_SETUP.md               # Quick start guide
└── PROJECT_SUMMARY.md               # This file
```

---

## 🔑 Key Features for Judges

✅ **Real agent-to-agent communication** with structured messages
✅ **Practical use case** addressing student mental health crisis
✅ **Complete workflow** from input to actionable recommendations
✅ **Production-ready** with proper error handling and fallbacks
✅ **Well-documented** with test scripts and examples
✅ **Scalable** architecture using Cloud Run

---

## 📞 Support

- See `HACKATHON_SETUP.md` for quick start
- See `backend/README.md` for detailed API docs
- Run `python test_agents.py` for live demo
