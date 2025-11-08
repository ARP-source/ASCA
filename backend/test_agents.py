"""
Test script for ASCA Multi-Agent System
Demonstrates agent communication and workflow
"""

import asyncio
import json
from agents.assignment_analyzer import AssignmentAnalyzerAgent
from agents.schedule_optimizer import ScheduleOptimizerAgent
from agents.wellness_monitor import WellnessMonitorAgent

# Your Gemini API Key - set via environment variable
import os
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "your-api-key-here")


async def test_multi_agent_workflow():
    """Test the complete multi-agent workflow"""
    
    print("=" * 80)
    print("ASCA MULTI-AGENT SYSTEM TEST")
    print("=" * 80)
    print()
    
    # Initialize agents
    print("🤖 Initializing agents...")
    analyzer = AssignmentAnalyzerAgent(GEMINI_API_KEY)
    scheduler = ScheduleOptimizerAgent(GEMINI_API_KEY)
    wellness = WellnessMonitorAgent(GEMINI_API_KEY)
    print(f"   ✓ {analyzer.name}")
    print(f"   ✓ {scheduler.name}")
    print(f"   ✓ {wellness.name}")
    print()
    
    # Sample assignments
    assignments = [
        {
            "id": "hw1",
            "title": "History Essay",
            "description": "Write a 5-page essay analyzing the causes of World War II",
            "due_date": "2025-11-15",
            "course": "History 101"
        },
        {
            "id": "hw2",
            "title": "Math Problem Set",
            "description": "Complete problems 1-20 from Chapter 5 on Calculus",
            "due_date": "2025-11-12",
            "course": "Math 201"
        },
        {
            "id": "hw3",
            "title": "Programming Project",
            "description": "Build a web application using React and Node.js",
            "due_date": "2025-11-20",
            "course": "CS 301"
        }
    ]
    
    print("📚 Sample Assignments:")
    for a in assignments:
        print(f"   • {a['title']} ({a['course']}) - Due: {a['due_date']}")
    print()
    
    # STEP 1: Assignment Analyzer
    print("-" * 80)
    print("STEP 1: Assignment Analyzer Agent")
    print("-" * 80)
    print("Analyzing workload...")
    
    workload_analysis = await analyzer.analyze_workload(assignments)
    
    print(f"\n📊 Workload Analysis Results:")
    print(f"   Total Assignments: {workload_analysis['total_assignments']}")
    print(f"   Total Hours: {workload_analysis['total_estimated_hours']}")
    print(f"   Stress Level: {workload_analysis['stress_level']}")
    print(f"   High Priority: {workload_analysis['high_priority_count']}")
    print(f"\n   Recommendations:")
    for rec in workload_analysis['recommendations'][:3]:
        print(f"   • {rec}")
    print()
    
    # Agent Communication: Analyzer → Scheduler
    print("📡 Agent Communication: Analyzer → Scheduler")
    analyzer_message = await analyzer.communicate_with_scheduler(workload_analysis)
    print(f"   Message Type: {analyzer_message['message_type']}")
    print(f"   Timestamp: {analyzer_message['timestamp']}")
    print()
    
    # STEP 2: Schedule Optimizer
    print("-" * 80)
    print("STEP 2: Schedule Optimizer Agent")
    print("-" * 80)
    print("Creating optimized schedule...")
    
    student_prefs = {
        "daily_study_hours": 6,
        "preferred_start_time": "09:00",
        "break_frequency": 60,
        "break_duration": 15
    }
    
    schedule = await scheduler.create_schedule(workload_analysis, student_prefs)
    
    print(f"\n📅 Schedule Created:")
    print(f"   Days Planned: {len(schedule.get('daily_schedules', []))}")
    print(f"   Flexibility Score: {schedule.get('flexibility_score', 'N/A')}/10")
    
    if schedule.get('daily_schedules'):
        first_day = schedule['daily_schedules'][0]
        print(f"\n   Sample Day ({first_day['day']}):")
        for session in first_day['sessions'][:3]:
            print(f"   • {session['time']}: {session.get('task', session.get('activity', 'N/A'))}")
    print()
    
    # Agent Communication: Scheduler → Wellness
    print("📡 Agent Communication: Scheduler → Wellness")
    scheduler_message = await scheduler.communicate_with_wellness(schedule)
    print(f"   Message Type: {scheduler_message['message_type']}")
    print(f"   Avg Daily Hours: {scheduler_message['data']['metrics']['average_daily_hours']}")
    print()
    
    # STEP 3: Wellness Monitor
    print("-" * 80)
    print("STEP 3: Wellness Monitor Agent")
    print("-" * 80)
    print("Assessing wellness...")
    
    student_wellness = {
        "mood": "stressed",
        "stress_level": 7,
        "sleep_hours": 6,
        "energy_level": 5
    }
    
    wellness_assessment = await wellness.assess_wellness(
        workload_analysis,
        scheduler_message['data'],
        student_wellness
    )
    
    print(f"\n🧘 Wellness Assessment:")
    print(f"   Wellness Score: {wellness_assessment['wellness_score']}/100")
    print(f"   Risk Level: {wellness_assessment['risk_level']}")
    print(f"\n   Risk Factors:")
    for factor in wellness_assessment.get('risk_factors', [])[:3]:
        print(f"   • {factor}")
    print(f"\n   Recommendations:")
    for rec in wellness_assessment.get('recommendations', [])[:3]:
        print(f"   • {rec.get('suggestion', rec)}")
    print()
    
    # Agent Communication: Wellness → All
    print("📡 Agent Communication: Wellness → All Agents")
    wellness_message = await wellness.communicate_with_agents(wellness_assessment)
    print(f"   Message Type: {wellness_message['message_type']}")
    print(f"   Action Required: {wellness_message['action_required']}")
    print()
    
    # FINAL SUMMARY
    print("=" * 80)
    print("MULTI-AGENT WORKFLOW COMPLETE")
    print("=" * 80)
    print(f"\n✅ All 3 agents successfully communicated and completed workflow")
    print(f"\n📈 Summary:")
    print(f"   • Analyzed {workload_analysis['total_assignments']} assignments")
    print(f"   • Created {len(schedule.get('daily_schedules', []))}-day schedule")
    print(f"   • Wellness score: {wellness_assessment['wellness_score']}/100")
    print(f"   • Risk level: {wellness_assessment['risk_level']}")
    print()
    
    # Save results
    results = {
        "workload_analysis": workload_analysis,
        "schedule": schedule,
        "wellness_assessment": wellness_assessment,
        "agent_communications": [
            analyzer_message,
            scheduler_message,
            wellness_message
        ]
    }
    
    with open('test_results.json', 'w') as f:
        json.dump(results, f, indent=2)
    
    print("💾 Results saved to test_results.json")
    print()


if __name__ == "__main__":
    asyncio.run(test_multi_agent_workflow())
