// Adaptive Student Coaching Agents - Main JavaScript
// Multi-Agent Collaboration Platform

// Global state management
const agentStates = {
    assignment: { status: 'active', tasks: 7, nextDeadline: '2 hours', activity: [] },
    research: { status: 'busy', sources: 23, writingScore: 85, activity: [] },
    study: { status: 'active', matches: 12, nextSession: 'Tomorrow', activity: [] },
    transfer: { status: 'active', requirements: '18/24', gpa: '3.6/4.0', activity: [] },
    wellness: { status: 'active', score: 92, nextBreak: '15 min', activity: [] }
};

let collaborationAnimation = null;
let typedInstance = null;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeAnimations();
    initializeAgentDashboard();
    startAgentActivitySimulation();
    initializeCollaborationCanvas();
    
    // Add smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
});

// Initialize text animations
function initializeAnimations() {
    // Initialize Splitting.js for text animations
    if (typeof Splitting !== 'undefined') {
        Splitting();
        
        // Animate hero title
        anime({
            targets: '.splitting-text .char',
            translateY: [100, 0],
            opacity: [0, 1],
            easing: 'easeOutExpo',
            duration: 1400,
            delay: (el, i) => 30 * i
        });
    }
    
    // Initialize typed text
    if (typeof Typed !== 'undefined') {
        typedInstance = new Typed('#typed-text', {
            strings: [
                'Multi-Agent Collaboration for Academic Excellence',
                'Intelligent Coaching for Student Success',
                'AI-Powered Educational Support System',
                'Seamless Integration with Your Academic Journey'
            ],
            typeSpeed: 50,
            backSpeed: 30,
            backDelay: 2000,
            loop: true,
            showCursor: true,
            cursorChar: '|'
        });
    }
    
    // Animate agent cards on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                anime({
                    targets: entry.target,
                    translateY: [50, 0],
                    opacity: [0, 1],
                    easing: 'easeOutQuart',
                    duration: 800,
                    delay: Math.random() * 200
                });
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.agent-card').forEach(card => {
        observer.observe(card);
    });
}

// Initialize agent dashboard with real-time updates
function initializeAgentDashboard() {
    updateAgentStatuses();
    
    // Update agent statuses every 30 seconds
    setInterval(updateAgentStatuses, 30000);
    
    // Animate progress rings
    animateProgressRings();
}

// Update agent status indicators
function updateAgentStatuses() {
    Object.keys(agentStates).forEach(agentKey => {
        const agent = agentStates[agentKey];
        const statusElement = document.querySelector(`[data-agent="${agentKey}"] .agent-status`);
        
        if (statusElement) {
            statusElement.className = `agent-status status-${agent.status}`;
        }
    });
}

// Animate progress rings in success metrics
function animateProgressRings() {
    const progressRings = document.querySelectorAll('.progress-ring-circle');
    progressRings.forEach((ring, index) => {
        const percentages = [75, 80, 85, 90];
        const circumference = 2 * Math.PI * 40;
        const offset = circumference - (percentages[index] / 100) * circumference;
        
        anime({
            targets: ring,
            strokeDashoffset: [circumference, offset],
            easing: 'easeOutQuart',
            duration: 2000,
            delay: index * 200
        });
    });
}

// Simulate agent activity
function startAgentActivitySimulation() {
    const activities = [
        { agent: 'assignment', message: 'Updated your task priority list', time: '2 minutes ago' },
        { agent: 'research', message: 'Found 5 new academic sources', time: '5 minutes ago' },
        { agent: 'study', message: 'Matched you with 3 study partners', time: '8 minutes ago' },
        { agent: 'transfer', message: 'Updated UC transfer requirements', time: '12 minutes ago' },
        { agent: 'wellness', message: 'Suggested a 10-minute break', time: '15 minutes ago' }
    ];
    
    // Add new activity every 45 seconds
    setInterval(() => {
        const randomActivity = activities[Math.floor(Math.random() * activities.length)];
        addAgentActivity(randomActivity.agent, randomActivity.message, randomActivity.time);
    }, 45000);
}

