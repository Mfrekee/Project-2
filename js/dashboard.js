// Dashboard functionality for LearnHub

// Dashboard data
let dashboardData = {
    stats: {
        activeCourses: 3,
        completedCourses: 12,
        pendingAssignments: 5,
        studyHours: 24
    },
    recentCourses: [
        {
            id: 1,
            title: "JavaScript Fundamentals",
            instructor: "Sarah Johnson",
            progress: 75,
            thumbnail: "https://via.placeholder.com/300x200",
            category: "Programming"
        },
        {
            id: 2,
            title: "UI/UX Design Principles",
            instructor: "Mike Chen",
            progress: 45,
            thumbnail: "https://via.placeholder.com/300x200",
            category: "Design"
        },
        {
            id: 3,
            title: "Digital Marketing Strategy",
            instructor: "Emily Davis",
            progress: 90,
            thumbnail: "https://via.placeholder.com/300x200",
            category: "Marketing"
        }
    ],
    upcomingAssignments: [
        {
            id: 1,
            title: "JavaScript Project Submission",
            course: "JavaScript Fundamentals",
            dueDate: "2025-01-15",
            status: "pending"
        },
        {
            id: 2,
            title: "Design Portfolio Review",
            course: "UI/UX Design Principles",
            dueDate: "2025-01-18",
            status: "pending"
        },
        {
            id: 3,
            title: "Marketing Campaign Analysis",
            course: "Digital Marketing Strategy",
            dueDate: "2025-01-20",
            status: "submitted"
        }
    ],
    courseProgress: [
        {
            course: "JavaScript Fundamentals",
            progress: 75
        },
        {
            course: "UI/UX Design Principles",
            progress: 45
        },
        {
            course: "Digital Marketing Strategy",
            progress: 90
        }
    ]
};

// Initialize dashboard
document.addEventListener('DOMContentLoaded', function () {
    if (window.location.pathname.includes('dashboard.html')) {
        initializeDashboard();
    }
    if (window.location.pathname.includes('courses.html')) {
        initializeCourses();
    }
    if (window.location.pathname.includes('assignments.html')) {
        initializeAssignments();
    }
});

// Initialize dashboard page
function initializeDashboard() {
    // Check authentication
    if (!auth.isAuthenticated()) {
        window.location.href = 'login.html';
        return;
    }

    loadDashboardData();
    renderDashboardStats();
    renderRecentCourses();
    renderUpcomingAssignments();
    renderCourseProgress();
}

// Load dashboard data from API
async function loadDashboardData() {
    try {
        const token = auth.getAuthToken();
        const response = await fetch(`${API_BASE_URL}/dashboard`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            dashboardData = data;
        }
    } catch (error) {
        console.error('Error loading dashboard data:', error);
        // Use mock data if API fails
    }
}

// Render dashboard statistics
function renderDashboardStats() {
    const stats = dashboardData.stats;

    document.getElementById('activeCourses').textContent = stats.activeCourses;
    document.getElementById('completedCourses').textContent = stats.completedCourses;
    document.getElementById('pendingAssignments').textContent = stats.pendingAssignments;
    document.getElementById('studyHours').textContent = stats.studyHours;
}

// Render recent courses
function renderRecentCourses() {
    const container = document.getElementById('recentCourses');
    if (!container) return;

    container.innerHTML = dashboardData.recentCourses.map(course => `
        <div class="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
            <img src="${course.thumbnail}" alt="${course.title}" class="w-16 h-12 object-cover rounded">
            <div class="flex-1">
                <h3 class="font-semibold text-gray-800">${course.title}</h3>
                <p class="text-sm text-gray-600">by ${course.instructor}</p>
                <div class="mt-2">
                    <div class="flex justify-between text-sm text-gray-600 mb-1">
                        <span>Progress</span>
                        <span>${course.progress}%</span>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-2">
                        <div class="bg-primary h-2 rounded-full" style="width: ${course.progress}%"></div>
                    </div>
                </div>
            </div>
            <button onclick="continueCourse(${course.id})" class="bg-primary text-white px-4 py-2 rounded-lg hover:bg-secondary transition-colors">
                Continue
            </button>
        </div>
    `).join('');
}

// Render upcoming assignments
function renderUpcomingAssignments() {
    const container = document.getElementById('upcomingAssignments');
    if (!container) return;

    container.innerHTML = dashboardData.upcomingAssignments.map(assignment => `
        <div class="p-4 border border-gray-200 rounded-lg">
            <h3 class="font-semibold text-gray-800">${assignment.title}</h3>
            <p class="text-sm text-gray-600">${assignment.course}</p>
            <p class="text-sm text-gray-500">Due: ${formatDate(assignment.dueDate)}</p>
            <span class="inline-block mt-2 px-2 py-1 text-xs rounded-full ${getStatusClass(assignment.status)}">
                ${assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
            </span>
        </div>
    `).join('');
}

