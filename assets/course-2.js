"use strict";
/* C++ Daily course, part 2: Units 3–4. Shapes are described in course-1.js. */

/* ======================= UNIT 3: REPEATING ======================= */
DAYS.push({n:10,unit:"Repeating things",title:"while loops",
goal:"Repeat code for as long as a condition holds.",
sections:[
 {h:"Repeat while true",p:"A `while` loop checks its condition, runs the block if it's true, then goes back and checks again. It stops the first time the condition is false. Each run through the block is called an iteration.",code:R`int i = 1;
while (i <= 3) {
    std::cout << "lap " << i << "\n";
    i++;
}
std::cout << "finished\n";`,out:"lap 1\nlap 2\nlap 3\nfinished"},
 {h:"The three parts of a counting loop",p:"Most loops need three things: a starting value (`int i = 1`), a condition (`i <= 3`) and a step that moves towards the end (`i++`). Forget the step and the condition never becomes false. That's an infinite loop: the program runs forever. If it happens here, the online compiler stops it after a few seconds."},
 {h:"Loops that don't count",p:"The condition can be anything. This loop keeps doubling until the value passes 100, and you don't need to know in advance how many times that takes.",code:R`int x = 1;
while (x <= 100) {
    x *= 2;
}
std::cout << x << "\n";`,out:"128"},
 {h:"Reading until a stop value",p:"A common pattern: keep reading numbers until a special value, often 0, says stop. That value is called a sentinel.",code:R`int total = 0;
int n = 0;
std::cin >> n;
while (n != 0) {
    total += n;
    std::cin >> n;
}
std::cout << total << "\n";`,in:"5 10 3 0",out:"18"},
 {h:"Peeling off digits",p:"Remember `% 10` (last digit) and `/ 10` (drop the last digit) from Day 5? In a loop, they visit every digit of a number, right to left, until nothing is left.",code:R`int n = 4827;
while (n > 0) {
    std::cout << n % 10 << " ";
    n /= 10;
}`,out:"7 2 8 4"}],
takeaways:["`while (cond) { ... }` repeats until cond is false.","Start, condition, step. Forget the step and it never ends.","A sentinel value can say when to stop reading.","`% 10` and `/ 10` in a loop visit every digit."],
checks:[
 {t:"out",code:R`int i = 1;
while (i <= 3) {
    std::cout << i << " ";
    i++;
}`,a:"1 2 3",why:"It prints, then steps, until i reaches 4 and the condition fails."},
 {t:"out",code:R`int n = 3;
while (n > 0) {
    std::cout << n;
    n--;
}
std::cout << "go";`,a:"321go",why:"3, 2, 1, then n is 0 and the loop ends."},
 {t:"mc",q:"What's wrong with this loop?",code:R`int i = 0;
while (i < 5) {
    std::cout << i;
}`,opts:["Nothing","i never changes, so it loops forever","It prints nothing","`while` needs a semicolon after the condition"],a:1,why:"There's no step. Add `i++;` inside the loop."},
 {t:"out",code:R`int x = 1;
while (x < 50) {
    std::cout << x << " ";
    x *= 2;
}`,a:"1 2 4 8 16 32",why:"After 32, x becomes 64, which fails x < 50."},
 {t:"out",code:R`int k = 10;
while (k < 5) {
    std::cout << "inside";
}
std::cout << "after";`,a:"after",why:"The condition is false straight away, so the body never runs."}],
problems:[
 {title:"Liftoff",task:"Read a whole number n and count down from n to 1, one number per line, then print `Liftoff!`.\n\nExample: input `3` → output `3`, `2`, `1`, `Liftoff!` on four lines.",tests:[{in:"3",out:"3\n2\n1\nLiftoff!"},{in:"1",out:"1\nLiftoff!"},{in:"5",out:"5\n4\n3\n2\n1\nLiftoff!"}],
  starter:R`#include <iostream>

int main() {
    int n = 0;
    std::cin >> n;

    return 0;
}`,hints:["`while (n >= 1)` or `while (n > 0)`.","Print n, then `n--;`. After the loop, print Liftoff!"],
  sol:R`#include <iostream>

int main() {
    int n = 0;
    std::cin >> n;
    while (n > 0) {
        std::cout << n << "\n";
        n--;
    }
    std::cout << "Liftoff!\n";
    return 0;
}`,explain:"The Liftoff line goes after the loop's closing brace, so it runs once, when the loop is finished."},
 {title:"Digit sum",task:"Read a positive whole number and print the sum of its digits.\n\nExample: input `4827` → output `21` (4 + 8 + 2 + 7).",tests:[{in:"4827",out:"21"},{in:"5",out:"5"},{in:"1000",out:"1"},{in:"99999",out:"45"}],
  starter:R`#include <iostream>

int main() {
    int n = 0;
    std::cin >> n;
    int sum = 0;

    std::cout << sum << "\n";
    return 0;
}`,hints:["Loop `while (n > 0)`.","Inside: `sum += n % 10;` then `n /= 10;`"],
  sol:R`#include <iostream>

int main() {
    int n = 0;
    std::cin >> n;
    int sum = 0;
    while (n > 0) {
        sum += n % 10;
        n /= 10;
    }
    std::cout << sum << "\n";
    return 0;
}`,explain:"This shape, a running total updated inside a loop, is called an accumulator. You'll use it constantly."},
 {title:"Add until zero",task:"Read whole numbers until you read a 0, then print how many numbers came before the 0 and their total, separated by a space.\n\nExample: input `5 10 3 0` → output `3 18`.",tests:[{in:"5 10 3 0",out:"3 18"},{in:"0",out:"0 0"},{in:"-4 4 7 0",out:"3 7"}],
  starter:R`#include <iostream>

int main() {
    int count = 0;
    int total = 0;

    std::cout << count << " " << total << "\n";
    return 0;
}`,hints:["Read the first number before the loop, then loop `while (n != 0)`.","Inside the loop: add to total, add one to count, then read the next number."],
  sol:R`#include <iostream>

int main() {
    int count = 0;
    int total = 0;
    int n = 0;
    std::cin >> n;
    while (n != 0) {
        total += n;
        count++;
        std::cin >> n;
    }
    std::cout << count << " " << total << "\n";
    return 0;
}`,explain:"Reading before the loop and again at the end of each iteration means the 0 is never added or counted."}]});

