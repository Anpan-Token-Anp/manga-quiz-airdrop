let currentQuestionIndex = 0;
let questions = [];
let score = 0;
let playerName = "";
let walletAddress = "";

async function fetchQuestions() {
  const res = await fetch("https://opentdb.com/api.php?amount=7&category=31&difficulty=medium&type=multiple");
  const data = await res.json();
  questions = data.results.map(q => ({
    question: decodeHTML(q.question),
    correct: decodeHTML(q.correct_answer),
    answers: shuffle([decodeHTML(q.correct_answer), ...q.incorrect_answers.map(decodeHTML)])
  }));
  showQuestion();
}

function decodeHTML(html) {
  const txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function showQuestion() {
  const questionBox = document.getElementById("question-area");
  const answersBox = document.getElementById("answer-buttons");
  const nextBtn = document.getElementById("next-btn");

  questionBox.innerHTML = `<p>${questions[currentQuestionIndex].question}</p>`;
  answersBox.innerHTML = "";

  questions[currentQuestionIndex].answers.forEach(answer => {
    const btn = document.createElement("button");
    btn.textContent = answer;
    btn.onclick = () => checkAnswer(answer);
    answersBox.appendChild(btn);
  });

  nextBtn.classList.add("hidden");
}

function checkAnswer(selected) {
  const correct = questions[currentQuestionIndex].correct;
  if (selected === correct) score++;
  document.querySelectorAll("#answer-buttons button").forEach(btn => {
    btn.disabled = true;
    if (btn.textContent === correct) btn.style.backgroundColor = "#4CAF50";
    else if (btn.textContent === selected) btn.style.backgroundColor = "#f44336";
  });
  document.getElementById("next-btn").classList.remove("hidden");
}

document.getElementById("next-btn").onclick = () => {
  currentQuestionIndex++;
  if (currentQuestionIndex < questions.length) {
    showQuestion();
  } else {
    endGame();
  }
};

function endGame() {
  const questionBox = document.getElementById("question-area");
  const answersBox = document.getElementById("answer-buttons");
  const nextBtn = document.getElementById("next-btn");
  questionBox.innerHTML = `<h2>Quiz complete!</h2><p>${playerName}, your score: ${score}/7</p>`;
  answersBox.innerHTML = "";
  nextBtn.classList.add("hidden");

  distributeReward();
}

async function distributeReward() {
  if (!walletAddress) return alert("Wallet not connected");
  const reward = score >= 5 ? 10 : 1;
  alert(`${reward} token(s) will be sent to ${walletAddress}`);
  // Ici vous connecterez la logique avec Thirdweb plus tard
}

// Handle pseudo
function handlePseudo() {
  const input = document.getElementById("pseudo-input");
  playerName = input.value.trim();
  if (playerName) alert(`Welcome ${playerName}`);
}

// Handle wallet
async function connectWallet() {
  if (!window.ethereum) return alert("MetaMask is not installed. Please install it to use this site.");
  try {
    const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
    walletAddress = accounts[0];
    document.getElementById("wallet-display").textContent = walletAddress;
  } catch (err) {
    console.error(err);
    alert("Wallet connection failed.");
  }
}

document.getElementById("pseudo-btn").onclick = handlePseudo;
document.getElementById("wallet-btn").onclick = connectWallet;

window.onload = fetchQuestions;
