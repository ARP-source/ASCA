/**
 * ASCA API Client
 * Connects frontend to backend multi-agent system
 */

const API_BASE_URL = 'http://localhost:8080';

// API Client class
class ASCAApiClient {
    constructor(baseUrl = API_BASE_URL) {
        this.baseUrl = baseUrl;
    }

    async request(endpoint, options = {}) {
        const url = `${this.baseUrl}${endpoint}`;
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        };

        try {
            const response = await fetch(url, config);
            if (!response.ok) {
                throw new Error(`API Error: ${response.status} ${response.statusText}`);
            }
            return await response.json();
        } catch (error) {
            console.error('API Request failed:', error);
            throw error;
        }
    }

    // Health check
    async healthCheck() {
        return this.request('/');
    }

    // Analyze single assignment
    async analyzeAssignment(assignment) {
        return this.request('/api/analyze-assignment', {
            method: 'POST',
            body: JSON.stringify(assignment)
        });
    }

    // Analyze workload (multiple assignments)
    async analyzeWorkload(assignments) {
        return this.request('/api/analyze-workload', {
            method: 'POST',
            body: JSON.stringify(assignments)
        });
    }

    // Create schedule (2 agents: Analyzer + Scheduler)
    async createSchedule(assignments, preferences = null) {
        return this.request('/api/create-schedule', {
            method: 'POST',
            body: JSON.stringify({ assignments, preferences })
        });
    }

    // Wellness check (3 agents: Analyzer + Scheduler + Wellness)
    async wellnessCheck(assignments, preferences = null, wellnessInput = null) {
        return this.request('/api/wellness-check', {
            method: 'POST',
            body: JSON.stringify({ assignments, preferences, wellness_input: wellnessInput })
        });
    }

    // Full multi-agent analysis (all 3 agents)
    async fullAnalysis(assignments, preferences = null, wellnessInput = null) {
        return this.request('/api/full-analysis', {
            method: 'POST',
            body: JSON.stringify({ 
                assignments, 
                preferences, 
                wellness_input: wellnessInput 
            })
        });
    }

    // Suggest break
    async suggestBreak(currentActivity, timeWorked) {
        return this.request('/api/suggest-break', {
            method: 'POST',
            body: JSON.stringify({ current_activity: currentActivity, time_worked: timeWorked })
        });
    }
}

// Create global API client instance
const apiClient = new ASCAApiClient();

// Enhanced functions that call the real backend
async function analyzeAssignmentsWithBackend() {
    try {
        showNotification('🤖 Analyzing assignments with AI agents...', 'info');
        
        // Get sample assignments (you can replace this with actual form data)
        const assignments = [
            {
                id: 'hw1',
                title: 'History Essay',
                description: 'Write a 5-page essay analyzing the causes of World War II',
                due_date: '2025-11-15',
                course: 'History 101'
            },
            {
                id: 'hw2',
                title: 'Math Problem Set',
                description: 'Complete problems 1-20 from Chapter 5 on Calculus',
                due_date: '2025-11-12',
                course: 'Math 201'
            },
            {
                id: 'hw3',
                title: 'Programming Project',
                description: 'Build a web application using React and Node.js',
                due_date: '2025-11-20',
                course: 'CS 301'
            }
        ];

        const result = await apiClient.analyzeWorkload(assignments);
        
        if (result.success) {
            const data = result.data;
            showNotification(
                `✅ Analysis complete! ${data.total_assignments} assignments, ${data.total_estimated_hours}h total. Stress: ${data.stress_level}`,
                'success'
            );
            
            // Update UI with results
            displayWorkloadResults(data);
        }
    } catch (error) {
        showNotification('❌ Backend not running. Start with: cd backend && python main.py', 'error');
        console.error(error);
    }
}

async function createScheduleWithBackend() {
    try {
        showNotification('📅 Creating optimized schedule with AI...', 'info');
        
        const assignments = getSampleAssignments();
        const preferences = {
            daily_study_hours: 6,
            preferred_start_time: '09:00',
            break_frequency: 60,
            break_duration: 15
        };

        const result = await apiClient.createSchedule(assignments, preferences);
        
        if (result.success) {
            showNotification('✅ Schedule created successfully!', 'success');
            displayScheduleResults(result.data);
        }
    } catch (error) {
        showNotification('❌ Backend not running. Start with: cd backend && python main.py', 'error');
        console.error(error);
    }
}

async function performFullAnalysis() {
    try {
        showNotification('🤖 Running full multi-agent analysis...', 'info');
        
        const assignments = getSampleAssignments();
        const preferences = {
            daily_study_hours: 6,
            preferred_start_time: '09:00',
            break_frequency: 60,
            break_duration: 15
        };
        const wellnessInput = {
            mood: 'focused',
            stress_level: 5,
            sleep_hours: 7,
            energy_level: 7
        };

        const result = await apiClient.fullAnalysis(assignments, preferences, wellnessInput);
        
        if (result.success) {
            showNotification(
                `✅ Complete! Wellness: ${result.summary.wellness_score}/100, Risk: ${result.summary.risk_level}`,
                'success'
            );
            displayFullAnalysisResults(result);
        }
    } catch (error) {
        showNotification('❌ Backend not running. Start with: cd backend && python main.py', 'error');
        console.error(error);
    }
}

