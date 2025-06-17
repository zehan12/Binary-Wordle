# 🧠 Binary Wordle

A fun twist on the classic Wordle game – guess the hidden binary word!  
Built with **Next.js**, Tailwind CSS, and React animations.

---

## 🚀 Features

- 🎯 Guess a 5-letter binary word (e.g., `10101`)
- 🎨 Animated feedback for correct, misplaced, and incorrect bits
- ⌨️ Keyboard input support
- 🔁 Daily puzzle logic (optional)

---

## 🛠 Tech Stack

- [Next.js](https://nextjs.org/) (App Router / Pages Router – depends on your setup)
- [React](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [TypeScript](https://www.typescriptlang.org/) (recommended)

---

## 🧩 How to Play

- The word is a **5-bit binary string** (e.g., `01110`)
- Green cell = Correct bit and position  
- Yellow cell = Bit exists but in the wrong position  
- Gray cell = Bit is not in the word  
- You have **6 attempts** to guess correctly!

---

## 🖥️ Running Locally

```bash
# Clone the repo
git clone https://github.com/your-username/binary-wordle.git
cd binary-wordle

# Install dependencies
npm install

# Run the development server
npm run dev

# Open http://localhost:3000 in your browser
