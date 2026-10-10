/* ================== ДАНІ ================== */

const PRODUCTS = [
  {
    id:1,
    name:"AIMBOT.X",
    game:"CS:GO 2",
    price:150,
    icon:"⌖",
    tag:"HOT",
    desc:"Автоматичне наведення з точністю 99.7%. Headshots гарантовано."
  },
  {
    id:2,
    name:"WALLHACK_PRO",
    game:"Valorant",
    price:120,
    icon:"◫",
    tag:"",
    desc:"Бачте ворогів крізь стіни. ESP-режим із підсвічуванням."
  },
  {
    id:3,
    name:"SPEED_GLITCH",
    game:"GTA VI Online",
    price:80,
    icon:"⚡",
    tag:"",
    desc:"Переміщення зі швидкістю світла. Анти-кік захист включено."
  },
  {
    id:4,
    name:"LOOT_HARVESTER",
    game:"Escape Tarkov",
    price:200,
    icon:"⛏",
    tag:"NEW",
    desc:"Автоматичний збут луту. Радар цінностей у реальному часі."
  },
  {
    id:5,
    name:"GHOST_MODE",
    game:"Fortnite",
    price:95,
    icon:"👁",
    tag:"",
    desc:"Невидимість для противників. Обхід replay-системи."
  },
  {
    id:6,
    name:"NO_RECOIL_CORE",
    game:"Apex Legends",
    price:60,
    icon:"✛",
    tag:"",
    desc:"Нульова віддача на всіх типах зброї. Ідеальний spray control."
  },
  {
    id:7,
    name:"RADAR_OVERRIDE",
    game:"PUBG",
    price:110,
    icon:"◎",
    tag:"",
    desc:"Повний радар з позиціями всіх гравців на мапі."
  },
  {
    id:8,
    name:"XP_MULTIPLIER",
    game:"Універсальний",
    price:45,
    icon:"✕",
    tag:"SALE",
    desc:"x10 досвіду та прокачки на будь-якій грі. Сумісність 98%."
  }
];


/* ================== LOCAL STORAGE ================== */

const store = {

  get(key, fallback){

    try{

      const v = localStorage.getItem(key);

      return v === null
        ? fallback
        : JSON.parse(v);

    }catch(e){

      return fallback;

    }

  },

  set(key, val){

    try{

      localStorage.setItem(
        key,
        JSON.stringify(val)
      );

    }catch(e){}

  }

};


let balance =
  store.get("nexus_balance", 0);

let cart =
  store.get("nexus_cart", {});

let wheelData =
  store.get(
    "nexus_wheel",
    {
      lastSpin:0,
      rotation:0
    }
  );


/* ================== TOAST ================== */

function toast(msg, type){

  type = type || "";

  const box =
    document.getElementById("toasts");

  const el =
    document.createElement("div");

  el.className =
    "toast " + type;

  el.textContent = msg;

  box.appendChild(el);

  setTimeout(function(){

    el.classList.add("out");

    setTimeout(function(){

      el.remove();

    },350);

  },3200);

}


/* ================== БАЛАНС ================== */

function updateBalanceUI(){

  const el =
    document.getElementById("balanceValue");

  el.textContent = balance;

  el.style.textShadow =
    "0 0 10px rgba(0,255,65,.9)";

  setTimeout(function(){

    el.style.textShadow = "none";

  },400);

}


function addCoins(amount){

  balance += amount;

  store.set(
    "nexus_balance",
    balance
  );

  updateBalanceUI();

}


/* ================== КАТАЛОГ ================== */

function renderProducts(){

  const grid =
    document.getElementById("productsGrid");

  grid.innerHTML = "";

  PRODUCTS.forEach(function(p){

    const card =
      document.createElement("div");

    card.className = "product";

    card.innerHTML =

      (p.tag
        ? '<span class="tag">' +
          p.tag +
          '</span>'
        : '') +

      '<div class="icon">' +
        p.icon +
      '</div>' +

      '<h3>' +
        p.name +
      '</h3>' +

      '<div class="game">' +
        '// ' +
        p.game +
      '</div>' +

      '<div class="desc">' +
        p.desc +
      '</div>' +

      '<div class="price">' +
        p.price +
        ' <small>🪙 монет</small>' +
      '</div>' +

      '<button data-id="' +
        p.id +
      '">' +
        '[ ДОДАТИ ДО КОШИКА ]' +
      '</button>';

    const btn =
      card.querySelector("button");

    btn.addEventListener(
      "click",
      function(){

        addToCart(p.id);

        btn.textContent =
          "[ ✓ ДОДАНО ]";

        btn.classList.add("added");

        setTimeout(function(){

          btn.textContent =
            "[ ДОДАТИ ДО КОШИКА ]";

          btn.classList.remove("added");

        },900);

      }
    );

    grid.appendChild(card);

  });

}


