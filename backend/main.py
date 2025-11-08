"""
ASCA Multi-Agent System - FastAPI Server
Orchestrates communication between Assignment Analyzer, Schedule Optimizer, and Wellness Monitor agents
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import os
from dotenv import load_dotenv

from agents.assignment_analyzer import AssignmentAnalyzerAgent
from agents.schedule_optimizer import ScheduleOptimizerAgent
from agents.wellness_monitor import WellnessMonitorAgent

# Load environment variables
load_dotenv()

app = FastAPI(
    title="ASCA Multi-Agent System",
    description="Adaptive Student Coaching Agents - Multi-agent system for academic success",
    version="1.0.0"
)

# CORS middleware for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize agents
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

assignment_analyzer = AssignmentAnalyzerAgent(GEMINI_API_KEY)
schedule_optimizer = ScheduleOptimizerAgent(GEMINI_API_KEY)
wellness_monitor = WellnessMonitorAgent(GEMINI_API_KEY)


# Pydantic models for request/response
class Assignment(BaseModel):
    id: str
    title: str
    description: str
    due_date: str
    course: str


class StudentPreferences(BaseModel):
    daily_study_hours: Optional[int] = 6
    preferred_start_time: Optional[str] = "09:00"
    break_frequency: Optional[int] = 60
    break_duration: Optional[int] = 15


class WellnessInput(BaseModel):
    mood: Optional[str] = "neutral"
    stress_level: Optional[int] = 5
    sleep_hours: Optional[int] = 7
    energy_level: Optional[int] = 5


class MultiAgentRequest(BaseModel):
    assignments: List[Assignment]
    preferences: Optional[StudentPreferences] = None
    wellness_input: Optional[WellnessInput] = None


# API Endpoints
@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "ASCA Multi-Agent System",
        "agents": [
            assignment_analyzer.name,
            schedule_optimizer.name,
            wellness_monitor.name
        ]
    }


@app.post("/api/analyze-assignment")
async def analyze_single_assignment(assignment: Assignment):
    """
    Analyze a single assignment
    Agent: Assignment Analyzer
    """
    try:
        analysis = await assignment_analyzer.analyze_assignment(assignment.dict())
        return {
            "success": True,
            "agent": assignment_analyzer.name,
            "data": analysis
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/analyze-workload")
async def analyze_workload(assignments: List[Assignment]):
    """
    Analyze overall workload across multiple assignments
    Agent: Assignment Analyzer
    """
    try:
        assignments_data = [a.dict() for a in assignments]
        analysis = await assignment_analyzer.analyze_workload(assignments_data)
        return {
            "success": True,
            "agent": assignment_analyzer.name,
            "data": analysis
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/create-schedule")
async def create_schedule(
    assignments: List[Assignment],
    preferences: Optional[StudentPreferences] = None
):
    """
    Create optimized schedule
    Agent Flow: Assignment Analyzer → Schedule Optimizer
    """
    try:
        # Step 1: Analyze workload
        assignments_data = [a.dict() for a in assignments]
        workload_analysis = await assignment_analyzer.analyze_workload(assignments_data)
        
        # Step 2: Create schedule
        prefs_dict = preferences.dict() if preferences else None
        schedule = await schedule_optimizer.create_schedule(workload_analysis, prefs_dict)
        
        return {
            "success": True,
            "agents_involved": [assignment_analyzer.name, schedule_optimizer.name],
            "data": {
                "workload_analysis": workload_analysis,
                "schedule": schedule
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/wellness-check")
async def wellness_check(
    assignments: List[Assignment],
    preferences: Optional[StudentPreferences] = None,
    wellness_input: Optional[WellnessInput] = None
):
    """
    Perform wellness assessment
    Agent Flow: Assignment Analyzer → Schedule Optimizer → Wellness Monitor
    """
    try:
        # Step 1: Analyze workload
        assignments_data = [a.dict() for a in assignments]
        workload_analysis = await assignment_analyzer.analyze_workload(assignments_data)
        
        # Step 2: Create schedule
        prefs_dict = preferences.dict() if preferences else None
        schedule = await schedule_optimizer.create_schedule(workload_analysis, prefs_dict)
        
        # Step 3: Assess wellness
        wellness_dict = wellness_input.dict() if wellness_input else None
        schedule_data = await schedule_optimizer.communicate_with_wellness(schedule)
        wellness_assessment = await wellness_monitor.assess_wellness(
            workload_analysis,
            schedule_data['data'],
            wellness_dict
        )
        
        return {
            "success": True,
            "agents_involved": [
                assignment_analyzer.name,
                schedule_optimizer.name,
                wellness_monitor.name
            ],
            "data": {
                "workload_analysis": workload_analysis,
                "schedule": schedule,
                "wellness_assessment": wellness_assessment
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/full-analysis")
async def full_multi_agent_analysis(request: MultiAgentRequest):
    """
    Complete multi-agent workflow
    Agent Flow: Assignment Analyzer → Schedule Optimizer → Wellness Monitor
    Returns comprehensive analysis with all agent outputs
    """
    try:
        # Step 1: Assignment Analyzer analyzes workload
        assignments_data = [a.dict() for a in request.assignments]
        workload_analysis = await assignment_analyzer.analyze_workload(assignments_data)
        
        # Agent communication: Analyzer → Scheduler
        analyzer_message = await assignment_analyzer.communicate_with_scheduler(workload_analysis)
        
        # Step 2: Schedule Optimizer creates schedule
        prefs_dict = request.preferences.dict() if request.preferences else None
        schedule = await schedule_optimizer.create_schedule(workload_analysis, prefs_dict)
        
        # Agent communication: Scheduler → Wellness
        scheduler_message = await schedule_optimizer.communicate_with_wellness(schedule)
        
        # Step 3: Wellness Monitor assesses wellness
        wellness_dict = request.wellness_input.dict() if request.wellness_input else None
        wellness_assessment = await wellness_monitor.assess_wellness(
            workload_analysis,
            scheduler_message['data'],
            wellness_dict
        )
        
        # Agent communication: Wellness → All
        wellness_message = await wellness_monitor.communicate_with_agents(wellness_assessment)
        
        return {
            "success": True,
            "workflow": "Complete Multi-Agent Analysis",
            "agents_involved": [
                assignment_analyzer.name,
                schedule_optimizer.name,
                wellness_monitor.name
            ],
            "agent_communications": [
                analyzer_message,
                scheduler_message,
                wellness_message
            ],
            "results": {
                "workload_analysis": workload_analysis,
                "schedule": schedule,
                "wellness_assessment": wellness_assessment
            },
            "summary": {
                "total_assignments": workload_analysis.get('total_assignments', 0),
                "total_hours": workload_analysis.get('total_estimated_hours', 0),
                "stress_level": workload_analysis.get('stress_level', 'Unknown'),
                "wellness_score": wellness_assessment.get('wellness_score', 0),
                "risk_level": wellness_assessment.get('risk_level', 'Unknown')
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/suggest-break")
async def suggest_break(current_activity: str, time_worked: int):
    """
    Get break suggestion from Wellness Monitor
    Agent: Wellness Monitor
    """
    try:
        suggestion = await wellness_monitor.suggest_break(current_activity, time_worked)
        return {
            "success": True,
            "agent": wellness_monitor.name,
            "data": suggestion
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8080))
    uvicorn.run(app, host="0.0.0.0", port=port)
