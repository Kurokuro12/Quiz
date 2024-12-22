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
  const questionImage = document.getElementById("questionImage");
  const answers = document.getElementById("answers");
  const writtenAnswer = document.getElementById("writtenAnswer");
  const submitAnswerButton = document.getElementById("submitAnswerButton");

  questionText.textContent = question.question;

  if (question.image) {
    questionImage.src = question.image;
    questionImage.classList.remove("hidden");
  } else {
    questionImage.classList.add("hidden");
  }

  if (question.options) {
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
    writtenAnswer.classList.remove("hidden");
    submitAnswerButton.classList.remove("hidden");
    submitAnswerButton.onclick = () => handleAnswer(writtenAnswer.value.trim());
  }
}

function handleAnswer(selectedAnswer) {
  const question = filteredQuestions[currentQuestionIndex];
  const isCorrect = question.options
    ? selectedAnswer === question.answer
    : selectedAnswer.toString() === question.answer.toString();

  playerAnswers.push({
    question: question.question,
    selected: question.options ? question.options[selectedAnswer] : selectedAnswer,
    correct: question.options ? question.options[question.answer] : question.answer,
    explanation: question.explanation,
    isCorrect,
  });

  currentQuestionIndex++;
  showQuestion();
}

function giveUp() {
  for (let i = currentQuestionIndex; i < filteredQuestions.length; i++) {
    const question = filteredQuestions[i];
    playerAnswers.push({
      question: question.question,
      selected: "未回答",
      correct: question.options ? question.options[question.answer] : question.answer,
      explanation: question.explanation,
      isCorrect: false,
    });
  }
  showResult();
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
        <p><strong style="color: navy;">問題:</strong> ${answer.question}</p>
        <p><strong style="color: brown;">あなたの回答:</strong> ${answer.selected || "未回答"}</p>
        <p><strong style="color: green;">正解:</strong> ${answer.correct}</p>
        <p><strong style="color: gray;">解説:</strong> ${answer.explanation}</p>
        ${
          answer.link
            ? `<p><a href="${answer.link}" target="_blank" style="color: blue;">参考リンク</a></p>`
            : "<p style='color: gray;'>参考リンクはありません</p>"
        }
        ${
          answer.youtube && answer.youtube.startsWith("https")
            ? `<p><a href="${answer.youtube}" target="_blank" style="color: red;">YouTube解説動画</a></p>`
            : "<p style='color: gray;'>YouTube解説動画はありません</p>"
        }
        <p style="color: ${answer.isCorrect ? "green" : "red"};">
          ${answer.isCorrect ? "正解！" : "不正解！"}
        </p>
      </div>
    `)
    .join("");
}

document.getElementById("startButton").onclick = fetchData;
document.getElementById("restartButton").onclick = () => {
  document.getElementById("resultScreen").classList.add("hidden");
  document.getElementById("startScreen").classList.remove("hidden");
};
document.getElementById("giveUpButton").onclick = giveUp;