DAYS.push({n:11,unit:"Repeating things",title:"for loops",
goal:"Write counting loops in one tidy line.",
sections:[
 {h:"Anatomy of a for loop",p:"A `for` loop puts the start, the condition and the step on one line, separated by semicolons. It does exactly what yesterday's counting while loop did, but you can see everything at a glance.",code:R`for (int i = 1; i <= 3; i++) {
    std::cout << "lap " << i << "\n";
}`,out:"lap 1\nlap 2\nlap 3"},
 {h:"Counting any way you like",p:"Start anywhere, stop anywhere, step by anything.",code:R`for (int i = 0; i < 10; i += 3) {
    std::cout << i << " ";
}
std::cout << "\n";
for (int i = 5; i >= 1; i--) {
    std::cout << i << " ";
}`,out:"0 3 6 9\n5 4 3 2 1"},
 {h:"Off by one",p:"`i < 5` and `i <= 5` differ by one iteration. Starting at 0 with `i < n` runs exactly n times, and that's the most common form, because lists in C++ start counting at 0. When a loop is wrong by exactly one, check the start value and whether you used < or <=."},
 {h:"Loops with a running total",p:"Combine a loop with an accumulator to add things up.",code:R`int sum = 0;
for (int i = 1; i <= 100; i++) {
    sum += i;
}
std::cout << sum << "\n";`,out:"5050"},
 {h:"Where the loop variable lives",p:"A variable created in the `for (...)` line only exists inside that loop. After the closing brace it's gone, and using it is a compile error. If you need the value afterwards, create the variable before the loop."}],
takeaways:["`for (start; condition; step) { ... }`","`for (int i = 0; i < n; i++)` runs exactly n times.","Off by one? Check the start and < vs <=.","The loop variable only exists inside the loop."],
checks:[
 {t:"out",code:R`for (int i = 0; i < 3; i++) {
    std::cout << i;
}`,a:"012",why:"0, 1, 2. At 3 the condition i < 3 fails."},
 {t:"out",code:R`for (int i = 10; i > 0; i -= 3) {
    std::cout << i << " ";
}`,a:"10 7 4 1",why:"After 1, i becomes −2, which fails i > 0."},
 {t:"mc",q:"How many times does `for (int i = 0; i <= 5; i++)` run?",opts:["4","5","6","Forever"],a:2,why:"0, 1, 2, 3, 4, 5 is six values. `<=` includes the 5."},
 {t:"out",code:R`int s = 0;
for (int i = 1; i <= 4; i++) {
    s += i;
}
std::cout << s;`,a:"10",why:"1 + 2 + 3 + 4 = 10."},
 {t:"mc",q:"What happens here?",code:R`for (int i = 0; i < 3; i++) {
    std::cout << i;
}
std::cout << i;`,opts:["Prints 0123","Prints 0122","Compile error: i doesn't exist after the loop","Prints 012 and then a random number"],a:2,why:"i was created in the for line, so it disappears at the closing brace."}],
problems:[
 {title:"Times table",task:"Read a whole number n and print its times table from 1 to 10 in this format:\n\n`7 x 1 = 7`\n`7 x 2 = 14`\n…\n`7 x 10 = 70`",tests:[{in:"7",out:"7 x 1 = 7\n7 x 2 = 14\n7 x 3 = 21\n7 x 4 = 28\n7 x 5 = 35\n7 x 6 = 42\n7 x 7 = 49\n7 x 8 = 56\n7 x 9 = 63\n7 x 10 = 70"},{in:"1",out:"1 x 1 = 1\n1 x 2 = 2\n1 x 3 = 3\n1 x 4 = 4\n1 x 5 = 5\n1 x 6 = 6\n1 x 7 = 7\n1 x 8 = 8\n1 x 9 = 9\n1 x 10 = 10"}],
  starter:R`#include <iostream>

int main() {
    int n = 0;
    std::cin >> n;

    return 0;
}`,hints:["`for (int i = 1; i <= 10; i++)`","Print `n << \" x \" << i << \" = \" << n * i << \"\\n\"`."],
  sol:R`#include <iostream>

int main() {
    int n = 0;
    std::cin >> n;
    for (int i = 1; i <= 10; i++) {
        std::cout << n << " x " << i << " = " << n * i << "\n";
    }
    return 0;
}`,explain:"Ten lines of output from three lines of code. That's what loops are for."},
 {title:"Sum to n",task:"Read a whole number n (1 or more) and print 1 + 2 + … + n.",tests:[{in:"4",out:"10"},{in:"100",out:"5050"},{in:"1",out:"1"}],
  starter:R`#include <iostream>

int main() {

    return 0;
}`,hints:["An accumulator `int sum = 0;` before the loop.","`for (int i = 1; i <= n; i++) sum += i;`"],
  sol:R`#include <iostream>

int main() {
    int n = 0;
    std::cin >> n;
    int sum = 0;
    for (int i = 1; i <= n; i++) {
        sum += i;
    }
    std::cout << sum << "\n";
    return 0;
}`,explain:"There's also a formula, n × (n + 1) / 2, which gives the answer instantly. Interviewers like asking for both. Try it: does it match?"},
 {title:"Factorial",task:"Read n (0 to 20) and print n! = 1 × 2 × … × n. By definition 0! = 1.\n\nWarning: 20! is about 2.4 × 10^18, far too big for an `int`.",tests:[{in:"5",out:"120"},{in:"0",out:"1"},{in:"20",out:"2432902008176640000"}],
  starter:R`#include <iostream>

int main() {
    int n = 0;
    std::cin >> n;

    return 0;
}`,hints:["Start the result at 1, not 0, because you're multiplying.","Use `long long result = 1;` so it can hold 20!.","For n = 0 the loop runs zero times and leaves result at 1, which is correct."],
  sol:R`#include <iostream>

int main() {
    int n = 0;
    std::cin >> n;
    long long result = 1;
    for (int i = 2; i <= n; i++) {
        result *= i;
    }
    std::cout << result << "\n";
    return 0;
}`,explain:"With `int`, 13! already overflows and gives garbage. Picking a type that's big enough is part of the solution."}]});

