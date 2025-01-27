const dataUrl = "./quiz-data.json";

let questions = [];
let filteredQuestions = [];
let currentQuestionIndex = 0;
let playerAnswers = [];
let selectedQuestionCount = 0;

async function fetchData() {
  try {
    const response = await fetch(dataUrl);
    if (!response.ok) throw new Error("データの取得に失敗しました。");
    questions = await response.json();
    showCategories();
  } catch (error) {
    console.error(error);
    alert("問題データを読み込めませんでした。");
  }
}

function showCategories() {
  const categories = [...new Set(questions.map(q => q.category))];
  const categoriesDiv = document.getElementById("categories");
  categoriesDiv.innerHTML = "";
  categories.forEach(category => {
    const button = document.createElement("button");
    button.textContent = category;
    button.classList.add("option-button");
    button.onclick = () => selectCategory(category);
    categoriesDiv.appendChild(button);
  });

  document.getElementById("startScreen").classList.add("hidden");
  document.getElementById("categoryScreen").classList.remove("hidden");
}

function selectCategory(category) {
  filteredQuestions = questions.filter(q => q.category === category);
  currentQuestionIndex = 0;
  playerAnswers = [];
  showQuestionCountSelection();
}

function showQuestionCountSelection() {
  const questionCountDiv = document.getElementById("questionCount");
  questionCountDiv.innerHTML = "";
  const maxQuestions = filteredQuestions.length;

  for (let i = 1; i <= maxQuestions; i++) {
    const button = document.createElement("button");
    button.textContent = `${i}問`;
    button.classList.add("option-button");
    button.onclick = () => selectQuestionCount(i);
    questionCountDiv.appendChild(button);
  }

  document.getElementById("categoryScreen").classList.add("hidden");
  document.getElementById("questionCountScreen").classList.remove("hidden");
}

function selectQuestionCount(count) {
  selectedQuestionCount = count;
  filteredQuestions = filteredQuestions.slice(0, count);
  document.getElementById("questionCountScreen").classList.add("hidden");
  document.getElementById("quizScreen").classList.remove("hidden");
  showQuestion();
}

function showQuestion() {
  if (currentQuestionIndex >= selectedQuestionCount) {
    showResult();
    return;
  }

  const question = filteredQuestions[currentQuestionIndex];
  const questionText = document.getElementById("questionText");
  const answers = document.getElementById("answers");
  const writtenAnswer = document.getElementById("writtenAnswer");
  const submitAnswerButton = document.getElementById("submitAnswerButton");

  questionText.textContent = question.question;

  if (question.type === "choice") {
    answers.innerHTML = "";
    writtenAnswer.classList.add("hidden");
    submitAnswerButton.classList.add("hidden");
    question.options.forEach((option, index) => {
      const button = document.createElement("button");
      button.textContent = option;
      button.classList.add("option-button");
      button.onclick = () => handleAnswer(index);
      answers.appendChild(button);
    });
  } else {
    answers.innerHTML = "";
    writtenAnswer.value = "";
    writtenAnswer.classList.remove("hidden");
    submitAnswerButton.classList.remove("hidden");
    submitAnswerButton.onclick = () => handleAnswer(writtenAnswer.value.trim());
  }
}

function handleAnswer(selectedAnswer) {
  const question = filteredQuestions[currentQuestionIndex];
  const isCorrect = question.type === "choice"
    ? selectedAnswer === question.answer
    : selectedAnswer.toString() === question.answer.toString();

  playerAnswers.push({
    question: question.question,
    selected: question.type === "choice"
      ? question.options[selectedAnswer] || "未回答"
      : selectedAnswer || "未回答",
    correct: question.type === "choice"
      ? question.options[question.answer]
      : question.answer,
    explanation: question.explanation,
    isCorrect,
  });

  currentQuestionIndex++;
  showQuestion();
}

function showResult() {
  document.getElementById("quizScreen").classList.add("hidden");
  const resultScreen = document.getElementById("resultScreen");
  const resultDiv = document.getElementById("result");

  resultScreen.classList.remove("hidden");

  resultDiv.innerHTML = playerAnswers
    .map((answer, index) => `
      <div>
        <h3>問題 ${index + 1}</h3>
        <p><strong>問題:</strong> ${answer.question}</p>
        <p><strong>あなたの回答:</strong> <span style="color: ${answer.isCorrect ? "green" : "red"};">${answer.selected}</span></p>
        <p><strong>正解:</strong> ${answer.correct}</p>
        <p><strong>解説:</strong> ${answer.explanation}</p>
      </div>
    `)
    .join("");
}

document.getElementById("startButton").onclick = fetchData;
document.getElementById("restartButton").onclick = () => {
  document.getElementById("resultScreen").classList.add("hidden");
  document.getElementById("startScreen").classList.remove("hidden");
};
document.getElementById("infoButton").onclick = () => {
  document.getElementById("startScreen").classList.add("hidden");
  document.getElementById("infoScreen").classList.remove("hidden");
};
document.getElementById("backToStartButton").onclick = () => {
  document.getElementById("infoScreen").classList.add("hidden");
  document.getElementById("startScreen").classList.remove("hidden");
};
