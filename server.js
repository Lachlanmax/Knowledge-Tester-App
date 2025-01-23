import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Sample trivia questions database
const questionBank = {
  science: [
    {
      id: 1,
      question: "What is the chemical symbol for gold?",
      options: ["Go", "Au", "Gd", "Ag"],
      correct: 1,
      difficulty: "easy"
    },
    {
      id: 2,
      question: "What is the speed of light?",
      options: ["300,000 km/s", "150,000 km/s", "500,000 km/s", "100,000 km/s"],
      correct: 0,
      difficulty: "medium"
    },
    {
      id: 3,
      question: "How many bones are in the human body?",
      options: ["186", "206", "226", "246"],
      correct: 1,
      difficulty: "easy"
    }
  ],
  history: [
    {
      id: 1,
      question: "In what year did World War II end?",
      options: ["1943", "1944", "1945", "1946"],
      correct: 2,
      difficulty: "easy"
    },
    {
      id: 2,
      question: "Who was the first President of the United States?",
      options: ["Thomas Jefferson", "George Washington", "John Adams", "James Madison"],
      correct: 1,
      difficulty: "easy"
    },
    {
      id: 3,
      question: "In what year did the Titanic sink?",
      options: ["1910", "1911", "1912", "1913"],
      correct: 2,
      difficulty: "easy"
    }
  ],
  geography: [
    {
      id: 1,
      question: "What is the capital of France?",
      options: ["Lyon", "Marseille", "Paris", "Nice"],
      correct: 2,
      difficulty: "easy"
    },
    {
      id: 2,
      question: "Which is the longest river in the world?",
      options: ["Amazon", "Nile", "Yangtze", "Mississippi"],
      correct: 1,
      difficulty: "medium"
    },
    {
      id: 3,
      question: "How many continents are there?",
      options: ["5", "6", "7", "8"],
      correct: 2,
      difficulty: "easy"
    }
  ],
  technology: [
    {
      id: 1,
      question: "What does HTML stand for?",
      options: ["Hyper Text Markup Language", "High Tech Modern Language", "Home Tool Markup Language", "Hyperlinks and Text Markup Language"],
      correct: 0,
      difficulty: "easy"
    },
    {
      id: 2,
      question: "In what year was JavaScript created?",
      options: ["1993", "1995", "1997", "1999"],
      correct: 1,
      difficulty: "medium"
    },
    {
      id: 3,
      question: "What does API stand for?",
      options: ["Application Programming Interface", "Advanced Programming Input", "Application Process Integration", "Advanced Protocol Interface"],
      correct: 0,
      difficulty: "medium"
    }
  ],
  sports: [
    {
      id: 1,
      question: "How many players are on a basketball team on the court?",
      options: ["4", "5", "6", "7"],
      correct: 1,
      difficulty: "easy"
    },
    {
      id: 2,
      question: "In tennis, what is a score of 0 called?",
      options: ["Zero", "Nil", "Love", "Nothing"],
      correct: 2,
      difficulty: "medium"
    },
    {
      id: 3,
      question: "How many holes are on a standard golf course?",
      options: ["9", "18", "27", "36"],
      correct: 1,
      difficulty: "easy"
    }
  ]
};

// API Routes
app.get('/api/categories', (req, res) => {
  const categories = Object.keys(questionBank);
  res.json(categories);
});

app.get('/api/questions/:category', (req, res) => {
  const { category } = req.params;
  if (questionBank[category]) {
    // Shuffle questions
    const questions = [...questionBank[category]].sort(() => Math.random() - 0.5);
    res.json(questions);
  } else {
    res.status(404).json({ error: 'Category not found' });
  }
});

app.post('/api/scores', (req, res) => {
  const { playerName, category, score, totalQuestions, timeSpent } = req.body;
  
  if (!playerName || !category) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const scoreRecord = {
    id: Date.now(),
    playerName,
    category,
    score,
    totalQuestions,
    percentage: Math.round((score / totalQuestions) * 100),
    timeSpent,
    timestamp: new Date().toISOString()
  };

  // In a real app, this would be saved to a database
  res.json({ success: true, message: 'Score recorded', data: scoreRecord });
});

app.get('/api/leaderboard/:category', (req, res) => {
  const { category } = req.params;
  // This would retrieve from database in a real app
  res.json({ category, scores: [] });
});

app.listen(PORT, () => {
  console.log(`Knowledge Tester API running on http://localhost:${PORT}`);
  console.log(`Categories available: ${Object.keys(questionBank).join(', ')}`);
});
