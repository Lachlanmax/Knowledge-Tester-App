// App State
let appState = {
    playerName: '',
    currentCategory: '',
    questions: [],
    currentQuestionIndex: 0,
    userAnswers: [],
    score: 0,
    startTime: null,
    timeLimit: 30, // seconds per question
    categories: []
};

// Timer variables
let timerInterval = null;
let timeRemaining = 0;

// API Base URL
const API_URL = 'http://localhost:3000/api';

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    loadCategories();
});

// Load categories from API
async function loadCategories() {
    try {
        const response = await fetch(`${API_URL}/categories`);
        if (!response.ok) throw new Error('Failed to load categories');
        
        appState.categories = await response.json();
        renderCategories();
    } catch (error) {
        console.error('Error loading categories:', error);
        // Fallback categories if API is not available
        appState.categories = ['science', 'history', 'geography', 'technology', 'sports'];
        renderCategories();
    }
}

// Render category buttons
function renderCategories() {
    const grid = document.getElementById('categoriesGrid');
    grid.innerHTML = '';

    appState.categories.forEach(category => {
        const btn = document.createElement('button');
        btn.className = 'category-btn';
        btn.textContent = category.charAt(0).toUpperCase() + category.slice(1);
        btn.onclick = () => selectCategory(category);
        grid.appendChild(btn);
    });
}

// Select category and start quiz
async function selectCategory(category) {
    const playerName = document.getElementById('playerName').value.trim();
    if (!playerName) {
        alert('Please enter your name to start!');
        return;
    }

    appState.playerName = playerName;
    appState.currentCategory = category;
    appState.currentQuestionIndex = 0;
    appState.userAnswers = [];
    appState.score = 0;

    try {
        const response = await fetch(`${API_URL}/questions/${category}`);
        if (!response.ok) throw new Error('Failed to load questions');
        
        appState.questions = await response.json();
        startQuiz();
    } catch (error) {
        console.error('Error loading questions:', error);
        alert('Failed to load questions. Please try again.');
    }
}

// Start quiz
function startQuiz() {
    appState.startTime = Date.now();
    showScreen('quizScreen');
    displayQuestion();
}

// Display current question
function displayQuestion() {
    const question = appState.questions[appState.currentQuestionIndex];
    
    // Update header
    document.getElementById('categoryName').textContent = appState.currentCategory.toUpperCase();
    document.getElementById('questionNumber').textContent = 
        `Question ${appState.currentQuestionIndex + 1} / ${appState.questions.length}`;

    // Display question text
    document.getElementById('questionText').textContent = question.question;

    // Display options
    const optionsContainer = document.getElementById('optionsContainer');
    optionsContainer.innerHTML = '';

    question.options.forEach((option, index) => {
        const optionDiv = document.createElement('div');
        optionDiv.className = 'option';
        optionDiv.textContent = option;
        optionDiv.onclick = () => selectOption(index);
        
        // Highlight previously selected answer
        if (appState.userAnswers[appState.currentQuestionIndex] === index) {
            optionDiv.classList.add('selected');
        }
        
        optionsContainer.appendChild(optionDiv);
    });

    // Update button states
    updateButtonStates();

    // Start timer
    startTimer();
}

// Select option
function selectOption(index) {
    appState.userAnswers[appState.currentQuestionIndex] = index;
    
    // Update UI
    const options = document.querySelectorAll('.option');
    options.forEach((option, i) => {
        option.classList.remove('selected');
        if (i === index) {
            option.classList.add('selected');
        }
    });
}

// Update button states
function updateButtonStates() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const submitBtn = document.getElementById('submitBtn');

    prevBtn.disabled = appState.currentQuestionIndex === 0;
    
    const isLastQuestion = appState.currentQuestionIndex === appState.questions.length - 1;
    nextBtn.style.display = isLastQuestion ? 'none' : 'block';
    submitBtn.style.display = isLastQuestion ? 'block' : 'none';
}

