const screens = [...document.querySelectorAll(".screen")];
const navButtons = [...document.querySelectorAll(".bottom-nav button")];
const messages = document.querySelector("#messages");
const chatInput = document.querySelector("#chatInput");
const chatForm = document.querySelector("#chatForm");
const quickReplies = document.querySelector("#quickReplies");
const crisisModal = document.querySelector("#crisisModal");
const exerciseModal = document.querySelector("#exerciseModal");
const toast = document.querySelector("#toast");
const exerciseTitle = document.querySelector("#exerciseModalTitle");
const exerciseInstruction = document.querySelector("#exerciseInstruction");
const exerciseCounter = document.querySelector("#exerciseCounter");
const exerciseProgress = document.querySelector("#exerciseProgress");
const exerciseVisual = document.querySelector("#exerciseVisual");
const exerciseVisualText = document.querySelector("#exerciseVisualText");
const exerciseNext = document.querySelector("#exerciseNext");
const exerciseBack = document.querySelector("#exerciseBack");

const exercises = {
  grounding: {
    title: "Заземлення 5–4–3–2–1",
    steps: [
      ["5 речей, які бачиш", "Повільно озирнися і назви п’ять предметів. Колір, форма, відстань — будь-яка деталь.", "5"],
      ["4 відчуття тіла", "Назви чотири відчуття: стопи в черевиках, спина на опорі, тканина на шкірі, температура повітря.", "4"],
      ["3 звуки, які чуєш", "Прислухайся до трьох звуків — близьких або далеких. Не треба вгадувати їх джерело.", "3"],
      ["2 запахи", "Назви два запахи. Якщо не відчуваєш — згадай два знайомі безпечні запахи.", "2"],
      ["1 смак або повільний видих", "Поміть смак у роті або зроби один звичайний вдих і м’який довший видих.", "1"]
    ]
  },
  release: {
    title: "Опора для тіла",
    steps: [
      ["Відчуй стопи", "Постав обидві стопи на поверхню. Не тисни сильно — просто поміть, що вона тебе тримає.", "↧"],
      ["Натисни й відпусти", "Легко притисни стопи до підлоги на 5 секунд, потім повністю відпусти. Без болю.", "5"],
      ["Опусти плечі", "Дозволь плечам опуститися на кілька міліметрів. Розтисни щелепу й долоні.", "↓"],
      ["Озирнися", "Знайди очима двері або вихід, джерело світла і один нерухомий предмет.", "⌖"]
    ]
  },
  orienting: {
    title: "Я тут, зараз",
    steps: [
      ["Назви місце", "Скажи подумки або вголос: «Я зараз у…». Назви місто, кімнату чи інше безпечне для тебе місце.", "1"],
      ["Назви час", "Назви сьогоднішню дату або хоча б рік, пору доби й день тижня.", "2"],
      ["Знайди відмінності", "Назви три ознаки, які показують, що це теперішній момент, а не спогад.", "3"],
      ["Обери наступну дію", "Що допоможе в найближчі 5 хвилин: вода, світло, свіже повітря чи людина поруч?", "→"]
    ]
  }
};

let activeExercise = null;
let exerciseStep = 0;
let breathingTimer = null;
let breathingCycles = 0;

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

  const exerciseButton = event.target.closest("[data-exercise]");
  if (exerciseButton) openExercise(exerciseButton.dataset.exercise);
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

function openExercise(name) {
  activeExercise = name;
  exerciseStep = 0;
  breathingCycles = 0;
  exerciseModal.hidden = false;
  document.body.style.overflow = "hidden";
  renderExercise();
  document.querySelector("#closeExercise").focus();
}

function closeExercise() {
  clearTimeout(breathingTimer);
  breathingTimer = null;
  activeExercise = null;
  exerciseModal.hidden = true;
  document.body.style.overflow = "";
  exerciseVisual.className = "exercise-visual";
}

