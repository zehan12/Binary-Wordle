/* eslint-disable react-hooks/exhaustive-deps */
"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Info, RotateCcw } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

const BINARY_WORDS = [
  "00000",
  "00001",
  "00010",
  "00011",
  "00100",
  "00101",
  "00110",
  "00111",
  "01000",
  "01001",
  "01010",
  "01011",
  "01100",
  "01101",
  "01110",
  "01111",
  "10000",
  "10001",
  "10010",
  "10011",
  "10100",
  "10101",
  "10110",
  "10111",
  "11000",
  "11001",
  "11010",
  "11011",
  "11100",
  "11101",
  "11110",
  "11111",
]

const socialLinks = [
  { name: "GitHub", url: "https://github.com/zehan12" },
  { name: "Portfolio", url: "https://zehankhan.vercel.app/" },
  { name: "Medium", url: "https://medium.com/@zehan9211" },
  { name: "LinkedIn", url: "https://www.linkedin.com/in/zehan-khan-6001a4144/" },
];


type CellState = "empty" | "correct" | "present" | "absent"

interface Cell {
  value: string
  state: CellState
}

export default function BinaryWordle() {
  const [targetWord, setTargetWord] = useState("")
  const [currentGuess, setCurrentGuess] = useState("")
  const [guesses, setGuesses] = useState<Cell[][]>([])
  const [currentRow, setCurrentRow] = useState(0)
  const [gameStatus, setGameStatus] = useState<"playing" | "won" | "lost">("playing")
  const [showInstructions, setShowInstructions] = useState(false)
  const [animatingRow, setAnimatingRow] = useState<number | null>(null)

  useEffect(() => {
    resetGame()
  }, [])

  const resetGame = () => {
    const randomWord = BINARY_WORDS[Math.floor(Math.random() * BINARY_WORDS.length)]
    setTargetWord(randomWord)
    setCurrentGuess("")
    setGuesses(
      Array(6)
        .fill(null)
        .map(() => Array(5).fill({ value: "", state: "empty" })),
    )
    setCurrentRow(0)
    setGameStatus("playing")
    setAnimatingRow(null)
  }

  const evaluateGuess = (guess: string): Cell[] => {
    const result: Cell[] = []
    const targetArray = targetWord.split("")
    const guessArray = guess.split("")

    const targetCounts = { "0": 0, "1": 0 }
    const guessCounts = { "0": 0, "1": 0 }

    for (let i = 0; i < 5; i++) {
      if (guessArray[i] === targetArray[i]) {
        result[i] = { value: guessArray[i], state: "correct" }
      } else {
        result[i] = { value: guessArray[i], state: "absent" }
        targetCounts[targetArray[i] as "0" | "1"]++
        guessCounts[guessArray[i] as "0" | "1"]++
      }
    }

    for (let i = 0; i < 5; i++) {
      if (result[i].state === "absent") {
        const digit = guessArray[i] as "0" | "1"
        if (targetCounts[digit] > 0) {
          result[i].state = "present"
          targetCounts[digit]--
        }
      }
    }

    return result
  }

  const submitGuess = () => {
    if (currentGuess.length !== 5 || gameStatus !== "playing") return

    setAnimatingRow(currentRow)

    const newGuesses = [...guesses]
    const guessWithoutColors = currentGuess.split("").map((digit) => ({ value: digit, state: "empty" as CellState }))
    newGuesses[currentRow] = guessWithoutColors
    setGuesses(newGuesses)

    setTimeout(() => {
      const evaluatedGuess = evaluateGuess(currentGuess)
      const finalGuesses = [...newGuesses]
      finalGuesses[currentRow] = evaluatedGuess
      setGuesses(finalGuesses)

      if (currentGuess === targetWord) {
        setGameStatus("won")
      } else if (currentRow === 5) {
        setGameStatus("lost")
      } else {
        setCurrentRow(currentRow + 1)
      }

      setCurrentGuess("")
      setAnimatingRow(null)
    }, 1250)
  }

  const handleKeyPress = useCallback(
    (key: string) => {
      if (gameStatus !== "playing" || animatingRow !== null) return

      if (key === "Enter") {
        submitGuess()
      } else if (key === "Backspace") {
        setCurrentGuess((prev) => prev.slice(0, -1))
      } else if ((key === "0" || key === "1") && currentGuess.length < 5) {
        setCurrentGuess((prev) => prev + key)
      }
    },
    [currentGuess, gameStatus, animatingRow],
  )

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      handleKeyPress(event.key)
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [handleKeyPress])

  const getCellClassName = (state: CellState, isAnimating: boolean) => {
    const baseClasses =
      "w-12 h-12 border-2 rounded flex items-center justify-center text-xl font-bold transition-all duration-300"

    let colorClasses = ""
    switch (state) {
      case "correct":
        colorClasses = "bg-green-500 text-white border-green-500"
        break
      case "present":
        colorClasses = "bg-yellow-500 text-white border-yellow-500"
        break
      case "absent":
        colorClasses = "bg-gray-500 text-white border-gray-500"
        break
      default:
        colorClasses = "bg-white border-gray-300"
    }

    const animationClasses = isAnimating ? `animate-flip` : ""

    return `${baseClasses} ${colorClasses} ${animationClasses}`
  }

  const getKeyClassName = (digit: "0" | "1") => {
    let state: CellState = "empty"

    for (let i = 0; i < currentRow; i++) {
      for (let j = 0; j < 5; j++) {
        if (guesses[i][j].value === digit) {
          if (guesses[i][j].state === "correct") {
            state = "correct"
            break
          } else if (guesses[i][j].state === "present" && state !== "present") {
            state = "present"
          } else if (guesses[i][j].state === "absent" && state === "empty") {
            state = "absent"
          }
        }
      }
      if (state === "correct") break
    }

    switch (state) {
      case "correct":
        return "bg-green-500 text-white hover:bg-green-600"
      case "present":
        return "bg-yellow-500 text-white hover:bg-yellow-600"
      case "absent":
        return "bg-gray-500 text-white hover:bg-gray-600"
      default:
        return "bg-gray-200 hover:bg-gray-300"
    }
  }

  return (
    <>
      <div className="absolute inset-0 bg-white dark:bg-gray-950 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.3] dark:opacity-[0.2]">
          <svg width="100%" height="100%" viewBox="0 0 1200 600" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="wave-gradient-1" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.3" />
              </linearGradient>
              <linearGradient id="wave-gradient-2" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#ec4899" stopOpacity="0.3" />
              </linearGradient>
              <linearGradient id="wave-gradient-3" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ec4899" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.3" />
              </linearGradient>
            </defs>

            <path
              d="M0,50 C100,100 200,0 300,50 C400,100 500,0 600,50 C700,100 800,0 900,50 C1000,100 1100,0 1200,50 V600 H0 Z"
              fill="url(#wave-gradient-1)"
            />
            <path
              d="M0,150 C100,200 200,100 300,150 C400,200 500,100 600,150 C700,200 800,100 900,150 C1000,200 1100,100 1200,150 V600 H0 Z"
              fill="url(#wave-gradient-2)"
            />
            <path
              d="M0,250 C100,300 200,200 300,250 C400,300 500,200 600,250 C700,300 800,200 900,250 C1000,300 1100,200 1200,250 V600 H0 Z"
              fill="url(#wave-gradient-3)"
            />
          </svg>
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-white via-white/0 to-white dark:from-gray-950 dark:via-gray-950/0 dark:to-gray-950">
          <div className="min-h-screen  flex flex-col items-center justify-center p-4">
            <style jsx>{`
        @keyframes flip {
          0% {
            transform: rotateX(0);
          }
          50% {
            transform: rotateX(-90deg);
          }
          100% {
            transform: rotateX(0);
          }
        }
        
        .animate-flip {
          animation: flip 0.6s ease-in-out;
        }
        
        .animate-flip:nth-child(1) { animation-delay: 0ms; }
        .animate-flip:nth-child(2) { animation-delay: 150ms; }
        .animate-flip:nth-child(3) { animation-delay: 300ms; }
        .animate-flip:nth-child(4) { animation-delay: 450ms; }
        .animate-flip:nth-child(5) { animation-delay: 600ms; }
      `}</style>

            <Card className="w-full max-w-md p-6 bg-white shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <Dialog open={showInstructions} onOpenChange={setShowInstructions}>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Info className="h-5 w-5" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>How to Play Binary Wordle</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-3 text-sm">
                      <p>Guess the 5-digit binary number in 6 tries.</p>
                      <p>Each guess must be a valid 5-digit binary number using only 0s and 1s.</p>
                      <p>After each guess, the color of the tiles will change:</p>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-green-500 rounded"></div>
                          <span>Green: Correct digit in correct position</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-yellow-500 rounded"></div>
                          <span>Yellow: Correct digit in wrong position</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-gray-500 rounded"></div>
                          <span>Gray: Digit not in the target number</span>
                        </div>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

                <h1 className="text-2xl font-bold text-center">Binary Wordle</h1>

                <Button variant="ghost" size="icon" onClick={resetGame}>
                  <RotateCcw className="h-5 w-5" />
                </Button>
              </div>

              <div className="grid grid-cols-5 gap-1 mb-6 px-14">
                {guesses.map((row, rowIndex) =>
                  row.map((cell, colIndex) => {
                    const isAnimating = animatingRow === rowIndex
                    const animationDelay = colIndex * 150

                    return (
                      <div
                        key={`${rowIndex}-${colIndex}`}
                        className={`
                    ${getCellClassName(cell.state, isAnimating)}
                    ${rowIndex === currentRow && colIndex < currentGuess.length && animatingRow === null ? "border-gray-500" : ""}
                  `}
                        style={isAnimating ? { animationDelay: `${animationDelay}ms` } : {}}
                      >
                        {rowIndex === currentRow && colIndex < currentGuess.length && animatingRow === null
                          ? currentGuess[colIndex]
                          : cell.value}
                      </div>
                    )
                  }),
                )}
              </div>

              <div className="space-y-2">
                <div className="flex justify-center gap-2">
                  <Button
                    className={`w-16 h-12 text-xl font-bold ${getKeyClassName("0")}`}
                    onClick={() => handleKeyPress("0")}
                    disabled={gameStatus !== "playing" || animatingRow !== null}
                  >
                    0
                  </Button>
                  <Button
                    className={`w-16 h-12 text-xl font-bold ${getKeyClassName("1")}`}
                    onClick={() => handleKeyPress("1")}
                    disabled={gameStatus !== "playing" || animatingRow !== null}
                  >
                    1
                  </Button>
                  <Button
                    variant="outline"
                    className="w-16 h-12"
                    onClick={() => handleKeyPress("Backspace")}
                    disabled={gameStatus !== "playing" || animatingRow !== null}
                  >
                    ⌫
                  </Button>
                  <Button
                    className="px-4 h-12 bg-gray-600 hover:bg-gray-700 text-white"
                    onClick={() => handleKeyPress("Enter")}
                    disabled={gameStatus !== "playing" || currentGuess.length !== 5 || animatingRow !== null}
                  >
                    ENTER
                  </Button>
                </div>
              </div>

              {gameStatus === "won" && (
                <div className="mt-4 p-3 bg-green-100 border border-green-300 rounded text-center">
                  <p className="text-green-800 font-semibold">Congratulations! You won!</p>
                  <p className="text-sm text-green-600">The answer was: {targetWord}</p>
                </div>
              )}

              {gameStatus === "lost" && (
                <div className="mt-4 p-3 bg-red-100 border border-red-300 rounded text-center">
                  <p className="text-red-800 font-semibold">Game Over!</p>
                  <p className="text-sm text-red-600">The answer was: {targetWord}</p>
                </div>
              )}

              <p className="text-xs text-gray-500 text-center mt-4">
                Use keyboard (0, 1, Enter, Backspace) or buttons to play
              </p>
              <div className="flex space-x-4 justify-center -mt-2">
                {socialLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition text-sm text-blue-700 hover:underline"
                  >
                    {link.name}
                  </a>
                ))}
              </div>
              <div className="text-center text-gray-600 text-sm -mt-5">
                Made with <span className="text-red-500">❤️</span> by{" "}
                <a
                  href="https://github.com/zehan12"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  Zehan Khan
                </a>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </>
  )
}
