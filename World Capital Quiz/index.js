import express from "express";
import dotenv from "dotenv";
import { db } from "./db.js";

dotenv.config();

const app = express();
const port = 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

let quiz = [];
let totalCorrect = 0;
let currentQuestion = {};

// Load quiz from Supabase
async function loadQuiz() {
  try{
    const res = await db.query("SELECT country, capital FROM Capitals");
    quiz = res.rows;
  } catch (err) {
    console.error("Error fetching quiz from DB:", err);
  }
}

// GET home page
app.get("/", async (req, res) => {
  totalCorrect = 0;
  if (quiz.length === 0) await loadQuiz();
  await nextQuestion();
  res.render("index.ejs", { question: currentQuestion });
});

// POST answer
app.post("/submit", async (req, res) => {
  let answer = req.body.answer?.trim() || "";
  let isCorrect = false;

  if (currentQuestion.capital.toLowerCase() === answer.toLowerCase()) {
    totalCorrect++;
    isCorrect = true;
  }

  await nextQuestion();
  res.render("index.ejs", {
    question: currentQuestion,
    wasCorrect: isCorrect,
    totalScore: totalCorrect,
  });
});

// Get next random question
async function nextQuestion() {
  if (quiz.length === 0) await loadQuiz();
  const randomCountry = quiz[Math.floor(Math.random() * quiz.length)];
  currentQuestion = randomCountry;
}

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
