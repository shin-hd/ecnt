const titleWrapper = document.querySelector("#title-wrapper");
const startButton = document.querySelector("#start");

const playWrapper = document.querySelector("#play-wrapper");
const playButton = document.querySelector("#play");
const radioWrapper = document.querySelector("#radio-wrapper");
const radioButtons = document.querySelectorAll("#radio-wrapper input[name='rsp']")

const resultWrapper = document.querySelector("#result-wrapper");
const resultText = document.querySelector("#result");
const replayButton = document.querySelector("#replay");
const userSelectText = document.querySelector("#userSelect");
const computerSelectText = document.querySelector("#computerSelect");

const scoreText = document.querySelector("#score");
const logger = document.querySelector("#logger");

const HIDDEN_CLASS = "hidden";
const FLEX_CLASS = "flex";

const WIN_MESSAGE = "승리!";
const DRAW_MESSAGE = "무승부";
const LOOSE_MESSAGE = "패배...";

const score = [0, 0, 0];

let userSelect = null;
function setUserSelect(value) {
  userSelect = value;
}

const WINNER = {
  "✌🏻": "🖐🏻",
  "✊🏻": "✌🏻",
  "🖐🏻": "✊🏻"
}
const LOOSER = {
  "✌🏻": "✊🏻",
  "✊🏻": "🖐🏻",
  "🖐🏻": "✌🏻"
}

const visible = (doc) => {
  doc.classList.remove(HIDDEN_CLASS);
  doc.classList.add(FLEX_CLASS);
}

const invisible = (doc) => {
  doc.classList.add(HIDDEN_CLASS);
  doc.classList.remove(FLEX_CLASS);
}

const onPlayButtonClick = () => {
  if (!userSelect) {
    alert("가위 바위 보 중 하나를 선택하세요!!");
    return;
  }

  const li = document.createElement("li");
  li.setAttribute('id', score.reduce((prev, cur) => prev + cur));

  const result = Math.floor(Math.random() * 3);
  userSelectText.innerText = userSelect;
  switch (result) {
    case 0:
      resultText.innerText = WIN_MESSAGE;
      computerSelectText.innerText = WINNER[userSelect];
      li.innerText = `[승리] ${userSelect} vs ${WINNER[userSelect]}`
      break;
    case 1:
      resultText.innerText = DRAW_MESSAGE;
      computerSelectText.innerText = userSelect;
      li.innerText = `[무승부] ${userSelect} vs ${WINNER[userSelect]}`
      break;
    case 2:
      resultText.innerText = LOOSE_MESSAGE;
      computerSelectText.innerText = LOOSER[userSelect];
      li.innerText = `[패배] ${userSelect} vs ${WINNER[userSelect]}`
      break;
  }
  logger.prepend(li);
  score[result]++;
  scoreText.innerText = `${score[0]}승 ${score[1]}무 ${score[2]}패`;
  invisible(playWrapper);
  visible(resultWrapper);

  radioButtons.forEach(x => x.checked = false);
}

const onReplayButtonClick = () => {
  userSelect = null;
  resultText.innerText = "";

  invisible(resultWrapper);
  visible(playWrapper);
}

startButton.addEventListener("click", () => {
  invisible(titleWrapper);
  visible(playWrapper)
})
playButton.addEventListener("click", onPlayButtonClick);
replayButton.addEventListener("click", onReplayButtonClick);