DAYS.push({n:12,unit:"Repeating things",title:"Loop patterns: count, find, stop early",
goal:"Recognise the handful of loop shapes that solve most problems.",
sections:[
 {h:"Read n, then n values",p:"Many problems give you a count first, then that many values. A for loop reads them one at a time. You don't need to store them all to add them up or find the biggest.",code:R`int n = 0;
std::cin >> n;
int total = 0;
for (int i = 0; i < n; i++) {
    int x = 0;
    std::cin >> x;
    total += x;
}
std::cout << total << "\n";`,in:"4\n3 8 -2 5",out:"14"},
 {h:"Tracking the biggest",p:"To find a maximum, keep the best value seen so far and update it whenever you see something bigger. Start it from the first value, not from 0: if every number is negative, a start of 0 would wrongly win.",code:R`int n = 0;
std::cin >> n;
int best = 0;
std::cin >> best;
for (int i = 1; i < n; i++) {
    int x = 0;
    std::cin >> x;
    if (x > best) {
        best = x;
    }
}
std::cout << best << "\n";`,in:"3\n-7 -2 -9",out:"-2"},
 {h:"break: stop now",p:"`break` jumps straight out of the loop. Use it when you've found what you were looking for and there's no point carrying on.",code:R`for (int i = 1; i <= 10; i++) {
    if (i * i > 20) {
        std::cout << "first square over 20: " << i * i << "\n";
        break;
    }
}`,out:"first square over 20: 25"},
 {h:"continue: skip this one",p:"`continue` skips the rest of the current iteration and moves on to the next.",code:R`for (int i = 1; i <= 6; i++) {
    if (i % 3 == 0) {
        continue;
    }
    std::cout << i << " ";
}`,out:"1 2 4 5"},
 {h:"Counting",p:"A counter is an accumulator that adds 1 when something is true: `if (x > 0) count++;`. A flag is a bool that starts false and becomes true when something happens, like finding a divisor. Sum, count, max/min, flag, stop early: those five shapes cover most beginner loop problems."}],
takeaways:["Read n, then loop n times reading one value each time.","Start a max/min from the first value, not 0.","`break` leaves the loop; `continue` skips to the next iteration.","Sum, count, max/min, flag, stop early."],
checks:[
 {t:"out",code:R`for (int i = 1; i <= 5; i++) {
    if (i == 4) {
        break;
    }
    std::cout << i;
}`,a:"123",why:"At i = 4 the loop exits before printing."},
 {t:"out",code:R`for (int i = 1; i <= 5; i++) {
    if (i % 2 == 0) {
        continue;
    }
    std::cout << i;
}`,a:"135",why:"Even numbers skip the print."},
 {t:"mc",q:"You're finding the largest of some numbers that might all be negative. What should `best` start as?",opts:["0","The first number read","-1","1000000"],a:1,why:"Starting from 0 would beat every negative number and give the wrong answer."},
 {t:"out",q:"The input is `5  3 -1 0 -6 2`. What does this print?",code:R`int n = 0;
std::cin >> n;
int neg = 0;
for (int i = 0; i < n; i++) {
    int x = 0;
    std::cin >> x;
    if (x < 0) {
        neg++;
    }
}
std::cout << neg;`,in:"5\n3 -1 0 -6 2",a:"2",why:"−1 and −6 are negative. 0 is not."},
 {t:"out",code:R`bool found = false;
for (int d = 2; d < 9; d++) {
    if (9 % d == 0) {
        found = true;
    }
}
std::cout << found;`,a:"1",why:"3 divides 9, so the flag gets set to true."}],
problems:[
 {title:"Sum, min and max",task:"Read n (at least 1), then n whole numbers. Print their sum, the smallest and the largest, separated by spaces.\n\nExample: input `4` then `3 8 -2 5` → output `14 -2 8`.",tests:[{in:"4\n3 8 -2 5",out:"14 -2 8"},{in:"1\n7",out:"7 7 7"},{in:"3\n-5 -9 -1",out:"-15 -9 -1"}],
  starter:R`#include <iostream>

int main() {
    int n = 0;
    std::cin >> n;

    return 0;
}`,hints:["Read the first number before the loop and use it to start sum, lo and hi.","Loop the remaining n − 1 times, updating all three."],
  sol:R`#include <iostream>

int main() {
    int n = 0;
    std::cin >> n;
    int first = 0;
    std::cin >> first;
    int sum = first, lo = first, hi = first;
    for (int i = 1; i < n; i++) {
        int x = 0;
        std::cin >> x;
        sum += x;
        if (x < lo) lo = x;
        if (x > hi) hi = x;
    }
    std::cout << sum << " " << lo << " " << hi << "\n";
    return 0;
}`,explain:"One pass through the data, three answers. The single-number test and the all-negative test are the ones that catch a bad starting value."},
 {title:"First negative",task:"Read n, then n whole numbers. Print the position (counting from 1) of the first negative number, or `-1` if there isn't one.\n\nExample: input `5` then `4 0 -3 2 -8` → output `3`.",tests:[{in:"5\n4 0 -3 2 -8",out:"3"},{in:"3\n1 2 3",out:"-1"},{in:"2\n-1 -2",out:"1"}],
  starter:R`#include <iostream>

int main() {
    int n = 0;
    std::cin >> n;
    int pos = -1;

    std::cout << pos << "\n";
    return 0;
}`,hints:["Loop i from 1 to n, reading x each time.","When x < 0, set `pos = i;` and `break;`, because you only want the first one."],
  sol:R`#include <iostream>

int main() {
    int n = 0;
    std::cin >> n;
    int pos = -1;
    for (int i = 1; i <= n; i++) {
        int x = 0;
        std::cin >> x;
        if (x < 0) {
            pos = i;
            break;
        }
    }
    std::cout << pos << "\n";
    return 0;
}`,explain:"Without `break`, pos would end up holding the last negative, not the first. Starting pos at −1 handles the 'not found' case for free."},
 {title:"Is it prime?",task:"Read a whole number n (1 or more) and print `prime` or `not prime`. A prime has exactly two divisors: 1 and itself. So 1 is not prime.",tests:[{in:"2",out:"prime"},{in:"17",out:"prime"},{in:"21",out:"not prime"},{in:"1",out:"not prime"},{in:"97",out:"prime"}],
  starter:R`#include <iostream>

int main() {
    int n = 0;
    std::cin >> n;

    return 0;
}`,hints:["Try every d from 2 up to n − 1. If `n % d == 0`, n isn't prime.","Use a flag: `bool prime = (n >= 2);` then set it to false when you find a divisor.","Faster: you only need to try d while `d * d <= n`. Why?"],
  sol:R`#include <iostream>

int main() {
    int n = 0;
    std::cin >> n;
    bool prime = (n >= 2);
    for (int d = 2; d * d <= n; d++) {
        if (n % d == 0) {
            prime = false;
            break;
        }
    }
    if (prime) {
        std::cout << "prime\n";
    } else {
        std::cout << "not prime\n";
    }
    return 0;
}`,explain:"If n = a × b, one of a and b is at most √n. So if nothing up to √n divides n, nothing does. For n = 1,000,003 that's about 1,000 checks instead of a million."}]});

