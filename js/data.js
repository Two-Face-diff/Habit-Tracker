/* Author: Marwan Rafe Mohammed
Project: Habita
Course: TAG-Web Development Course-Level.1
License: All rights reserved – No reuse without permission
Date: April 2025 */

// Data Manager for Habita by @Two-Face
const dataManager = {
    // User Data
    currentUser: null,
    users: [],

    // Init data from localStorage
    init() {
        try {
            const storedUsers = localStorage.getItem('habitTrackerUsers');
            if (storedUsers) {
                this.users = JSON.parse(storedUsers);
            } else {
                // Init with demo user if no data exists
                this.users = [
                    {
                        id: utilities.generateId(),
                        email: 'demo@example.com',
                        password: utilities.hashPassword('demo123'),
                        name: 'Demo User',
                        habits: [],
                        goals: [],
                        reminders: [],
                        createdAt: new Date().toISOString()
                    }
                ];
                this.saveUsers();
            }
        } catch (error) {
            console.error('Error initializing data:', error);
            this.users = [];
            this.saveUsers();
        }
    },

    // Save users to localStorage
    saveUsers() {
        try {
            localStorage.setItem('habitTrackerUsers', JSON.stringify(this.users));
        } catch (error) {
            console.error('Error saving users:', error);
            showToast('Error saving data. Please try again.', 'error');
        }
    },

    // Habit Categories
    categories: [
        {
            id: 1,
            name: 'Health & Fitness',
            description: 'Physical well-being and exercise habits',
            icon: 'fa-dumbbell',
            habits: [
                'Morning Exercise',
                'Evening Walk',
                'Yoga',
                'Meditation'
            ]
        },
        {
            id: 2,
            name: 'Mindfulness',
            description: 'Mental health and self-care habits',
            icon: 'fa-brain',
            habits: [
                'Meditation',
                'Journaling',
                'Gratitude Practice'
            ]
        },
        {
            id: 3,
            name: 'Learning',
            description: 'Personal development and education',
            icon: 'fa-book',
            habits: [
                'Read 30 minutes',
                'Learn a new skill',
                'Practice language'
            ]
        }
    ],

    // Quick Add Habits
    quickAddHabits: [
        {
            name: 'Drink Water',
            icon: 'fa-tint',
            category: 'Health & Fitness'
        },
        {
            name: 'Read 10 Pages',
            icon: 'fa-book',
            category: 'Learning'
        },
        {
            name: '10 Minute Walk',
            icon: 'fa-walking',
            category: 'Health & Fitness'
        },
        {
            name: 'Meditate',
            icon: 'fa-brain',
            category: 'Mindfulness'
        }
    ],

    // User Management
    login(email, password) {
        try {
            const user = this.users.find(u => u.email === email && u.password === utilities.hashPassword(password));
            if (user) {
                this.currentUser = { ...user };
                delete this.currentUser.password; // Don't store password in currentUser
                localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
                return true;
            }
            return false;
        } catch (error) {
            console.error('Login error:', error);
            return false;
        }
    },

    logout() {
        try {
            this.currentUser = null;
            localStorage.removeItem('currentUser');
            return true;
        } catch (error) {
            console.error('Logout error:', error);
            return false;
        }
    },

    getCurrentUser() {
        try {
            if (!this.currentUser) {
                const storedUser = localStorage.getItem('currentUser');
                if (storedUser) {
                    this.currentUser = JSON.parse(storedUser);
                }
            }
            return this.currentUser;
        } catch (error) {
            console.error('Error getting current user:', error);
            return null;
        }
    },

    getUserByEmail(email) {
        return this.users.find(u => u.email === email);
    },

    addUser(user) {
        try {
            if (this.getUserByEmail(user.email)) {
                throw new Error('Email already registered');
            }
            this.users.push(user);
            this.saveUsers();
            return true;
        } catch (error) {
            console.error('Error adding user:', error);
            throw error;
        }
    },

    // Habit Management
    addHabit(habit) {
        try {
            const user = this.getCurrentUser();
            if (!user) throw new Error('User not logged in');

            const newHabit = {
                id: utilities.generateId(),
                ...habit,
                createdAt: new Date().toISOString(),
                completionHistory: {},
                streak: 0
            };

            user.habits.push(newHabit);
            this.saveUserData();
            return newHabit;
        } catch (error) {
            console.error('Error adding habit:', error);
            throw error;
        }
    },

    updateHabit(habitId, updatedData) {
        try {
            const user = this.getCurrentUser();
            if (!user) throw new Error('User not logged in');

            const habitIndex = user.habits.findIndex(h => h.id === habitId);
            if (habitIndex === -1) throw new Error('Habit not found');

            user.habits[habitIndex] = { ...user.habits[habitIndex], ...updatedData };
            this.saveUserData();
            return true;
        } catch (error) {
            console.error('Error updating habit:', error);
            throw error;
        }
    },

    markHabitComplete(habitId, date) {
        try {
            const user = this.getCurrentUser();
            if (!user) throw new Error('User not logged in');

            const habit = user.habits.find(h => h.id === habitId);
            if (!habit) throw new Error('Habit not found');

            if (!habit.completionHistory) {
                habit.completionHistory = {};
            }

            habit.completionHistory[date] = true;
            this.updateStreak(habit);
            this.saveUserData();
            return true;
        } catch (error) {
            console.error('Error marking habit complete:', error);
            throw error;
        }
    },

    // Helper Funcs
    updateStreak(habit) {
        try {
            const dates = Object.keys(habit.completionHistory || {}).sort();
            let streak = 0;
            let currentDate = new Date();
            
            for (let i = dates.length - 1; i >= 0; i--) {
                const date = new Date(dates[i]);
                if (habit.completionHistory[dates[i]] && 
                    (currentDate - date) / (1000 * 60 * 60 * 24) <= streak + 1) {
                    streak++;
                } else {
                    break;
                }
            }
            
            habit.streak = streak;
        } catch (error) {
            console.error('Error updating streak:', error);
            habit.streak = 0;
        }
    },

    saveUserData() {
        try {
            if (this.currentUser) {
                localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
            }
        } catch (error) {
            console.error('Error saving user data:', error);
            showToast('Error saving data. Please try again.', 'error');
        }
    },

    // Getter Funcs
    getHabitsForDate(date) {
        try {
            const user = this.getCurrentUser();
            if (!user) return [];
            
            return user.habits.map(habit => ({
                ...habit,
                completed: habit.completionHistory?.[date] || false
            }));
        } catch (error) {
            console.error('Error getting habits for date:', error);
            return [];
        }
    },

    getHabitStats() {
        try {
            const user = this.getCurrentUser();
            if (!user) return null;

            const totalHabits = user.habits.length;
            const completedHabits = user.habits.filter(h => 
                h.completionHistory?.[new Date().toISOString().split('T')[0]]
            ).length;

            return {
                totalHabits,
                completedHabits,
                completionRate: totalHabits > 0 ? (completedHabits / totalHabits) * 100 : 0
            };
        } catch (error) {
            console.error('Error getting habit stats:', error);
            return null;
        }
    },

    getWeeklyStats() {
        try {
            const user = this.getCurrentUser();
            if (!user) return null;

            const today = new Date();
            const weekStart = new Date(today);
            weekStart.setDate(today.getDate() - today.getDay());
            
            let weeklyStats = {
                total: 0,
                completed: 0,
                days: {}
            };

            for (let i = 0; i < 7; i++) {
                const date = new Date(weekStart);
                date.setDate(weekStart.getDate() + i);
                const dateStr = date.toISOString().split('T')[0];
                
                const habits = this.getHabitsForDate(dateStr);
                weeklyStats.days[dateStr] = {
                    total: habits.length,
                    completed: habits.filter(h => h.completed).length
                };
                
                weeklyStats.total += habits.length;
                weeklyStats.completed += habits.filter(h => h.completed).length;
            }

            return weeklyStats;
        } catch (error) {
            console.error('Error getting weekly stats:', error);
            return null;
        }
    },

    getReminders: function() {
        const user = this.getCurrentUser();
        if (!user) return [];
        
        return user.reminders.map(reminder => ({
            ...reminder,
            habit: user.habits.find(h => h.id === reminder.habitId)
        }));
    },

    updateReminder: function(reminderId, updates) {
        const user = this.getCurrentUser();
        if (user) {
            const reminder = user.reminders.find(r => r.id === reminderId);
            if (reminder) {
                Object.assign(reminder, updates);
                this.saveUserData();
                return true;
            }
        }
        return false;
    },

    // Upt existing methods to use saveUsers()
    updateUser(userId, updatedData) {
        const userIndex = this.users.findIndex(u => u.id === userId);
        if (userIndex !== -1) {
            this.users[userIndex] = { ...this.users[userIndex], ...updatedData };
            this.saveUsers();
            return true;
        }
        return false;
    }
};

// Init data manager
dataManager.init(); 