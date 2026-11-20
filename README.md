# Smart Calculator

A responsive calculator web application built with HTML5, CSS3, Bootstrap 5 and Vanilla JavaScript, created as a Full Stack Web Development internship project.

## Project Objective

To apply the basics of HTML, CSS, Bootstrap and JavaScript by building a useful, professional-looking frontend application independently, without frameworks or external JavaScript libraries.

## Technologies Used

- **HTML5** – page structure
- **CSS3** – custom styling, colours and transitions
- **Bootstrap 5.3 (CDN)** – responsive layout (container, rows, columns, flex utilities)
- **CSS Grid** – calculator keypad layout
- **Vanilla JavaScript** – all calculator logic (no `eval()`, no libraries, no APIs)

## Features

- Addition, subtraction, multiplication, division
- Modulus (`%`) and square root (`√`)
- AC (all clear), C (clear entry), Backspace, Decimal, +/− and Equals
- Operator precedence (`5 + 3 × 2 = 11`)
- Secondary display that shows the running expression
- Error messages for division by zero and square root of a negative number
- Blocks multiple decimal points and replaces repeated operators
- Removes unnecessary decimal zeros and floating-point noise (`0.1 + 0.2 = 0.3`)
- Keyboard support (digits, `+ - * / %`, `.`, Enter, Backspace, Delete, Esc)
- Responsive on phones, tablets, laptops and desktops

## Project Folder Structure

```
smart-calculator/
├── index.html    # page structure
├── style.css     # custom styles
├── script.js     # calculator logic
├── README.md     # project information
└── GUIDE.md      # testing checklist, deployment steps, explanation, viva Q&A
```

## How to Run Locally

1. Download or clone this folder.
2. Open `index.html` in any modern browser (double-click it, or use the Live Server extension in VS Code).
3. An internet connection is needed once to load Bootstrap and the Google Font from their CDNs.

No installation or build step is required.

## Calculator Operations Supported

| Button | Operation |
|---|---|
| `+` `−` `×` `÷` | Basic arithmetic |
| `%` | Modulus (remainder) |
| `√` | Square root of the current number |
| `AC` | Clear everything |
| `C` | Clear the current entry |
| `⌫` | Delete the last digit |
| `.` | Decimal point |
| `+/−` | Change sign |
| `=` | Calculate the result |

## Deployment

The project is static (no backend), so it deploys directly to Netlify from a GitHub repository.
Step-by-step instructions are in `GUIDE.md`.

- GitHub repository: _add your link here_
- Live site: _add your Netlify URL here_