// Add activity to the feed
function addAgentActivity(agent, message, time) {
    const activityFeed = document.querySelector('.space-y-4');
    if (!activityFeed) return;
    
    const agentIcons = {
        assignment: { icon: '📅', color: 'blue' },
        research: { icon: '🔍', color: 'green' },
        study: { icon: '👥', color: 'purple' },
        transfer: { icon: '🎓', color: 'orange' },
        wellness: { icon: '🧘', color: 'teal' }
    };
    
    const agentData = agentIcons[agent];
    
    const activityElement = document.createElement('div');
    activityElement.className = 'activity-item pl-4 py-3';
    activityElement.innerHTML = `
        <div class="flex items-center space-x-3">
            <div class="w-8 h-8 bg-${agentData.color}-100 rounded-full flex items-center justify-center">
                <span class="text-${agentData.color}-600 text-sm">${agentData.icon}</span>
            </div>
            <div class="flex-1">
                <p class="text-sm font-medium text-charcoal-gray">${message}</p>
                <p class="text-xs text-gray-500">${time}</p>
            </div>
        </div>
    `;
    
    // Add to top of feed
    activityFeed.insertBefore(activityElement, activityFeed.firstChild);
    
    // Animate in
    anime({
        targets: activityElement,
        translateX: [-300, 0],
        opacity: [0, 1],
        easing: 'easeOutQuart',
        duration: 500
    });
    
    // Remove oldest activity if more than 5
    const activities = activityFeed.children;
    if (activities.length > 5) {
        activityFeed.removeChild(activities[activities.length - 1]);
    }
}

// Initialize collaboration canvas
function initializeCollaborationCanvas() {
    const canvas = document.getElementById('collaboration-canvas');
    if (!canvas) return;
    
    // P5.js sketch for collaboration visualization
    const sketch = (p) => {
        let particles = [];
        let connections = [];
        
        p.setup = () => {
            p.createCanvas(canvas.offsetWidth, canvas.offsetHeight);
            
            // Create particles representing agents
            for (let i = 0; i < 5; i++) {
                particles.push({
                    x: p.random(p.width),
                    y: p.random(p.height),
                    vx: p.random(-1, 1),
                    vy: p.random(-1, 1),
                    size: p.random(4, 8),
                    color: p.color(p.random(100, 255), p.random(100, 255), p.random(100, 255), 150)
                });
            }
        };
        
        p.draw = () => {
            p.clear();
            
            // Update and draw particles
            particles.forEach(particle => {
                particle.x += particle.vx;
                particle.y += particle.vy;
                
                // Bounce off edges
                if (particle.x < 0 || particle.x > p.width) particle.vx *= -1;
                if (particle.y < 0 || particle.y > p.height) particle.vy *= -1;
                
                // Draw particle
                p.fill(particle.color);
                p.noStroke();
                p.ellipse(particle.x, particle.y, particle.size);
            });
            
            // Draw connections between nearby particles
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const distance = p.dist(particles[i].x, particles[i].y, particles[j].x, particles[j].y);
                    if (distance < 150) {
                        const alpha = p.map(distance, 0, 150, 100, 0);
                        p.stroke(255, 255, 255, alpha);
                        p.strokeWeight(1);
                        p.line(particles[i].x, particles[i].y, particles[j].x, particles[j].y);
                    }
                }
            }
        };
        
        p.windowResized = () => {
            p.resizeCanvas(canvas.offsetWidth, canvas.offsetHeight);
        };
    };
    
    collaborationAnimation = new p5(sketch, canvas);
}

