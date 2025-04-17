/* Author: Marwan Rafe Mohammed 
Project: Habita
Course: TAG-Web Development Course-Level.1
License: All rights reserved – No reuse without permission
Date: April 2025 */

// recommendations page js by @Two-Face
document.addEventListener('DOMContentLoaded', function() {
    // Check if user logged in
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        window.location.href = 'index.html';
        return;
    }

    // Logout func
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            localStorage.removeItem('currentUser');
            window.location.href = 'index.html';
        });
    }

    // user's habits
    const userHabits = JSON.parse(localStorage.getItem('userHabits')) || [];
    
    // Define all possible habit recommendations
    const allRecommendations = {
        'health': [
            { name: 'Morning Exercise', description: 'Start your day with 30 minutes of exercise', timeOfDay: 'Morning', frequency: 'Daily', difficulty: 'medium' },
            { name: 'Drink Water', description: 'Drink 8 glasses of water daily', timeOfDay: 'Anytime', frequency: 'Daily', difficulty: 'easy' },
            { name: 'Healthy Breakfast', description: 'Eat a nutritious breakfast every morning', timeOfDay: 'Morning', frequency: 'Daily', difficulty: 'easy' },
            { name: 'Evening Walk', description: 'Take a 20-minute walk after dinner', timeOfDay: 'Evening', frequency: 'Daily', difficulty: 'easy' },
            { name: 'Stretching', description: 'Do 10 minutes of stretching before bed', timeOfDay: 'Evening', frequency: 'Daily', difficulty: 'easy' },
            { name: 'Intermittent Fasting', description: 'Follow 16:8 fasting schedule', timeOfDay: 'Anytime', frequency: 'Daily', difficulty: 'hard' },
            { name: 'Intense Workout', description: 'Complete a 1-hour high-intensity workout', timeOfDay: 'Anytime', frequency: 'Daily', difficulty: 'hard' },
            { name: 'Meal Prep', description: 'Prepare all meals for the week', timeOfDay: 'Anytime', frequency: 'Weekly', difficulty: 'hard' }
        ],
        'learning': [
            { name: 'Read Books', description: 'Read for 30 minutes daily', timeOfDay: 'Anytime', frequency: 'Daily', difficulty: 'medium' },
            { name: 'Learn New Words', description: 'Learn 5 new words daily', timeOfDay: 'Anytime', frequency: 'Daily', difficulty: 'easy' },
            { name: 'Online Course', description: 'Spend 1 hour on online learning', timeOfDay: 'Anytime', frequency: 'Daily', difficulty: 'hard' },
            { name: 'Practice Skills', description: 'Practice a skill for 30 minutes', timeOfDay: 'Anytime', frequency: 'Daily', difficulty: 'medium' },
            { name: 'Watch Educational Videos', description: 'Watch educational content for 20 minutes', timeOfDay: 'Anytime', frequency: 'Daily', difficulty: 'easy' },
            { name: 'Language Immersion', description: 'Spend 2 hours practicing a new language', timeOfDay: 'Anytime', frequency: 'Daily', difficulty: 'hard' },
            { name: 'Research Project', description: 'Work on a personal research project', timeOfDay: 'Anytime', frequency: 'Daily', difficulty: 'hard' },
            { name: 'Technical Certification', description: 'Study for a technical certification', timeOfDay: 'Anytime', frequency: 'Daily', difficulty: 'hard' }
        ],
        'productivity': [
            { name: 'Morning Planning', description: 'Plan your day in the morning', timeOfDay: 'Morning', frequency: 'Daily', difficulty: 'easy' },
            { name: 'Pomodoro Technique', description: 'Use Pomodoro technique for work', timeOfDay: 'Anytime', frequency: 'Daily', difficulty: 'medium' },
            { name: 'Task Prioritization', description: 'Prioritize your tasks daily', timeOfDay: 'Morning', frequency: 'Daily', difficulty: 'medium' },
            { name: 'Digital Detox', description: 'Take a 30-minute break from screens', timeOfDay: 'Evening', frequency: 'Daily', difficulty: 'easy' },
            { name: 'Evening Review', description: 'Review your day and plan tomorrow', timeOfDay: 'Evening', frequency: 'Daily', difficulty: 'easy' },
            { name: 'Deep Work Session', description: 'Complete a 4-hour focused work session', timeOfDay: 'Anytime', frequency: 'Daily', difficulty: 'hard' },
            { name: 'Project Management', description: 'Manage a complex project', timeOfDay: 'Anytime', frequency: 'Daily', difficulty: 'hard' },
            { name: 'Time Blocking', description: 'Plan every hour of your day', timeOfDay: 'Morning', frequency: 'Daily', difficulty: 'hard' }
        ],
        'mindfulness': [
            { name: 'Morning Meditation', description: 'Meditate for 10 minutes in the morning', timeOfDay: 'Morning', frequency: 'Daily', difficulty: 'medium' },
            { name: 'Gratitude Journal', description: 'Write 3 things you are grateful for', timeOfDay: 'Evening', frequency: 'Daily', difficulty: 'easy' },
            { name: 'Deep Breathing', description: 'Practice deep breathing exercises', timeOfDay: 'Anytime', frequency: 'Daily', difficulty: 'easy' },
            { name: 'Mindful Eating', description: 'Eat one meal mindfully', timeOfDay: 'Anytime', frequency: 'Daily', difficulty: 'medium' },
            { name: 'Evening Reflection', description: 'Reflect on your day for 5 minutes', timeOfDay: 'Evening', frequency: 'Daily', difficulty: 'easy' },
            { name: 'Silent Retreat', description: 'Spend 1 hour in complete silence', timeOfDay: 'Anytime', frequency: 'Daily', difficulty: 'hard' },
            { name: 'Digital Sabbath', description: 'No digital devices for 24 hours', timeOfDay: 'Anytime', frequency: 'Weekly', difficulty: 'hard' },
            { name: 'Mindfulness Challenge', description: 'Practice mindfulness for 2 hours', timeOfDay: 'Anytime', frequency: 'Daily', difficulty: 'hard' }
        ],
        'relationships': [
            { name: 'Family Time', description: 'Spend quality time with family', timeOfDay: 'Evening', frequency: 'Daily', difficulty: 'easy' },
            { name: 'Call a Friend', description: 'Call or message a friend', timeOfDay: 'Anytime', frequency: 'Daily', difficulty: 'easy' },
            { name: 'Express Gratitude', description: 'Express gratitude to someone', timeOfDay: 'Anytime', frequency: 'Daily', difficulty: 'easy' },
            { name: 'Active Listening', description: 'Practice active listening', timeOfDay: 'Anytime', frequency: 'Daily', difficulty: 'medium' },
            { name: 'Random Act of Kindness', description: 'Do one random act of kindness', timeOfDay: 'Anytime', frequency: 'Daily', difficulty: 'easy' },
            { name: 'Community Service', description: 'Volunteer for 4 hours', timeOfDay: 'Anytime', frequency: 'Weekly', difficulty: 'hard' },
            { name: 'Relationship Building', description: 'Host a gathering for 10+ people', timeOfDay: 'Anytime', frequency: 'Monthly', difficulty: 'hard' },
            { name: 'Conflict Resolution', description: 'Resolve a long-standing conflict', timeOfDay: 'Anytime', frequency: 'As needed', difficulty: 'hard' }
        ]
    };

    // Define quick tips
    const quickTips = [
        // General Tips
        {
            title: "Start Small",
            description: "Begin with habits that take less than 2 minutes to complete",
            icon: "fa-rocket",
            category: "general"
        },
        {
            title: "Track Progress",
            description: "Use a habit tracker to monitor your consistency",
            icon: "fa-chart-line",
            category: "general"
        },
        {
            title: "Stack Habits",
            description: "Connect new habits to existing routines",
            icon: "fa-layer-group",
            category: "general"
        },
        {
            title: "Set Reminders",
            description: "Use phone notifications for habit cues",
            icon: "fa-bell",
            category: "general"
        },
        {
            title: "Celebrate Small Wins",
            description: "Reward yourself for maintaining streaks",
            icon: "fa-trophy",
            category: "general"
        },

        // Health & Fitness Tips
        {
            title: "Stay Hydrated",
            description: "Keep a water bottle with you throughout the day",
            icon: "fa-tint",
            category: "health"
        },
        {
            title: "Morning Stretch",
            description: "Stretch for 5 minutes after waking up",
            icon: "fa-running",
            category: "health"
        },
        {
            title: "Healthy Snacking",
            description: "Keep healthy snacks readily available",
            icon: "fa-apple-alt",
            category: "health"
        },
        {
            title: "Take the Stairs",
            description: "Choose stairs over elevator when possible",
            icon: "fa-walking",
            category: "health"
        },
        {
            title: "Posture Check",
            description: "Check and correct your posture regularly",
            icon: "fa-user",
            category: "health"
        },
        {
            title: "Stand Up",
            description: "Stand up and move every hour",
            icon: "fa-chair",
            category: "health"
        },
        {
            title: "Meal Planning",
            description: "Plan your meals for the week ahead",
            icon: "fa-calendar-day",
            category: "health"
        },

        // Mindfulness Tips
        {
            title: "Digital Detox",
            description: "Take regular breaks from screens",
            icon: "fa-mobile-alt",
            category: "mindfulness"
        },
        {
            title: "Gratitude Practice",
            description: "Write down three things you're grateful for daily",
            icon: "fa-heart",
            category: "mindfulness"
        },
        {
            title: "Mindful Breathing",
            description: "Take deep breaths when feeling stressed",
            icon: "fa-wind",
            category: "mindfulness"
        },
        {
            title: "Present Moment",
            description: "Focus on one task at a time",
            icon: "fa-clock",
            category: "mindfulness"
        },
        {
            title: "Nature Time",
            description: "Spend 10 minutes in nature daily",
            icon: "fa-tree",
            category: "mindfulness"
        },
        {
            title: "Mindful Eating",
            description: "Eat without distractions",
            icon: "fa-utensils",
            category: "mindfulness"
        },
        {
            title: "Evening Reflection",
            description: "Reflect on your day before bed",
            icon: "fa-moon",
            category: "mindfulness"
        },

        // Productivity Tips
        {
            title: "Morning Routine",
            description: "Start your day with a consistent morning routine",
            icon: "fa-sun",
            category: "productivity"
        },
        {
            title: "Time Blocking",
            description: "Schedule specific times for important tasks",
            icon: "fa-calendar-alt",
            category: "productivity"
        },
        {
            title: "Task Prioritization",
            description: "Focus on the most important tasks first",
            icon: "fa-tasks",
            category: "productivity"
        },
        {
            title: "Digital Organization",
            description: "Keep your digital files and emails organized",
            icon: "fa-folder",
            category: "productivity"
        },
        {
            title: "Two-Minute Rule",
            description: "Complete tasks that take less than two minutes immediately",
            icon: "fa-stopwatch",
            category: "productivity"
        },
        {
            title: "Clear Workspace",
            description: "Keep your workspace clean and organized",
            icon: "fa-desk",
            category: "productivity"
        },
        {
            title: "Focus Time",
            description: "Use the Pomodoro technique for focused work",
            icon: "fa-hourglass",
            category: "productivity"
        },

        // Learning Tips
        {
            title: "Learning Time",
            description: "Dedicate 30 minutes daily to learning something new",
            icon: "fa-book",
            category: "learning"
        },
        {
            title: "Reading Habit",
            description: "Read for at least 20 minutes daily",
            icon: "fa-book-reader",
            category: "learning"
        },
        {
            title: "Skill Practice",
            description: "Practice a skill for 15 minutes daily",
            icon: "fa-guitar",
            category: "learning"
        },
        {
            title: "Take Notes",
            description: "Write down key points while learning",
            icon: "fa-pencil-alt",
            category: "learning"
        },
        {
            title: "Teach Others",
            description: "Share what you learn with someone else",
            icon: "fa-chalkboard-teacher",
            category: "learning"
        },
        {
            title: "Review Notes",
            description: "Review your notes before going to bed",
            icon: "fa-clipboard",
            category: "learning"
        },
        {
            title: "Learn Languages",
            description: "Practice a new language for 10 minutes daily",
            icon: "fa-language",
            category: "learning"
        },

        // Relationship Tips
        {
            title: "Active Listening",
            description: "Practice fully focusing when others speak",
            icon: "fa-comments",
            category: "relationships"
        },
        {
            title: "Social Connection",
            description: "Reach out to a friend or family member daily",
            icon: "fa-user-friends",
            category: "relationships"
        },
        {
            title: "Quality Time",
            description: "Spend quality time with loved ones",
            icon: "fa-users",
            category: "relationships"
        },
        {
            title: "Express Appreciation",
            description: "Tell someone why you appreciate them",
            icon: "fa-smile",
            category: "relationships"
        },
        {
            title: "Family Meals",
            description: "Have meals together with family when possible",
            icon: "fa-utensils",
            category: "relationships"
        },
        {
            title: "Random Kindness",
            description: "Do something kind for someone each day",
            icon: "fa-hand-holding-heart",
            category: "relationships"
        },
        {
            title: "Deep Conversations",
            description: "Have meaningful conversations regularly",
            icon: "fa-comments-alt",
            category: "relationships"
        },

        // Additional General Tips
        {
            title: "Morning Sunlight",
            description: "Get natural sunlight early in the day",
            icon: "fa-sun",
            category: "health"
        },
        {
            title: "Sleep Schedule",
            description: "Maintain consistent sleep and wake times",
            icon: "fa-bed",
            category: "health"
        },
        {
            title: "Declutter Daily",
            description: "Spend 5 minutes decluttering each day",
            icon: "fa-trash",
            category: "productivity"
        },
        {
            title: "Weekly Planning",
            description: "Plan your week every Sunday evening",
            icon: "fa-calendar-week",
            category: "productivity"
        },
        {
            title: "Stress Relief",
            description: "Practice a stress-relief activity daily",
            icon: "fa-peace",
            category: "mindfulness"
        },
        {
            title: "Creative Time",
            description: "Spend time on creative activities",
            icon: "fa-paint-brush",
            category: "learning"
        },
        {
            title: "Network Building",
            description: "Connect with one new person weekly",
            icon: "fa-network-wired",
            category: "relationships"
        },
        {
            title: "Financial Check",
            description: "Review your expenses weekly",
            icon: "fa-wallet",
            category: "productivity"
        },
        {
            title: "Skill Sharing",
            description: "Share your skills with others",
            icon: "fa-share-alt",
            category: "learning"
        },
        {
            title: "Nature Walk",
            description: "Take a walk in nature weekly",
            icon: "fa-leaf",
            category: "health"
        },
        {
            title: "Digital Learning",
            description: "Watch an educational video daily",
            icon: "fa-video",
            category: "learning"
        },
        {
            title: "Mindful Break",
            description: "Take mindful breaks between tasks",
            icon: "fa-coffee",
            category: "mindfulness"
        },
        {
            title: "Goal Review",
            description: "Review your goals weekly",
            icon: "fa-bullseye",
            category: "productivity"
        },
        {
            title: "Positive Affirmations",
            description: "Practice daily positive self-talk",
            icon: "fa-comment-smile",
            category: "mindfulness"
        },
        {
            title: "Hobby Time",
            description: "Dedicate time to your hobbies",
            icon: "fa-palette",
            category: "learning"
        },
        {
            title: "Community Service",
            description: "Volunteer in your community monthly",
            icon: "fa-hands-helping",
            category: "relationships"
        },
        {
            title: "Mental Exercise",
            description: "Solve puzzles or brain teasers daily",
            icon: "fa-puzzle-piece",
            category: "learning"
        },
        {
            title: "Healthy Boundaries",
            description: "Practice setting and maintaining boundaries",
            icon: "fa-shield-alt",
            category: "relationships"
        },
        {
            title: "Tech-Free Time",
            description: "Have dedicated time without technology",
            icon: "fa-power-off",
            category: "mindfulness"
        },
        {
            title: "Energy Management",
            description: "Plan tasks according to your energy levels",
            icon: "fa-battery-three-quarters",
            category: "productivity"
        },
        {
            title: "Knowledge Sharing",
            description: "Share interesting facts with others",
            icon: "fa-lightbulb",
            category: "learning"
        },
        {
            title: "Self-Care Sunday",
            description: "Dedicate Sundays to self-care activities",
            icon: "fa-spa",
            category: "health"
        },
        {
            title: "Habit Tracking",
            description: "Review your habit progress weekly",
            icon: "fa-check-double",
            category: "general"
        }
    ];

    // Func to analyze user habits and get personalized recommendations
    function getPersonalizedRecommendations() {
        // Get user's cur habits
        const currentHabitNames = userHabits.map(habit => habit.name.toLowerCase());
        
        // Analyze user's habits
        const userInterests = analyzeUserInterests();
        
        // Get recommendations based on user interests
        let recommendations = [];
        
        // Add recommendations from user's interest categories
        userInterests.forEach(category => {
            const categoryRecommendations = allRecommendations[category]
                .filter(habit => !currentHabitNames.includes(habit.name.toLowerCase()))
                .map(habit => ({ ...habit, category }));
            recommendations.push(...categoryRecommendations);
        });
        
        // lw m4 kafya hy5od mn al categories b2a
        if (recommendations.length < 5) {
            Object.entries(allRecommendations).forEach(([category, habits]) => {
                if (!userInterests.includes(category)) {
                    const newRecommendations = habits
                        .filter(habit => !currentHabitNames.includes(habit.name.toLowerCase()))
                        .map(habit => ({ ...habit, category }));
                    recommendations.push(...newRecommendations);
                }
            });
        }
        
        // Remove duplicates and limit to 5 recommendations
        recommendations = [...new Set(recommendations.map(JSON.stringify))].map(JSON.parse).slice(0, 5);
        
        return recommendations;
    }

    // Func to analyze user interests based on their habits
    function analyzeUserInterests() {
        const interests = {
            health: 0,
            learning: 0,
            productivity: 0,
            mindfulness: 0,
            relationships: 0
        };
        
        // Count habits in each category
        userHabits.forEach(habit => {
            Object.entries(allRecommendations).forEach(([category, habits]) => {
                if (habits.some(h => h.name.toLowerCase() === habit.name.toLowerCase())) {
                    interests[category]++;
                }
            });
        });
        
        // Get top 2 categories
        return Object.entries(interests)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 2)
            .map(([category]) => category);
    }

    // Func to dply personalized recommendations
    function displayPersonalizedRecommendations(difficulty = 'all') {
        const recommendations = getPersonalizedRecommendations();
        const listGroup = document.querySelector('.list-group');
        
        if (!recommendations.length) {
            listGroup.innerHTML = `
                <div class="alert alert-success">
                    <i class="fas fa-check-circle me-2"></i>
                    You've already added all our recommended habits! Great job!
                </div>
            `;
            return;
        }
        
        // Filter by difficulty 
        const filteredRecommendations = difficulty === 'all' 
            ? recommendations 
            : recommendations.filter(habit => habit.difficulty === difficulty);
        
        listGroup.innerHTML = filteredRecommendations.map(habit => `
            <div class="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
                <div>
                    <div class="d-flex align-items-center">
                        <i class="fas fa-${getCategoryIcon(habit.category)} me-3 text-${getCategoryColor(habit.category)}"></i>
                        <h6 class="mb-0">${habit.name}</h6>
                        <span class="badge bg-${getDifficultyColor(habit.difficulty)} ms-2">${habit.difficulty}</span>
                    </div>
                    <p class="text-muted small mb-0 mt-1">${habit.description}</p>
                </div>
                <button class="btn btn-primary btn-sm add-habit-btn" data-habit='${JSON.stringify(habit)}'>
                    <i class="fas fa-plus"></i>
                </button>
            </div>
        `).join('');
        
        // Event listeners to "Add" btns
        document.querySelectorAll('.add-habit-btn').forEach(button => {
            button.addEventListener('click', function() {
                const habitData = JSON.parse(this.dataset.habit);
                addHabitToUserHabits(habitData);
                this.disabled = true;
                this.innerHTML = '<i class="fas fa-check"></i>';
                window.utilities.showToast('Habit added successfully!', 'success');
                // 🔃 (ref) recommendations
                displayPersonalizedRecommendations(difficulty);
            });
        });
    }

    // Helper func for styling
    function getCategoryIcon(category) {
        const icons = {
            health: 'heartbeat',
            learning: 'book',
            productivity: 'chart-line',
            mindfulness: 'brain',
            relationships: 'users'
        };
        return icons[category] || 'star';
    }

    function getCategoryColor(category) {
        const colors = {
            health: 'primary',
            learning: 'info',
            productivity: 'warning',
            mindfulness: 'success',
            relationships: 'danger'
        };
        return colors[category] || 'secondary';
    }

    function getDifficultyColor(difficulty) {
        const colors = {
                    easy: 'success',
                    medium: 'warning',
                    hard: 'danger'
        };
        return colors[difficulty] || 'secondary';
    }

    // Func to add habit to user's habits
    function addHabitToUserHabits(habitData) {
        // Check if habit already exists
        if (userHabits.some(h => h.name === habitData.name)) {
            window.utilities.showToast('This habit is already in your list!', 'warning');
            return;
        }

        // Cre new habit object
        const newHabit = {
            id: Date.now().toString(),
            name: habitData.name,
            description: habitData.description,
            timeOfDay: habitData.timeOfDay,
            frequency: habitData.frequency,
            completionHistory: {},
            createdAt: new Date().toISOString()
        };

        userHabits.push(newHabit);
        localStorage.setItem('userHabits', JSON.stringify(userHabits));
    }

    // Ini personalized recommendations
    displayPersonalizedRecommendations();

    // Event listeners for difficulty filter
    document.querySelectorAll('[data-difficulty]').forEach(filter => {
        filter.addEventListener('click', function(e) {
            e.preventDefault();
            const difficulty = this.dataset.difficulty;
            document.getElementById('dropdownMenuButton').textContent = 
                difficulty === 'all' ? 'All Difficulties' : this.textContent;
            displayPersonalizedRecommendations(difficulty);
        });
    });

    // Add click event listeners to "View Habits" btns
    document.querySelectorAll('.view-habits-btn').forEach(button => {
        button.addEventListener('click', function() {
            const category = this.dataset.category;
            showHabitRecommendations(category);
        });
    });

    // Func to show habit recommendations for a category
    function showHabitRecommendations(category) {
        const recommendations = allRecommendations[category];
        if (!recommendations) return;

        const modal = document.createElement('div');
        modal.className = 'modal fade';
        modal.id = 'habitRecommendationsModal';
        modal.setAttribute('tabindex', '-1');
        modal.setAttribute('aria-labelledby', 'habitRecommendationsModalLabel');
        modal.setAttribute('aria-hidden', 'true');

        modal.innerHTML = `
            <div class="modal-dialog modal-dialog-centered modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                        <h5 class="modal-title" id="habitRecommendationsModalLabel">
                            ${category.charAt(0).toUpperCase() + category.slice(1)} Habits
                        </h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                        <div class="row">
                            ${recommendations.map(habit => `
                                <div class="col-md-6 mb-3">
                                    <div class="card h-100">
                                        <div class="card-body">
                                            <h5 class="card-title">${habit.name}</h5>
                                            <p class="card-text">${habit.description}</p>
                                            <div class="d-flex justify-content-between align-items-center">
                                                <small class="text-muted">
                                                    <i class="fas fa-clock me-1"></i>${habit.timeOfDay}
                                                </small>
                                                <small class="text-muted">
                                                    <i class="fas fa-calendar me-1"></i>${habit.frequency}
                                                </small>
                                                <span class="badge bg-${getDifficultyColor(habit.difficulty)}">
                                            ${habit.difficulty}
                                        </span>
                                            </div>
                                        </div>
                                        <div class="card-footer bg-transparent">
                                            <button class="btn btn-primary btn-sm w-100 add-habit-btn" 
                                                    data-habit='${JSON.stringify(habit)}'>
                                                <i class="fas fa-plus me-2"></i>Add to My Habits
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
                </div>
            `;
            
        document.body.appendChild(modal);
        const modalInstance = new bootstrap.Modal(modal);
        modalInstance.show();

        // Event listeners for adding habits
        modal.addEventListener('click', function(e) {
            if (e.target.classList.contains('add-habit-btn')) {
                const habitData = JSON.parse(e.target.dataset.habit);
                addHabitToUserHabits(habitData);
                e.target.disabled = true;
                e.target.innerHTML = '<i class="fas fa-check me-2"></i>Added';
                window.utilities.showToast('Habit added successfully!', 'success');
            }
        });

        // Remove mdl mn DOM lma tclose
        modal.addEventListener('hidden.bs.modal', function() {
            document.body.removeChild(modal);
        });
    }

    // Func to dply random quick tips
    function displayRandomQuickTips() {
        const tipsContainer = document.querySelector('.quick-tips-container');
        if (!tipsContainer) return;

        // 🔀 tips array
        const shuffledTips = [...quickTips].sort(() => Math.random() - 0.5);
        
        // Take first 4 tips
        const selectedTips = shuffledTips.slice(0, 4);
        
        // Dply tips
        tipsContainer.innerHTML = selectedTips.map(tip => `
            <div class="col-12 mb-2">
                <div class="card border-0 bg-light">
                    <div class="card-body p-2">
                        <div class="d-flex align-items-center">
                            <i class="fas ${tip.icon} text-${getCategoryColor(tip.category)} me-2"></i>
                            <div>
                                <h6 class="mb-0 fs-6">${tip.title}</h6>
                                <p class="card-text small text-muted mb-0">${tip.description}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // Ini all sects
    updateHabitInsights();
    displayRandomQuickTips();
    updateWeeklyFocus();

    // Upt sects lma al habits are modified
    document.addEventListener('habitsUpdated', function() {
        updateHabitInsights();
        updateWeeklyFocus();
    });

    // Event listener to refresh tips btn
    const refreshTipsBtn = document.getElementById('refreshTipsBtn');
    if (refreshTipsBtn) {
        refreshTipsBtn.addEventListener('click', displayRandomQuickTips);
    }

    // Func to upt habit insights
    function updateHabitInsights() {
        const habitStats = document.getElementById('habitStats');
        if (!habitStats) return;

        const totalHabits = userHabits.length;
        const activeHabits = userHabits.filter(habit => {
            const lastWeek = new Date();
            lastWeek.setDate(lastWeek.getDate() - 7);
            return Object.keys(habit.completionHistory).some(date => new Date(date) > lastWeek);
        }).length;

        const completionRate = userHabits.reduce((acc, habit) => {
            const completions = Object.values(habit.completionHistory).filter(v => v).length;
            const total = Object.keys(habit.completionHistory).length || 1;
            return acc + (completions / total);
        }, 0) / (totalHabits || 1);

        habitStats.innerHTML = `
            <div class="mb-3">
                <div class="d-flex justify-content-between mb-1">
                    <span class="text-muted">Total Habits</span>
                    <span class="fw-bold">${totalHabits}</span>
                </div>
                <div class="d-flex justify-content-between mb-1">
                    <span class="text-muted">Active Habits</span>
                    <span class="fw-bold">${activeHabits}</span>
                </div>
                <div class="d-flex justify-content-between">
                    <span class="text-muted">Average Completion</span>
                    <span class="fw-bold">${Math.round(completionRate * 100)}%</span>
                </div>
            </div>
            <div class="progress" style="height: 8px;">
                <div class="progress-bar bg-success" style="width: ${completionRate * 100}%"></div>
                </div>
            `;
    }

    // Func to upt weekly focus
    function updateWeeklyFocus() {
        const weeklyFocus = document.getElementById('weeklyFocus');
        if (!weeklyFocus) return;

        const today = new Date();
        const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
        
        const weeklyStats = userHabits.map(habit => {
            const completions = Object.entries(habit.completionHistory)
                .filter(([date]) => new Date(date) >= startOfWeek)
                .filter(([_, completed]) => completed).length;
            return { name: habit.name, completions };
        }).sort((a, b) => b.completions - a.completions);

        weeklyFocus.innerHTML = `
            <div class="text-center mb-3">
                <h6 class="fw-bold mb-0">Week of ${startOfWeek.toLocaleDateString()}</h6>
                <small class="text-muted">Focus on improving these habits</small>
            </div>
            ${weeklyStats.slice(0, 3).map(stat => `
                <div class="d-flex justify-content-between align-items-center mb-2">
                    <span class="text-truncate">${stat.name}</span>
                    <span class="badge bg-light text-dark">${stat.completions}/7</span>
                </div>
            `).join('')}
        `;
    }
}); 