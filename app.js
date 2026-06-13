const screens = [...document.querySelectorAll(".screen")];
const navButtons = [...document.querySelectorAll(".bottom-nav button")];
const messages = document.querySelector("#messages");
const chatInput = document.querySelector("#chatInput");
const chatForm = document.querySelector("#chatForm");
const quickReplies = document.querySelector("#quickReplies");
const crisisModal = document.querySelector("#crisisModal");
const toast = document.querySelector("#toast");

const crisisPatterns = [
  /не хочу жити/i,
  /хочу померти/i,
  /покінчити з собою/i,
  /вбити себе/i,
  /застрел(ю|итися)/i,
  /нашкодити собі/i,
  /суїцид/i,
  /самогуб/i,
  /убить себя/i,
  /не хочу жить/i,
  /хочу умереть/i,
  /покончу с собой/i,
  /наврежу себе/i
];

const responseRules = [
  {
    pattern: /(тривог|панік|страшно|накрива|серце.*б'ється|сердце.*бьется)/i,
    response: [
      "Я тут. Спершу не треба нічого вирішувати.",
      "Спробуй уперти стопи в підлогу й назвати: 5 речей, які бачиш; 4, яких можеш торкнутися; 3 звуки, які чуєш. Напиши мені одну річ, яку бачиш прямо зараз."
    ]
  },
  {
    pattern: /(не сплю|не можу заснути|безсон|кошмар|сон)/i,
    response: [
      "Схоже, тіло досі не отримало сигналу, що можна послабити готовність.",
      "Не будемо змушувати себе заснути. Що зараз сильніше заважає: думки, спогади, звуки чи напруга в тілі?"
    ]
  },
  {
    pattern: /(злість|злий|лють|бісить|ненавиджу|агрес)/i,
    response: [
      "Твоя злість має причину. Тут її не треба приховувати.",
      "Що сталося безпосередньо перед тим, як напруга різко піднялася?"
    ]
  },
  {
    pattern: /(втратив|загинув|загинула|помер|полон|зник безвісти|горе)/i,
    response: [
      "Мені дуже шкода, що тобі доводиться це нести. Я не буду шукати швидких слів, які нібито все виправлять.",
      "Можеш розповісти про цю людину або про те, що сьогодні болить найбільше. Я послухаю."
    ]
  },
  {
    pattern: /(винен|провина|мав би|могла б|не врятував|не спас)/i,
    response: [
      "Почуття провини після важких подій може звучати дуже переконливо, навіть коли людина діяла в неможливих обставинах.",
      "За що саме ти себе звинувачуєш? Можна написати прямо, без пом'якшень."
    ]
  },
  {
    pattern: /(не знаю|нічого|не можу говорити|мовчи|просто послухай)/i,
    response: [
      "Добре. Я не буду квапити.",
      "Можеш написати уривками, одним словом або навіть крапкою. Я залишаюся поруч."
    ]
  }
];

function goToScreen(id) {
  const target = document.getElementById(id);
  if (!target) return;

  screens.forEach((screen) => screen.classList.toggle("active", screen === target));
  navButtons.forEach((button) => button.classList.toggle("active", button.dataset.go === id));
  window.scrollTo({ top: 0, behavior: "smooth" });

  if (id === "chat") {
    setTimeout(() => chatInput.focus(), 350);
  }
}

document.addEventListener("click", (event) => {
  const navigation = event.target.closest("[data-go]");
  if (navigation) goToScreen(navigation.dataset.go);

  const promptButton = event.target.closest("[data-prompt]");
  if (promptButton) {
    goToScreen("chat");
    setTimeout(() => {
      chatInput.value = promptButton.dataset.prompt;
      resizeInput();
      chatInput.focus();
    }, 420);
  }

  const messageButton = event.target.closest("[data-message]");
  if (messageButton) sendMessage(messageButton.dataset.message);

  if (event.target.closest("[data-open-crisis]")) openCrisis();
});

function addMessage(textParts, sender = "assistant") {
  const row = document.createElement("div");
  row.className = `message-row ${sender}`;

  if (sender === "assistant") {
    const avatar = document.createElement("div");
    avatar.className = "message-avatar";
    avatar.textContent = "П";
    row.append(avatar);
  }

  const bubble = document.createElement("div");
  bubble.className = "message";
  const parts = Array.isArray(textParts) ? textParts : [textParts];
  parts.forEach((part) => {
    const paragraph = document.createElement("p");
    paragraph.textContent = part;
    bubble.append(paragraph);
  });

  const time = document.createElement("time");
  time.textContent = new Intl.DateTimeFormat("uk", { hour: "2-digit", minute: "2-digit" }).format(new Date());
  bubble.append(time);
  row.append(bubble);
  messages.append(row);
  messages.scrollTop = messages.scrollHeight;
}

function showTyping() {
  const row = document.createElement("div");
  row.className = "message-row assistant";
  row.id = "typingRow";
  row.innerHTML = '<div class="message-avatar">П</div><div class="message"><div class="typing"><i></i><i></i><i></i></div></div>';
  messages.append(row);
  messages.scrollTop = messages.scrollHeight;
}

function chooseResponse(text) {
  const match = responseRules.find((rule) => rule.pattern.test(text));
  if (match) return match.response;
  return [
    "Я чую тебе. Схоже, зараз справді непросто.",
    "Що в усьому цьому найбільше тисне саме цієї хвилини?"
  ];
}

function sendMessage(rawText) {
  const text = rawText.trim();
  if (!text) return;

  addMessage(text, "user");
  chatInput.value = "";
  resizeInput();
  quickReplies.hidden = true;

  if (crisisPatterns.some((pattern) => pattern.test(text))) {
    setTimeout(() => {
      addMessage([
        "Дякую, що сказав про це прямо. Зараз важливіше не залишатися наодинці й залучити живу допомогу.",
        "Відійди від зброї або інших небезпечних предметів і поклич когось, хто може фізично бути поруч."
      ]);
      openCrisis();
    }, 350);
    return;
  }

  showTyping();
  const delay = 650 + Math.random() * 450;
  setTimeout(() => {
    document.querySelector("#typingRow")?.remove();
    addMessage(chooseResponse(text));
  }, delay);
}

chatForm.addEventListener("submit", (event) => {
  event.preventDefault();
  sendMessage(chatInput.value);
});

chatInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    chatForm.requestSubmit();
  }
});

