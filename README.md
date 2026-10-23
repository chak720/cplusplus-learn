# C++ Daily

Learn C++ from zero, one short day at a time.

Each day is a short lesson, a few quick questions and one to three real coding problems. You write code in the browser, then **Run** it or **Check** it against test cases. Thirty days take you from "what is a compiler?" to classes, maps, pointers and a small capstone project.

## How a day works

1. **Warm-up**: three questions from earlier days, starting with ones you got wrong.
2. **Lesson**: a few short sections with code examples and their output. Every example opens in Compiler Explorer so you can play with it.
3. **Quick check**: five multiple-choice or predict-the-output questions.
4. **Problems**: write the code yourself. Hints come one at a time, and a worked solution with notes is there if you're stuck.
5. **Finish**: once the questions are done and at least one problem is solved.

Missed questions go into a review queue and keep coming back until you get them right twice.

## The course

| Unit | Days | Topics |
| --- | --- | --- |
| First steps | 1–6 | programs and compilers, output, variables, input, arithmetic, types |
| Making decisions | 7–9 | if/else, logic, switch |
| Repeating things | 10–13 | while, for, loop patterns, nested loops |
| Functions | 14–17 | functions, scope, references, overloading, recursion |
| Collections | 18–22 | vector, strings, grids, `<algorithm>` |
| Organising data | 23–26 | struct, classes, map, set and unordered containers |
| Under the hood | 27–30 | pointers, the heap and smart pointers, debugging, capstone |

## Running code

Run and Check send your code to [Compiler Explorer](https://godbolt.org) (GCC 13.2, `-std=c++20 -Wall`). If your network blocks it, use **Open in Compiler Explorer** or a compiler on your own machine. The Course tab explains how to install one on Windows or Mac.

Progress is saved in your browser only. Use **Progress → Copy progress** to move it to another device.

## How it's built

Plain HTML, CSS and JavaScript with no build step, so any static host works (GitHub Pages included).

- `assets/course-*.js`: the lessons, questions and problems, one file per pair of units
- `assets/app.js`: views, progress, the quick-check runner and the code runner
- `tools/verify.js`: compiles and runs every example, checks every predict-the-output answer, and runs every solution against its tests. Run `node tools/verify.js` (needs `g++`) after editing course content, or `node tools/verify.js 12` for one day.
