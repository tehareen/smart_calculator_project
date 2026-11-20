# Smart Calculator – Guide

## 1. Testing Checklist

I could not run the code in a browser, so **nothing below is marked as passed**. Open `index.html`, try each test, and fill in the "Actual" column yourself.

| # | Test (press in order) | Expected | Actual | Pass? |
|---|---|---|---|---|
| 1 | 10 + 5 = | 15 | | |
| 2 | 20 − 8 = | 12 | | |
| 3 | 6 × 7 = | 42 | | |
| 4 | 20 ÷ 4 = | 5 | | |
| 5 | 10 % 3 = | 1 | | |
| 6 | 25 then √ | 5 | | |
| 7 | 2.5 + 3.5 = | 6 (not 6.0) | | |
| 8 | 10 ÷ 0 = | "Cannot divide by zero" | | |
| 9 | 5 + 3 × 2 = | 11 | | |
| 10 | 0.1 + 0.2 = | 0.3 | | |
| 11 | 9 then +/− then √ | "Invalid input" | | |
| 12 | Type 7, 8, 9 then AC | Display 0, small display empty | | |
| 13 | 5 + 3 then C then 4 = | 9 (C cleared only the 3) | | |
| 14 | Type 123 then ⌫ | 12 | | |
| 15 | Type 1 . 2 . 3 | 1.23 (second dot ignored) | | |
| 16 | 5 then +/− | −5; press again → 5 | | |
| 17 | 5 + × 3 = | 15 (× replaced +) | | |
| 18 | 2 + 3 = then 4 | Display 4 (starts new number) | | |
| 19 | After an error, press 5 | Display 5 (error cleared) | | |
| 20 | Resize browser / use phone view (DevTools → F12 → device icon) | No sideways scroll, buttons usable | | |

## 2. GitHub Upload Instructions

1. **Create folder** `smart-calculator` on your computer and save `index.html`, `style.css`, `script.js`, `README.md` inside it.
2. **Open in VS Code:** File → Open Folder → choose `smart-calculator`.
3. **Run in browser:** right-click `index.html` → "Open with Live Server" (install the *Live Server* extension), or just double-click the file.
4. **Create a repository:** log in to github.com → click **+** (top right) → **New repository** → name it `smart-calculator` → keep it Public → click **Create repository**.
5. **Upload files:** on the new repository page click **uploading an existing file**, drag the 4 project files (not the folder itself) into the page, write a message like "Add Smart Calculator", and click **Commit changes**.

## 3. Netlify Deployment Instructions

1. Go to netlify.com and sign up with your GitHub account.
2. Click **Add new site → Import an existing project → Deploy with GitHub** and allow access.
3. Choose your `smart-calculator` repository.
4. Leave **Build command** empty and set **Publish directory** to `.` (or leave it blank). There is no build step.
5. Click **Deploy**. After about a minute your site is live.
6. Copy the URL shown (like `https://something.netlify.app`). You can rename it under **Site configuration → Change site name**.
7. **Check the live site:** open the URL on your laptop and your phone and repeat the checklist above. Paste the URL into your README.

## 4. How the Project Works (for beginners)

- **HTML** builds the skeleton: the title, the two displays and every button. Each button has `data-action` and `data-value` attributes that tell JavaScript what it does.
- **CSS** adds the look: the gradient background, rounded buttons, colours, hover/click effects and the CSS Grid that arranges the keys in 4 columns.
- **Bootstrap** is loaded from a CDN link. We use its `container`, `row`, `col-*` classes for the responsive layout and `d-flex`, `min-vh-100`, `align-items-center` to centre the calculator. We also add the `btn` class to buttons.
- **Vanilla JavaScript** means plain JavaScript with no frameworks or libraries.
- **Event listeners:** `addEventListener("click", handleButtonClick)` tells the browser "run this function when this button is clicked". The `event` it receives tells us which button was pressed.
- **Multiple functions:** each job has its own function (`add`, `divide`, `handleNumber`, `updateDisplay`…). That makes code short, reusable and easy to explain.
- **Loops:** a `for` loop attaches a listener to every button (`script.js`, section 9). Another `for` loop in `calculateTokens` walks through the expression, and one in `tokensToText` builds the small-display text.
- **if/else:** `handleInput` uses if/else to choose which function to run, and `applyOperation` uses it to choose the maths operator. Other ifs catch errors.
- **innerText:** `mainDisplay.innerText = currentInput;` replaces the text shown on the screen.
- **Maths:** numbers and operators are stored in the `tokens` list, e.g. `[5, "+", 3, "*", 2]`. Pass 1 solves `* / %`, pass 2 solves `+ -`, which gives correct precedence (5 + 6 = 11).
- **Decimals:** the number being typed is kept as text, so `"2.5"` is possible. `indexOf(".")` blocks a second dot. `toPrecision(12)` removes floating-point noise such as `0.30000000000000004`, and converting back with `Number()` removes useless zeros.
- **Errors:** division and modulus by zero, and square root of a negative number, set `errorMessage`. `updateDisplay` shows it in red. Pressing any button afterwards clears it, so the calculator never crashes.
- **How the files work together:** `index.html` loads Bootstrap and `style.css` for looks, and `script.js` last. The script finds the elements by id/class, listens for clicks, and writes results back into the page.