// Helper function to get sample assignments
function getSampleAssignments() {
    return [
        {
            id: 'hw1',
            title: 'History Essay',
            description: 'Write a 5-page essay analyzing the causes of World War II',
            due_date: '2025-11-15',
            course: 'History 101'
        },
        {
            id: 'hw2',
            title: 'Math Problem Set',
            description: 'Complete problems 1-20 from Chapter 5 on Calculus',
            due_date: '2025-11-12',
            course: 'Math 201'
        },
        {
            id: 'hw3',
            title: 'Programming Project',
            description: 'Build a web application using React and Node.js',
            due_date: '2025-11-20',
            course: 'CS 301'
        }
    ];
}

// Display functions
function displayWorkloadResults(data) {
    const modal = createModal('Workload Analysis Results', `
        <div class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
                <div class="bg-blue-50 p-4 rounded-lg">
                    <div class="text-2xl font-bold text-blue-600">${data.total_assignments}</div>
                    <div class="text-sm text-gray-600">Total Assignments</div>
                </div>
                <div class="bg-orange-50 p-4 rounded-lg">
                    <div class="text-2xl font-bold text-orange-600">${data.total_estimated_hours}h</div>
                    <div class="text-sm text-gray-600">Estimated Hours</div>
                </div>
                <div class="bg-red-50 p-4 rounded-lg">
                    <div class="text-2xl font-bold text-red-600">${data.high_priority_count}</div>
                    <div class="text-sm text-gray-600">High Priority</div>
                </div>
                <div class="bg-purple-50 p-4 rounded-lg">
                    <div class="text-2xl font-bold text-purple-600">${data.stress_level}</div>
                    <div class="text-sm text-gray-600">Stress Level</div>
                </div>
            </div>
            
            <div class="bg-gray-50 p-4 rounded-lg">
                <h4 class="font-semibold mb-2">AI Recommendations:</h4>
                <ul class="space-y-1">
                    ${data.recommendations.slice(0, 5).map(rec => 
                        `<li class="text-sm text-gray-600">• ${rec}</li>`
                    ).join('')}
                </ul>
            </div>
        </div>
    `);
    document.body.appendChild(modal);
}

function displayScheduleResults(data) {
    const schedule = data.schedule;
    const modal = createModal('Optimized Schedule', `
        <div class="space-y-4">
            <div class="bg-green-50 p-4 rounded-lg">
                <div class="text-lg font-bold text-green-600">Schedule Created!</div>
                <div class="text-sm text-gray-600">Flexibility Score: ${schedule.flexibility_score}/10</div>
            </div>
            
            <div class="space-y-2">
                <h4 class="font-semibold">First 3 Days:</h4>
                ${schedule.daily_schedules.slice(0, 3).map(day => `
                    <div class="border-l-4 border-blue-500 pl-3 py-2">
                        <div class="font-medium">${day.day} - ${day.date}</div>
                        <div class="text-sm text-gray-600">${day.total_hours} hours scheduled</div>
                    </div>
                `).join('')}
            </div>
            
            <button onclick="window.location.href='assignments.html'" class="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
                View Full Schedule
            </button>
        </div>
    `);
    document.body.appendChild(modal);
}

function displayFullAnalysisResults(result) {
    const modal = createModal('Complete Multi-Agent Analysis', `
        <div class="space-y-4">
            <div class="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-4 rounded-lg">
                <div class="text-lg font-bold">All 3 Agents Completed!</div>
                <div class="text-sm">Assignment Analyzer → Schedule Optimizer → Wellness Monitor</div>
            </div>
            
            <div class="grid grid-cols-3 gap-3">
                <div class="bg-blue-50 p-3 rounded-lg text-center">
                    <div class="text-xl font-bold text-blue-600">${result.summary.total_assignments}</div>
                    <div class="text-xs text-gray-600">Assignments</div>
                </div>
                <div class="bg-orange-50 p-3 rounded-lg text-center">
                    <div class="text-xl font-bold text-orange-600">${result.summary.total_hours}h</div>
                    <div class="text-xs text-gray-600">Total Hours</div>
                </div>
                <div class="bg-green-50 p-3 rounded-lg text-center">
                    <div class="text-xl font-bold text-green-600">${result.summary.wellness_score}</div>
                    <div class="text-xs text-gray-600">Wellness Score</div>
                </div>
            </div>
            
            <div class="bg-gray-50 p-4 rounded-lg">
                <h4 class="font-semibold mb-2">Agent Communications:</h4>
                <div class="space-y-2 text-sm">
                    ${result.agent_communications.map((comm, i) => `
                        <div class="flex items-center space-x-2">
                            <span class="text-blue-500">→</span>
                            <span class="font-medium">${comm.agent}</span>
                            <span class="text-gray-500">${comm.message_type}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div class="bg-${result.summary.risk_level === 'High' ? 'red' : result.summary.risk_level === 'Medium' ? 'yellow' : 'green'}-50 p-4 rounded-lg">
                <div class="font-semibold">Risk Level: ${result.summary.risk_level}</div>
                <div class="text-sm text-gray-600">Stress: ${result.summary.stress_level}</div>
            </div>
        </div>
    `);
    document.body.appendChild(modal);
}

// Check if backend is running on page load
window.addEventListener('DOMContentLoaded', async () => {
    try {
        const health = await apiClient.healthCheck();
        console.log('✅ Backend connected:', health);
        showNotification('✅ Connected to ASCA backend', 'success');
    } catch (error) {
        console.warn('⚠️ Backend not running. Start with: cd backend && python main.py');
        showNotification('⚠️ Backend offline. Some features require: cd backend && python main.py', 'warning');
    }
});
