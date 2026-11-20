// =====================================================
// Smart Calculator - script.js (Vanilla JavaScript)
// =====================================================

// ---------- 1. Variables that remember the calculator's state ----------
var currentInput = "0";        // the number being typed (kept as text)
var tokens = [];               // finished numbers and operators, e.g. [5, "+", 3, "*"]
var startNewNumber = false;    // true = the next digit starts a brand new number
var lastWasOperator = false;   // true = the last button pressed was an operator
var previousCalculation = "";  // text for the small display, e.g. "5 + 3 ="
var errorMessage = "";         // empty text means "no error"
var MAX_DIGITS = 15;           // longest number the user can type

// ---------- 2. Connect to the HTML elements ----------
var mainDisplay = document.getElementById("main-display");
var secondaryDisplay = document.getElementById("secondary-display");
var buttons = document.querySelectorAll(".calc-btn");

// ---------- 3. Functions for each calculator operation ----------
function add(a, b) {
  return a + b;
}

function subtract(a, b) {
  return a - b;
}

function multiply(a, b) {
  return a * b;
}

function divide(a, b) {
  if (b === 0) {
    errorMessage = "Cannot divide by zero";
    return 0;
  }
  return a / b;
}

function modulus(a, b) {
  if (b === 0) {
    errorMessage = "Cannot divide by zero";
    return 0;
  }
  return a % b;
}

function squareRoot(number) {
  if (number < 0) {
    errorMessage = "Invalid input";
    return 0;
  }
  return Math.sqrt(number);
}

// Chooses the correct operation using if/else
function applyOperation(a, operator, b) {
  if (operator === "+") {
    return add(a, b);
  } else if (operator === "-") {
    return subtract(a, b);
  } else if (operator === "*") {
    return multiply(a, b);
  } else if (operator === "/") {
    return divide(a, b);
  } else if (operator === "%") {
    return modulus(a, b);
  }
  return b;
}

// ---------- 4. Calculating a whole expression with precedence ----------
// Pass 1 does * / % first. Pass 2 then does + and - from left to right.
function calculateTokens(list) {
  var afterPass1 = [list[0]];

  // Pass 1: handle multiplication, division and modulus
  for (var i = 1; i < list.length; i += 2) {
    var operator = list[i];
    var nextNumber = list[i + 1];

    if (operator === "*" || operator === "/" || operator === "%") {
      var previousNumber = afterPass1.pop();
      var partialResult = applyOperation(previousNumber, operator, nextNumber);
      if (errorMessage !== "") {
        return 0;
      }
      afterPass1.push(partialResult);
    } else {
      afterPass1.push(operator);
      afterPass1.push(nextNumber);
    }
  }

  // Pass 2: handle addition and subtraction
  var result = afterPass1[0];
  for (var j = 1; j < afterPass1.length; j += 2) {
    result = applyOperation(result, afterPass1[j], afterPass1[j + 1]);
  }
  return result;
}

// ---------- 5. Helper functions for text ----------
// Rounds tiny errors (0.1 + 0.2) and removes extra decimal zeros
function formatNumber(number) {
  var rounded = Number(number.toPrecision(12));
  return String(rounded);
}

function getOperatorSymbol(operator) {
  if (operator === "*") {
    return "\u00D7";
  } else if (operator === "/") {
    return "\u00F7";
  } else if (operator === "-") {
    return "\u2212";
  }
  return operator;
}

// Turns [5, "+", 3] into the text "5 + 3"
function tokensToText(list) {
  var text = "";
  for (var i = 0; i < list.length; i++) {
    if (typeof list[i] === "number") {
      text = text + formatNumber(list[i]) + " ";
    } else {
      text = text + getOperatorSymbol(list[i]) + " ";
    }
  }
  return text.trim();
}

// ---------- 6. Functions that update the display ----------
function updateDisplay() {
  if (errorMessage !== "") {
    mainDisplay.innerText = errorMessage;
    mainDisplay.classList.add("is-error");
  } else {
    mainDisplay.innerText = currentInput;
    mainDisplay.classList.remove("is-error");
  }

  if (tokens.length > 0) {
    secondaryDisplay.innerText = tokensToText(tokens);
  } else {
    secondaryDisplay.innerText = previousCalculation;
  }

  // Use a smaller font for long numbers
  if (mainDisplay.innerText.length > 11) {
    mainDisplay.classList.add("is-long");
  } else {
    mainDisplay.classList.remove("is-long");
  }
}

function resetCalculator() {
  currentInput = "0";
  tokens = [];
  startNewNumber = false;
  lastWasOperator = false;
  previousCalculation = "";
  errorMessage = "";
}

