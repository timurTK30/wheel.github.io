const cells = 31;
const tg = window.Telegram.WebApp;

// From 0.001 to 100
const items = [
  { name: "Coin 100", img: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fin.pinterest.com%2Fpin%2Fgolden-coin-png-transparent-glossy-golden-coin-icon-coin-icons-icons-coin-coin-png-image-for-free-download--827395762791812990%2F&psig=AOvVaw0_fJQusG1FxlZSqZFkiDWB&ust=1735153766179000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCJDwn9WNwYoDFQAAAAAdAAAAABAE", chance: 1 },
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
