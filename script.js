const cells = 31;
const tg = window.Telegram.WebApp;

// From 0.001 to 100
const items = [
  { name: "Coin 100", img: "img/coin.png", chance: 1 },
  { name: "Premium", img: "img/korona.png", chance: 1.5},
  { name: "Coin 300", img: "img/coin.png", chance: 1}

];

function getItem() {
  let item;
  const totalChance = items.reduce((acc, elm) => acc + elm.chance, 0);
  const randomChance = Math.random() * totalChance;

  let cumulativeChance = 0;
  for (const elm of items) {
    cumulativeChance += elm.chance;
    if (randomChance < cumulativeChance) {
      item = elm;
      break;
    }
  }

  return item;
}

function generateItems() {
  document.querySelector(".list").remove();
  document.querySelector(".scope").innerHTML = `
    <ul class="list"></ul>
  `;

  const list = document.querySelector(".list");

  for (let i = 0; i < cells; i++) {
    const item = getItem();

    const li = document.createElement("li");
    li.setAttribute("data-item", JSON.stringify(item));
    li.classList.add("list__item");
    li.innerHTML = `
      <img src="${item.img}" alt="" />
    `;

    list.append(li);
  }
}

generateItems();

let isStarted = false;
let isFirstStart = true;

function start() {
  if (isStarted) return;
  else isStarted = true;

  if (!isFirstStart) generateItems();
  else isFirstStart = false;
  const list = document.querySelector(".list");

  setTimeout(() => {
    list.style.left = "50%";
    list.style.transform = "translate3d(-50%, 0, 0)";
  }, 0);

  const item = list.querySelectorAll("li")[15];

  list.addEventListener(
    "transitionend",
    () => {
      isStarted = false;
      item.classList.add("active");
      let data = JSON.parse(item.getAttribute("data-item"));
      data.type = "prize";
      sendDataToTelegram(JSON.stringify(data));
    },
    { once: true }
  );
}

function sendDataToTelegram(data){
    tg.sendData(data);
}
