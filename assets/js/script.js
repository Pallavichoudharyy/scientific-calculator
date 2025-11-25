const display = document.getElementById("display");
const subdisplay = document.getElementById("subdisplay");

let expression = "";

/* ----------------------------------------------------
   PRESS BUTTON (Add to expression)
---------------------------------------------------- */
function press(value) {
  expression += value;
  display.value = expression;
}

/* ----------------------------------------------------
   CLEAR DISPLAY
---------------------------------------------------- */
function clearDisplay() {
  expression = "";
  display.value = "";
  subdisplay.textContent = "";
}

/* ----------------------------------------------------
   BACKSPACE
---------------------------------------------------- */
function backspace() {
  expression = expression.slice(0, -1);
  display.value = expression;
}

/* ----------------------------------------------------
   CALCULATE EXPRESSION
---------------------------------------------------- */
function calculate() {
  if (!expression) return;

  try {
    // Add closing parentheses automatically
    let openBrackets = (expression.match(/\(/g) || []).length;
    let closeBrackets = (expression.match(/\)/g) || []).length;

    if (openBrackets > closeBrackets) {
      expression += ")".repeat(openBrackets - closeBrackets);
    }

    // Replace log10 -> Math.log10
    expression = expression.replace(/(^|[^a-zA-Z])log\(/g, "$1Math.log10(");

    // % operator logic: convert "a%b" → "(a/100)*b"
    expression = expression.replace(/(\d+)%(\d+)/g, "($1/100*$2)");

    let result = eval(expression);

    subdisplay.textContent = expression;
    display.value = result;

    expression = String(result);

  } catch (error) {
    display.value = "Error";
    expression = "";
  }
}

/* ----------------------------------------------------
   THEME TOGGLE
---------------------------------------------------- */
function toggleTheme() {
  const root = document.documentElement;

  let darkMode = getComputedStyle(root).getPropertyValue("--bg").trim() === "#0d0d0d";

  if (darkMode) {
    // Switch to LIGHT MODE
    root.style.setProperty("--bg", "#f2f2f2");
    root.style.setProperty("--card", "#ffffff");
    root.style.setProperty("--white", "#000000");

    root.style.setProperty("--number-bg", "#e5e5e5");
    root.style.setProperty("--number-hover", "#d1d1d1");

    root.style.setProperty("--shadow", "rgba(0,0,0,0.15)");
    root.style.setProperty("--glass", "rgba(0,0,0,0.05)");
  } else {
    // Switch to DARK MODE (original values)
    root.style.setProperty("--bg", "#0d0d0d");
    root.style.setProperty("--card", "#141414");
    root.style.setProperty("--white", "#ffffff");

    root.style.setProperty("--number-bg", "#1f1f1f");
    root.style.setProperty("--number-hover", "#2a2a2a");

    root.style.setProperty("--shadow", "rgba(0,0,0,0.45)");
    root.style.setProperty("--glass", "rgba(255,255,255,0.05)");
  }
}

/* ----------------------------------------------------
   OPTIONAL: KEYBOARD SUPPORT
---------------------------------------------------- */
document.addEventListener("keydown", (e) => {
  const key = e.key;

  if (!isNaN(key) || "+-*/().".includes(key)) {
    press(key);
  }

  if (key === "Enter") calculate();
  if (key === "Backspace") backspace();
  if (key === "Escape") clearDisplay();
});