// Render course progress
function renderCourseProgress() {
    const container = document.getElementById('courseProgress');
    if (!container) return;

    container.innerHTML = dashboardData.courseProgress.map(course => `
        <div class="mb-4">
            <div class="flex justify-between text-sm text-gray-600 mb-1">
                <span>${course.course}</span>
                <span>${course.progress}%</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2">
                <div class="bg-primary h-2 rounded-full transition-all duration-500" style="width: ${course.progress}%"></div>
            </div>
        </div>
    `).join('');
}

// Initialize courses page
function initializeCourses() {
    if (!auth.isAuthenticated()) {
        window.location.href = 'login.html';
        return;
    }

    loadCourses();
    setupCourseFilters();
}

// Load courses data
async function loadCourses() {
    try {
        const token = auth.getAuthToken();
        const response = await fetch(`${API_BASE_URL}/courses`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            renderCourses(data.courses);
        } else {
            // Use mock data
            renderCourses(getMockCourses());
        }
    } catch (error) {
        console.error('Error loading courses:', error);
        renderCourses(getMockCourses());
    }
}

// Get mock courses data
function getMockCourses() {
    return [
        {
            id: 1,
            title: "JavaScript Fundamentals",
            description: "Learn the basics of JavaScript programming language",
            instructor: "Sarah Johnson",
            thumbnail: "https://via.placeholder.com/300x200",
            category: "programming",
            duration: "8 weeks",
            level: "Beginner",
            rating: 4.8,
            students: 1250,
            price: 99,
            status: "enrolled",
            progress: 75
        },
        {
            id: 2,
            title: "UI/UX Design Principles",
            description: "Master the fundamentals of user interface and user experience design",
            instructor: "Mike Chen",
            thumbnail: "https://via.placeholder.com/300x200",
            category: "design",
            duration: "6 weeks",
            level: "Intermediate",
            rating: 4.9,
            students: 890,
            price: 149,
            status: "enrolled",
            progress: 45
        },
        {
            id: 3,
            title: "Digital Marketing Strategy",
            description: "Learn how to create effective digital marketing campaigns",
            instructor: "Emily Davis",
            thumbnail: "https://via.placeholder.com/300x200",
            category: "marketing",
            duration: "10 weeks",
            level: "Advanced",
            rating: 4.7,
            students: 2100,
            price: 199,
            status: "completed",
            progress: 100
        }
    ];
}

// Render courses
function renderCourses(courses) {
    const container = document.getElementById('courseGrid');
    if (!container) return;

    container.innerHTML = courses.map(course => `
        <div class="course-card bg-white rounded-lg shadow-sm overflow-hidden">
            <img src="${course.thumbnail}" alt="${course.title}" class="w-full h-48 object-cover">
            <div class="p-6">
                <div class="flex justify-between items-start mb-2">
                    <span class="text-sm text-gray-500">${course.category}</span>
                    <span class="text-sm font-medium text-primary">$${course.price}</span>
                </div>
                <h3 class="text-xl font-semibold text-gray-800 mb-2">${course.title}</h3>
                <p class="text-gray-600 text-sm mb-4">${course.description}</p>
                <div class="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span>by ${course.instructor}</span>
                    <div class="flex items-center">
                        <svg class="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                        </svg>
                        ${course.rating} (${course.students})
                    </div>
                </div>
                ${course.status === 'enrolled' ? `
                    <div class="mb-4">
                        <div class="flex justify-between text-sm text-gray-600 mb-1">
                            <span>Progress</span>
                            <span>${course.progress}%</span>
                        </div>
                        <div class="w-full bg-gray-200 rounded-full h-2">
                            <div class="bg-primary h-2 rounded-full" style="width: ${course.progress}%"></div>
                        </div>
                    </div>
                ` : ''}
                <div class="flex gap-2">
                    <button onclick="viewCourse(${course.id})" class="flex-1 bg-primary text-white py-2 px-4 rounded-lg hover:bg-secondary transition-colors">
                        ${course.status === 'enrolled' ? 'Continue' : course.status === 'completed' ? 'Review' : 'View Details'}
                    </button>
                    ${course.status === 'not-started' ? `
                        <button onclick="enrollCourse(${course.id})" class="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors">
                            Enroll
                        </button>
                    ` : ''}
                </div>
            </div>
        </div>
    `).join('');
}

// Setup course filters
function setupCourseFilters() {
    const searchInput = document.getElementById('courseSearch');
    const categoryFilter = document.getElementById('categoryFilter');
    const statusFilter = document.getElementById('statusFilter');

    if (searchInput) {
        searchInput.addEventListener('input', filterCourses);
    }
    if (categoryFilter) {
        categoryFilter.addEventListener('change', filterCourses);
    }
    if (statusFilter) {
        statusFilter.addEventListener('change', filterCourses);
    }
}

