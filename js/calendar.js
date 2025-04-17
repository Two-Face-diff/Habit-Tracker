/* Author: Marwan Rafe Mohammed 
Project: Habita
Course: TAG-Web Development Course-Level.1
License: All rights reserved – No reuse without permission
Date: April 2025 */

// calendar page js by @Two-Face
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        window.location.href = 'index.html';
        return;
    }

    // Logout functionality
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            localStorage.removeItem('currentUser');
            window.location.href = 'index.html';
        });
    }

    // Current date tracking
    const today = new Date();
    let currentMonth = today.getMonth();
    let currentYear = today.getFullYear();

    // Month names for display
    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    
    // Day names for display
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    
    // Get stored habits
    function getHabits() {
        return JSON.parse(localStorage.getItem('userHabits')) || [];
    }
    
    // Get habit completion data
    function getHabitCompletionData() {
        const habits = getHabits();
        const completionData = {};
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        
        for (let i = 1; i <= daysInMonth; i++) {
            const dateKey = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
            completionData[dateKey] = {};
            
            habits.forEach(habit => {
                if (habit.completionHistory && habit.completionHistory[dateKey] !== undefined) {
                    completionData[dateKey][habit.id] = habit.completionHistory[dateKey];
                } else {
                    completionData[dateKey][habit.id] = false;
                }
            });
        }
        
        return completionData;
    }

    // Save habit completion data
    function saveHabitCompletion(habitId, dateKey, isCompleted) {
        const habits = getHabits();
        const habit = habits.find(h => h.id === habitId);
        
        if (habit) {
            if (!habit.completionHistory) {
                habit.completionHistory = {};
            }
            habit.completionHistory[dateKey] = isCompleted;
            localStorage.setItem('userHabits', JSON.stringify(habits));
            return true;
        }
        return false;
    }
    
    // Initialize the calendar
    function initCalendar() {
        try {
            // Update month/year display
            const monthYearDisplay = document.getElementById('currentMonthYear');
            if (!monthYearDisplay) {
                throw new Error('Month/year display element not found');
            }
            monthYearDisplay.textContent = `${monthNames[currentMonth]} ${currentYear}`;
            
            // Get completion data
            const completionData = getHabitCompletionData();
            
            // Get calendar grid
            const calendarGrid = document.getElementById('calendarGrid');
            if (!calendarGrid) {
                throw new Error('Calendar grid element not found');
            }
            
            // Clear existing calendar
            calendarGrid.innerHTML = '';
            
            // Add day headers
            dayNames.forEach(day => {
                const dayHeader = document.createElement('div');
                dayHeader.className = 'calendar-day-header';
                dayHeader.textContent = day;
                calendarGrid.appendChild(dayHeader);
            });
            
            // Get first day of month
            const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
            
            // Get number of days in month
            const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
            
            // Add empty cells for days before the 1st
            for (let i = 0; i < firstDayOfMonth; i++) {
                const emptyCell = document.createElement('div');
                emptyCell.className = 'calendar-day empty';
                calendarGrid.appendChild(emptyCell);
            }
            
            // Add cells for each day
            for (let day = 1; day <= daysInMonth; day++) {
                const dateKey = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                const dayData = completionData[dateKey] || {};
                
                const dayCell = document.createElement('div');
                dayCell.className = 'calendar-day';
                dayCell.dataset.date = dateKey;
            
                // Highlight today
                if (day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear()) {
                    dayCell.classList.add('today');
                }
            
                // Add day number
                const dayNumber = document.createElement('div');
                dayNumber.className = 'day-number';
                dayNumber.textContent = day;
                dayCell.appendChild(dayNumber);
            
                // Add habit completion indicators
                const habitIndicators = document.createElement('div');
                habitIndicators.className = 'habit-indicators';
                
                // Get habits
                const habits = getHabits();
                const habitCount = habits.length;
                const completedCount = Object.values(dayData).filter(Boolean).length;
                
                if (habitCount > 0) {
                    // Create completion indicator
                    const indicator = document.createElement('div');
                    indicator.className = 'completion-indicator';
                    
                    // Calculate completion percentage
                    const completionPercentage = (completedCount / habitCount) * 100;
                    
                    // Add appropriate class based on completion
                    if (completionPercentage === 100) {
                        indicator.classList.add('completed');
                    } else if (completionPercentage > 0) {
                        indicator.classList.add('partial');
                        indicator.style.setProperty('--completion', `${completionPercentage}%`);
                    } else {
                        indicator.classList.add('empty');
                    }
                    
                    habitIndicators.appendChild(indicator);
                    
                    // Add tooltip
                    const tooltip = document.createElement('div');
                    tooltip.className = 'completion-tooltip';
                    tooltip.textContent = `${completedCount}/${habitCount} completed`;
                    habitIndicators.appendChild(tooltip);
                }
                
                dayCell.appendChild(habitIndicators);
                
                // Add click event
                dayCell.addEventListener('click', function() {
                    showDayDetails(dateKey, dayData);
                });
                
                calendarGrid.appendChild(dayCell);
            }
        } catch (error) {
            console.error('Error initializing calendar:', error);
            window.utilities.showToast('Error initializing calendar. Please try refreshing the page.', 'danger');
        }
    }
    
    // Function to show day details
    function showDayDetails(dateKey, dayData) {
        try {
            const detailsContainer = document.getElementById('dayDetailsContainer');
            const overlay = document.getElementById('calendarOverlay');
            
            if (!detailsContainer || !overlay) {
                throw new Error('Required elements not found');
            }
            
            const [year, month, day] = dateKey.split('-').map(Number);
            const date = new Date(year, month - 1, day);
            const formattedDate = date.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            });
            
            const habits = getHabits();
            
            detailsContainer.innerHTML = `
                <div class="card shadow-lg">
                    <div class="card-header bg-white d-flex justify-content-between align-items-center">
                        <h5 class="mb-0">${formattedDate}</h5>
                        <button type="button" class="btn-close" aria-label="Close"></button>
                    </div>
                    <div class="card-body">
                        <h6 class="mb-3">Habit Completion</h6>
                        <ul class="list-group list-group-flush mb-3">
                            ${habits.map(habit => {
                                const isCompleted = dayData[habit.id] || false;
                                return `
                                    <li class="list-group-item d-flex justify-content-between align-items-center">
                                        <div>
                                            <h6 class="mb-0">${habit.name}</h6>
                                            <small class="text-muted">${habit.timeOfDay || 'Anytime'}</small>
                                        </div>
                                        <div class="form-check form-switch">
                                            <input class="form-check-input" type="checkbox" 
                                                id="habit-${habit.id}" 
                                                ${isCompleted ? 'checked' : ''}
                                                data-habit-id="${habit.id}">
                                        </div>
                                    </li>
                                `;
                            }).join('')}
                        </ul>
                        <button class="btn btn-primary w-100" id="saveChangesBtn">
                            <i class="fas fa-save me-2"></i>Save Changes
                        </button>
                    </div>
                </div>
            `;
            
            // Show the modal
            overlay.style.display = 'block';
            detailsContainer.style.display = 'block';
            
            // Add event listeners
            const closeBtn = detailsContainer.querySelector('.btn-close');
            closeBtn.addEventListener('click', function() {
                overlay.style.display = 'none';
                detailsContainer.style.display = 'none';
            });
            
            // Add save button handler
            const saveBtn = document.getElementById('saveChangesBtn');
            if (saveBtn) {
                saveBtn.addEventListener('click', function() {
                    const checkboxes = detailsContainer.querySelectorAll('.form-check-input');
                    let hasChanges = false;
                    
                    checkboxes.forEach(checkbox => {
                        const habitId = checkbox.dataset.habitId;
                        const isCompleted = checkbox.checked;
                        
                        if (saveHabitCompletion(habitId, dateKey, isCompleted)) {
                            hasChanges = true;
                        }
                    });
                    
                    if (hasChanges) {
                        // Update the calendar display
                        initCalendar();
                        // Show success message
                        window.utilities.showToast('Changes saved successfully!', 'success');
                    }
                    
                    // Close the modal
                    overlay.style.display = 'none';
                    detailsContainer.style.display = 'none';
                });
            }
            
        } catch (error) {
            console.error('Error showing day details:', error);
            window.utilities.showToast('Error showing day details. Please try again.', 'danger');
        }
    }
    
    // Navigation buttons
    document.getElementById('prevMonth').addEventListener('click', function() {
        if (currentMonth === 0) {
            currentMonth = 11;
            currentYear--;
        } else {
            currentMonth--;
        }
        initCalendar();
    });
    
    document.getElementById('nextMonth').addEventListener('click', function() {
        if (currentMonth === 11) {
            currentMonth = 0;
            currentYear++;
        } else {
            currentMonth++;
        }
        initCalendar();
    });
    
    // Today button functionality
    document.getElementById('currentMonth').addEventListener('click', function() {
        currentMonth = today.getMonth();
        currentYear = today.getFullYear();
        initCalendar();
    });
    
    // Initialize calendar
    initCalendar();
}); 