// Start collaboration demo
function startCollaborationDemo() {
    // Show collaboration modal or start animation
    showNotification('🤝 Starting Agent Collaboration Demo...', 'success');
    
    // Animate agent cards to show collaboration
    anime({
        targets: '.agent-card',
        scale: [1, 1.05, 1],
        duration: 1000,
        delay: (el, i) => i * 200,
        easing: 'easeInOutQuart'
    });
    
    // Add collaboration activity
    setTimeout(() => {
        addAgentActivity('collaboration', 'All agents coordinated to optimize your study schedule', 'Just now');
    }, 1500);
}

// Show quick actions modal
function showQuickActions() {
    const modal = createModal('Quick Actions', `
        <div class="grid grid-cols-2 gap-4">
            <button onclick="quickAction('assignment')" class="p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                <div class="text-blue-500 text-2xl mb-2">📅</div>
                <div class="font-medium">Add Assignment</div>
            </button>
            <button onclick="quickAction('research')" class="p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                <div class="text-green-500 text-2xl mb-2">🔍</div>
                <div class="font-medium">Research Help</div>
            </button>
            <button onclick="quickAction('study')" class="p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
                <div class="text-purple-500 text-2xl mb-2">👥</div>
                <div class="font-medium">Find Study Group</div>
            </button>
            <button onclick="quickAction('wellness')" class="p-4 bg-teal-50 rounded-lg hover:bg-teal-100 transition-colors">
                <div class="text-teal-500 text-2xl mb-2">🧘</div>
                <div class="font-medium">Wellness Check</div>
            </button>
        </div>
    `);
    document.body.appendChild(modal);
}

// Handle quick actions
function quickAction(type) {
    const actions = {
        assignment: {
            title: 'Add New Assignment',
            content: `
                <div class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Assignment Title</label>
                        <input type="text" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="e.g., History Essay">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                        <input type="date" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                        <select class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                            <option>High</option>
                            <option>Medium</option>
                            <option>Low</option>
                        </select>
                    </div>
                    <button onclick="submitAssignment()" class="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">Add Assignment</button>
                </div>
            `
        },
        research: {
            title: 'Research Assistance',
            content: `
                <div class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Research Topic</label>
                        <input type="text" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" placeholder="e.g., Climate Change Effects">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Assignment Type</label>
                        <select class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                            <option>Research Paper</option>
                            <option>Essay</option>
                            <option>Report</option>
                            <option>Presentation</option>
                        </select>
                    </div>
                    <button onclick="startResearch()" class="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors">Start Research</button>
                </div>
            `
        },
        study: {
            title: 'Find Study Group',
            content: `
                <div class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                        <select class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                            <option>Mathematics</option>
                            <option>Science</option>
                            <option>History</option>
                            <option>English</option>
                            <option>Computer Science</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Preferred Time</label>
                        <input type="datetime-local" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                    </div>
                    <button onclick="findStudyGroup()" class="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors">Find Matches</button>
                </div>
            `
        },
        wellness: {
            title: 'Wellness Check-in',
            content: `
                <div class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">How are you feeling right now?</label>
                        <div class="grid grid-cols-5 gap-2">
                            <button onclick="selectMood('stressed')" class="mood-btn p-3 text-2xl border border-gray-300 rounded-lg hover:bg-gray-50">😰</button>
                            <button onclick="selectMood('tired')" class="mood-btn p-3 text-2xl border border-gray-300 rounded-lg hover:bg-gray-50">😴</button>
                            <button onclick="selectMood('focused')" class="mood-btn p-3 text-2xl border border-gray-300 rounded-lg hover:bg-gray-50">🧠</button>
                            <button onclick="selectMood('happy')" class="mood-btn p-3 text-2xl border border-gray-300 rounded-lg hover:bg-gray-50">😊</button>
                            <button onclick="selectMood('excited')" class="mood-btn p-3 text-2xl border border-gray-300 rounded-lg hover:bg-gray-50">🚀</button>
                        </div>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Stress Level (1-10)</label>
                        <input type="range" min="1" max="10" value="5" class="w-full">
                    </div>
                    <button onclick="submitWellness()" class="w-full bg-teal-600 text-white py-2 rounded-lg hover:bg-teal-700 transition-colors">Get Recommendations</button>
                </div>
            `
        }
    };
    
    const modal = createModal(actions[type].title, actions[type].content);
    document.body.appendChild(modal);
}