chatInput.addEventListener("input", resizeInput);

function resizeInput() {
  chatInput.style.height = "auto";
  chatInput.style.height = `${Math.min(chatInput.scrollHeight, 140)}px`;
}

document.querySelector("#clearChat").addEventListener("click", () => {
  messages.innerHTML = `
    <div class="message-row assistant">
      <div class="message-avatar">П</div>
      <div class="message">
        <p>Розмову очищено. Можемо почати заново.</p>
        <p>Що зараз із тобою?</p>
        <time>зараз</time>
      </div>
    </div>`;
  quickReplies.hidden = false;
  showToast("Розмову видалено з цього пристрою");
});

function openCrisis() {
  crisisModal.hidden = false;
  document.body.style.overflow = "hidden";
  document.querySelector("#closeCrisis").focus();
}

function closeCrisis() {
  crisisModal.hidden = true;
  document.body.style.overflow = "";
}

document.querySelector("#closeCrisis").addEventListener("click", closeCrisis);
document.querySelector("#stayInChat").addEventListener("click", () => {
  closeCrisis();
  goToScreen("chat");
});
crisisModal.addEventListener("click", (event) => {
  if (event.target === crisisModal) closeCrisis();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !crisisModal.hidden) closeCrisis();
});

document.querySelector("#privacyButton").addEventListener("click", () => {
  showToast("Історія чату не зберігається");
});

function showToast(text) {
  toast.textContent = text;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("show"), 2400);
}