/* ================== КОШИК ================== */

function cartItemCount(){

  return Object.values(cart)
    .reduce(function(a,b){

      return a + b;

    },0);

}


function cartTotal(){

  return Object.keys(cart)
    .reduce(function(sum,id){

      const p =
        PRODUCTS.find(function(x){

          return x.id == id;

        });

      return sum +
        (p
          ? p.price * cart[id]
          : 0);

    },0);

}


function addToCart(id){

  cart[id] =
    (cart[id] || 0) + 1;

  store.set(
    "nexus_cart",
    cart
  );

  updateCartUI();

  const p =
    PRODUCTS.find(function(x){

      return x.id == id;

    });

  toast(
    "> " +
    p.name +
    " додано до кошика"
  );

}


function changeQty(id, delta){

  cart[id] =
    (cart[id] || 0) + delta;

  if(cart[id] <= 0){

    delete cart[id];

  }

  store.set(
    "nexus_cart",
    cart
  );

  updateCartUI();

}


function removeFromCart(id){

  delete cart[id];

  store.set(
    "nexus_cart",
    cart
  );

  updateCartUI();

  toast(
    "> Товар видалено з кошика"
  );

}


function updateCartUI(){

  document.getElementById(
    "cartCount"
  ).textContent =
    cartItemCount();

  document.getElementById(
    "cartTotal"
  ).textContent =
    cartTotal() + " 🪙";

  const box =
    document.getElementById(
      "cartItems"
    );

  box.innerHTML = "";

  const ids =
    Object.keys(cart);

  if(ids.length === 0){

    box.innerHTML =
      '<div class="cart-empty">' +
      '// кошик порожній. час щось зламати...' +
      '<br><br>' +
      '[ іди до магазину ]' +
      '</div>';

    return;

  }

  ids.forEach(function(id){

    const p =
      PRODUCTS.find(function(x){

        return x.id == id;

      });

    if(!p) return;

    const qty =
      cart[id];

    const item =
      document.createElement("div");

    item.className =
      "cart-item";

    item.innerHTML =

      '<div class="ci-info">' +

        '<div class="ci-name">' +
          p.icon +
          ' ' +
          p.name +
        '</div>' +

        '<div class="ci-price">' +
          p.price +
          ' 🪙 × ' +
          qty +
          ' = ' +
          (p.price * qty) +
          ' 🪙' +
        '</div>' +

      '</div>' +

      '<div class="qty-controls">' +

        '<button data-act="minus">' +
          '−' +
        '</button>' +

        '<span class="qty">' +
          qty +
        '</span>' +

        '<button data-act="plus">' +
          '+' +
        '</button>' +

      '</div>' +

      '<button class="ci-remove" data-act="del">' +
        '✕' +
      '</button>';


    item
      .querySelector('[data-act="minus"]')
      .addEventListener(
        "click",
        function(){

          changeQty(id,-1);

        }
      );


    item
      .querySelector('[data-act="plus"]')
      .addEventListener(
        "click",
        function(){

          changeQty(id,1);

        }
      );


    item
      .querySelector('[data-act="del"]')
      .addEventListener(
        "click",
        function(){

          removeFromCart(id);

        }
      );


    box.appendChild(item);

  });

}


function openCart(){

  document
    .getElementById("cartOverlay")
    .classList.add("open");

}


function closeCart(){

  document
    .getElementById("cartOverlay")
    .classList.remove("open");

}


/* ================== КНОПКИ КОШИКА ================== */

document
  .getElementById("openCartBtn")
  .addEventListener(
    "click",
    openCart
  );


document
  .getElementById("closeCartBtn")
  .addEventListener(
    "click",
    closeCart
  );


document
  .getElementById("cartOverlay")
  .addEventListener(
    "click",
    function(e){

      if(e.target === e.currentTarget){

        closeCart();

      }

    }
  );


document.addEventListener(
  "keydown",
  function(e){

    if(e.key === "Escape"){

      closeCart();

    }

  }
);


