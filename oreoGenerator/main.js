function generateOreo(arr) {
  var card = document.createElement("div");
  card.className = "oreo-card";
  var cardBody = document.createElement("div");
  cardBody.className = "card-body";
  var biscuitCount = 0;
  for (var i = 0; i < arr.length; i++) {
    if (i == arr.length - 1 && arr[i] === "O") {
      cardBody.innerHTML += `<img
                src="./imgs/oreobottom.png"
                class="oreo-bottom"
                alt="bottom"
                style="z-index:${arr.length - i}"
                draggable="false"
              />`;
    } else if (arr[i] === "O") {
      if (biscuitCount % 2 == 0) {
        cardBody.innerHTML += `<img src="./imgs/oreotop.png" class="oreo-top" alt="top" style="z-index:${
          arr.length - i
        }" draggable="false"/>`;
      } else {
        cardBody.innerHTML += `<img
                src="./imgs/oreobottom.png"
                class="oreo-bottom"
                alt="bottom"
                style="z-index:${arr.length - i}"
                draggable="false"
              />`;
      }
      biscuitCount++;
    } else if (arr[i] === "RE") {
      cardBody.innerHTML += `<img src="./imgs/oreocream.png" class="oreo-cream" alt="cream"  style="z-index:${
        arr.length - i
      }" draggable="false"/>`;
    } else if (arr[i] === "&") {
      cardBody.innerHTML += `<div class="oreo-empty"></div>`;
    }
  }
  card.appendChild(cardBody);
  card.innerHTML += `<h1 class="card-title">${arr.join("")}</h1>`;
  document.querySelector(".card-area").appendChild(card);
}

document.getElementById("input-form").addEventListener("submit", event => {
  event.preventDefault();
  var s = document.getElementById("oreostr").value;
  var oreoArr = [];
  var flag = 0;
  s = s.toUpperCase();
  if (s === "") {
    flag = 1;
  }
  for (var i = 0; i < s.length; i++) {
    if (!(s[i] === "O" || s[i] === "R" || s[i] === "E" || s[i] === "&")) {
      flag = 1;
      break;
    } else if (s[i] === "O") {
      oreoArr.push("O");
    } else if (s[i] === "&") {
      oreoArr.push("&");
    } else if (s[i] === "R" && s[i + 1] === "E") {
      oreoArr.push("RE");
      i++;
    } else {
      flag = 1;
      break;
    }
  }
  if (!flag) {
    generateOreo(oreoArr);
  } else {
    window.alert("Enter Valid OREO Input");
  }
});
