let playerScore = 0;
let computerScore = 0;
let round = 1;
let gameOver = false;
let difficulty = "easy";
let history = [];

const emojis = { Rock: "🪨", Paper: "📄", Scissors: "✂️" };
const moves = ["Rock", "Paper", "Scissors"];

function setDifficulty(level) {
  difficulty = level;
  document.querySelectorAll(".diff-btn").forEach(btn => btn.classList.remove("active"));
  document.getElementById("diff-" + level).classList.add("active");
  resetGame();
}

function getComputerMove(playerMove) {
  if (difficulty === "easy") {
    return moves[Math.floor(Math.random() * 3)];
  } else if (difficulty === "medium") {
    if (Math.random() < 0.4) {
      const winMap = { Rock: "Paper", Paper: "Scissors", Scissors: "Rock" };
      return winMap[playerMove];
    }
    return moves[Math.floor(Math.random() * 3)];
  } else {
    const winMap = { Rock: "Paper", Paper: "Scissors", Scissors: "Rock" };
    return Math.random() < 0.75 ? winMap[playerMove] : moves[Math.floor(Math.random() * 3)];
  }
}

function getResult(player, computer) {
  if (player === computer) return "tie";
  if (
    (player === "Rock" && computer === "Scissors") ||
    (player === "Scissors" && computer === "Paper") ||
    (player === "Paper" && computer === "Rock")
  ) return "win";
  return "lose";
}

function addToHistory(playerMove, computerMove, result) {
  history.unshift({ playerMove, computerMove, result, round: round - 1 });
  if (history.length > 5) history.pop();
  renderHistory();
}

function renderHistory() {
  const container = document.getElementById("historyList");
  if (history.length === 0) {
    container.innerHTML = "<p class='no-history'>No rounds yet</p>";
    return;
  }
  container.innerHTML = history.map(h => `
    <div class="history-item ${h.result}">
      <span class="h-round">R${h.round}</span>
      <span>${emojis[h.playerMove]}</span>
      <span class="h-vs">vs</span>
      <span>${emojis[h.computerMove]}</span>
      <span class="h-result">${h.result === "win" ? "Win 🎉" : h.result === "lose" ? "Lose 💀" : "Tie 🤝"}</span>
    </div>
  `).join("");
}

function play(playerMove) {
  if (gameOver) return;

  let buttons = document.querySelectorAll(".btn");
  buttons.forEach(btn => btn.disabled = true);

  document.getElementById("playerPick").textContent = emojis[playerMove];
  document.getElementById("cpuPick").textContent = "🤔";
  document.getElementById("resultMsg").textContent = "...";
  document.getElementById("resultMsg").className = "result-msg";

  setTimeout(function() {
    let computerMove = getComputerMove(playerMove);
    let result = getResult(playerMove, computerMove);

    document.getElementById("cpuPick").textContent = emojis[computerMove];

    let resultEl = document.getElementById("resultMsg");

    if (result === "win") {
      playerScore++;
      resultEl.textContent = "You win this round! 🎉";
      resultEl.className = "result-msg win";
    } else if (result === "lose") {
      computerScore++;
      resultEl.textContent = "Computer wins this round! 💀";
      resultEl.className = "result-msg lose";
    } else {
      resultEl.textContent = "It's a tie! 🤝";
      resultEl.className = "result-msg tie";
    }

    document.getElementById("playerScore").textContent = playerScore;
    document.getElementById("computerScore").textContent = computerScore;

    round++;
    document.getElementById("roundInfo").textContent = "Round " + round;

    addToHistory(playerMove, computerMove, result);

    if (playerScore === 3 || computerScore === 3) {
      gameOver = true;
      setTimeout(showPopup, 700);
      return;
    }

    setTimeout(function() {
      buttons.forEach(btn => btn.disabled = false);
    }, 800);
  }, 600);
}

function showPopup() {
  let title = document.getElementById("popupTitle");
  let scoreText = document.getElementById("popupScore");

  if (playerScore === 3) {
    title.textContent = "You Win! 🎉";
    title.style.color = "#44dd88";
  } else {
    title.textContent = "Computer Wins! 💀";
    title.style.color = "#ff5566";
  }

  scoreText.textContent = playerScore + " - " + computerScore;
  document.getElementById("overlay").classList.add("show");
}

function resetGame() {
  playerScore = 0;
  computerScore = 0;
  round = 1;
  gameOver = false;
  history = [];

  document.getElementById("playerScore").textContent = "0";
  document.getElementById("computerScore").textContent = "0";
  document.getElementById("playerPick").textContent = "❓";
  document.getElementById("cpuPick").textContent = "❓";
  document.getElementById("resultMsg").textContent = "Make your move!";
  document.getElementById("resultMsg").className = "result-msg";
  document.getElementById("roundInfo").textContent = "Round 1";
  document.getElementById("overlay").classList.remove("show");
  document.querySelectorAll(".btn").forEach(btn => btn.disabled = false);
  renderHistory();
}