/* ================== ОПЛАТА ================== */

document
  .getElementById("checkoutBtn")
  .addEventListener(
    "click",
    function(){

      const total =
        cartTotal();

      if(total === 0){

        toast(
          "> Кошик порожній!",
          "error"
        );

        return;

      }


      if(balance < total){

        toast(
          "> Недостатньо монет! Потрібно " +
          total +
          " 🪙, у вас " +
          balance +
          " 🪙. Крутіть колесо!",
          "error"
        );

        return;

      }


      balance -= total;

      store.set(
        "nexus_balance",
        balance
      );

      cart = {};

      store.set(
        "nexus_cart",
        cart
      );

      updateCartUI();

      updateBalanceUI();

      closeCart();

      toast(
        "> ✓ ЗАМОВЛЕННЯ ОФОРМЛЕНО! Чіти надіслано на ваш термінал."
      );

    }
  );


/* ================== КОЛЕСО ================== */

const WHEEL_SECTORS =
  [0,5,10,15,20,50,75,100];

const SPIN_COOLDOWN =
  10000;


const canvas =
  document.getElementById(
    "wheelCanvas"
  );

const ctx =
  canvas.getContext("2d");

const spinBtn =
  document.getElementById(
    "spinBtn"
  );

const cooldownText =
  document.getElementById(
    "cooldownText"
  );

const wheelResult =
  document.getElementById(
    "wheelResult"
  );

let spinning = false;


/* ================== МАЛЮВАННЯ КОЛЕСА ================== */

function drawWheel(){

  const n =
    WHEEL_SECTORS.length;

  const size =
    canvas.width;

  const cx =
    size / 2;

  const cy =
    size / 2;

  const r =
    size / 2 - 8;

  const angle =
    (Math.PI * 2) / n;

  ctx.clearRect(
    0,
    0,
    size,
    size
  );


  for(let i = 0; i < n; i++){

    ctx.beginPath();

    ctx.moveTo(cx,cy);

    ctx.arc(
      cx,
      cy,
      r,
      i * angle - Math.PI / 2,
      (i + 1) * angle - Math.PI / 2
    );

    ctx.closePath();

    ctx.fillStyle =
      i % 2 === 0
        ? "#0d2b0d"
        : "#143a14";

    ctx.fill();

    ctx.strokeStyle =
      "#00ff41";

    ctx.lineWidth = 2;

    ctx.stroke();


    const mid =
      i * angle +
      angle / 2 -
      Math.PI / 2;


    ctx.save();

    ctx.translate(
      cx +
      Math.cos(mid) * r * 0.60,

      cy +
      Math.sin(mid) * r * 0.60
    );

    ctx.rotate(
      mid + Math.PI / 2
    );

    ctx.fillStyle =
      WHEEL_SECTORS[i] >= 50
        ? "#ff2b2b"
        : "#00ff41";

    ctx.font =
      "bold 46px 'Share Tech Mono', monospace";

    ctx.textAlign =
      "center";

    ctx.textBaseline =
      "middle";

    ctx.shadowColor =
      ctx.fillStyle;

    ctx.shadowBlur = 14;

    ctx.fillText(
      String(WHEEL_SECTORS[i]),
      0,
      0
    );

    ctx.restore();

  }


  ctx.beginPath();

  ctx.arc(
    cx,
    cy,
    r,
    0,
    Math.PI * 2
  );

  ctx.strokeStyle =
    "#00ff41";

  ctx.lineWidth = 6;

  ctx.stroke();

}


/* ================== COOLDOWN ================== */

function remainingCooldown(){

  return Math.max(
    0,
    SPIN_COOLDOWN -
    (Date.now() -
      wheelData.lastSpin)
  );

}


function updateCooldownUI(){

  if(spinning) return;

  const rem =
    remainingCooldown();

  if(rem > 0){

    spinBtn.disabled = true;

    cooldownText.textContent =
      "// повторний спін через " +
      Math.ceil(rem / 1000) +
      " с...";

  }else{

    spinBtn.disabled = false;

    cooldownText.textContent = "";

  }

}


setInterval(
  updateCooldownUI,
  250
);


/* ================== SPIN ================== */

