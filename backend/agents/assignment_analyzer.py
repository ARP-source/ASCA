"""
Assignment Analyzer Agent
Analyzes student assignments, deadlines, and workload complexity
"""

import google.generativeai as genai
from typing import List, Dict, Any
from datetime import datetime, timedelta
import json


class AssignmentAnalyzerAgent:
    """Agent that analyzes assignments and provides insights"""
    
    def __init__(self, api_key: str):
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel('gemini-pro')
        self.name = "Assignment Analyzer"
        
    async def analyze_assignment(self, assignment: Dict[str, Any]) -> Dict[str, Any]:
        """
        Analyze a single assignment for complexity, time requirements, and priority
        
        Args:
            assignment: Dict with keys: title, description, due_date, course
            
        Returns:
            Analysis with complexity score, estimated hours, priority level
        """
        prompt = f"""
You are an expert academic advisor analyzing student assignments.

Assignment Details:
- Title: {assignment.get('title', 'Unknown')}
- Description: {assignment.get('description', 'No description')}
- Course: {assignment.get('course', 'Unknown')}
- Due Date: {assignment.get('due_date', 'Unknown')}

Analyze this assignment and provide:
1. Complexity Score (1-10): How difficult is this assignment?
2. Estimated Hours: How many hours will this take?
3. Priority Level (High/Medium/Low): Based on due date and complexity
4. Key Tasks: Break down into 3-5 subtasks
5. Recommended Start Date: When should the student start?

Respond in JSON format:
{{
    "complexity_score": <1-10>,
    "estimated_hours": <number>,
    "priority_level": "<High/Medium/Low>",
    "key_tasks": ["task1", "task2", ...],
    "recommended_start_date": "<date>",
    "reasoning": "<brief explanation>"
}}
"""
        
        try:
            response = self.model.generate_content(prompt)
            # Extract JSON from response
            text = response.text.strip()
            if text.startswith('```json'):
                text = text[7:]
            if text.endswith('```'):
                text = text[:-3]
            
            analysis = json.loads(text.strip())
            analysis['assignment_id'] = assignment.get('id', 'unknown')
            analysis['analyzed_at'] = datetime.now().isoformat()
            
            return analysis
            
        except Exception as e:
            print(f"Error analyzing assignment: {e}")
            # Return default analysis
            return {
                "assignment_id": assignment.get('id', 'unknown'),
                "complexity_score": 5,
                "estimated_hours": 3,
                "priority_level": "Medium",
                "key_tasks": ["Review requirements", "Complete work", "Submit"],
                "recommended_start_date": (datetime.now() + timedelta(days=1)).isoformat(),
                "reasoning": "Default analysis due to processing error",
                "analyzed_at": datetime.now().isoformat()
            }
    
    async def analyze_workload(self, assignments: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Analyze overall workload across multiple assignments
        
        Args:
            assignments: List of assignment dicts
            
        Returns:
            Workload analysis with total hours, stress level, recommendations
        """
        if not assignments:
            return {
                "total_assignments": 0,
                "total_estimated_hours": 0,
                "stress_level": "Low",
                "recommendations": ["No assignments currently tracked"]
            }
        
        # Analyze each assignment
        analyses = []
        for assignment in assignments:
            analysis = await self.analyze_assignment(assignment)
            analyses.append(analysis)
        
        # Calculate aggregate metrics
        total_hours = sum(a.get('estimated_hours', 0) for a in analyses)
        high_priority_count = sum(1 for a in analyses if a.get('priority_level') == 'High')
        avg_complexity = sum(a.get('complexity_score', 0) for a in analyses) / len(analyses)
        
        # Determine stress level
        if total_hours > 40 or high_priority_count > 3:
            stress_level = "High"
        elif total_hours > 20 or high_priority_count > 1:
            stress_level = "Medium"
        else:
            stress_level = "Low"
        
        # Generate recommendations
        prompt = f"""
You are an academic advisor. A student has {len(assignments)} assignments with:
- Total estimated hours: {total_hours}
- High priority assignments: {high_priority_count}
- Average complexity: {avg_complexity:.1f}/10
- Stress level: {stress_level}

Provide 3-5 specific, actionable recommendations to help them manage their workload effectively.
Return as a JSON array of strings: ["recommendation1", "recommendation2", ...]
"""
        
        try:
            response = self.model.generate_content(prompt)
            text = response.text.strip()
            if text.startswith('```json'):
                text = text[7:]
            if text.endswith('```'):
                text = text[:-3]
            recommendations = json.loads(text.strip())
        except:
            recommendations = [
                "Start with high-priority assignments first",
                "Break large assignments into smaller tasks",
                "Schedule regular study sessions"
            ]
        
        return {
            "total_assignments": len(assignments),
            "total_estimated_hours": total_hours,
            "high_priority_count": high_priority_count,
            "average_complexity": round(avg_complexity, 1),
            "stress_level": stress_level,
            "recommendations": recommendations,
            "individual_analyses": analyses,
            "analyzed_at": datetime.now().isoformat()
        }
    
    async def communicate_with_scheduler(self, workload_analysis: Dict[str, Any]) -> Dict[str, Any]:
        """
        Prepare data to send to the Schedule Optimizer Agent
        
        Args:
            workload_analysis: Output from analyze_workload
            
        Returns:
            Formatted data for scheduler agent
        """
        return {
            "agent": self.name,
            "message_type": "workload_analysis",
            "data": workload_analysis,
            "timestamp": datetime.now().isoformat()
        }