// Show agent details
function showAgentDetails(agentType) {
    const agentInfo = {
        assignment: {
            name: 'Assignment Manager Agent',
            description: 'Your personal task organization expert that syncs with multiple platforms and creates optimized schedules.',
            features: [
                'Multi-platform assignment sync (Canvas, Google Calendar, school portals)',
                'AI-powered priority ranking and deadline management',
                'Personalized daily and weekly schedule generation',
                'Smart conflict resolution and time optimization',
                'Progress tracking with motivational feedback'
            ],
            stats: { activeTasks: 7, completedToday: 3, nextDeadline: '2 hours', efficiency: '94%' }
        },
        research: {
            name: 'Research & Writing Coach Agent',
            description: 'Academic writing assistant that helps find sources, develop thesis statements, and improve your writing.',
            features: [
                'Reputable academic source discovery and evaluation',
                'Thesis statement development and refinement',
                'Detailed research plan creation and management',
                'Real-time writing feedback and improvement suggestions',
                'Automatic citation formatting and bibliography generation'
            ],
            stats: { sourcesFound: 23, writingScore: 85, papersReviewed: 12, improvement: '+12 pts' }
        },
        study: {
            name: 'Study Group Finder Agent',
            description: 'Intelligent peer matching system that connects you with compatible study partners.',
            features: [
                'Learning style and availability matching algorithm',
                'Virtual study session organization and scheduling',
                'Group compatibility scoring and recommendations',
                'Subject-specific study group formation',
                'Session effectiveness tracking and feedback'
            ],
            stats: { matchesFound: 12, activeGroups: 3, sessionRating: 4.8, studyHours: '24 this week' }
        },
        transfer: {
            name: 'Transfer Advisor Agent',
            description: 'Comprehensive UC transfer planning with requirement tracking and application guidance.',
            features: [
                'UC transfer requirement tracking and validation',
                'Major-specific course planning and recommendations',
                'Application timeline management and deadline alerts',
                'Document upload reminders and essay guidance',
                'Transfer success probability analysis'
            ],
            stats: { requirementsMet: '18/24', gpa: '3.6/4.0', applications: 3, acceptanceChance: '87%' }
        },
        wellness: {
            name: 'Wellness & Focus Agent',
            description: 'Holistic well-being monitor that promotes balance and stress management.',
            features: [
                'Lightweight daily wellness check-ins and mood tracking',
                'Personalized stress relief and break recommendations',
                'Study-life balance optimization and suggestions',
                'Mindfulness exercises and focus enhancement techniques',
                'Wellness score tracking and improvement insights'
            ],
            stats: { wellnessScore: 92, breaksTaken: 8, mindfulnessSessions: 3, stressReduction: '78%' }
        }
    };
    
    const agent = agentInfo[agentType];
    const modal = createModal(agent.name, `
        <div class="space-y-6">
            <p class="text-gray-600">${agent.description}</p>
            
            <div>
                <h3 class="font-semibold text-charcoal-gray mb-3">Key Features</h3>
                <ul class="space-y-2">
                    ${agent.features.map(feature => `
                        <li class="flex items-start space-x-2">
                            <span class="text-sage-green mt-1">✓</span>
                            <span class="text-gray-600 text-sm">${feature}</span>
                        </li>
                    `).join('')}
                </ul>
            </div>
            
            <div class="grid grid-cols-2 gap-4">
                ${Object.entries(agent.stats).map(([key, value]) => `
                    <div class="bg-gray-50 p-3 rounded-lg">
                        <div class="text-2xl font-bold text-charcoal-gray">${value}</div>
                        <div class="text-xs text-gray-500 uppercase tracking-wide">${key.replace(/([A-Z])/g, ' $1').trim()}</div>
                    </div>
                `).join('')}
            </div>
            
            <div class="flex space-x-3">
                <button onclick="window.location.href='${agentType === 'assignment' ? 'assignments.html' : agentType === 'research' ? 'research.html' : agentType === 'study' ? 'study-groups.html' : agentType === 'transfer' ? 'transfer.html' : 'index.html'}'" class="flex-1 bg-sage-green text-white py-2 rounded-lg hover:bg-opacity-90 transition-colors">
                    Open ${agent.name}
                </button>
                <button onclick="closeModal()" class="flex-1 bg-gray-200 text-charcoal-gray py-2 rounded-lg hover:bg-gray-300 transition-colors">
                    Close
                </button>
            </div>
        </div>
    `);
    
    document.body.appendChild(modal);
}

