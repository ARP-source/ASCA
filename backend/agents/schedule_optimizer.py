"""
Schedule Optimizer Agent
Creates optimal study schedules based on assignment analysis
"""

import google.generativeai as genai
from typing import List, Dict, Any
from datetime import datetime, timedelta
import json


class ScheduleOptimizerAgent:
    """Agent that creates optimized study schedules"""
    
    def __init__(self, api_key: str):
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel('gemini-pro')
        self.name = "Schedule Optimizer"
        
    async def create_schedule(
        self, 
        workload_analysis: Dict[str, Any],
        student_preferences: Dict[str, Any] = None
    ) -> Dict[str, Any]:
        """
        Create an optimized study schedule based on workload analysis
        
        Args:
            workload_analysis: Output from Assignment Analyzer Agent
            student_preferences: Optional preferences (study hours, break frequency, etc.)
            
        Returns:
            Optimized schedule with daily tasks and time blocks
        """
        if student_preferences is None:
            student_preferences = {
                "daily_study_hours": 6,
                "preferred_start_time": "09:00",
                "break_frequency": 60,  # minutes
                "break_duration": 15,  # minutes
            }
        
        analyses = workload_analysis.get('individual_analyses', [])
        
        if not analyses:
            return {
                "schedule": [],
                "message": "No assignments to schedule",
                "created_at": datetime.now().isoformat()
            }
        
        # Prepare context for Gemini
        assignments_summary = "\n".join([
            f"- {a.get('assignment_id', 'Unknown')}: "
            f"{a.get('estimated_hours', 0)}h, "
            f"Priority: {a.get('priority_level', 'Medium')}, "
            f"Complexity: {a.get('complexity_score', 5)}/10"
            for a in analyses
        ])
        
        prompt = f"""
You are an expert study schedule optimizer. Create a detailed study schedule for a student.

WORKLOAD SUMMARY:
- Total assignments: {workload_analysis.get('total_assignments', 0)}
- Total hours needed: {workload_analysis.get('total_estimated_hours', 0)}
- Stress level: {workload_analysis.get('stress_level', 'Medium')}

ASSIGNMENTS:
{assignments_summary}

STUDENT PREFERENCES:
- Daily study hours: {student_preferences.get('daily_study_hours', 6)}
- Preferred start time: {student_preferences.get('preferred_start_time', '09:00')}
- Break every: {student_preferences.get('break_frequency', 60)} minutes
- Break duration: {student_preferences.get('break_duration', 15)} minutes

Create a 7-day optimized schedule that:
1. Prioritizes high-priority and high-complexity assignments
2. Distributes work evenly to avoid burnout
3. Includes regular breaks
4. Respects daily study hour limits
5. Builds in buffer time for unexpected issues

Return as JSON:
{{
    "daily_schedules": [
        {{
            "day": "Monday",
            "date": "YYYY-MM-DD",
            "sessions": [
                {{
                    "time": "09:00-10:00",
                    "assignment": "assignment_id",
                    "task": "specific task",
                    "type": "work"
                }},
                {{
                    "time": "10:00-10:15",
                    "type": "break",
                    "activity": "short walk"
                }}
            ],
            "total_hours": 6
        }}
    ],
    "optimization_notes": ["note1", "note2"],
    "flexibility_score": <1-10>
}}
"""
        
        try:
            response = self.model.generate_content(prompt)
            text = response.text.strip()
            if text.startswith('```json'):
                text = text[7:]
            if text.endswith('```'):
                text = text[:-3]
            
            schedule = json.loads(text.strip())
            schedule['created_at'] = datetime.now().isoformat()
            schedule['created_by'] = self.name
            
            return schedule
            
        except Exception as e:
            print(f"Error creating schedule: {e}")
            # Return basic schedule
            return self._create_basic_schedule(analyses, student_preferences)
    
    def _create_basic_schedule(
        self, 
        analyses: List[Dict[str, Any]], 
        preferences: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Create a simple fallback schedule"""
        daily_schedules = []
        start_date = datetime.now()
        
        for day_offset in range(7):
            current_date = start_date + timedelta(days=day_offset)
            day_name = current_date.strftime("%A")
            
            sessions = []
            current_time = datetime.strptime(preferences.get('preferred_start_time', '09:00'), '%H:%M')
            
            # Add 2-3 study sessions per day
            for i in range(min(3, len(analyses))):
                if i < len(analyses):
                    analysis = analyses[i]
                    session_end = current_time + timedelta(hours=1)
                    
                    sessions.append({
                        "time": f"{current_time.strftime('%H:%M')}-{session_end.strftime('%H:%M')}",
                        "assignment": analysis.get('assignment_id', 'Unknown'),
                        "task": analysis.get('key_tasks', ['Study'])[0] if analysis.get('key_tasks') else 'Study',
                        "type": "work"
                    })
                    
                    current_time = session_end
                    
                    # Add break
                    break_end = current_time + timedelta(minutes=15)
                    sessions.append({
                        "time": f"{current_time.strftime('%H:%M')}-{break_end.strftime('%H:%M')}",
                        "type": "break",
                        "activity": "rest"
                    })
                    current_time = break_end
            
            daily_schedules.append({
                "day": day_name,
                "date": current_date.strftime("%Y-%m-%d"),
                "sessions": sessions,
                "total_hours": len([s for s in sessions if s['type'] == 'work'])
            })
        
        return {
            "daily_schedules": daily_schedules,
            "optimization_notes": ["Basic schedule created", "Adjust as needed"],
            "flexibility_score": 7,
            "created_at": datetime.now().isoformat(),
            "created_by": self.name
        }
    
    async def communicate_with_wellness(self, schedule: Dict[str, Any]) -> Dict[str, Any]:
        """
        Prepare schedule data to send to Wellness Monitor Agent
        
        Args:
            schedule: Output from create_schedule
            
        Returns:
            Formatted data for wellness agent
        """
        # Calculate workload metrics for wellness check
        total_work_hours = 0
        for day in schedule.get('daily_schedules', []):
            total_work_hours += day.get('total_hours', 0)
        
        avg_daily_hours = total_work_hours / max(len(schedule.get('daily_schedules', [])), 1)
        
        return {
            "agent": self.name,
            "message_type": "schedule_created",
            "data": {
                "schedule": schedule,
                "metrics": {
                    "total_work_hours_week": total_work_hours,
                    "average_daily_hours": round(avg_daily_hours, 1),
                    "flexibility_score": schedule.get('flexibility_score', 5)
                }
            },
            "timestamp": datetime.now().isoformat()
        }
