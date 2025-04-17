/* Author: Marwan Rafe Mohammed 
Project: Habita
Course: TAG-Web Development Course-Level.1
License: All rights reserved – No reuse without permission
Date: April 2025 */

// home page js by @Two-Face
document.addEventListener('DOMContentLoaded', function() {
    // Check user
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        window.location.href = 'index.html';
        return;
    }

    // Initialize components
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // user data
    const userName = document.getElementById('userName');
    if (userName) {
        userName.textContent = currentUser.name || 'User';
    }

    // Initialize stats
    updateStats();

    // Add New Habit BtN
    const addHabitBtn = document.getElementById('addHabitBtn');
    if (addHabitBtn) {
        addHabitBtn.addEventListener('click', function() {
            const modal = new bootstrap.Modal(document.getElementById('addHabitModal'));
            modal.show();
        });
    }

    // Save  btn
    const saveHabitBtn = document.getElementById('saveHabitBtn');
    if (saveHabitBtn) {
        saveHabitBtn.addEventListener('click', function() {
            const habitName = document.getElementById('habitName').value.trim();
            const habitTime = document.getElementById('habitTime').value;
            const habitFrequency = document.getElementById('habitFrequency').value;
            const habitReminder = document.getElementById('habitReminder').checked;

            if (!habitName) {
                window.utilities.showToast('Please enter a habit name', 'danger');
                return;
            }
            
            const newHabit = {
                id: window.utilities.generateId(),
                name: window.utilities.sanitizeInput(habitName),
                timeOfDay: habitTime,
                frequency: habitFrequency,
                reminder: habitReminder,
                createdAt: new Date().toISOString(),
                streak: 0,
                completionHistory: {}
            };

            // Existing habits
            const habits = JSON.parse(localStorage.getItem('userHabits')) || [];
            habits.push(newHabit);
            localStorage.setItem('userHabits', JSON.stringify(habits));

            // Update UI
            updateHabitList();
            updateStats();

            // CLO MSG MDL
            const modal = bootstrap.Modal.getInstance(document.getElementById('addHabitModal'));
            modal.hide();
            document.getElementById('newHabitForm').reset();
            window.utilities.showToast('Habit added successfully!', '#00CED1');
        });
    }

    // Quick Add btns
    const quickAddButtons = document.querySelectorAll('.quick-add');
    quickAddButtons.forEach(button => {
        button.addEventListener('click', function() {
            const habitName = this.dataset.habit;
            const newHabit = {
                id: window.utilities.generateId(),
                name: habitName,
                timeOfDay: 'anytime',
                frequency: 'daily',
                reminder: false,
                createdAt: new Date().toISOString(),
                streak: 0,
                completionHistory: {}
            };

            // Existing habits
            const habits = JSON.parse(localStorage.getItem('userHabits')) || [];
            habits.push(newHabit);
            localStorage.setItem('userHabits', JSON.stringify(habits));

            // Update UI
            updateHabitList();
            updateStats();
            window.utilities.showToast(`${habitName} habit added successfully!`, '#00CED1');
        });
    });

    // Manage Reminders button
    const manageRemindersBtn = document.getElementById('manageReminders');
    if (manageRemindersBtn) {
        manageRemindersBtn.addEventListener('click', function() {
            // maybe in the future i will make it 
            window.utilities.showToast('Reminder management coming soon!', 'info');
        });
    }

    // Logout btn
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            localStorage.removeItem('currentUser');
            window.location.href = 'index.html';
        });
    }

    // Helper Func
    function getTimeIcon(timeOfDay) {
        switch(timeOfDay.toLowerCase()) {
            case 'morning':
                return '<i class="fas fa-sun text-warning"></i>';
            case 'afternoon':
                return '<i class="fas fa-cloud-sun text-primary"></i>';
            case 'evening':
                return '<i class="fas fa-moon text-info"></i>';
            default:
                return '<i class="fas fa-clock text-secondary"></i>';
        }
    }

    function getFrequencyIcon(frequency) {
        switch(frequency.toLowerCase()) {
            case 'daily':
                return '<i class="fas fa-calendar-day text-success"></i>';
            case 'weekdays':
                return '<i class="fas fa-briefcase text-primary"></i>';
            case 'weekends':
                return '<i class="fas fa-umbrella-beach text-warning"></i>';
            case 'weekly':
                return '<i class="fas fa-calendar-week text-info"></i>';
            default:
                return '<i class="fas fa-calendar text-secondary"></i>';
        }
    }

    function updateHabitList() {
        const habitList = document.getElementById('habitList');
        if (!habitList) return;
        
        const habits = JSON.parse(localStorage.getItem('userHabits')) || [];
        habitList.innerHTML = '';
        
        if (habits.length === 0) {
            habitList.innerHTML = `
                <li class="list-group-item text-center py-4">
                    <i class="fas fa-clipboard-list text-muted mb-2 fa-2x"></i>
                    <p class="text-muted mb-0">No habits added yet. Click "Add New Habit" to get started!</p>
                </li>`;
            return;
        }
        
        habits.forEach(habit => {
            const today = new Date().toISOString().split('T')[0];
            const isCompleted = habit.completionHistory && habit.completionHistory[today];
            
            const li = document.createElement('li');
            li.className = 'list-group-item';
            li.innerHTML = `
                    <div class="d-flex justify-content-between align-items-center">
                    <div class="d-flex align-items-center">
                        <div class="form-check form-switch me-3">
                            <input class="form-check-input" type="checkbox" 
                                id="habit-${habit.id}" 
                                ${isCompleted ? 'checked' : ''}>
                        </div>
                        <div>
                            <h6 class="mb-0">${habit.name}</h6>
                            <small class="text-muted">
                                ${getTimeIcon(habit.timeOfDay)} ${habit.timeOfDay} 
                                | ${getFrequencyIcon(habit.frequency)} ${habit.frequency}
                                ${habit.reminder ? ' | <i class="fas fa-bell text-warning"></i> Reminder set' : ''}
                            </small>
                        </div>
                    </div>
                    <button class="btn btn-outline-danger btn-sm delete-habit" data-habit-id="${habit.id}" aria-label="Delete ${habit.name}">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
            `;
            
            habitList.appendChild(li);
            
            // Event listener
            const checkbox = li.querySelector(`#habit-${habit.id}`);
            if (checkbox) {
                checkbox.addEventListener('change', function() {
                    const habits = JSON.parse(localStorage.getItem('userHabits')) || [];
                    const habitIndex = habits.findIndex(h => h.id === habit.id);
                    
                    if (habitIndex !== -1) {
                        if (!habits[habitIndex].completionHistory) {
                            habits[habitIndex].completionHistory = {};
                        }
                        
                        if (this.checked) {
                            habits[habitIndex].completionHistory[today] = true;
                            window.utilities.showToast(`${habit.name} completed!`, '#28a745');
                        } else {
                            delete habits[habitIndex].completionHistory[today];
                            window.utilities.showToast(`${habit.name} marked as incomplete`, '#fd7e14');
                        }
                        
                        localStorage.setItem('userHabits', JSON.stringify(habits));
                        updateStats();
                    }
                });
            }

            // Event listener del BTN
            const deleteBtn = li.querySelector('.delete-habit');
            if (deleteBtn) {
                deleteBtn.addEventListener('click', function() {
                    const habitId = this.dataset.habitId;
                    const habits = JSON.parse(localStorage.getItem('userHabits')) || [];
                    const habitIndex = habits.findIndex(h => h.id === habitId);
                    
                    if (habitIndex !== -1) {
                        const habitName = habits[habitIndex].name;
                        habits.splice(habitIndex, 1);
                        localStorage.setItem('userHabits', JSON.stringify(habits));
                        updateHabitList();
                        updateStats();
                        window.utilities.showToast(`${habitName} has been deleted`, '#dc3545');
                    }
                });
            }
        });
    }

    function updateStats() {
        const habits = JSON.parse(localStorage.getItem('userHabits')) || [];
        const today = new Date().toISOString().split('T')[0];

        // total habits
        const totalHabits = document.getElementById('totalHabits');
        if (totalHabits) {
            totalHabits.textContent = habits.length;
        }

        // Upt daily prog
        const completedToday = habits.filter(habit => 
            habit.completionHistory && habit.completionHistory[today]
        ).length;
        
        const progressBar = document.getElementById('dailyProgress');
        const progressText = document.getElementById('progressText');
        
        if (progressBar && progressText) {
            const percentage = habits.length ? (completedToday / habits.length) * 100 : 0;
            progressBar.style.width = `${percentage}%`;
            progressBar.setAttribute('aria-valuenow', percentage);
            progressText.textContent = `${completedToday}/${habits.length} Completed`;
        }

        // Upt weekly completion rate
        const weeklyCompletion = document.getElementById('weeklyCompletion');
        if (weeklyCompletion) {
            const weekStart = new Date();
            weekStart.setDate(weekStart.getDate() - 7);
            
            let totalPossible = 0;
            let totalCompleted = 0;
            
            habits.forEach(habit => {
                if (!habit.completionHistory) return;
                
                for (let d = new Date(weekStart); d <= new Date(); d.setDate(d.getDate() + 1)) {
                    const dateStr = d.toISOString().split('T')[0];
                    if (habit.completionHistory[dateStr]) {
                        totalCompleted++;
                    }
                    totalPossible++;
                }
            });
            
            const weeklyRate = totalPossible ? Math.round((totalCompleted / totalPossible) * 100) : 0;
            weeklyCompletion.textContent = `${weeklyRate}%`;
        }

        // Upt streaks 
        const streakCards = document.getElementById('streakCards');
        if (streakCards) {
            streakCards.innerHTML = '';
            
            if (habits.length === 0) {
                streakCards.innerHTML = `
                    <div class="col text-center py-4">
                        <i class="fas fa-fire-alt text-muted mb-2 fa-2x"></i>
                        <p class="text-muted mb-0">Add habits to start building streaks!</p>
                    </div>`;
                return;
            }

            habits.forEach(habit => {
                // Calc CUR streak
                let currentStreak = 0;
                let date = new Date(today);

                while (true) {
                    const dateStr = date.toISOString().split('T')[0];
                    if (habit.completionHistory && habit.completionHistory[dateStr]) {
                        currentStreak++;
                    } else {
                        break;
                    }
                    date.setDate(date.getDate() - 1);
                }

                // Cre streak card
                const streakCard = document.createElement('div');
                streakCard.className = 'col';
                streakCard.innerHTML = `
                    <div class="card h-100 ${currentStreak > 0 ? 'border-success' : ''}">
                        <div class="card-body text-center">
                            <h6 class="card-title mb-2">${habit.name}</h6>
                            <div class="streak-count mb-2">
                                <span class="display-4 ${currentStreak > 0 ? 'text-success' : 'text-muted'}">${currentStreak}</span>
                                <small class="text-muted d-block">day${currentStreak !== 1 ? 's' : ''}</small>
                            </div>
                            <p class="card-text">
                                <small class="text-muted">
                                    ${getStreakMessage(currentStreak)}
                                </small>
                            </p>
                </div>
            </div>
        `;
                streakCards.appendChild(streakCard);
            });
        }
    }

    function getStreakMessage(streak) {
        if (streak === 0) return "Start your streak today!";
        if (streak === 1) return "Great start! Keep going!";
        if (streak <= 3) return "Building momentum!";
        if (streak <= 7) return "You're on fire! 🔥";
        if (streak <= 14) return "Incredible dedication! 🌟";
        return "Unstoppable! 👑";
    }

    // Daily Tips func
    const tips = [
        {
            title: "Start Small",
            text: "Begin with tiny habits that take less than 2 minutes. Small actions lead to big changes over time."
        },
        {
            title: "Morning Routine",
            text: "The first hour of your day sets the tone. Create a morning routine that energizes and inspires you."
        },
        {
            title: "Track Progress",
            text: "What gets measured gets managed. Track your habits to stay accountable and motivated."
        },
        {
            title: "Environment Design",
            text: "Make good habits obvious and bad habits invisible. Your environment shapes your behavior."
        },
        {
            title: "Habit Stacking",
            text: "Link new habits to existing ones: 'After I [current habit], I will [new habit].'"
        },
        {
            title: "The 2-Day Rule",
            text: "Never skip a habit twice in a row. One day off is fine, two becomes a habit breaker."
        },
        {
            title: "Identity-Based Habits",
            text: "Focus on who you want to become. Ask: 'What would a healthy person do?'"
        },
        {
            title: "Reward System",
            text: "Celebrate small wins. Create immediate rewards for completing your habits."
        },
        {
            title: "Social Support",
            text: "Share your goals with others. Find an accountability partner or join a community."
        },
        {
            title: "Habit Bundling",
            text: "Pair enjoyable activities with habits you're building. Make the process more fun."
        },
        {
            title: "Implementation Intention",
            text: "Be specific: 'I will [BEHAVIOR] at [TIME] in [LOCATION].'"
        },
        {
            title: "Mindful Practice",
            text: "Stay present while performing your habits. Quality matters as much as quantity."
        },
        {
            title: "Progress Over Perfection",
            text: "Don't break the chain, but if you do, get back on track immediately."
        },
        {
            title: "Energy Management",
            text: "Schedule challenging habits when your energy is highest. Work with your natural rhythm."
        },
        {
            title: "Visual Cues",
            text: "Use visual reminders. Place habit cues where you'll naturally encounter them."
        },
        {
            title: "The 5-Minute Rule",
            text: "Start with just 5 minutes. Often, you'll want to continue once you've begun."
        },
        {
            title: "Decision Elimination",
            text: "Make decisions in advance. Remove choices when willpower is low."
        },
        {
            title: "Habit Reflection",
            text: "Review your habits weekly. What's working? What needs adjustment?"
        },
        {
            title: "Positive Association",
            text: "Make your habits enjoyable. Find ways to look forward to them."
        },
        {
            title: "Obstacle Planning",
            text: "Anticipate challenges and plan solutions in advance. Be prepared for disruptions."
        },
        {
            title: "Minimum Viable Effort",
            text: "Set a low bar for success. Make it ridiculously easy to start."
        },
        {
            title: "Time Blocking",
            text: "Schedule specific times for your habits. Treat them like important appointments."
        },
        {
            title: "Habit Flexibility",
            text: "Have backup plans for your habits. Adapt them to different situations."
        },
        {
            title: "Progress Logging",
            text: "Keep a habit journal. Document your journey and insights."
        },
        {
            title: "Environmental Triggers",
            text: "Create specific triggers in your environment that prompt your habits."
        },
        {
            title: "Habit Sequencing",
            text: "Order your habits strategically. Build momentum throughout the day."
        },
        {
            title: "Mindset Shift",
            text: "View habits as opportunities rather than obligations. Change 'have to' to 'get to.'"
        },
        {
            title: "Recovery Protocol",
            text: "Plan for setbacks. Have a specific strategy to get back on track."
        },
        {
            title: "Habit Evolution",
            text: "Gradually increase difficulty as habits become automatic. Keep growing."
        },
        {
            title: "Celebration Habit",
            text: "End each day by acknowledging your progress. Celebrate consistency over perfection."
        }
    ];

    let currentTipIndex = 0;

    function updateTip() {
        const tipTitle = document.getElementById('dailyTipTitle');
        const tipText = document.getElementById('dailyTipText');
        
        if (tipTitle && tipText) {
            // Fade out 
            tipTitle.style.opacity = '0';
            tipText.style.opacity = '0';
            
            setTimeout(() => {
                // Upt content
                tipTitle.textContent = tips[currentTipIndex].title;
                tipText.textContent = tips[currentTipIndex].text;
                
                // Fade in
                tipTitle.style.opacity = '1';
                tipText.style.opacity = '1';
                
                // Move to next tip
                currentTipIndex = (currentTipIndex + 1) % tips.length;
            }, 300);
        }
    }

    // Initialize tips system
    function initializeTips() {
        //  initial tip
        updateTip();
        
        // Click handler 
        const newTipBtn = document.getElementById('newTipBtn');
        if (newTipBtn) {
            newTipBtn.addEventListener('click', updateTip);
        }
        
        // Check if we should show a new daily tip
        const lastTipUpdate = localStorage.getItem('lastTipUpdate');
        const now = new Date().getTime();
        
        if (!lastTipUpdate || (now - parseInt(lastTipUpdate)) > 24 * 60 * 60 * 1000) {
            updateTip();
            localStorage.setItem('lastTipUpdate', now.toString());
        }
    }

    // Initialize tips
    initializeTips();

    // Initial upt of habits
    updateHabitList();
}); 