DAYS.push({n:13,unit:"Repeating things",title:"Loops inside loops",
goal:"Use nested loops for grids, tables and patterns.",
sections:[
 {h:"A loop in a loop",p:"Put one loop inside another and the inner loop runs completely, from start to finish, for every single iteration of the outer loop. Think of a clock: the minute hand goes all the way round for every step of the hour hand.",code:R`for (int row = 1; row <= 2; row++) {
    for (int col = 1; col <= 3; col++) {
        std::cout << row << col << " ";
    }
    std::cout << "\n";
}`,out:"11 12 13\n21 22 23"},
 {h:"Rows and columns",p:"The usual pattern: the outer loop picks a row, the inner loop prints across that row, and a new line goes after the inner loop finishes. With 3 rows and 4 columns, the inner body runs 3 × 4 = 12 times."},
 {h:"When the inner loop depends on the outer",p:"The inner loop's limit can use the outer variable. Here row 1 gets one star, row 2 gets two, and so on.",code:R`for (int row = 1; row <= 4; row++) {
    for (int k = 0; k < row; k++) {
        std::cout << "*";
    }
    std::cout << "\n";
}`,out:"*\n**\n***\n****"},
 {h:"break only escapes one level",p:"`break` inside the inner loop leaves the inner loop only; the outer loop carries on with its next iteration. Keep that in mind when you search a grid."}],
takeaways:["The inner loop runs fully for each outer iteration.","Outer = rows, inner = columns, new line after the inner loop.","The inner limit can depend on the outer variable.","`break` leaves only the innermost loop."],
checks:[
 {t:"out",code:R`for (int i = 0; i < 2; i++) {
    for (int j = 0; j < 3; j++) {
        std::cout << j;
    }
}`,a:"012012",why:"The inner loop prints 012, and the outer loop makes that happen twice."},
 {t:"mc",q:"How many times does the `cout` line run?",code:R`for (int i = 0; i < 3; i++) {
    for (int j = 0; j < 4; j++) {
        std::cout << "x";
    }
}`,opts:["7","12","4","3"],a:1,why:"3 outer iterations × 4 inner = 12."},
 {t:"out",code:R`for (int i = 1; i <= 3; i++) {
    for (int j = 1; j <= i; j++) {
        std::cout << i;
    }
    std::cout << " ";
}`,a:"1 22 333",why:"Row i prints the digit i, i times."},
 {t:"out",code:R`for (int i = 1; i <= 2; i++) {
    for (int j = 1; j <= 3; j++) {
        if (j == 2) break;
        std::cout << i << j << " ";
    }
}`,a:"11 21",why:"break exits the inner loop at j = 2, but the outer loop still moves on to i = 2."}],
problems:[
 {title:"Star triangle",task:"Read n and print a triangle of stars with n rows: row 1 has 1 star, row n has n stars.",tests:[{in:"3",out:"*\n**\n***"},{in:"1",out:"*"},{in:"5",out:"*\n**\n***\n****\n*****"}],
  starter:R`#include <iostream>

int main() {
    int n = 0;
    std::cin >> n;

    return 0;
}`,hints:["Outer loop: row from 1 to n.","Inner loop: print row stars, then a new line after it."],
  sol:R`#include <iostream>

int main() {
    int n = 0;
    std::cin >> n;
    for (int row = 1; row <= n; row++) {
        for (int k = 0; k < row; k++) {
            std::cout << "*";
        }
        std::cout << "\n";
    }
    return 0;
}`,explain:"Try changing the inner limit to `n - row + 1` to flip the triangle upside down."},
 {title:"Multiplication grid",task:"Read n and print an n × n multiplication grid. The number in row r, column c is r × c. Separate numbers with single spaces.\n\nExample: input `3` →\n`1 2 3`\n`2 4 6`\n`3 6 9`",tests:[{in:"3",out:"1 2 3\n2 4 6\n3 6 9"},{in:"1",out:"1"},{in:"4",out:"1 2 3 4\n2 4 6 8\n3 6 9 12\n4 8 12 16"}],
  starter:R`#include <iostream>

int main() {
    int n = 0;
    std::cin >> n;

    return 0;
}`,hints:["Two loops, r and c, both from 1 to n.","Print `r * c << \" \"` inside, and `\"\\n\"` after the inner loop. A trailing space is fine here."],
  sol:R`#include <iostream>

int main() {
    int n = 0;
    std::cin >> n;
    for (int r = 1; r <= n; r++) {
        for (int c = 1; c <= n; c++) {
            std::cout << r * c << " ";
        }
        std::cout << "\n";
    }
    return 0;
}`,explain:"The checker ignores spaces at the end of a line. Real judges often don't, so the tidy version prints the space only between numbers: `if (c > 1) std::cout << \" \";` before each number."},
 {title:"Primes up to n",task:"Read n and print every prime from 2 to n, separated by spaces. If there are none, print nothing.\n\nExample: input `20` → output `2 3 5 7 11 13 17 19`.",tests:[{in:"20",out:"2 3 5 7 11 13 17 19"},{in:"2",out:"2"},{in:"1",out:""},{in:"30",out:"2 3 5 7 11 13 17 19 23 29"}],
  starter:R`#include <iostream>

int main() {
    int n = 0;
    std::cin >> n;

    return 0;
}`,hints:["The outer loop goes through each candidate k from 2 to n.","The inner loop is yesterday's prime test for k."],
  sol:R`#include <iostream>

int main() {
    int n = 0;
    std::cin >> n;
    for (int k = 2; k <= n; k++) {
        bool prime = true;
        for (int d = 2; d * d <= k; d++) {
            if (k % d == 0) {
                prime = false;
                break;
            }
        }
        if (prime) {
            std::cout << k << " ";
        }
    }
    std::cout << "\n";
    return 0;
}`,explain:"The prime flag has to reset to true for every new k, so it's created inside the outer loop. Tomorrow you'll package the prime test as a function, which tidies this right up."}]});

