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

// 他の関数は前回のコードを再利用

document.getElementById("startButton").onclick = fetchData;
document.getElementById("infoButton").onclick = () => {
  document.getElementById("startScreen").classList.add("hidden");
  document.getElementById("infoScreen").classList.remove("hidden");
};
document.getElementById("backToStartButton").onclick = () => {
  document.getElementById("infoScreen").classList.add("hidden");
  document.getElementById("startScreen").classList.remove("hidden");
};
