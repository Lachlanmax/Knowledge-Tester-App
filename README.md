# Knowledge Tester App 🧠

A Kahoot-like quiz application for testing knowledge across different subjects with timed questions, score tracking, and instant feedback.

## Features

- 🎯 **Multiple Categories**: Science, History, Geography, Technology, Sports
- ⏱️ **Timed Questions**: 30-second timer per question
- 📊 **Score Tracking**: Track your performance with detailed statistics
- 🎨 **Beautiful UI**: Modern, responsive design that works on all devices
- 💾 **Score History**: Server-side score storage (ready for database integration)
- 🔄 **Multiple Quiz Attempts**: Take as many quizzes as you want

## Project Structure

```
.
├── server.js              # Express backend server with API endpoints
├── package.json           # Node.js dependencies
├── public/
│   ├── index.html         # Main HTML file
│   ├── styles.css         # Styling
│   ├── app.js             # Frontend JavaScript logic
│   └── favicon.ico        # Favicon
└── README.md              # This file
```

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm

### Steps

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

3. **Open in browser:**
   - Navigate to `http://localhost:3000`
   - Enter your name
   - Select a category
   - Start answering questions!

## API Endpoints

### Get Categories
```
GET /api/categories
```
Returns available quiz categories.

### Get Questions
```
GET /api/questions/:category
```
Returns all questions for a specific category.

### Submit Score
```
POST /api/scores
Body: { playerName, category, score, totalQuestions, timeSpent }
```
Records a quiz score.

### Get Leaderboard
```
GET /api/leaderboard/:category
```
Returns top scores for a category (ready for implementation).

## How to Play

1. **Enter Your Name**: Start by typing your name
2. **Choose Category**: Select from 5 knowledge categories
3. **Answer Questions**: You have 30 seconds per question
4. **Navigate**: Use Previous/Next buttons or let the timer auto-advance
5. **View Results**: See your score, accuracy percentage, and time taken

## Game Features

- **Instant Feedback**: Selected answers are highlighted
- **Progress Tracking**: Know which question you're on
- **Time Warning**: Timer changes color when time is running out
- **Detailed Results**: See percentage, time spent, and category
- **Responsive Design**: Works on desktop, tablet, and mobile

## Extending the App

### Add More Questions
Edit the `questionBank` object in `server.js`:
```javascript
const questionBank = {
  yourCategory: [
    {
      id: 1,
      question: "Your question?",
      options: ["Option 1", "Option 2", "Option 3", "Option 4"],
      correct: 0, // Index of correct answer
      difficulty: "easy"
    }
  ]
}
```

### Connect to Database
Replace the in-memory score storage in `/api/scores` with database calls:
- MongoDB
- PostgreSQL
- Firebase
- etc.

### Add User Authentication
Implement login/registration to track individual user progress.

### Add Leaderboard
Implement the `/api/leaderboard/:category` endpoint to show top scores.

## Technologies Used

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Node.js, Express.js
- **Styling**: Custom CSS with responsive design
- **API**: RESTful API with CORS support

## Future Enhancements

- [ ] Database integration (MongoDB, PostgreSQL)
- [ ] User authentication & login
- [ ] Leaderboard & rankings
- [ ] Difficulty levels
- [ ] Question images & videos
- [ ] Multiplayer mode
- [ ] Custom question sets
- [ ] AI-generated questions
- [ ] Badges & achievements
- [ ] Dark mode

## License

MIT License

## Author

Knowledge Tester App Contributors