/* ======================= UNIT 4: FUNCTIONS ======================= */
DAYS.push({n:14,unit:"Functions",title:"Writing your own functions",
goal:"Package code into named, reusable functions.",
sections:[
 {h:"Why functions",p:"A function is a named piece of code you can run whenever you like, as often as you like, by calling its name. You've already used some: `main` is a function, and `std::max` is one from the library. Writing your own means you solve a problem once, give it a clear name, and stop copying code around."},
 {h:"Defining and calling",p:"A function has a return type (what kind of value it gives back), a name, parameters in brackets (the inputs), and a body. `return` hands the answer back to whoever called it. Functions go above `main` so the compiler has seen them before they're used.",code:R`#include <iostream>

int square(int x) {
    return x * x;
}

int main() {
    std::cout << square(4) << "\n";
    int a = square(3) + square(2);
    std::cout << a << "\n";
    return 0;
}`,out:"16\n13"},
 {h:"Parameters",p:"Parameters are variables that get their values from the call. In `square(4)`, the 4 is the argument, and it becomes `x` inside the function. A function can take several, separated by commas.",code:R`#include <iostream>

double average(double a, double b) {
    return (a + b) / 2;
}

int main() {
    std::cout << average(3, 4) << "\n";
    return 0;
}`,out:"3.5"},
 {h:"void: functions that just do something",p:"If a function doesn't give a value back, its return type is `void`. It can still print, change things and so on.",code:R`#include <iostream>

void line(int n) {
    for (int i = 0; i < n; i++) {
        std::cout << "-";
    }
    std::cout << "\n";
}

int main() {
    line(5);
    line(2);
    return 0;
}`,out:"-----\n--"},
 {h:"return ends the function",p:"As soon as `return` runs, the function stops and hands back its value. Code after it in the function is skipped. That's handy for answering early: in an `isPrime` function, return false the moment you find a divisor."}],
takeaways:["return type, name, (parameters), { body }.","`return` hands back a value and ends the function.","`void` functions return nothing.","Define functions above `main`."],
checks:[
 {t:"out",code:R`#include <iostream>

int sq(int x) {
    return x * x;
}

int main() {
    std::cout << sq(3) + sq(4);
    return 0;
}`,a:"25",why:"9 + 16 = 25."},
 {t:"out",code:R`#include <iostream>

int addTen(int n) {
    return n + 10;
}

int main() {
    std::cout << addTen(addTen(1));
    return 0;
}`,a:"21",why:"The inner call gives 11, and the outer call adds 10 more."},
 {t:"mc",q:"What return type should a function have if it only prints a message?",opts:["int","void","bool","print"],a:1,why:"`void` means it returns nothing."},
 {t:"out",code:R`#include <iostream>

int f(int x) {
    if (x > 5) {
        return 1;
    }
    return 2;
    std::cout << "never";
}

int main() {
    std::cout << f(9) << f(3);
    return 0;
}`,a:"12",why:"f(9) returns 1 early. f(3) returns 2. The cout after the return never runs."},
 {t:"mc",q:"In `int square(int x)`, what is `x`?",opts:["The return value","A parameter: it receives the value passed in the call","A global variable","The function's name"],a:1,why:"Parameters are the function's inputs."}],
problems:[
 {title:"Cube function",task:"Write a function `long long cube(long long x)` that returns x × x × x. In `main`, read a number and print its cube using your function.",tests:[{in:"3",out:"27"},{in:"-2",out:"-8"},{in:"1000",out:"1000000000"}],
  starter:R`#include <iostream>

// write cube here

int main() {
    long long n = 0;
    std::cin >> n;
    // print cube(n)

    return 0;
}`,hints:["`long long cube(long long x) { return x * x * x; }`","In main: `std::cout << cube(n) << \"\\n\";`"],
  sol:R`#include <iostream>

long long cube(long long x) {
    return x * x * x;
}

int main() {
    long long n = 0;
    std::cin >> n;
    std::cout << cube(n) << "\n";
    return 0;
}`,explain:"1000³ is a billion, close to the int limit. A slightly bigger input would overflow an int, so the function uses long long."},
 {title:"isPrime as a function",task:"Write `bool isPrime(int n)` that returns true if n is prime. Then read n and print how many primes there are from 1 to n.\n\nExample: input `20` → output `8`.",tests:[{in:"20",out:"8"},{in:"1",out:"0"},{in:"100",out:"25"}],
  starter:R`#include <iostream>

bool isPrime(int n) {
    // return true or false

    return false;
}

int main() {
    int n = 0;
    std::cin >> n;

    return 0;
}`,hints:["Inside isPrime: `if (n < 2) return false;` then loop d while `d * d <= n` and `return false` if d divides n. After the loop, `return true;`.","In main, count the k from 1 to n where `isPrime(k)` is true."],
  sol:R`#include <iostream>

bool isPrime(int n) {
    if (n < 2) {
        return false;
    }
    for (int d = 2; d * d <= n; d++) {
        if (n % d == 0) {
            return false;
        }
    }
    return true;
}

int main() {
    int n = 0;
    std::cin >> n;
    int count = 0;
    for (int k = 1; k <= n; k++) {
        if (isPrime(k)) {
            count++;
        }
    }
    std::cout << count << "\n";
    return 0;
}`,explain:"Compare this with yesterday's nested loops. The early `return false` replaces the flag and the break, and main reads almost like English."}]});

