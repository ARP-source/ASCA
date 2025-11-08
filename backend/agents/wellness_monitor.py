"""
Wellness Monitor Agent
Monitors student wellness and provides recommendations for breaks and stress management
"""

import google.generativeai as genai
from typing import Dict, Any, List
from datetime import datetime
import json


class WellnessMonitorAgent:
    """Agent that monitors wellness and suggests interventions"""
    
    def __init__(self, api_key: str):
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel('gemini-pro')
        self.name = "Wellness Monitor"
        
    async def assess_wellness(
        self,
        workload_data: Dict[str, Any],
        schedule_data: Dict[str, Any],
        student_input: Dict[str, Any] = None
    ) -> Dict[str, Any]:
        """
        Assess student wellness based on workload and schedule
        
        Args:
            workload_data: From Assignment Analyzer
            schedule_data: From Schedule Optimizer
            student_input: Optional self-reported mood, stress, sleep
            
        Returns:
            Wellness assessment with recommendations
        """
        if student_input is None:
            student_input = {
                "mood": "neutral",
                "stress_level": 5,
                "sleep_hours": 7,
                "energy_level": 5
            }
        
        # Extract metrics
        stress_level = workload_data.get('stress_level', 'Medium')
        total_hours = workload_data.get('total_estimated_hours', 0)
        avg_daily_hours = schedule_data.get('metrics', {}).get('average_daily_hours', 0)
        
        prompt = f"""
You are a wellness and mental health advisor for students. Assess the student's wellness.

WORKLOAD METRICS:
- Stress level: {stress_level}
- Total work hours this week: {total_hours}
- Average daily study hours: {avg_daily_hours}

STUDENT SELF-REPORT:
- Mood: {student_input.get('mood', 'neutral')}
- Stress level (1-10): {student_input.get('stress_level', 5)}
- Sleep hours: {student_input.get('sleep_hours', 7)}
- Energy level (1-10): {student_input.get('energy_level', 5)}

Provide a wellness assessment with:
1. Overall wellness score (1-100)
2. Risk factors identified
3. Specific recommendations for breaks, exercise, sleep
4. Suggested wellness activities
5. When to seek additional support

Return as JSON:
{{
    "wellness_score": <1-100>,
    "risk_level": "<Low/Medium/High>",
    "risk_factors": ["factor1", "factor2"],
    "recommendations": [
        {{
            "category": "breaks",
            "suggestion": "specific suggestion",
            "frequency": "how often"
        }}
    ],
    "wellness_activities": ["activity1", "activity2"],
    "alert_threshold": "<when to seek help>",
    "positive_aspects": ["what's going well"]
}}
"""
        
        try:
            response = self.model.generate_content(prompt)
            text = response.text.strip()
            if text.startswith('```json'):
                text = text[7:]
            if text.endswith('```'):
                text = text[:-3]
            
            assessment = json.loads(text.strip())
            assessment['assessed_at'] = datetime.now().isoformat()
            assessment['assessed_by'] = self.name
            
            return assessment
            
        except Exception as e:
            print(f"Error assessing wellness: {e}")
            return self._create_basic_assessment(stress_level, avg_daily_hours, student_input)
    
    def _create_basic_assessment(
        self,
        stress_level: str,
        avg_daily_hours: float,
        student_input: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Create a basic wellness assessment"""
        
        # Calculate wellness score
        base_score = 70
        if stress_level == "High":
            base_score -= 20
        elif stress_level == "Low":
            base_score += 10
        
        if avg_daily_hours > 8:
            base_score -= 15
        elif avg_daily_hours < 4:
            base_score += 10
        
        if student_input.get('sleep_hours', 7) < 6:
            base_score -= 15
        
        wellness_score = max(10, min(100, base_score))
        
        # Determine risk level
        if wellness_score < 40:
            risk_level = "High"
        elif wellness_score < 70:
            risk_level = "Medium"
        else:
            risk_level = "Low"
        
        return {
            "wellness_score": wellness_score,
            "risk_level": risk_level,
            "risk_factors": [
                f"Stress level: {stress_level}",
                f"Study hours: {avg_daily_hours:.1f}/day"
            ],
            "recommendations": [
                {
                    "category": "breaks",
                    "suggestion": "Take a 10-minute break every hour",
                    "frequency": "hourly"
                },
                {
                    "category": "sleep",
                    "suggestion": "Aim for 7-8 hours of sleep",
                    "frequency": "daily"
                },
                {
                    "category": "exercise",
                    "suggestion": "20-minute walk or light exercise",
                    "frequency": "daily"
                }
            ],
            "wellness_activities": [
                "Deep breathing exercises",
                "Short meditation session",
                "Stretching routine",
                "Social connection time"
            ],
            "alert_threshold": "If stress remains high for more than a week, consider counseling",
            "positive_aspects": ["You're tracking your wellness", "You're being proactive"],
            "assessed_at": datetime.now().isoformat(),
            "assessed_by": self.name
        }
    
    async def suggest_break(self, current_activity: str, time_worked: int) -> Dict[str, Any]:
        """
        Suggest an appropriate break activity
        
        Args:
            current_activity: What the student is currently doing
            time_worked: Minutes worked without break
            
        Returns:
            Break suggestion with duration and activity
        """
        prompt = f"""
A student has been {current_activity} for {time_worked} minutes without a break.
Suggest an appropriate break activity that will help them refresh and refocus.

Consider:
- Break should be proportional to work time (5-15 minutes for <90 min work)
- Activity should be different from their current task
- Should promote physical movement or mental rest

Return as JSON:
{{
    "duration_minutes": <5-15>,
    "activity": "specific activity",
    "benefits": "why this helps",
    "return_signal": "how to know when to return to work"
}}
"""
        
        try:
            response = self.model.generate_content(prompt)
            text = response.text.strip()
            if text.startswith('```json'):
                text = text[7:]
            if text.endswith('```'):
                text = text[:-3]
            
            suggestion = json.loads(text.strip())
            suggestion['suggested_at'] = datetime.now().isoformat()
            
            return suggestion
            
        except Exception as e:
            print(f"Error suggesting break: {e}")
            return {
                "duration_minutes": 10,
                "activity": "Take a short walk or stretch",
                "benefits": "Reduces eye strain and improves circulation",
                "return_signal": "When you feel refreshed and ready to focus",
                "suggested_at": datetime.now().isoformat()
            }
    
    async def communicate_with_agents(self, wellness_assessment: Dict[str, Any]) -> Dict[str, Any]:
        """
        Prepare wellness data to send back to other agents
        
        Args:
            wellness_assessment: Output from assess_wellness
            
        Returns:
            Formatted data for other agents
        """
        return {
            "agent": self.name,
            "message_type": "wellness_assessment",
            "data": wellness_assessment,
            "timestamp": datetime.now().isoformat(),
            "action_required": wellness_assessment.get('risk_level') == 'High'
        }