// ---------- 7. Functions that handle each kind of button ----------
function handleNumber(digit) {
  lastWasOperator = false;

  if (startNewNumber) {
    currentInput = digit;
    startNewNumber = false;
    if (tokens.length === 0) {
      previousCalculation = "";   // a new calculation starts
    }
  } else if (currentInput === "0") {
    currentInput = digit;
  } else if (currentInput.length < MAX_DIGITS) {
    currentInput = currentInput + digit;
  }
}

function handleDecimal() {
  lastWasOperator = false;

  if (startNewNumber) {
    currentInput = "0.";
    startNewNumber = false;
    if (tokens.length === 0) {
      previousCalculation = "";
    }
  } else if (currentInput.indexOf(".") === -1) {
    currentInput = currentInput + ".";   // only one decimal point allowed
  }
}

function handleOperator(operator) {
  if (lastWasOperator) {
    // Two operators in a row: replace the old one with the new one
    tokens[tokens.length - 1] = operator;
  } else {
    tokens.push(Number(currentInput));
    tokens.push(operator);
  }
  lastWasOperator = true;
  startNewNumber = true;
}

function handleEquals() {
  if (lastWasOperator) {
    tokens.pop();                       // ignore an unfinished operator like "5 +"
  } else {
    tokens.push(Number(currentInput));
  }

  var expressionText = tokensToText(tokens) + " =";
  var result = calculateTokens(tokens);

  if (errorMessage === "" && !isFinite(result)) {
    errorMessage = "Number too large";
  }

  tokens = [];
  previousCalculation = expressionText;
  startNewNumber = true;
  lastWasOperator = false;

  if (errorMessage !== "") {
    currentInput = "0";
  } else {
    currentInput = formatNumber(result);
  }
}

function handleSquareRoot() {
  if (lastWasOperator) {
    return;   // nothing new has been typed yet
  }

  var result = squareRoot(Number(currentInput));

  if (errorMessage !== "") {
    previousCalculation = "\u221A(" + currentInput + ")";
    tokens = [];
    currentInput = "0";
  } else {
    previousCalculation = "\u221A(" + currentInput + ") =";
    currentInput = formatNumber(result);
  }
  startNewNumber = true;
}

function handlePlusMinus() {
  if (lastWasOperator || currentInput === "0") {
    return;
  }

  if (currentInput.charAt(0) === "-") {
    currentInput = currentInput.slice(1);
  } else {
    currentInput = "-" + currentInput;
  }
}

function handleBackspace() {
  if (startNewNumber) {
    return;   // do not edit a finished result
  }

  currentInput = currentInput.slice(0, -1);
  if (currentInput === "" || currentInput === "-") {
    currentInput = "0";
  }
}

function handleClear() {
  currentInput = "0";       // clears only the current entry
  startNewNumber = false;
}

// ---------- 8. One function decides what to do for any button or key ----------
function handleInput(action, value) {
  if (errorMessage !== "") {
    resetCalculator();   // any button after an error starts fresh
  }

  if (action === "number") {
    handleNumber(value);
  } else if (action === "decimal") {
    handleDecimal();
  } else if (action === "operator") {
    handleOperator(value);
  } else if (action === "equals") {
    handleEquals();
  } else if (action === "sqrt") {
    handleSquareRoot();
  } else if (action === "plusminus") {
    handlePlusMinus();
  } else if (action === "backspace") {
    handleBackspace();
  } else if (action === "clear") {
    handleClear();
  } else if (action === "allclear") {
    resetCalculator();
  }

  updateDisplay();
}

// ---------- 9. Event listeners ----------
function handleButtonClick(event) {
  var button = event.currentTarget;
  handleInput(button.getAttribute("data-action"), button.getAttribute("data-value"));
}

// Loop: give every calculator button a click listener
for (var i = 0; i < buttons.length; i++) {
  buttons[i].addEventListener("click", handleButtonClick);
}

// Bonus: use the computer keyboard too
function handleKeyPress(event) {
  var key = event.key;
  var handled = true;

  if (key >= "0" && key <= "9") {
    handleInput("number", key);
  } else if (key === ".") {
    handleInput("decimal", null);
  } else if (key === "+" || key === "-" || key === "*" || key === "/" || key === "%") {
    handleInput("operator", key);
  } else if (key === "Enter" || key === "=") {
    handleInput("equals", null);
  } else if (key === "Backspace") {
    handleInput("backspace", null);
  } else if (key === "Delete") {
    handleInput("clear", null);
  } else if (key === "Escape") {
    handleInput("allclear", null);
  } else {
    handled = false;
  }

  if (handled) {
    event.preventDefault();
  }
}

document.addEventListener("keydown", handleKeyPress);

// Show the starting display
updateDisplay();