DAYS.push({n:15,unit:"Functions",title:"Parameters are copies, and scope",
goal:"Understand what a function can and can't see or change.",
sections:[
 {h:"Pass by value",p:"When you call a function, each parameter gets a copy of the argument. The function can change its copy however it likes, and the caller's variable is unaffected.",code:R`#include <iostream>

void addOne(int x) {
    x = x + 1;
    std::cout << "inside: " << x << "\n";
}

int main() {
    int a = 5;
    addOne(a);
    std::cout << "outside: " << a << "\n";
    return 0;
}`,out:"inside: 6\noutside: 5"},
 {h:"Scope: where a name exists",p:"A variable exists from where it's created to the closing brace of the block it's in. Variables in `main` can't be seen inside other functions, and vice versa. Two functions can each have their own variable called `x`; they're completely separate boxes."},
 {h:"Return it, don't print it",p:"A function that returns a value is more useful than one that prints it, because the caller can decide what to do with the result: print it, add it to something, compare it. Keep printing in `main` and let your functions calculate."},
 {h:"Default arguments",p:"You can give a parameter a default value. If the caller leaves it out, the default is used. Defaults go at the end of the parameter list.",code:R`#include <iostream>
#include <string>

void greet(std::string name, std::string greeting = "Hello") {
    std::cout << greeting << ", " << name << "\n";
}

int main() {
    greet("Ada");
    greet("Linus", "Hi");
    return 0;
}`,out:"Hello, Ada\nHi, Linus"},
 {h:"Functions calling functions",p:"Functions can call other functions. Building big programs out of small, well-named functions that each do one thing is most of what good code looks like."}],
takeaways:["Parameters are copies: changing them doesn't change the caller's variable.","A variable lives until the end of its block.","Prefer returning values over printing inside functions.","Default arguments fill in missing parameters."],
checks:[
 {t:"out",code:R`#include <iostream>

void addOne(int x) {
    x++;
}

int main() {
    int a = 5;
    addOne(a);
    std::cout << a;
    return 0;
}`,a:"5",why:"addOne changed its own copy. a is untouched."},
 {t:"out",code:R`#include <iostream>

int twice(int x) {
    x = x * 2;
    return x;
}

int main() {
    int a = 4;
    int b = twice(a);
    std::cout << a << " " << b;
    return 0;
}`,a:"4 8",why:"The doubled copy came back as the return value, but a is still 4."},
 {t:"out",code:R`#include <iostream>

int price(int qty, int unit = 3) {
    return qty * unit;
}

int main() {
    std::cout << price(2) << " " << price(2, 5);
    return 0;
}`,a:"6 10",why:"The first call uses the default unit of 3."},
 {t:"mc",q:"Why is `int total(...)` that returns its answer usually better than `void printTotal(...)`?",opts:["It runs faster","The caller can reuse the result: print it, compare it or add to it","void functions can't have parameters","It isn't: they're the same"],a:1,why:"A returned value can be used in any way the caller likes."}],
problems:[
 {title:"Grade function",task:"Write `char grade(int score)` using the rules from Day 8 (70+ A, 60+ B, 50+ C, else F). Read n, then n scores, and print the letter for each, separated by spaces.\n\nExample: input `3` then `72 55 40` → output `A C F`.",tests:[{in:"3\n72 55 40",out:"A C F"},{in:"1\n60",out:"B"},{in:"4\n100 0 69 50",out:"A F B C"}],
  starter:R`#include <iostream>

char grade(int score) {

    return 'F';
}

int main() {

    return 0;
}`,hints:["Inside grade: `if (score >= 70) return 'A';` and so on. No else needed, because return leaves straight away.","In main: loop n times, read a score, print `grade(score) << \" \"`."],
  sol:R`#include <iostream>

char grade(int score) {
    if (score >= 70) return 'A';
    if (score >= 60) return 'B';
    if (score >= 50) return 'C';
    return 'F';
}

int main() {
    int n = 0;
    std::cin >> n;
    for (int i = 0; i < n; i++) {
        int s = 0;
        std::cin >> s;
        std::cout << grade(s) << " ";
    }
    std::cout << "\n";
    return 0;
}`,explain:"Early returns make the chain flat and easy to read. The function has no idea where scores come from, which is exactly why it's reusable."},
 {title:"Power",task:"Write `long long power(long long base, int exp)` that returns base to the power exp (exp is 0 or more) using a loop. Read base and exp and print the result.\n\nExample: input `2 10` → output `1024`.",tests:[{in:"2 10",out:"1024"},{in:"5 0",out:"1"},{in:"-3 3",out:"-27"},{in:"10 15",out:"1000000000000000"}],
  starter:R`#include <iostream>

long long power(long long base, int exp) {

    return 0;
}

int main() {
    long long b = 0;
    int e = 0;
    std::cin >> b >> e;
    std::cout << power(b, e) << "\n";
    return 0;
}`,hints:["Start `long long result = 1;`","Multiply result by base, exp times."],
  sol:R`#include <iostream>

long long power(long long base, int exp) {
    long long result = 1;
    for (int i = 0; i < exp; i++) {
        result *= base;
    }
    return result;
}

int main() {
    long long b = 0;
    int e = 0;
    std::cin >> b >> e;
    std::cout << power(b, e) << "\n";
    return 0;
}`,explain:"`std::pow` in `<cmath>` exists, but it works in doubles, which can be slightly off for big whole numbers. For exact integer powers, a loop like this is safer."}]});