// Filter courses
function filterCourses() {
    // This would implement filtering logic
    console.log('Filtering courses...');
}

// Initialize assignments page
function initializeAssignments() {
    if (!auth.isAuthenticated()) {
        window.location.href = 'login.html';
        return;
    }

    loadAssignments();
}

// Load assignments data
async function loadAssignments() {
    try {
        const token = auth.getAuthToken();
        const response = await fetch(`${API_BASE_URL}/assignments`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            renderAssignments(data.assignments);
        } else {
            // Use mock data
            renderAssignments(getMockAssignments());
        }
    } catch (error) {
        console.error('Error loading assignments:', error);
        renderAssignments(getMockAssignments());
    }
}

// Get mock assignments data
function getMockAssignments() {
    return [
        {
            id: 1,
            title: "JavaScript Project Submission",
            course: "JavaScript Fundamentals",
            description: "Create a todo list application using vanilla JavaScript",
            dueDate: "2025-01-15",
            status: "pending",
            points: 100
        },
        {
            id: 2,
            title: "Design Portfolio Review",
            course: "UI/UX Design Principles",
            description: "Submit your design portfolio for peer review",
            dueDate: "2025-01-18",
            status: "pending",
            points: 150
        },
        {
            id: 3,
            title: "Marketing Campaign Analysis",
            course: "Digital Marketing Strategy",
            description: "Analyze a real-world marketing campaign",
            dueDate: "2025-01-20",
            status: "submitted",
            points: 200
        }
    ];
}

// Render assignments
function renderAssignments(assignments) {
    const container = document.getElementById('assignmentList');
    if (!container) return;

    container.innerHTML = assignments.map(assignment => `
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div class="flex justify-between items-start mb-4">
                <div>
                    <h3 class="text-xl font-semibold text-gray-800">${assignment.title}</h3>
                    <p class="text-gray-600">${assignment.course}</p>
                </div>
                <span class="px-3 py-1 text-sm rounded-full ${getStatusClass(assignment.status)}">
                    ${assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
                </span>
            </div>
            <p class="text-gray-600 mb-4">${assignment.description}</p>
            <div class="flex justify-between items-center">
                <div class="text-sm text-gray-500">
                    <p>Due: ${formatDate(assignment.dueDate)}</p>
                    <p>Points: ${assignment.points}</p>
                </div>
                <div class="flex gap-2">
                    <button onclick="viewAssignment(${assignment.id})" class="bg-primary text-white px-4 py-2 rounded-lg hover:bg-secondary transition-colors">
                        View Details
                    </button>
                    ${assignment.status === 'pending' ? `
                        <button onclick="submitAssignment(${assignment.id})" class="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors">
                            Submit
                        </button>
                    ` : ''}
                </div>
            </div>
        </div>
    `).join('');
}

// Filter assignments by status
function filterAssignments(status) {
    // Update tab styles
    document.querySelectorAll('[id^="tab-"]').forEach(tab => {
        tab.classList.remove('border-primary', 'text-primary');
        tab.classList.add('border-transparent', 'text-gray-500');
    });

    const activeTab = document.getElementById(`tab-${status}`);
    if (activeTab) {
        activeTab.classList.remove('border-transparent', 'text-gray-500');
        activeTab.classList.add('border-primary', 'text-primary');
    }

    // Filter logic would go here
    console.log(`Filtering assignments by status: ${status}`);
}

// Utility functions
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function getStatusClass(status) {
    const statusClasses = {
        pending: 'status-pending',
        submitted: 'status-submitted',
        graded: 'status-graded',
        overdue: 'status-overdue'
    };
    return statusClasses[status] || 'status-pending';
}

// Course actions
function continueCourse(courseId) {
    console.log(`Continuing course ${courseId}`);
    // Navigate to course content
}

function viewCourse(courseId) {
    console.log(`Viewing course ${courseId}`);
    // Show course details modal or navigate to course page
}

function enrollCourse(courseId) {
    console.log(`Enrolling in course ${courseId}`);
    // Handle course enrollment
}

// Assignment actions
function viewAssignment(assignmentId) {
    console.log(`Viewing assignment ${assignmentId}`);
    // Show assignment details modal
}

function submitAssignment(assignmentId) {
    console.log(`Submitting assignment ${assignmentId}`);
    // Handle assignment submission
}

// Modal functions
function closeCourseModal() {
    document.getElementById('courseModal').classList.add('hidden');
}

function closeAssignmentModal() {
    document.getElementById('assignmentModal').classList.add('hidden');
}

// Export functions for global access
window.dashboard = {
    filterAssignments,
    continueCourse,
    viewCourse,
    enrollCourse,
    viewAssignment,
    submitAssignment,
    closeCourseModal,
    closeAssignmentModal
};