// Show collaboration center
function showCollaborationCenter() {
    const modal = createModal('Agent Collaboration Center', `
        <div class="space-y-6">
            <div class="bg-gradient-to-r from-sage-green to-soft-blue p-6 rounded-lg text-white">
                <h3 class="text-xl font-bold mb-2">Real-Time Collaboration</h3>
                <p>Watch how our AI agents work together to support your academic success</p>
            </div>
            
            <div class="space-y-4">
                <div class="border-l-4 border-blue-500 pl-4 py-2">
                    <div class="flex items-center space-x-2 mb-1">
                        <span class="text-blue-500">📅</span>
                        <span class="font-medium">Assignment Manager</span>
                        <span class="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">Initiated</span>
                    </div>
                    <p class="text-sm text-gray-600">Detected upcoming deadline conflict, requesting schedule optimization</p>
                </div>
                
                <div class="border-l-4 border-green-500 pl-4 py-2 ml-4">
                    <div class="flex items-center space-x-2 mb-1">
                        <span class="text-green-500">🔍</span>
                        <span class="font-medium">Research Coach</span>
                        <span class="text-xs bg-green-100 text-green-600 px-2 py-1 rounded">Responding</span>
                    </div>
                    <p class="text-sm text-gray-600">Adjusting research timeline to accommodate new deadline priorities</p>
                </div>
                
                <div class="border-l-4 border-purple-500 pl-4 py-2 ml-8">
                    <div class="flex items-center space-x-2 mb-1">
                        <span class="text-purple-500">👥</span>
                        <span class="font-medium">Study Group Finder</span>
                        <span class="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded">Coordinating</span>
                    </div>
                    <p class="text-sm text-gray-600">Rescheduling study sessions to align with new assignment priorities</p>
                </div>
                
                <div class="border-l-4 border-teal-500 pl-4 py-2 ml-4">
                    <div class="flex items-center space-x-2 mb-1">
                        <span class="text-teal-500">🧘</span>
                        <span class="font-medium">Wellness Coach</span>
                        <span class="text-xs bg-teal-100 text-teal-600 px-2 py-1 rounded">Monitoring</span>
                    </div>
                    <p class="text-sm text-gray-600">Adding recommended breaks to prevent burnout during busy period</p>
                </div>
            </div>
            
            <div class="bg-gray-50 p-4 rounded-lg">
                <h4 class="font-semibold text-charcoal-gray mb-2">Collaboration Result</h4>
                <p class="text-sm text-gray-600">All agents have successfully coordinated to create an optimized schedule that balances your academic workload with wellness breaks and peer collaboration opportunities.</p>
            </div>
        </div>
    `);
    
    document.body.appendChild(modal);
}

// Utility functions for quick actions
function submitAssignment() {
    showNotification('✅ Assignment added successfully! Check your updated schedule.', 'success');
    closeModal();
    
    // Update agent status
    agentStates.assignment.tasks += 1;
    addAgentActivity('assignment', 'Added new assignment to your schedule', 'Just now');
}