DAYS.push({n:16,unit:"Functions",title:"References: letting a function change things",
goal:"Use references to change the caller's variables and to avoid copying.",
sections:[
 {h:"The problem",p:"Yesterday `addOne(a)` couldn't change `a`, because the function got a copy. Sometimes you want the function to change the original, for example to swap two variables."},
 {h:"Reference parameters",p:"Put `&` after the type, as in `int& x`, and the parameter becomes a reference: another name for the caller's actual variable, not a copy. Changes to x are changes to a.",code:R`#include <iostream>

void addOne(int& x) {
    x++;
}

int main() {
    int a = 5;
    addOne(a);
    std::cout << a << "\n";
    return 0;
}`,out:"6"},
 {h:"Swap, properly",p:"With references, a swap function finally works.",code:R`#include <iostream>

void swapInts(int& a, int& b) {
    int temp = a;
    a = b;
    b = temp;
}

int main() {
    int x = 1, y = 2;
    swapInts(x, y);
    std::cout << x << " " << y << "\n";
    return 0;
}`,out:"2 1"},
 {h:"const references: no copy, no changes",p:"Copying a big thing, like a long string or a list of a million numbers, takes time. `const std::string& s` passes it without copying, and the `const` promises the function won't change it. That's the standard way to pass anything bigger than a number when you only need to read it. (`for (char ch : s)` below means: for each character in s. Day 19 covers it properly.)",code:R`#include <iostream>
#include <string>

int countA(const std::string& s) {
    int c = 0;
    for (char ch : s) {
        if (ch == 'a') c++;
    }
    return c;
}

int main() {
    std::cout << countA("banana") << "\n";
    return 0;
}`,out:"3"},
 {h:"References outside functions",p:"You can also make a reference variable: `int& r = a;` makes r another name for a. That's less common for now. The rule to remember for function parameters: small value you only read, pass by value; something to change, pass by reference; something big you only read, pass by const reference."}],
takeaways:["`int& x` is a reference: another name for the caller's variable.","Use a reference when a function must change its argument.","`const T&` passes big things without copying and without changing them.","Small and read-only: by value. Change it: `&`. Big and read-only: `const &`."],
checks:[
 {t:"out",code:R`#include <iostream>

void addOne(int& x) {
    x++;
}

int main() {
    int a = 5;
    addOne(a);
    addOne(a);
    std::cout << a;
    return 0;
}`,a:"7",why:"x is a itself, so each call increases a."},
 {t:"out",code:R`int a = 1;
int& r = a;
r = 7;
std::cout << a;`,a:"7",why:"r is another name for a, so assigning to r changes a."},
 {t:"mc",q:"Which signature lets `reset` set the caller's variable to 0?",opts:["`void reset(int x)`","`void reset(int& x)`","`void reset(const int& x)`","`int reset()`"],a:1,why:"Only a non-const reference can change the caller's variable."},
 {t:"out",code:R`#include <iostream>

void f(int a, int& b) {
    a = 10;
    b = 20;
}

int main() {
    int x = 1, y = 2;
    f(x, y);
    std::cout << x << " " << y;
    return 0;
}`,a:"1 20",why:"a was a copy of x, but b is y itself."},
 {t:"mc",q:"Why write `const std::string& s` instead of `std::string s`?",opts:["It lets the function change s","It avoids copying the string, and promises not to change it","It's required for strings","It makes s a number"],a:1,why:"No copy is made, and const stops accidental changes."}],
problems:[
 {title:"Swap function",task:"Write `void swapInts(int& a, int& b)`. Read two numbers, swap them with your function, and print them.\n\nExample: input `3 8` → output `8 3`.",tests:[{in:"3 8",out:"8 3"},{in:"-1 5",out:"5 -1"},{in:"4 4",out:"4 4"}],
  starter:R`#include <iostream>

void swapInts(int& a, int& b) {

}

int main() {
    int x = 0, y = 0;
    std::cin >> x >> y;
    swapInts(x, y);
    std::cout << x << " " << y << "\n";
    return 0;
}`,hints:["Same three lines as Day 3: temp = a, a = b, b = temp."],
  sol:R`#include <iostream>

void swapInts(int& a, int& b) {
    int temp = a;
    a = b;
    b = temp;
}

int main() {
    int x = 0, y = 0;
    std::cin >> x >> y;
    swapInts(x, y);
    std::cout << x << " " << y << "\n";
    return 0;
}`,explain:"Delete the two `&` symbols and run it again: nothing swaps. That's the whole difference between a copy and a reference."},
 {title:"Min and max out",task:"Write `void minMax(int a, int b, int c, int& lo, int& hi)` that puts the smallest of a, b, c in lo and the largest in hi. Read three numbers and print `lo hi`.",tests:[{in:"4 9 2",out:"2 9"},{in:"5 5 5",out:"5 5"},{in:"-1 -7 3",out:"-7 3"}],
  starter:R`#include <iostream>

void minMax(int a, int b, int c, int& lo, int& hi) {

}

int main() {
    int a = 0, b = 0, c = 0;
    std::cin >> a >> b >> c;
    int lo = 0, hi = 0;
    minMax(a, b, c, lo, hi);
    std::cout << lo << " " << hi << "\n";
    return 0;
}`,hints:["Start `lo = a; hi = a;`","Then compare with b and with c, updating lo and hi."],
  sol:R`#include <iostream>

void minMax(int a, int b, int c, int& lo, int& hi) {
    lo = a;
    hi = a;
    if (b < lo) lo = b;
    if (c < lo) lo = c;
    if (b > hi) hi = b;
    if (c > hi) hi = c;
}

int main() {
    int a = 0, b = 0, c = 0;
    std::cin >> a >> b >> c;
    int lo = 0, hi = 0;
    minMax(a, b, c, lo, hi);
    std::cout << lo << " " << hi << "\n";
    return 0;
}`,explain:"A function can only return one value, so references are one way to send back two. (Later options include returning a struct or a `std::pair`.)"}]});