spinBtn.addEventListener(
  "click",
  function(){

    if(
      spinning ||
      remainingCooldown() > 0
    ){

      return;

    }

    spinning = true;

    spinBtn.disabled = true;

    wheelResult.textContent = "";

    cooldownText.textContent =
      "// обертання...";


    const weights =
      [25,20,18,14,10,7,4,2];

    let rnd =
      Math.random() *
      weights.reduce(
        function(a,b){
          return a + b;
        },
        0
      );

    let idx = 0;


    for(
      let i = 0;
      i < weights.length;
      i++
    ){

      rnd -= weights[i];

      if(rnd <= 0){

        idx = i;

        break;

      }

    }


    const n =
      WHEEL_SECTORS.length;

    const sectorAngle =
      360 / n;


    const current =
      (
        (wheelData.rotation % 360) +
        360
      ) % 360;


    const targetMod =
      (
        360 -
        idx * sectorAngle -
        sectorAngle / 2
      ) % 360;


    let delta =
      targetMod - current;


    if(delta < 180){

      delta += 360;

    }


    const newRotation =
      wheelData.rotation +
      360 * 6 +
      delta;


    canvas.style.transform =
      "rotate(" +
      newRotation +
      "deg)";


    wheelData.rotation =
      newRotation;

    wheelData.lastSpin =
      Date.now();


    store.set(
      "nexus_wheel",
      wheelData
    );


    setTimeout(
      function(){

        const won =
          WHEEL_SECTORS[idx];

        addCoins(won);


        if(won > 0){

          wheelResult.textContent =
            ">> ВИГРАШ: +" +
            won +
            " МОНЕТ <<";

          toast(
            "> Колесо фортуни: +" +
            won +
            " 🪙"
          );

        }else{

          wheelResult.textContent =
            ">> ПУСТО. СПРОБУЙ ЩЕ. <<";

          toast(
            "> Випало 0 монет. Фортуна буває жорстокою...",
            "error"
          );

        }


        spinning = false;

        updateCooldownUI();

      },
      4600
    );

  }
);


/* ================== ІНІЦІАЛІЗАЦІЯ КОЛЕСА ================== */

drawWheel();

canvas.style.transform =
  "rotate(" +
  (wheelData.rotation || 0) +
  "deg)";


/* ================== ДОНАТ ================== */

document
  .getElementById("donateBtn")
  .addEventListener(
    "click",
    function(){

      toast(
        "> Дякуємо за підтримку! Це демонстраційна кнопка, реальні гроші не списуються."
      );

    }
  );


/* ================== ЕФЕКТ ДРУКУ ================== */

const typedTexts = [

  "> ініціалізація протоколу доступу...",

  "> взлом ігрової матриці: 100%",

  "> ласкаво просимо до NEXUS_CHEATS",

  "> обирай. купуй. перемагай."

];


let tIdx = 0;
let cIdx = 0;
let deleting = false;


function typeLoop(){

  const el =
    document.getElementById(
      "typedLine"
    );

  const full =
    typedTexts[tIdx];


  if(!deleting){

    cIdx++;

    el.textContent =
      full.slice(0,cIdx);


    if(cIdx === full.length){

      deleting = true;

      setTimeout(
        typeLoop,
        1800
      );

      return;

    }


    setTimeout(
      typeLoop,
      45 + Math.random() * 50
    );


  }else{

    cIdx--;

    el.textContent =
      full.slice(0,cIdx);


    if(cIdx === 0){

      deleting = false;

      tIdx =
        (tIdx + 1) %
        typedTexts.length;

    }


    setTimeout(
      typeLoop,
      22
    );

  }

}


typeLoop();


/* ================== МОБІЛЬНЕ МЕНЮ ================== */

const burger =
  document.getElementById(
    "burgerBtn"
  );

const mobileMenu =
  document.getElementById(
    "mobileMenu"
  );


burger.addEventListener(
  "click",
  function(){

    mobileMenu.classList.toggle(
      "open"
    );

    burger.textContent =
      mobileMenu.classList.contains("open")
        ? "✕"
        : "☰";

  }
);


const menuLinks =
  mobileMenu.querySelectorAll("a");


for(
  let i = 0;
  i < menuLinks.length;
  i++
){

  menuLinks[i].addEventListener(
    "click",
    function(){

      mobileMenu.classList.remove(
        "open"
      );

      burger.textContent =
        "☰";

    }
  );

}


/* ================== ЗАПУСК ================== */

renderProducts();

updateCartUI();

updateBalanceUI();

updateCooldownUI();