function startResearch() {
    showNotification('🔍 Research Coach is finding relevant sources for your topic...', 'info');
    closeModal();
    
    setTimeout(() => {
        addAgentActivity('research', 'Found 12 relevant academic sources', 'Just now');
        showNotification('📚 Found 12 high-quality sources! Check the Research tab.', 'success');
    }, 2000);
}

function findStudyGroup() {
    showNotification('👥 Study Group Finder is matching you with compatible peers...', 'info');
    closeModal();
    
    setTimeout(() => {
        addAgentActivity('study', 'Matched you with 5 potential study partners', 'Just now');
        showNotification('🎯 Found 5 compatible study partners! Check Study Groups tab.', 'success');
    }, 1500);
}

function selectMood(mood) {
    document.querySelectorAll('.mood-btn').forEach(btn => {
        btn.classList.remove('bg-teal-100', 'border-teal-500');
        btn.classList.add('border-gray-300');
    });
    
    event.target.classList.remove('border-gray-300');
    event.target.classList.add('bg-teal-100', 'border-teal-500');
}

function submitWellness() {
    showNotification('🧘 Wellness Coach has personalized recommendations for you!', 'success');
    closeModal();
    
    setTimeout(() => {
        addAgentActivity('wellness', 'Provided personalized wellness recommendations', 'Just now');
    }, 1000);
}

// Modal utility functions
function createModal(title, content) {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    modal.innerHTML = `
        <div class="bg-white rounded-xl p-6 max-w-md w-full mx-4 max-h-96 overflow-y-auto">
            <div class="flex justify-between items-center mb-4">
                <h3 class="text-lg font-semibold text-charcoal-gray">${title}</h3>
                <button onclick="closeModal()" class="text-gray-400 hover:text-gray-600">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
            </div>
            ${content}
        </div>
    `;
    
    // Animate in
    anime({
        targets: modal,
        opacity: [0, 1],
        duration: 300,
        easing: 'easeOutQuart'
    });
    
    anime({
        targets: modal.querySelector('.bg-white'),
        scale: [0.8, 1],
        duration: 300,
        easing: 'easeOutQuart'
    });
    
    return modal;
}

function closeModal() {
    const modal = document.querySelector('.fixed.inset-0');
    if (modal) {
        anime({
            targets: modal,
            opacity: [1, 0],
            duration: 200,
            easing: 'easeInQuart',
            complete: () => {
                modal.remove();
            }
        });
    }
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    const colors = {
        success: 'bg-green-500',
        error: 'bg-red-500',
        info: 'bg-blue-500',
        warning: 'bg-yellow-500'
    };
    
    notification.className = `fixed top-4 right-4 ${colors[type]} text-white px-6 py-3 rounded-lg shadow-lg z-50 transform translate-x-full`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Animate in
    anime({
        targets: notification,
        translateX: [300, 0],
        duration: 500,
        easing: 'easeOutQuart'
    });
    
    // Auto remove after 4 seconds
    setTimeout(() => {
        anime({
            targets: notification,
            translateX: [0, 300],
            duration: 300,
            easing: 'easeInQuart',
            complete: () => {
                notification.remove();
            }
        });
    }, 4000);
}

// Handle window resize for canvas
window.addEventListener('resize', () => {
    if (collaborationAnimation) {
        const canvas = document.getElementById('collaboration-canvas');
        collaborationAnimation.resizeCanvas(canvas.offsetWidth, canvas.offsetHeight);
    }
});

// Export functions for global access
window.startCollaborationDemo = startCollaborationDemo;
window.showQuickActions = showQuickActions;
window.quickAction = quickAction;
window.showAgentDetails = showAgentDetails;
window.showCollaborationCenter = showCollaborationCenter;
window.closeModal = closeModal;
window.submitAssignment = submitAssignment;
window.startResearch = startResearch;
window.findStudyGroup = findStudyGroup;
window.selectMood = selectMood;
window.submitWellness = submitWellness;