DAYS.push({n:17,unit:"Functions",title:"Overloading and recursion",
goal:"Give one name to several versions of a function, and write functions that call themselves.",
sections:[
 {h:"Overloading",p:"Two functions can share a name if their parameter types differ. The compiler picks the right one from the arguments you pass. That's why `std::cout <<` works on ints, doubles and strings alike.",code:R`#include <iostream>
#include <string>

void describe(int x) {
    std::cout << "int " << x << "\n";
}

void describe(double x) {
    std::cout << "double " << x << "\n";
}

void describe(const std::string& s) {
    std::cout << "text " << s << "\n";
}

int main() {
    describe(3);
    describe(2.5);
    describe("hi");
    return 0;
}`,out:"int 3\ndouble 2.5\ntext hi"},
 {h:"Recursion: a function that calls itself",p:"Some problems contain a smaller copy of themselves. 5! is 5 × 4!, and 4! is 4 × 3!, and so on down to 1. A recursive function solves the small version by calling itself, and every recursive function needs a base case: an input simple enough to answer without calling itself again.",code:R`#include <iostream>

long long factorial(int n) {
    if (n <= 1) {
        return 1;
    }
    return n * factorial(n - 1);
}

int main() {
    std::cout << factorial(5) << "\n";
    return 0;
}`,out:"120"},
 {h:"Tracing it",p:"factorial(3) asks for 3 × factorial(2). That asks for 2 × factorial(1). factorial(1) hits the base case and returns 1. Then the answers come back up: 2 × 1 = 2, then 3 × 2 = 6. Each waiting call sits on the call stack until the call below it returns."},
 {h:"No base case, no end",p:"Without a base case, or with one that's never reached, the function calls itself forever until the program runs out of stack memory and crashes. That's a stack overflow. Before writing the recursive call, ask: does every call move closer to the base case?"},
 {h:"When to use it",p:"Anything recursion can do, a loop can do too. Recursion shines when the problem is naturally nested: trees, folders inside folders, trying every combination. For simple counting, a loop is usually clearer and faster."}],
takeaways:["Same name, different parameter types = overloading.","A recursive function calls itself on a smaller problem.","Always have a base case, and always move towards it.","Loops are often simpler; recursion suits nested problems."],
checks:[
 {t:"out",code:R`#include <iostream>

int half(int x) { return x / 2; }
double half(double x) { return x / 2; }

int main() {
    std::cout << half(7) << " " << half(7.0);
    return 0;
}`,a:"3 3.5",why:"7 is an int, so the int version runs and divides with whole numbers."},
 {t:"out",code:R`#include <iostream>

void down(int n) {
    if (n == 0) return;
    std::cout << n;
    down(n - 1);
}

int main() {
    down(3);
    return 0;
}`,a:"321",why:"It prints 3, then calls down(2), and so on until n is 0."},
 {t:"out",code:R`#include <iostream>

int f(int n) {
    if (n <= 1) return 1;
    return n * f(n - 1);
}

int main() {
    std::cout << f(4);
    return 0;
}`,a:"24",why:"4 × 3 × 2 × 1."},
 {t:"mc",q:"What happens when you call this?",code:R`int g(int n) {
    return g(n - 1) + 1;
}`,opts:["Returns n","Returns 0","Calls itself forever and crashes with a stack overflow","Compile error"],a:2,why:"There's no base case, so it never stops."},
 {t:"out",code:R`#include <iostream>

int fib(int n) {
    if (n < 2) return n;
    return fib(n - 1) + fib(n - 2);
}

int main() {
    std::cout << fib(6);
    return 0;
}`,a:"8",why:"0, 1, 1, 2, 3, 5, 8: fib(6) is 8."}],
problems:[
 {title:"Fibonacci",task:"The Fibonacci numbers start F(0) = 0, F(1) = 1, and each one after is the sum of the previous two. Write a recursive `long long fib(int n)`. Read n (0 to 30) and print F(n).",tests:[{in:"0",out:"0"},{in:"1",out:"1"},{in:"10",out:"55"},{in:"30",out:"832040"}],
  starter:R`#include <iostream>

long long fib(int n) {

    return 0;
}

int main() {
    int n = 0;
    std::cin >> n;
    std::cout << fib(n) << "\n";
    return 0;
}`,hints:["Base case: if n < 2, return n.","Otherwise return fib(n − 1) + fib(n − 2)."],
  sol:R`#include <iostream>

long long fib(int n) {
    if (n < 2) {
        return n;
    }
    return fib(n - 1) + fib(n - 2);
}

int main() {
    int n = 0;
    std::cin >> n;
    std::cout << fib(n) << "\n";
    return 0;
}`,explain:"This is beautiful but slow: fib(30) makes over a million calls, because it recalculates the same values again and again. A loop that keeps the last two numbers does it in 30 steps. Spotting that kind of waste is a big part of interview coding."},
 {title:"Recursive digit sum",task:"Write a recursive `int digitSum(int n)` for a non-negative n: the digit sum of n is its last digit plus the digit sum of the rest. Read n and print the result. No loops allowed.",tests:[{in:"4827",out:"21"},{in:"0",out:"0"},{in:"9",out:"9"},{in:"1000001",out:"2"}],
  starter:R`#include <iostream>

int digitSum(int n) {

    return 0;
}

int main() {
    int n = 0;
    std::cin >> n;
    std::cout << digitSum(n) << "\n";
    return 0;
}`,hints:["Base case: if n is 0, the sum is 0.","Otherwise: `return n % 10 + digitSum(n / 10);`"],
  sol:R`#include <iostream>

int digitSum(int n) {
    if (n == 0) {
        return 0;
    }
    return n % 10 + digitSum(n / 10);
}

int main() {
    int n = 0;
    std::cin >> n;
    std::cout << digitSum(n) << "\n";
    return 0;
}`,explain:"Compare it with Day 10's loop. Same idea: each call peels off one digit and n / 10 moves towards the base case."}]});
