/* Author: Marwan Rafe Mohammed
Project: Habita
Course: TAG-Web Development Course-Level.1
License: All rights reserved – No reuse without permission
Date: April 2025 */

// progress page js by @Two-Face
document.addEventListener('DOMContentLoaded', function() {
    // Check logged in
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        window.location.href = 'index.html';
        return;
    }

    // Initialize achiv-sys
    let completionChart;
    let currentPeriod = 'week';
    const habits = JSON.parse(localStorage.getItem('userHabits')) || [];
    const achievements = {
        streaks: [
            { id: 'streak_3', name: 'Getting Started', description: 'Maintain any habit for 3 days in a row', requirement: 3, points: 50, icon: '🌱' },
            { id: 'streak_7', name: 'Week Warrior', description: 'Keep a habit for a full week', requirement: 7, points: 100, icon: '🔥' },
            { id: 'streak_30', name: 'Monthly Master', description: 'Maintain a habit for 30 days', requirement: 30, points: 500, icon: '⭐' },
            { id: 'streak_100', name: 'Habit Champion', description: 'Keep going for 100 days straight', requirement: 100, points: 2000, icon: '👑' }
        ],
        consistency: [
            { id: 'cons_50', name: 'Half Way There', description: 'Achieve 50% completion rate over 30 days', requirement: 50, points: 100, icon: '📈' },
            { id: 'cons_80', name: 'Excellence', description: 'Maintain 80% completion rate for 30 days', requirement: 80, points: 300, icon: '🎯' },
            { id: 'cons_100', name: 'Perfection', description: 'Achieve 100% completion for a full week', requirement: 100, points: 500, icon: '💫' }
        ],
        milestones: [
            { id: 'total_10', name: 'Good Start', description: 'Complete any habit 10 times', requirement: 10, points: 50, icon: '🎯' },
            { id: 'total_50', name: 'Dedicated', description: 'Reach 50 total completions', requirement: 50, points: 200, icon: '⚡' },
            { id: 'total_100', name: 'Century Club', description: 'Hit 100 total completions', requirement: 100, points: 500, icon: '🏆' },
            { id: 'total_365', name: 'Year of Growth', description: 'Complete 365 total habits', requirement: 365, points: 1000, icon: '🌟' }
        ],
        variety: [
            { id: 'habits_3', name: 'Diversified', description: 'Track 3 different habits', requirement: 3, points: 100, icon: '🎨' },
            { id: 'habits_5', name: 'Life Balancer', description: 'Maintain 5 active habits', requirement: 5, points: 300, icon: '⚖️' }
        ],
        special: [
            { id: 'morning_7', name: 'Early Bird', description: 'Complete morning habits 7 days in a row', requirement: 7, points: 200, icon: '🌅' },
            { id: 'night_7', name: 'Night Owl', description: 'Keep up with evening habits for a week', requirement: 7, points: 200, icon: '🌙' },
            { id: 'weekend_4', name: 'Weekend Warrior', description: 'Complete all habits on 4 weekends', requirement: 4, points: 300, icon: '🎉' }
        ]
    };

    // Ini page
    updateOverviewStats();
    initChart(currentPeriod);
    updateHabitTable();
    updateAchievements();
    initializeEventListeners();
    updateNextAchievements();

    function initializeEventListeners() {
        // Period selector btns
        const periodButtons = document.querySelectorAll('[data-period]');
        periodButtons.forEach(button => {
            button.addEventListener('click', function() {
                periodButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                currentPeriod = this.dataset.period;
                initChart(currentPeriod);
            });
        });

        // Habit search testing
        const searchInput = document.querySelector('input[placeholder="Search habits..."]');
        if (searchInput) {
            searchInput.addEventListener('input', function() {
                const searchTerm = this.value.toLowerCase();
                const rows = document.querySelectorAll('tbody tr');
                rows.forEach(row => {
                    const habitName = row.querySelector('td:first-child').textContent.toLowerCase();
                    row.style.display = habitName.includes(searchTerm) ? '' : 'none';
                });
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

        // Achiv-sys filter btn
        const achievementFilterButtons = document.querySelectorAll('[data-achievement-filter]');
        achievementFilterButtons.forEach(button => {
            button.addEventListener('click', function() {
                achievementFilterButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                filterAchievements(this.dataset.achievementFilter);
            });
        });
    }

    function updateOverviewStats() {
        const today = new Date().toISOString().split('T')[0];
        const stats = calculateStats();

        // Upt Overall Completion
        const overallCompletion = document.querySelector('.border-primary .display-5');
        if (overallCompletion) {
            overallCompletion.textContent = `${stats.overallCompletion}%`;
            const trend = document.querySelector('.border-primary small');
            if (trend) {
                const trendValue = stats.overallCompletion - stats.lastWeekCompletion;
                trend.innerHTML = trendValue >= 0 ? 
                    `<i class="fas fa-arrow-up me-1"></i>${trendValue}% from last week` :
                    `<i class="fas fa-arrow-down me-1"></i>${Math.abs(trendValue)}% from last week`;
                trend.className = trendValue >= 0 ? 'text-success' : 'text-danger';
            }
        }

        // Upt Cur Streak
        const currentStreak = document.querySelector('.border-success .display-5');
        if (currentStreak) {
            currentStreak.textContent = stats.currentStreak;
        }

        // Upt Habits Cmp
        const habitsCompleted = document.querySelector('.border-warning .display-5');
        if (habitsCompleted) {
            habitsCompleted.textContent = stats.totalCompletions;
            const weeklyCompletions = document.querySelector('.border-warning small');
            if (weeklyCompletions) {
                weeklyCompletions.innerHTML = `<i class="fas fa-arrow-up me-1"></i>${stats.weeklyCompletions} this week`;
            }
        }

        // Upt Points
        const points = document.querySelector('.border-info .display-5');
        if (points) {
            points.textContent = calculatePoints(stats);
            const level = document.querySelector('.border-info small');
            if (level) {
                const currentLevel = Math.floor(stats.totalCompletions / 100) + 1;
                level.textContent = `Level ${currentLevel} Achiever`;
            }
        }
    }

    function calculateStats() {
        const today = new Date().toISOString().split('T')[0];
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        const twoWeeksAgo = new Date();
        twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

        let stats = {
            totalCompletions: 0,
            weeklyCompletions: 0,
            currentStreak: 0,
            overallCompletion: 0,
            lastWeekCompletion: 0
        };

        if (habits.length === 0) return stats;

        // Calc cmps and streaks
        habits.forEach(habit => {
            if (!habit.completionHistory) return;

            // Count total completions
            const completions = Object.keys(habit.completionHistory).length;
            stats.totalCompletions += completions;

            // Count weekly CMPS
            const weeklyCompletions = Object.keys(habit.completionHistory).filter(date => 
                new Date(date) >= oneWeekAgo
            ).length;
            stats.weeklyCompletions += weeklyCompletions;

            // Calc streak
            let currentStreak = 0;
            let maxStreak = 0;
            let date = new Date(today);

            while (true) {
                const dateStr = date.toISOString().split('T')[0];
                if (habit.completionHistory[dateStr]) {
                    currentStreak++;
                    maxStreak = Math.max(maxStreak, currentStreak);
                } else {
                    break;
                }
                date.setDate(date.getDate() - 1);
            }

            stats.currentStreak = Math.max(stats.currentStreak, currentStreak);
        });

        // Calc cmps rate
        const thisWeekTotal = habits.length * 7;
        const lastWeekTotal = habits.length * 7;

        const thisWeekCompleted = habits.reduce((total, habit) => {
            if (!habit.completionHistory) return total;
            return total + Object.keys(habit.completionHistory).filter(date => 
                new Date(date) >= oneWeekAgo && new Date(date) <= new Date()
            ).length;
        }, 0);

        const lastWeekCompleted = habits.reduce((total, habit) => {
            if (!habit.completionHistory) return total;
            return total + Object.keys(habit.completionHistory).filter(date => 
                new Date(date) >= twoWeeksAgo && new Date(date) < oneWeekAgo
            ).length;
        }, 0);

        stats.overallCompletion = Math.round((thisWeekCompleted / thisWeekTotal) * 100) || 0;
        stats.lastWeekCompletion = Math.round((lastWeekCompleted / lastWeekTotal) * 100) || 0;

        return stats;
    }

    function calculatePoints(stats) {
        // Point system pro max x:
        // - 10 points per completion
        // - Streak bonus: 5 points per day of streak
        // - Weekly bonus: 100 points for 100% completion
        let points = stats.totalCompletions * 10;
        points += stats.currentStreak * 5;
        if (stats.overallCompletion === 100) {
            points += 100;
        }
        return points;
    }

    function getChartData(period) {
        const data = {
            labels: [],
            datasets: []
        };

        // Set labels based on period
        switch(period) {
            case 'week':
                data.labels = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
                break;
            case 'month':
                data.labels = Array.from({length: 4}, (_, i) => `Week ${i + 1}`);
                break;
            case 'year':
                data.labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                break;
        }

        // Cre DB for each habit
        habits.forEach((habit, index) => {
            const colors = [
                { bg: 'rgba(74, 144, 226, 0.7)', border: 'rgba(74, 144, 226, 1)' },
                { bg: 'rgba(255, 107, 107, 0.7)', border: 'rgba(255, 107, 107, 1)' },
                { bg: 'rgba(46, 204, 113, 0.7)', border: 'rgba(46, 204, 113, 1)' },
                { bg: 'rgba(241, 196, 15, 0.7)', border: 'rgba(241, 196, 15, 1)' }
            ];

            const colorIndex = index % colors.length;
            const dataset = {
                label: habit.name,
                data: calculateCompletionData(habit, period),
                backgroundColor: colors[colorIndex].bg,
                borderColor: colors[colorIndex].border,
                    borderWidth: 1,
                stack: `Stack ${index}`
            };

            data.datasets.push(dataset);
        });

        return data;
    }

    function calculateCompletionData(habit, period) {
        if (!habit.completionHistory) return Array(period === 'week' ? 7 : period === 'month' ? 4 : 12).fill(0);

        const today = new Date();
        const data = [];

        switch(period) {
            case 'week':
                for (let i = 6; i >= 0; i--) {
                    const date = new Date(today);
                    date.setDate(date.getDate() - i);
                    const dateStr = date.toISOString().split('T')[0];
                    data.push(habit.completionHistory[dateStr] ? 1 : 0);
                }
                break;

            case 'month':
                for (let week = 0; week < 4; week++) {
                    let completions = 0;
                    for (let day = 0; day < 7; day++) {
                        const date = new Date(today);
                        date.setDate(date.getDate() - (week * 7 + day));
                        const dateStr = date.toISOString().split('T')[0];
                        if (habit.completionHistory[dateStr]) completions++;
                    }
                    data.push(completions / 7);
                }
                break;

            case 'year':
                const currentMonth = today.getMonth();
                for (let month = 0; month < 12; month++) {
                    if (month > currentMonth) {
                        data.push(0);
                        continue;
                    }

                    const daysInMonth = new Date(today.getFullYear(), month + 1, 0).getDate();
                    let completions = 0;
                    let totalDays = 0;

                    for (let day = 1; day <= daysInMonth; day++) {
                        const date = new Date(today.getFullYear(), month, day);
                        if (date > today) break;

                        const dateStr = date.toISOString().split('T')[0];
                        if (habit.completionHistory[dateStr]) completions++;
                        totalDays++;
                    }

                    data.push(totalDays > 0 ? completions / totalDays : 0);
                }
                break;
        }

        return data;
    }

    function initChart(period) {
        const ctx = document.getElementById('completionChart').getContext('2d');
        
        if (completionChart) {
            completionChart.destroy();
        }
        
        completionChart = new Chart(ctx, {
            type: 'bar',
            data: getChartData(period),
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: {
                    duration: 1000,
                    easing: 'easeOutQuart'
                },
                scales: {
                    x: {
                        grid: {
                            display: false
                        }
                    },
                    y: {
                        beginAtZero: true,
                        max: 1,
                        ticks: {
                            callback: function(value) {
                                return (value * 100) + '%';
                            }
                        }
                    }
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return context.dataset.label + ': ' + (context.raw * 100).toFixed(0) + '%';
                            }
                        }
                    },
                    legend: {
                        position: 'bottom',
                        labels: {
                            boxWidth: 15,
                            padding: 15
                        }
                    }
                }
            }
        });
    }

    function updateHabitTable() {
        const tbody = document.querySelector('tbody');
        if (!tbody) return;

        tbody.innerHTML = '';
        
        habits.forEach(habit => {
            const stats = calculateHabitStats(habit);
            const tr = document.createElement('tr');
            
            tr.innerHTML = `
                <td>
                    <span class="fw-medium">${habit.name}</span>
                </td>
                <td>
                    <div class="d-flex align-items-center">
                        <div class="progress flex-grow-1 me-2" style="height: 8px;">
                            <div class="progress-bar ${stats.completionRate >= 80 ? 'bg-success' : stats.completionRate >= 60 ? 'bg-warning' : 'bg-danger'}" 
                                role="progressbar" 
                                style="width: ${stats.completionRate}%" 
                                aria-valuenow="${stats.completionRate}" 
                                aria-valuemin="0" 
                                aria-valuemax="100"
                                aria-label="${habit.name} completion rate">
                            </div>
                        </div>
                        <span>${stats.completionRate}%</span>
                    </div>
                </td>
                <td>
                    <span class="badge ${stats.currentStreak >= 7 ? 'bg-success' : 'bg-primary'}">${stats.currentStreak} days</span>
                </td>
                <td>
                    <canvas class="sparkline" data-values="${JSON.stringify(stats.weeklyTrend)}" width="100" height="30"></canvas>
                </td>
                <td>
                    <span class="badge ${stats.status.color}">${stats.status.text}</span>
                </td>
            `;
            
            tbody.appendChild(tr);
        });

        // Initialize spark-lines  DOM
        initSparklines();
    }

    function calculateHabitStats(habit) {
        const stats = {
            completionRate: 0,
            currentStreak: 0,
            weeklyTrend: Array(7).fill(0),
            status: { text: 'Getting Started', color: 'bg-secondary' }
        };

        if (!habit.completionHistory) return stats;

        // Calc cmp rate (last 30 days)
        const today = new Date();
        let completions = 0;
        let totalDays = 0;

        for (let i = 0; i < 30; i++) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            
            if (habit.completionHistory[dateStr] !== undefined) {
                totalDays++;
                if (habit.completionHistory[dateStr]) completions++;
            }
        }

        stats.completionRate = totalDays > 0 ? Math.round((completions / totalDays) * 100) : 0;

        // Calc cur streak
        let currentDate = new Date(today);
        while (true) {
            const dateStr = currentDate.toISOString().split('T')[0];
            if (habit.completionHistory[dateStr]) {
                stats.currentStreak++;
                currentDate.setDate(currentDate.getDate() - 1);
            } else {
                break;
            }
        }

        // Calc weekly 
        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            stats.weeklyTrend[6 - i] = habit.completionHistory[dateStr] ? 1 : 0;
        }

        // Determine status
        if (stats.completionRate >= 80 && stats.currentStreak >= 7) {
            stats.status = { text: 'Excellent', color: 'bg-success' };
        } else if (stats.completionRate >= 60 || stats.currentStreak >= 5) {
            stats.status = { text: 'On Track', color: 'bg-primary' };
        } else if (stats.completionRate >= 40) {
            stats.status = { text: 'Needs Focus', color: 'bg-warning' };
        } else {
            stats.status = { text: 'Getting Started', color: 'bg-secondary' };
        }

        return stats;
    }

    function initSparklines() {
        const sparklines = document.querySelectorAll('.sparkline');
        
        sparklines.forEach(sparkline => {
            const values = JSON.parse(sparkline.dataset.values);
            const ctx = sparkline.getContext('2d');
            
            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: Array(values.length).fill(''),
                    datasets: [{
                        data: values,
                        borderColor: 'rgba(74, 144, 226, 1)',
                        backgroundColor: 'rgba(74, 144, 226, 0.1)',
                        borderWidth: 2,
                        pointRadius: 0,
                        fill: true,
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    animation: {
                        duration: 800
                    },
                    plugins: {
                        legend: {
                            display: false
                        },
                        tooltip: {
                            enabled: false
                        }
                    },
                    scales: {
                        x: {
                            display: false
                        },
                        y: {
                            display: false,
                            min: 0,
                            max: 1
                        }
                    }
                }
            });
        });
    }

    function updateAchievements() {
        const achievementsContainer = document.querySelector('#achievementsContainer');
        if (!achievementsContainer) return;

        const userAchievements = JSON.parse(localStorage.getItem('userAchievements')) || {};
        const stats = calculateDetailedStats();
        let achievementsHTML = '';

        // Process achiv category
        Object.keys(achievements).forEach(category => {
            achievementsHTML += `
                <div class="achievement-category mb-4">
                    <h5 class="mb-3">${category.charAt(0).toUpperCase() + category.slice(1)}</h5>
                    <div class="row g-3">
            `;

            achievements[category].forEach(achievement => {
                const isUnlocked = checkAchievementUnlock(achievement, stats);
                const progressPercent = calculateAchievementProgress(achievement, stats);
                
                if (isUnlocked && !userAchievements[achievement.id]) {
                    // New achiv unlocked
                    userAchievements[achievement.id] = {
                        unlockedAt: new Date().toISOString(),
                        points: achievement.points
                    };
                    localStorage.setItem('userAchievements', JSON.stringify(userAchievements));
                    showAchievementUnlockToast(achievement);
                }

                achievementsHTML += `
                    <div class="col-md-6 col-lg-4">
                        <div class="card achievement-card ${isUnlocked ? 'border-success' : 'border-secondary'} h-100" 
                            data-achievement-id="${achievement.id}">
                            <div class="card-body">
                                <div class="d-flex align-items-center mb-2">
                                    <span class="achievement-icon fs-4 me-2">${achievement.icon}</span>
                                    <h6 class="card-title mb-0">${achievement.name}</h6>
                                </div>
                                <p class="card-text small text-muted">${achievement.description}</p>
                                <div class="progress" style="height: 8px;">
                                    <div class="progress-bar ${isUnlocked ? 'bg-success' : 'bg-secondary'}" 
                                        role="progressbar" 
                                        style="width: ${progressPercent}%" 
                                        aria-valuenow="${progressPercent}" 
                                        aria-valuemin="0" 
                                        aria-valuemax="100">
                                    </div>
                                </div>
                                <div class="d-flex justify-content-between align-items-center mt-2">
                                    <small class="text-muted">${progressPercent}%</small>
                                    <div>
                                        <span class="badge ${isUnlocked ? 'bg-success' : 'bg-secondary'}">
                                            ${isUnlocked ? '✓ ' + achievement.points + ' pts' : achievement.points + ' pts'}
                                        </span>
                                        ${userAchievements[achievement.id] ? `
                                            <small class="ms-2 text-muted">
                                                Unlocked ${new Date(userAchievements[achievement.id].unlockedAt).toLocaleDateString()}
                                            </small>
                                        ` : ''}
                        </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            });

            achievementsHTML += `
                </div>
            </div>
        `;
        });

        achievementsContainer.innerHTML = achievementsHTML;

        // Apply cur filter
        const activeFilter = document.querySelector('[data-achievement-filter].active');
        if (activeFilter) {
            filterAchievements(activeFilter.dataset.achievementFilter);
        }
    }

    function calculateDetailedStats() {
        const stats = calculateStats(); // basic stats
        const today = new Date();
        
        // Additional detailed statistics
        let detailedStats = {
            ...stats,
            longestStreak: 0,
            morningStreaks: {},
            eveningStreaks: {},
            weekendCompletions: 0,
            habitCount: habits.length,
            timeOfDayStats: {
                morning: 0,
                evening: 0
            }
        };

        habits.forEach(habit => {
            if (!habit.completionHistory) return;

            // Calc longest streak
            let currentStreak = 0;
            let maxStreak = 0;
            let date = new Date(today);

            // Count weekend CMPS
            Object.keys(habit.completionHistory).forEach(dateStr => {
                const date = new Date(dateStr);
                if (date.getDay() === 0 || date.getDay() === 6) { // Weekend days
                    detailedStats.weekendCompletions++;
                }

                // Track time od day CMPS
                if (habit.timeOfDay === 'morning') {
                    detailedStats.timeOfDayStats.morning++;
                } else if (habit.timeOfDay === 'evening') {
                    detailedStats.timeOfDayStats.evening++;
                }
            });

            // Calc streaks time of day
            if (habit.timeOfDay === 'morning') {
                detailedStats.morningStreaks[habit.id] = calculateTimeOfDayStreak(habit, 'morning');
            } else if (habit.timeOfDay === 'evening') {
                detailedStats.eveningStreaks[habit.id] = calculateTimeOfDayStreak(habit, 'evening');
            }
        });

        return detailedStats;
    }

    function calculateTimeOfDayStreak(habit, timeOfDay) {
        let streak = 0;
        const today = new Date();
        let currentDate = new Date(today);

        while (true) {
            const dateStr = currentDate.toISOString().split('T')[0];
            if (habit.completionHistory[dateStr] && habit.timeOfDay === timeOfDay) {
                streak++;
                currentDate.setDate(currentDate.getDate() - 1);
            } else {
                break;
            }
        }

        return streak;
    }

    function checkAchievementUnlock(achievement, stats) {
        switch (achievement.id) {
            case 'streak_3':
            case 'streak_7':
            case 'streak_30':
            case 'streak_100':
                return stats.currentStreak >= achievement.requirement;
            
            case 'cons_50':
            case 'cons_80':
            case 'cons_100':
                return stats.overallCompletion >= achievement.requirement;
            
            case 'total_10':
            case 'total_50':
            case 'total_100':
            case 'total_365':
                return stats.totalCompletions >= achievement.requirement;
            
            case 'habits_3':
            case 'habits_5':
                return stats.habitCount >= achievement.requirement;
            
            case 'morning_7':
                return Object.values(stats.morningStreaks).some(streak => streak >= achievement.requirement);
            
            case 'night_7':
                return Object.values(stats.eveningStreaks).some(streak => streak >= achievement.requirement);
            
            case 'weekend_4':
                return stats.weekendCompletions >= (achievement.requirement * 2); // 2 days per weekend
            
            default:
                return false;
        }
    }

    function calculateAchievementProgress(achievement, stats) {
        switch (achievement.id) {
            case 'streak_3':
            case 'streak_7':
            case 'streak_30':
            case 'streak_100':
                return Math.min(100, Math.round((stats.currentStreak / achievement.requirement) * 100));
            
            case 'cons_50':
            case 'cons_80':
            case 'cons_100':
                return Math.min(100, Math.round((stats.overallCompletion / achievement.requirement) * 100));
            
            case 'total_10':
            case 'total_50':
            case 'total_100':
            case 'total_365':
                return Math.min(100, Math.round((stats.totalCompletions / achievement.requirement) * 100));
            
            case 'habits_3':
            case 'habits_5':
                return Math.min(100, Math.round((stats.habitCount / achievement.requirement) * 100));
            
            case 'morning_7':
                const morningStreak = Math.max(...Object.values(stats.morningStreaks || {}), 0);
                return Math.min(100, Math.round((morningStreak / achievement.requirement) * 100));
            
            case 'streak_30':
                const readingHabit = habits.find(h => 
                    h.name.toLowerCase().includes('read') || 
                    h.name.toLowerCase().includes('book')
                );
                return readingHabit ? calculateHabitStreak(readingHabit) : 0;
            
            case 'total_20':
                const exerciseHabit = habits.find(h => 
                    h.name.toLowerCase().includes('exercise') || 
                    h.name.toLowerCase().includes('workout') ||
                    h.name.toLowerCase().includes('fitness')
                );
                return exerciseHabit ? calculateMonthlyCompletions(exerciseHabit) : 0;
            
            case 'total_50':
                const meditationHabit = habits.find(h => 
                    h.name.toLowerCase().includes('meditate') || 
                    h.name.toLowerCase().includes('meditation')
                );
                return meditationHabit ? calculateTotalCompletions(meditationHabit) : 0;
            
            case 'weekend_4':
                return Math.min(100, Math.round((stats.weekendCompletions / (achievement.requirement * 2)) * 100));
            
            default:
                return 0;
        }
    }

    function calculateHabitStreak(habit) {
        if (!habit || !habit.completionHistory) return 0;
        const today = new Date();
        let streak = 0;
        let currentDate = new Date(today);

        while (true) {
            const dateStr = currentDate.toISOString().split('T')[0];
            if (!habit.completionHistory[dateStr]) break;
            streak++;
            currentDate.setDate(currentDate.getDate() - 1);
        }

        return streak;
    }

    function calculateMonthlyCompletions(habit) {
        if (!habit || !habit.completionHistory) return 0;
        const today = new Date();
        const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        let count = 0;

        for (let date = new Date(firstDayOfMonth); date <= today; date.setDate(date.getDate() + 1)) {
            const dateStr = date.toISOString().split('T')[0];
            if (habit.completionHistory[dateStr]) count++;
        }

        return count;
    }

    function calculateTotalCompletions(habit) {
        if (!habit || !habit.completionHistory) return 0;
        return Object.values(habit.completionHistory).filter(completed => completed).length;
    }

    function showAchievementUnlockToast(achievement) {
        const toastContainer = document.querySelector('.toast-container') || createToastContainer();
        const toastId = 'toast-' + Date.now();
        
        const toastHTML = `
            <div id="${toastId}" class="toast achievement-toast" role="alert" aria-live="assertive" aria-atomic="true">
                <div class="toast-header bg-success text-white">
                    <strong class="me-auto">Achievement Unlocked! ${achievement.icon}</strong>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast" aria-label="Close"></button>
                </div>
                <div class="toast-body">
                    <h6 class="mb-1">${achievement.name}</h6>
                    <p class="mb-1 small">${achievement.description}</p>
                    <span class="badge bg-success">+${achievement.points} points</span>
                </div>
            </div>
        `;
        
        toastContainer.insertAdjacentHTML('beforeend', toastHTML);
        const toast = new bootstrap.Toast(document.getElementById(toastId), { autohide: true, delay: 5000 });
        toast.show();
    }

    function createToastContainer() {
        const container = document.createElement('div');
        container.className = 'toast-container position-fixed bottom-0 end-0 p-3';
        document.body.appendChild(container);
        return container;
    }

    function filterAchievements(filter) {
        const achievementCards = document.querySelectorAll('.achievement-category .card');
        const stats = calculateDetailedStats();
        
        achievementCards.forEach(card => {
            const achievementId = card.dataset.achievementId;
            const achievement = findAchievementById(achievementId);
            const isUnlocked = achievement ? checkAchievementUnlock(achievement, stats) : false;

            switch(filter) {
                case 'unlocked':
                    card.style.display = isUnlocked ? '' : 'none';
                    break;
                case 'locked':
                    card.style.display = !isUnlocked ? '' : 'none';
                    break;
                default: // 'all'
                    card.style.display = '';
            }
        });
    }

    function findAchievementById(id) {
        for (const category in achievements) {
            const found = achievements[category].find(a => a.id === id);
            if (found) return found;
        }
        return null;
    }

    function updateNextAchievements() {
        const achievementList = document.querySelector('.achievement-list');
        if (!achievementList) return;

        // CLR existing content
        achievementList.innerHTML = '';

        // Get user,s achievements data
        const userAchievements = JSON.parse(localStorage.getItem('userAchievements')) || {};
        const stats = calculateDetailedStats();

        // Combine all achievements into a single array
        const allAchievements = [
            ...achievements.streaks,
            ...achievements.consistency,
            ...achievements.milestones,
            ...achievements.variety,
            ...achievements.special
        ];

        // Sort achievements by progress and filter to show next 4 most relevant :)
        const nextAchievements = allAchievements
            .map(achievement => {
                const progress = calculateAchievementProgress(achievement, stats);
                const isUnlocked = checkAchievementUnlock(achievement, stats);
                return { ...achievement, progress, isUnlocked };
            })
            .sort((a, b) => {
                // Prioritize in-progress achievements that are clo to cmp
                if (!a.isUnlocked && !b.isUnlocked) {
                    return b.progress - a.progress;
                }
                // Put unlocked achievements at the end
                return a.isUnlocked ? 1 : -1;
            })
            .slice(0, 4);

        // Dply the achievements
        nextAchievements.forEach(achievement => {
            const unlockedDate = userAchievements[achievement.id]?.unlockedAt;
            
            const achievementHTML = `
                <div class="achievement-item d-flex align-items-center p-3 border-bottom">
                    <div class="achievement-icon me-3">
                        <span class="fs-4">${achievement.icon}</span>
                    </div>
                    <div class="achievement-details flex-grow-1">
                        <h6 class="mb-1">${achievement.name}</h6>
                        <p class="text-muted small mb-1">${achievement.description}</p>
                        ${achievement.isUnlocked 
                            ? `<span class="badge bg-success">Earned ${achievement.points} pts</span>
                            ${unlockedDate ? `<small class="ms-2 text-muted">on ${new Date(unlockedDate).toLocaleDateString()}</small>` : ''}`
                            : `<div class="progress" style="height: 5px;">
                                <div class="progress-bar bg-primary" role="progressbar" 
                                    style="width: ${achievement.progress}%;" 
                                    aria-valuenow="${achievement.progress}" 
                                    aria-valuemin="0" 
                                    aria-valuemax="100">
                                </div>
                            </div>
                            <small class="text-muted">${Math.floor(achievement.progress)}% complete</small>`
                        }
                    </div>
                </div>
            `;
            achievementList.insertAdjacentHTML('beforeend', achievementHTML);
        });
    }

    function getProgressColor(percent) {
        if (percent >= 75) return 'success';
        if (percent >= 50) return 'info';
        if (percent >= 25) return 'warning';
        return 'danger';
    }
});

// LAst comment - Upt the card when achievements or habits change
window.addEventListener('storage', (e) => {
    if (e.key === 'userAchievements' || e.key === 'userHabits') {
        updateNextAchievements();
    }
}); 