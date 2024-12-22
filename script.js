const dataUrl = "./quiz-data.json";

let questions = [];
let filteredQuestions = [];
let currentQuestionIndex = 0;
let playerAnswers = [];
let selectedQuestionCount = 0;

// JSONデータを取得
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

// カテゴリ表示
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

// カテゴリ選択後の出題数選択
function selectCategory(category) {
  filteredQuestions = questions.filter(q => q.category === category);
  const questionCountDiv = document.getElementById("questionCount");
  questionCountDiv.innerHTML = "";

  [5, 10, 15].forEach(count => {
    const button = document.createElement("button");
    button.textContent = `${count}問`;
    button.classList.add("option-button");
    button.onclick = () => startQuiz(count);
    questionCountDiv.appendChild(button);
  });

  document.getElementById("categoryScreen").classList.add("hidden");
  document.getElementById("questionCountScreen").classList.remove("hidden");
}

// クイズ開始
function startQuiz(count) {
  selectedQuestionCount = count;
  currentQuestionIndex = 0;
  playerAnswers = [];
  document.getElementById("questionCountScreen").classList.add("hidden");
  document.getElementById("quizScreen").classList.remove("hidden");
  showQuestion();
}

// 問題を表示
function showQuestion() {
  const question = filteredQuestions[currentQuestionIndex];
  const questionText = document.getElementById("questionText");
  const answersDiv = document.getElementById("answers");
  const writtenAnswerInput = document.getElementById("writtenAnswer");
  const submitAnswerButton = document.getElementById("submitAnswerButton");

  questionText.textContent = `Q${currentQuestionIndex + 1}: ${question.question}`;
  answersDiv.innerHTML = "";

  if (question.type === "choice") {
    question.options.forEach((option, index) => {
      const button = document.createElement("button");
      button.textContent = option;
      button.classList.add("option-button");
      button.onclick = () => handleAnswer(option);
      answersDiv.appendChild(button);
    });
    writtenAnswerInput.classList.add("hidden");
    submitAnswerButton.classList.add("hidden");
  } else if (question.type === "written") {
    writtenAnswerInput.classList.remove("hidden");
    submitAnswerButton.classList.remove("hidden");
    submitAnswerButton.onclick = () => handleAnswer(writtenAnswerInput.value.trim());
  }
}

// 解答処理
function handleAnswer(answer) {
  if (!answer) {
    alert("回答を入力してください。");
    return;
  }

  playerAnswers.push({
    question: filteredQuestions[currentQuestionIndex].question,
    correctAnswer: filteredQuestions[currentQuestionIndex].correctAnswer,
    playerAnswer: answer
  });

  currentQuestionIndex++;
  if (currentQuestionIndex < selectedQuestionCount && currentQuestionIndex < filteredQuestions.length) {
    showQuestion();
  } else {
    showResults();
  }
}

// リザルト表示
function showResults() {
  const resultDiv = document.getElementById("result");
  resultDiv.innerHTML = "";

  playerAnswers.forEach((answer, index) => {
    const resultItem = document.createElement("div");
    resultItem.innerHTML = `
      <h3>Q${index + 1}: ${answer.question}</h3>
      <p><strong>正解:</strong> ${answer.correctAnswer}</p>
      <p><strong>あなたの回答:</strong> ${answer.playerAnswer}</p>
      <p>${answer.correctAnswer === answer.playerAnswer ? "✅ 正解" : "❌ 不正解"}</p>
    `;
    resultDiv.appendChild(resultItem);
  });

  document.getElementById("quizScreen").classList.add("hidden");
  document.getElementById("resultScreen").classList.remove("hidden");
}

// 最初の画面に戻る
function restartQuiz() {
  document.getElementById("resultScreen").classList.add("hidden");
  document.getElementById("startScreen").classList.remove("hidden");
}

// お知らせ画面の切り替え
function showInfo() {
  document.getElementById("startScreen").classList.add("hidden");
  document.getElementById("infoScreen").classList.remove("hidden");
}

function backToStart() {
  document.getElementById("infoScreen").classList.add("hidden");
  document.getElementById("startScreen").classList.remove("hidden");
}

// イベントリスナー
document.getElementById("startButton").onclick = fetchData;
document.getElementById("infoButton").onclick = showInfo;
document.getElementById("backToStartButton").onclick = backToStart;
document.getElementById("restartButton").onclick = restartQuiz;
document.getElementById("giveUpButton").onclick = showResults;