function renderExercise() {
  clearTimeout(breathingTimer);
  exerciseVisual.className = "exercise-visual";

  if (activeExercise === "breathing") {
    exerciseTitle.textContent = "Повільний видих";
    exerciseProgress.style.width = `${Math.min((breathingCycles / 6) * 100, 100)}%`;
    exerciseBack.disabled = true;
    exerciseNext.textContent = breathingCycles >= 6 ? "Завершити" : "Пропустити цикл";
    runBreathingPhase("in");
    return;
  }

  const exercise = exercises[activeExercise];
  const [heading, instruction, symbol] = exercise.steps[exerciseStep];
  exerciseTitle.textContent = exercise.title;
  exerciseInstruction.textContent = `${heading}. ${instruction}`;
  exerciseCounter.textContent = `Крок ${exerciseStep + 1} з ${exercise.steps.length}`;
  exerciseVisualText.textContent = symbol;
  exerciseProgress.style.width = `${((exerciseStep + 1) / exercise.steps.length) * 100}%`;
  exerciseBack.disabled = exerciseStep === 0;
  exerciseNext.innerHTML = exerciseStep === exercise.steps.length - 1 ? "Завершити" : "Далі <span>→</span>";
}

function runBreathingPhase(phase) {
  const duration = phase === "in" ? 4 : 6;
  exerciseInstruction.textContent = phase === "in"
    ? "М’яко вдихай носом. Не намагайся набрати якомога більше повітря."
    : "Повільно видихай через злегка стиснуті губи. Нехай видих буде довшим.";
  exerciseVisualText.textContent = phase === "in" ? "Вдих" : "Видих";
  exerciseVisual.className = `exercise-visual ${phase === "in" ? "breathe-in" : "breathe-out"}`;

  let seconds = duration;
  exerciseCounter.textContent = `${seconds} с · цикл ${Math.min(breathingCycles + 1, 6)} з 6`;
  const tick = () => {
    seconds -= 1;
    if (seconds > 0) {
      exerciseCounter.textContent = `${seconds} с · цикл ${Math.min(breathingCycles + 1, 6)} з 6`;
      breathingTimer = setTimeout(tick, 1000);
      return;
    }

    if (phase === "in") {
      exerciseVisual.className = "exercise-visual";
      void exerciseVisual.offsetWidth;
      runBreathingPhase("out");
    } else {
      breathingCycles += 1;
      exerciseProgress.style.width = `${Math.min((breathingCycles / 6) * 100, 100)}%`;
      if (breathingCycles >= 6) {
        exerciseInstruction.textContent = "Готово. Повернись до звичайного дихання й поміть, чи змінилася інтенсивність стану хоча б трохи.";
        exerciseCounter.textContent = "6 циклів завершено";
        exerciseVisualText.textContent = "✓";
        exerciseVisual.className = "exercise-visual";
        exerciseNext.textContent = "Завершити";
      } else {
        exerciseVisual.className = "exercise-visual";
        void exerciseVisual.offsetWidth;
        runBreathingPhase("in");
      }
    }
  };
  breathingTimer = setTimeout(tick, 1000);
}

exerciseNext.addEventListener("click", () => {
  if (!activeExercise) return;

  if (activeExercise === "breathing") {
    if (breathingCycles >= 6) closeExercise();
    else {
      clearTimeout(breathingTimer);
      breathingCycles += 1;
      if (breathingCycles >= 6) {
        renderExercise();
      } else {
        renderExercise();
      }
    }
    return;
  }

  const steps = exercises[activeExercise].steps;
  if (exerciseStep >= steps.length - 1) {
    closeExercise();
    showToast("Вправу завершено. Поміть, як ти зараз");
  } else {
    exerciseStep += 1;
    renderExercise();
  }
});

exerciseBack.addEventListener("click", () => {
  if (!activeExercise) return;

  if (activeExercise !== "breathing" && exerciseStep > 0) {
    exerciseStep -= 1;
    renderExercise();
  }
});

document.querySelector("#closeExercise").addEventListener("click", closeExercise);
document.querySelector("#exerciseStop").addEventListener("click", closeExercise);
exerciseModal.addEventListener("click", (event) => {
  if (event.target === exerciseModal) closeExercise();
});

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
  if (event.key === "Escape" && !exerciseModal.hidden) closeExercise();
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