// Previous question
function previousQuestion() {
    if (appState.currentQuestionIndex > 0) {
        appState.currentQuestionIndex--;
        displayQuestion();
    }
}

// Next question
function nextQuestion() {
    if (appState.currentQuestionIndex < appState.questions.length - 1) {
        appState.currentQuestionIndex++;
        displayQuestion();
    }
}

// Start timer
function startTimer() {
    if (timerInterval) clearInterval(timerInterval);
    
    timeRemaining = appState.timeLimit;
    updateTimerDisplay();

    timerInterval = setInterval(() => {
        timeRemaining--;
        updateTimerDisplay();

        if (timeRemaining <= 0) {
            clearInterval(timerInterval);
            nextQuestion();
        }
    }, 1000);
}

// Update timer display
function updateTimerDisplay() {
    const timerEl = document.getElementById('timer');
    timerEl.textContent = `${timeRemaining}s`;
    
    if (timeRemaining <= 10) {
        timerEl.classList.add('warning');
    } else {
        timerEl.classList.remove('warning');
    }
}

// Submit quiz
function submitQuiz() {
    if (timerInterval) clearInterval(timerInterval);
    
    // Calculate score
    appState.score = 0;
    appState.questions.forEach((question, index) => {
        if (appState.userAnswers[index] === question.correct) {
            appState.score++;
        }
    });

    // Calculate time spent
    const timeSpent = Math.round((Date.now() - appState.startTime) / 1000);

    // Send score to server
    submitScore(appState.playerName, appState.currentCategory, appState.score, 
                appState.questions.length, timeSpent);

    // Show results
    showResults();
}

// Submit score to API
async function submitScore(playerName, category, score, totalQuestions, timeSpent) {
    try {
        const response = await fetch(`${API_URL}/scores`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                playerName,
                category,
                score,
                totalQuestions,
                timeSpent
            })
        });

        if (!response.ok) throw new Error('Failed to submit score');
        const result = await response.json();
        console.log('Score submitted:', result);
    } catch (error) {
        console.error('Error submitting score:', error);
        // Silently fail - game continues
    }
}

// Show results screen
function showResults() {
    const percentage = Math.round((appState.score / appState.questions.length) * 100);
    const timeSpent = Math.round((Date.now() - appState.startTime) / 1000);
    const minutes = Math.floor(timeSpent / 60);
    const seconds = timeSpent % 60;

    // Update score text
    document.getElementById('scoreText').textContent = 
        `${appState.score} out of ${appState.questions.length} correct`;

    // Update percentage circle
    const circle = document.getElementById('scoreCircle');
    const circumference = 2 * Math.PI * 45;
    const offset = circumference - (percentage / 100) * circumference;
    circle.style.strokeDasharray = circumference;
    circle.style.strokeDashoffset = offset;

    document.getElementById('scorePercentage').textContent = `${percentage}%`;

    // Update stats
    const statsHtml = `
        <div class="stat">
            <div class="stat-label">Score</div>
            <div class="stat-value">${appState.score}/${appState.questions.length}</div>
        </div>
        <div class="stat">
            <div class="stat-label">Accuracy</div>
            <div class="stat-value">${percentage}%</div>
        </div>
        <div class="stat">
            <div class="stat-label">Time</div>
            <div class="stat-value">${minutes}m ${seconds}s</div>
        </div>
        <div class="stat">
            <div class="stat-label">Category</div>
            <div class="stat-value" style="text-transform: capitalize;">${appState.currentCategory}</div>
        </div>
    `;
    document.getElementById('resultsStats').innerHTML = statsHtml;

    showScreen('resultsScreen');
}

// Go back to home
function goHome() {
    showScreen('homeScreen');
    document.getElementById('playerName').value = '';
    if (timerInterval) clearInterval(timerInterval);
}

// Show specific screen
function showScreen(screenName) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenName).classList.add('active');
}