### Important functions, line by line

**`handleNumber(digit)`**
- `lastWasOperator = false;` – the last press was a number, not an operator.
- `if (startNewNumber)` – after an operator or result, a digit replaces the display instead of adding to it.
- `else if (currentInput === "0")` – avoids numbers like `05`; the 0 is replaced.
- `else if (currentInput.length < MAX_DIGITS)` – stops numbers getting too long; otherwise append the digit.

**`handleOperator(operator)`**
- If the last press was already an operator, replace it (`tokens[tokens.length - 1] = operator`), so `5 + ×` becomes `5 ×`.
- Otherwise `Number(currentInput)` converts the typed text to a number; push it and the operator into `tokens`.
- Set the flags so the next digit starts a new number.

**`calculateTokens(list)`**
- `afterPass1 = [list[0]]` starts with the first number.
- The first `for` loop steps through operators (`i += 2`). For `* / %` it takes the previous number off the list (`pop`), calculates, and puts the result back. For `+ -` it just copies operator and number across.
- If an error happened, `return 0` stops straight away.
- The second loop goes left to right doing `+` and `-` on what is left. The final `result` is returned.

**`handleEquals()`**
- Removes an unfinished operator, or adds the last typed number.
- Builds the text for the small display, calls `calculateTokens`, checks for an infinite result, clears `tokens`, and shows the formatted result.

**`updateDisplay()`**
- Shows the error text (red) or the current number on the main display.
- Shows either the running expression or the previous calculation on the small display.
- Adds the `is-long` class to shrink long numbers.

## 5. Internship Viva Questions and Answers

1. **Why did you not use `eval()`?** It runs any text as code, which is unsafe and hides the logic. I wrote my own functions so I can explain every step.
2. **How does operator precedence work?** The expression is stored as a list. One pass does `* / %`, a second pass does `+ -`.
3. **Where did you use event listeners?** On every button with `addEventListener("click")`, and on the document for keyboard keys.
4. **Why use a loop for the buttons?** Writing 20 separate listeners would be repetitive; one `for` loop does it for all.
5. **How do you stop two decimal points?** `currentInput.indexOf(".") === -1` is checked before adding a dot.
6. **How is division by zero handled?** `divide` checks `b === 0`, sets an error message and the display shows it instead of `Infinity`.
7. **Why is the current number stored as a string?** So the user can type `2.` or `0.50` as text before it is converted with `Number()`.
8. **Why does 0.1 + 0.2 show 0.3?** Computers store decimals in binary, so tiny errors appear. `toPrecision(12)` rounds them away.
9. **What does Bootstrap do here?** It makes the layout responsive with grid classes and flex utilities, and styles the buttons' base.
10. **Why is the script tag at the end of the body?** The HTML elements must exist before JavaScript looks for them.
11. **Difference between `innerText` and `innerHTML`?** `innerText` sets plain text, `innerHTML` can also add HTML tags. I use `innerText` since the display only needs text.
12. **What is the difference between AC and C?** AC resets everything, C clears only the number currently being typed.
13. **Why CSS Grid for the keypad?** Four equal columns are easy with `repeat(4, 1fr)`, and the `=` button can span three columns.
14. **What happens with square root of a negative number?** `squareRoot` sets "Invalid input", which is shown in red.
15. **How could you improve the project?** Add a history list, brackets, a dark/light theme toggle, or unit tests.

## 6. Requirement Verification

| Requirement | Where it is done | Status |
|---|---|---|
| HTML5, CSS3, Bootstrap, Grid/Flex, Vanilla JS | `index.html`, `style.css`, `script.js` | Written |
| No frameworks, jQuery, libraries, APIs | Only Bootstrap CSS and a Google Font are loaded | Met |
| No `eval()` / `Function()` | Custom `calculateTokens` | Met |
| + − × ÷ % √, AC, C, ⌫, ., +/−, = | Buttons and `handleInput` | Written, needs your testing |
| Prevent double decimals, handle consecutive operators | `handleDecimal`, `handleOperator` | Written, needs your testing |
| Division by zero and negative root errors | `divide`, `modulus`, `squareRoot` | Written, needs your testing |
| Event listeners, functions, loops, if/else, innerText | Sections 3–9 of `script.js` | Used in working code |
| Secondary display, responsive, modern design | `style.css`, Bootstrap grid | Written, check on phone |
| File structure, README, deployment steps, viva Q&A | This folder and guide | Delivered |

**Status:** the code is ready for local testing and for GitHub/Netlify deployment. Run the checklist in section 1 first. If any test fails, tell me which one and I will fix it.
