"use strict";
/* C++ Daily course, part 1: Units 1–2.
   Day shape:
   {n, unit, title, goal, sections:[{h, p, code?, in?, out?}], takeaways:[], checks:[...], problems:[...]}
   Text in p/q/why/task: `backticks` render as inline code, a blank line starts a new paragraph.
   Checks: {t:"mc", q, code?, opts:[], a:<index>, why}  or  {t:"out", q?, code, in?, a:"<expected output>", why}
   Code without "main(" is wrapped in a main() with the common headers, for running and checking.
   Problems: {title, task, tests:[{in, out}], starter, hints:[], sol, explain}
   Run `node tools/verify.js` after editing: it compiles every example, check and solution. */
const DAYS=[];
const R=String.raw;

/* ======================= UNIT 1: FIRST STEPS ======================= */
DAYS.push({n:1,unit:"First steps",title:"What a program is, and your first one",
goal:"Write, run and fix a program that prints a message.",
sections:[
 {h:"What programming actually is",p:"A computer is very fast and completely literal. It does exactly what it is told, in order, and nothing else. A program is a list of those instructions.\n\nYou write the instructions as text in a programming language, here C++. That text is called source code. A computer can't run source code directly, so a tool called a compiler translates it into a program the machine can run. If your code breaks the rules of the language, the compiler refuses and tells you where."},
 {h:"Your first program",p:"Every C++ program you write for a while will look like this. Read it once, then we'll go line by line.",
  code:R`#include <iostream>

int main() {
    std::cout << "Hello, world!\n";
    return 0;
}`,out:"Hello, world!"},
 {h:"Line by line",p:"`#include <iostream>` pulls in the part of the standard library that handles input and output. Without it, the compiler doesn't know what `std::cout` is.\n\n`int main() { ... }` is where your program starts. The computer runs the lines between the curly braces `{ }`, top to bottom. Every program has exactly one `main`.\n\n`std::cout << \"Hello, world!\\n\";` sends text to the screen. `cout` means character output, and `std::` says it comes from the standard library. The text goes inside double quotes. `\\n` means new line. The semicolon `;` ends the instruction, like a full stop ends a sentence.\n\n`return 0;` tells whoever started the program that it finished without problems."},
 {h:"Where you'll write code",p:"Each day has problems with a code box. Type your code there and press Run to compile and run it, or Check to test it against the answer. Your code goes to Compiler Explorer (godbolt.org), a free online compiler, so you don't need to install anything yet. The Course tab explains how to install a compiler on your own laptop when you want to."},
 {h:"When it goes wrong",p:"You will see compiler errors constantly. That's normal, even for professionals. An error message names a line number and what it expected. Fix the first error first: one missing semicolon can cause a dozen errors below it, and they all vanish once the first is fixed."}],
takeaways:["A compiler turns your source code into a program.","The program starts at `main` and runs top to bottom.","`std::cout << \"text\";` prints text. Every instruction ends with `;`.","Read the first compiler error first."],
checks:[
 {t:"mc",q:"What does the compiler do?",opts:["Runs your code line by line as you type","Translates your source code into a program the computer can run","Fixes mistakes in your code automatically","Saves your code to the internet"],a:1,why:"The compiler translates. If your code breaks the language's rules, it stops and reports errors instead of fixing them."},
 {t:"mc",q:"Where does a C++ program start running?",opts:["At the first line of the file","At `#include <iostream>`","Inside `main`","At `return 0;`"],a:2,why:"Execution always begins at the first line inside `main`'s braces."},
 {t:"mc",q:"Why won't this compile?",code:R`#include <iostream>

int main() {
    std::cout << "Hi"
    return 0;
}`,opts:["`main` should be called `start`","The `std::cout` line is missing its semicolon","You can't print the word Hi","`return 0` should come first"],a:1,why:"Each instruction ends with `;`. The compiler will usually point at the next line, because that's where it realised something was missing."},
 {t:"out",q:"What does this print? Type it exactly.",code:R`std::cout << "Hi";
std::cout << "there";`,a:"Hithere",why:"`cout` prints exactly what you give it. No spaces or new lines are added for you, so the two words run together."},
 {t:"mc",q:"What happens if you delete `#include <iostream>`?",opts:["Nothing, it's optional","The program prints nothing but compiles","The compiler doesn't know what `std::cout` is and gives an error","The program runs slower"],a:2,why:"`std::cout` is defined in `<iostream>`. No include, no `cout`."}],
problems:[
 {title:"Say hello",task:"Print exactly `Hello, C++!` (capital H, a comma, a space, and an exclamation mark).",tests:[{in:"",out:"Hello, C++!"}],
  starter:R`#include <iostream>

int main() {
    // Write your line here

    return 0;
}`,hints:["Copy the shape of `std::cout << \"Hello, world!\\n\";` and change the text.","Check the punctuation: the checker compares your output character by character."],
  sol:R`#include <iostream>

int main() {
    std::cout << "Hello, C++!\n";
    return 0;
}`,explain:"The text between the quotes is printed exactly as written. The `\\n` just ends the line."},
 {title:"Fix the broken program",starterBroken:true,task:"This program has three mistakes, so it won't compile. Fix them so it prints `I fixed it`.\n\nTip: press Run first and read the compiler's error.",tests:[{in:"",out:"I fixed it"}],
  starter:R`#include <iostream>

int main() {
    std::Cout << "I fixed it\n"
    return 0;
`,hints:["The first error is a missing semicolon at the end of the `cout` line.","C++ is case-sensitive: `Cout` and `cout` are different names, and only `cout` exists.","Every `{` needs a matching `}`. Is `main` closed?"],
  sol:R`#include <iostream>

int main() {
    std::cout << "I fixed it\n";
    return 0;
}`,explain:"A missing semicolon, a wrong capital letter and a missing brace: three tiny slips, and none of them would let the program build. The compiler pointed you at each one. Getting used to reading its messages is half of learning C++."}]});

DAYS.push({n:2,unit:"First steps",title:"Printing text, numbers and new lines",
goal:"Control exactly what appears on screen.",
sections:[
 {h:"Chaining with <<",p:"You can send several things to `std::cout` in one line by repeating `<<`. Think of `<<` as an arrow pushing each item onto the screen, in order.",code:R`std::cout << "I am " << 20 << " years old\n";`,out:"I am 20 years old"},
 {h:"New lines",p:"`\\n` inside quotes starts a new line. You'll also see `std::endl`, which does the same and also forces the output to appear immediately. Use `\\n` by default: it's faster, and that matters when you print a lot.",code:R`std::cout << "line one\n";
std::cout << "line two" << std::endl;
std::cout << "a\nb\n";`,out:"line one\nline two\na\nb"},
 {h:"Numbers and maths",p:"Without quotes, C++ treats numbers as numbers and works out the maths first. With quotes, it's just text.",code:R`std::cout << 2 + 3 << "\n";
std::cout << "2 + 3" << "\n";
std::cout << "2 + 3 = " << 2 + 3 << "\n";`,out:"5\n2 + 3\n2 + 3 = 5"},
 {h:"Special characters",p:"Some characters need a backslash in front inside quotes. These are called escape sequences: `\\\"` prints a double quote, `\\\\` prints a backslash and `\\t` prints a tab.",code:R`std::cout << "She said \"hi\"\n";
std::cout << "C:\\Users\n";`,out:R`She said "hi"
C:\Users`},
 {h:"Comments",p:"Text after `//` is a comment: the compiler ignores it until the end of the line. `/* ... */` comments out everything between them, across lines. Use comments to explain why you did something, not what each line does.",code:R`// This whole line is ignored
std::cout << "shown\n"; // so is this part
/* and this
   too */`,out:"shown"}],
takeaways:["Chain items with `<<`. Nothing is added between them.","`\\n` = new line. Prefer it to `std::endl`.","No quotes = a value C++ works out. Quotes = text.","`//` and `/* */` are comments the compiler ignores."],
checks:[
 {t:"out",code:R`std::cout << "2 + 3 = " << 2 + 3;`,a:"2 + 3 = 5",why:"The quoted part is printed as text; the unquoted `2 + 3` is calculated."},
 {t:"out",q:"What does this print? If there are several lines, separate them with spaces.",code:R`std::cout << "a\nb\nc";`,a:"a b c",why:"Each `\\n` moves to a new line, so you get a, b and c on three lines."},
 {t:"out",code:R`std::cout << 10 << 20;`,a:"1020",why:"`cout` doesn't add a space between items, so 10 and 20 sit side by side."},
 {t:"mc",q:"Which line prints a double quote character?",opts:[R`std::cout << """;`,R`std::cout << "\"";`,R`std::cout << '"' + '"';`,R`std::cout << "/"";`],a:1,why:"Inside quotes, `\\\"` means a literal double quote. Option A ends the text early and confuses the compiler."},
 {t:"out",code:R`std::cout << "start"; // std::cout << "middle";
std::cout << "end";`,a:"startend",why:"Everything after `//` is ignored, including the second `cout`."}],
problems:[
 {title:"Receipt",task:"Print this receipt exactly, on three lines:\n\n`Coffee 3`\n`Cake 4`\n`Total 7`\n\nCalculate the 7 with `3 + 4` instead of typing it.",tests:[{in:"",out:"Coffee 3\nCake 4\nTotal 7"}],
  starter:R`#include <iostream>

int main() {
    std::cout << "Coffee " << 3 << "\n";
    // two more lines

    return 0;
}`,hints:["The first line is done for you. Copy its pattern.","For the total: `std::cout << \"Total \" << 3 + 4 << \"\\n\";`"],
  sol:R`#include <iostream>

int main() {
    std::cout << "Coffee " << 3 << "\n";
    std::cout << "Cake " << 4 << "\n";
    std::cout << "Total " << 3 + 4 << "\n";
    return 0;
}`,explain:"Note the space inside `\"Total \"`. Without it you'd print `Total7`."},
 {title:"Quote me",task:"Print exactly:\n\n`She said \"C++ is fun\" \\o/`",tests:[{in:"",out:R`She said "C++ is fun" \o/`}],
  starter:R`#include <iostream>

int main() {

    return 0;
}`,hints:["You need `\\\"` for each double quote.","A single backslash is written `\\\\` inside quotes."],
  sol:R`#include <iostream>

int main() {
    std::cout << "She said \"C++ is fun\" \\o/\n";
    return 0;
}`,explain:"Backslash starts an escape sequence, so to print a real backslash you escape it with another one."}]});

DAYS.push({n:3,unit:"First steps",title:"Variables: giving values a name",
goal:"Store values, change them and print them.",
sections:[
 {h:"A labelled box",p:"A variable is a named box that holds a value. Every box has a type, which says what kind of value fits in it. You create one by writing the type, a name, and usually a starting value.",code:R`int age = 20;
std::cout << "Age: " << age << "\n";`,out:"Age: 20"},
 {h:"= means store, not equals",p:"`=` doesn't mean the two sides are equal. It means: work out the right-hand side, then put the result in the box on the left. That's why `count = count + 1;` makes sense: take the current count, add one, store it back.",code:R`int count = 5;
count = count + 1;
count = count * 2;
std::cout << count << "\n";`,out:"12"},
 {h:"The basic types",p:"`int` holds whole numbers (-3, 0, 42). `double` holds decimals (3.14, -0.5). `char` holds one character in single quotes ('A'). `bool` holds `true` or `false`. `std::string` holds text in double quotes and needs `#include <string>`.",code:R`#include <iostream>
#include <string>

int main() {
    int lots = 3;
    double price = 19.99;
    char grade = 'A';
    bool open = true;
    std::string name = "Ada";
    std::cout << name << " bought " << lots << " at " << price << "\n";
    std::cout << grade << " " << open << "\n";
    return 0;
}`,out:"Ada bought 3 at 19.99\nA 1"},
 {h:"Names and copies",p:"Names can use letters, digits and `_`, but can't start with a digit or contain spaces. Case matters: `price` and `Price` are different. Pick names that say what the value means.\n\nWhen you write `int b = a;`, `b` gets a copy of `a`'s value at that moment. Changing `a` later doesn't change `b`."},
 {h:"Always give a starting value",p:"If you write `int x;` without a value, the box contains leftover garbage from memory, and reading it is a bug. Always initialise: `int x = 0;`. You may also see the brace style `int x{0};`, which means the same thing."}],
takeaways:["A variable = type + name + value.","`=` stores the right side into the left.","int, double, char, bool, std::string.","Copies are independent. Always initialise."],
checks:[
 {t:"out",code:R`int a = 5;
a = a + 2;
std::cout << a;`,a:"7",why:"`a + 2` is 7, which is stored back in `a`."},
 {t:"mc",q:"Which type should hold a price like 3.75?",opts:["int","double","char","bool"],a:1,why:"`double` holds decimals. An `int` would throw away the .75."},
 {t:"mc",q:"Which of these is not a valid variable name?",opts:["total_cost","x2","2ndPlace","firstName"],a:2,why:"Names can't start with a digit."},
 {t:"out",code:R`int x = 3;
int y = x;
x = 10;
std::cout << y;`,a:"3",why:"`y` got a copy of 3. Changing `x` afterwards doesn't affect it."},
 {t:"mc",q:"What's the difference between `'A'` and `\"A\"`?",opts:["None","`'A'` is a char (one character), `\"A\"` is text (a string)","`'A'` is a comment","`\"A\"` is a number"],a:1,why:"Single quotes hold exactly one character. Double quotes hold text of any length."}],
problems:[
 {title:"About me",task:"Create a `std::string` called `name` set to `Sam` and an `int` called `age` set to `19`. Use them to print exactly:\n\n`Sam is 19 years old.`",tests:[{in:"",out:"Sam is 19 years old."}],
  starter:R`#include <iostream>
#include <string>

int main() {
    // create the two variables

    // print the sentence using them

    return 0;
}`,hints:["`std::string name = \"Sam\";`","Print with `std::cout << name << \" is \" << age << \" years old.\\n\";` and watch the spaces."],
  sol:R`#include <iostream>
#include <string>

int main() {
    std::string name = "Sam";
    int age = 19;
    std::cout << name << " is " << age << " years old.\n";
    return 0;
}`,explain:"Change the two values and the sentence updates. That's the point of variables."},
 {title:"Swap two boxes",task:"`a` holds 4 and `b` holds 9. Swap their values using a third variable, then print `a=9 b=4`.\n\nDon't just type the numbers in the print line: the swap is the exercise.",tests:[{in:"",out:"a=9 b=4"}],
  starter:R`#include <iostream>

int main() {
    int a = 4;
    int b = 9;
    // swap them here

    std::cout << "a=" << a << " b=" << b << "\n";
    return 0;
}`,hints:["If you write `a = b;` first, the 4 is lost forever. Save it somewhere first.","`int temp = a;` then `a = b;` then `b = temp;`"],
  sol:R`#include <iostream>

int main() {
    int a = 4;
    int b = 9;
    int temp = a;
    a = b;
    b = temp;
    std::cout << "a=" << a << " b=" << b << "\n";
    return 0;
}`,explain:"Like swapping drinks between two full glasses: you need an empty third glass. Later you'll meet `std::swap(a, b)`, which does this for you."}]});

DAYS.push({n:4,unit:"First steps",title:"Reading input",
goal:"Make programs that respond to what the user types.",
sections:[
 {h:"std::cin",p:"`std::cin` is the keyboard (character input). `>>` takes what was typed and stores it in a variable. The arrows point the way the data flows: out to the screen with `<<`, in to your variable with `>>`.",code:R`int n = 0;
std::cin >> n;
std::cout << n * 2 << "\n";`,in:"21",out:"42"},
 {h:"Several values at once",p:"Chain `>>` to read several values. Spaces and new lines both separate values, so `3 4` on one line and 3 and 4 on separate lines read the same.",code:R`int a = 0, b = 0;
std::cin >> a >> b;
std::cout << a + b << "\n";`,in:"3 4",out:"7"},
 {h:"Words and whole lines",p:"Reading into a `std::string` with `>>` takes one word: it stops at the first space. To read a whole line including spaces, use `std::getline(std::cin, line);`.",code:R`std::string first;
std::cin >> first;
std::cout << "Hi " << first << "\n";`,in:"Ada Lovelace",out:"Hi Ada"},
 {h:"Prompts, and how the checker works",p:"In a real program you'd print a prompt like `Enter a number:` before reading. In this course's problems, don't: the checker types the input for you and compares everything your program prints with the expected answer. A prompt would be extra output and fail the check.\n\nTo try your own input, type it in the Input box under the code and press Run."}],
takeaways:["`std::cin >> x;` reads a value into x.","Spaces and new lines separate values.","`>>` into a string reads one word; `std::getline` reads a line.","No prompts in the problems."],
checks:[
 {t:"mc",q:"The user types `7 8`. After `std::cin >> a >> b;`, what is `a`?",opts:["78","7","8","15"],a:1,why:"The space separates the two values: a gets 7, b gets 8."},
 {t:"mc",q:"The user types `Ada Lovelace`. After `std::cin >> name;` (name is a string), what's in `name`?",opts:["Ada Lovelace","Ada","Lovelace","Nothing"],a:1,why:"`>>` stops at whitespace. Use `std::getline` for the whole line."},
 {t:"out",q:"The input is `5 6`. What does this print?",code:R`int x = 0, y = 0;
std::cin >> x >> y;
std::cout << y << x;`,in:"5 6",a:"65",why:"x is 5, y is 6, and it prints y first with nothing between them."},
 {t:"mc",q:"Which line reads a number into `n`?",opts:["`std::cin << n;`","`std::cout >> n;`","`std::cin >> n;`","`n = std::cin;`"],a:2,why:"Input flows from `cin` into `n`, so the arrows `>>` point at `n`."},
 {t:"out",q:"The input is `10`. What does this print?",code:R`int n = 0;
std::cin >> n;
n = n - 3;
std::cout << n * n;`,in:"10",a:"49",why:"n becomes 10, then 7, and 7 × 7 = 49."}],
problems:[
 {title:"Double it",task:"Read one whole number and print double it.\n\nExample: input `21` → output `42`.",tests:[{in:"21",out:"42"},{in:"-5",out:"-10"},{in:"0",out:"0"}],
  starter:R`#include <iostream>

int main() {
    int n = 0;
    // read n, then print n doubled

    return 0;
}`,hints:["`std::cin >> n;`","Print `n * 2`."],
  sol:R`#include <iostream>

int main() {
    int n = 0;
    std::cin >> n;
    std::cout << n * 2 << "\n";
    return 0;
}`,explain:"The checker ran this three times with different inputs. Testing the zero and negative cases is a habit worth stealing."},
 {title:"Greeting",task:"Read a first name (one word) and print `Hello, NAME!`.\n\nExample: input `Priya` → output `Hello, Priya!`.",tests:[{in:"Priya",out:"Hello, Priya!"},{in:"Tom",out:"Hello, Tom!"}],
  starter:R`#include <iostream>
#include <string>

int main() {

    return 0;
}`,hints:["Make a `std::string name;` and read into it with `std::cin >> name;`.","Print three pieces: `\"Hello, \"`, `name`, `\"!\\n\"`."],
  sol:R`#include <iostream>
#include <string>

int main() {
    std::string name;
    std::cin >> name;
    std::cout << "Hello, " << name << "!\n";
    return 0;
}`,explain:"A `std::string` starts empty, so `std::string name;` is fine without a starting value."},
 {title:"Sum of three",task:"Read three whole numbers and print their sum.\n\nExample: input `1 2 3` → output `6`.",tests:[{in:"1 2 3",out:"6"},{in:"10 -4 7",out:"13"},{in:"100\n200\n300",out:"600"}],
  starter:R`#include <iostream>

int main() {

    return 0;
}`,hints:["Make three `int` variables set to 0.","`std::cin >> a >> b >> c;`"],
  sol:R`#include <iostream>

int main() {
    int a = 0, b = 0, c = 0;
    std::cin >> a >> b >> c;
    std::cout << a + b + c << "\n";
    return 0;
}`,explain:"The third test put each number on its own line. `>>` treats new lines like spaces, so it still works."}]});

DAYS.push({n:5,unit:"First steps",title:"Arithmetic and the integer division trap",
goal:"Use + − × ÷ and remainder correctly, and know when C++ throws away decimals.",
sections:[
 {h:"The operators",p:"`+` add, `-` subtract, `*` multiply, `/` divide, `%` remainder. Multiplication and division happen before addition and subtraction, just like in maths. Use brackets whenever you're unsure.",code:R`std::cout << 2 + 3 * 4 << "\n";
std::cout << (2 + 3) * 4 << "\n";`,out:"14\n20"},
 {h:"Integer division drops the decimals",p:"When both sides of `/` are `int`, the answer is an `int`, and the fraction is thrown away (not rounded). This catches everyone at least once. If either side is a `double`, you get the decimal answer.",code:R`std::cout << 7 / 2 << "\n";
std::cout << 7.0 / 2 << "\n";
std::cout << 9 / 10 << "\n";`,out:"3\n3.5\n0"},
 {h:"Remainder with %",p:"`a % b` gives what's left over after dividing a by b. It's more useful than it looks: `n % 2` is 0 for even numbers, `n % 10` is the last digit, and `n / 10` removes the last digit.",code:R`std::cout << 17 % 5 << "\n";
std::cout << 4827 % 10 << " " << 4827 / 10 << "\n";`,out:"2\n7 482"},
 {h:"Shortcuts",p:"`x += 3;` means `x = x + 3;`. The same works for `-=`, `*=`, `/=` and `%=`. `x++;` adds one and `x--;` subtracts one.",code:R`int x = 5;
x += 3;
x *= 2;
x--;
std::cout << x << "\n";`,out:"15"}],
takeaways:["int / int = int: the fraction is dropped.","Make one side a double to get decimals.","`%` gives the remainder: even/odd, last digit.","`+=`, `*=`, `++`, `--` are shortcuts."],
checks:[
 {t:"out",code:R`std::cout << 7 / 2;`,a:"3",why:"Both are ints, so the .5 is dropped."},
 {t:"out",code:R`std::cout << 7 % 3;`,a:"1",why:"7 = 2 × 3 + 1. The remainder is 1."},
 {t:"out",code:R`std::cout << 2 + 3 * 4;`,a:"14",why:"Multiply first: 3 × 4 = 12, then add 2."},
 {t:"out",code:R`int x = 5;
x += 3;
x *= 2;
std::cout << x;`,a:"16",why:"5 + 3 = 8, then 8 × 2 = 16."},
 {t:"out",code:R`int total = 10;
int people = 4;
std::cout << total / people;`,a:"2",why:"10 / 4 is 2.5 in maths, but int / int gives 2. You'll fix this properly tomorrow."}],
problems:[
 {title:"Hours and minutes",task:"Read a number of minutes and print it as hours and minutes.\n\nExample: input `135` → output `2 hours 15 minutes`.",tests:[{in:"135",out:"2 hours 15 minutes"},{in:"60",out:"1 hours 0 minutes"},{in:"59",out:"0 hours 59 minutes"}],
  starter:R`#include <iostream>

int main() {
    int total = 0;
    std::cin >> total;
    // work out hours and minutes

    return 0;
}`,hints:["How many whole hours are in 135 minutes? Integer division by 60.","What's left over? That's a remainder: `%`."],
  sol:R`#include <iostream>

int main() {
    int total = 0;
    std::cin >> total;
    int hours = total / 60;
    int minutes = total % 60;
    std::cout << hours << " hours " << minutes << " minutes\n";
    return 0;
}`,explain:"Here integer division is exactly what you want. `/` and `%` together split a number into 'how many whole groups' and 'what's left'. ('1 hours' reads badly. Fixing that needs an `if`, which is in a couple of days.)"},
 {title:"Split the number",task:"Read a positive whole number. Print its last digit, a space, then the number with its last digit removed.\n\nExample: input `4827` → output `7 482`.",tests:[{in:"4827",out:"7 482"},{in:"50",out:"0 5"},{in:"9",out:"9 0"}],
  starter:R`#include <iostream>

int main() {

    return 0;
}`,hints:["Last digit: `n % 10`.","The rest: `n / 10`."],
  sol:R`#include <iostream>

int main() {
    int n = 0;
    std::cin >> n;
    std::cout << n % 10 << " " << n / 10 << "\n";
    return 0;
}`,explain:"Remember this trick. Repeat it in a loop and you can visit every digit of a number, which you'll do on Day 10."},
 {title:"Average of two",task:"Read two whole numbers and print their average, with decimals if needed.\n\nExample: input `3 4` → output `3.5`.",tests:[{in:"3 4",out:"3.5"},{in:"10 20",out:"15"},{in:"-1 2",out:"0.5"}],
  starter:R`#include <iostream>

int main() {
    int a = 0, b = 0;
    std::cin >> a >> b;
    std::cout << (a + b) / 2 << "\n"; // this is wrong for 3 and 4: why?
    return 0;
}`,hints:["`(a + b) / 2` is int / int, so 3.5 becomes 3.","Divide by `2.0` instead of `2`."],
  sol:R`#include <iostream>

int main() {
    int a = 0, b = 0;
    std::cin >> a >> b;
    std::cout << (a + b) / 2.0 << "\n";
    return 0;
}`,explain:"`2.0` is a double, so the whole division is done with decimals. Notice that 15.0 prints as `15`: `cout` hides a pointless `.0`."}]});

DAYS.push({n:6,unit:"First steps",title:"Types, conversions and constants",
goal:"Convert between int and double on purpose, and protect values that shouldn't change.",
sections:[
 {h:"Mixing int and double",p:"When an `int` and a `double` meet in a calculation, the int is converted to a double first, so the answer is a double. Two ints stay an int.",code:R`int lots = 3;
double price = 2.5;
std::cout << lots * price << "\n";
std::cout << 5 / 2.0 << "\n";`,out:"7.5\n2.5"},
 {h:"static_cast: converting on purpose",p:"`static_cast<double>(x)` gives you x as a double. That's the clean fix for yesterday's average problem when both values are ints. Going the other way, `static_cast<int>(9.99)` chops off the decimals and gives 9. It doesn't round.",code:R`int total = 10, people = 4;
std::cout << static_cast<double>(total) / people << "\n";
std::cout << static_cast<int>(9.99) << "\n";`,out:"2.5\n9"},
 {h:"const: values that never change",p:"Put `const` in front of a variable that should never change, like a tax rate. If any later line tries to change it, the program won't compile. That's a good thing: the compiler catches your mistake for you.",code:R`const double VAT = 0.2;
double net = 50.0;
std::cout << net * (1 + VAT) << "\n";`,out:"60"},
 {h:"How big can an int get?",p:"An `int` holds roughly −2.1 billion to +2.1 billion. Go past that and it overflows, which is a bug that gives nonsense answers. For bigger whole numbers use `long long`, which goes up to about 9 × 10^18.",code:R`long long population = 8000000000;
std::cout << population * 2 << "\n";`,out:"16000000000"},
 {h:"auto",p:"`auto x = 5;` lets the compiler pick the type from the starting value: here `int`. `auto y = 5.0;` makes a `double`. It saves typing, but while you're learning, writing the type yourself helps you notice what you're working with."}],
takeaways:["int with double → double.","`static_cast<double>(x)` converts on purpose. Casting to int chops, it doesn't round.","`const` stops a value from ever changing.","Past ~2 billion, use `long long`."],
checks:[
 {t:"out",code:R`int a = 7, b = 2;
std::cout << static_cast<double>(a) / b;`,a:"3.5",why:"a becomes 7.0, so the division keeps the decimal."},
 {t:"out",code:R`std::cout << static_cast<int>(9.99);`,a:"9",why:"Converting to int chops off the decimals. It doesn't round to 10."},
 {t:"mc",q:"What happens here?",code:R`const int lives = 3;
lives = 2;`,opts:["lives becomes 2","lives stays 3 silently","Compile error: you can't change a const","The program crashes when run"],a:2,why:"The compiler refuses to build code that changes a `const`."},
 {t:"out",code:R`std::cout << 5 / 2 << " " << 5 / 2.0;`,a:"2 2.5",why:"The first is int / int, the second has a double."},
 {t:"mc",q:"Which type should hold 10 billion?",opts:["int","long long","char","bool"],a:1,why:"10 billion is well past an int's limit of about 2.1 billion."}],
problems:[
 {title:"Pizza split",task:"Read the number of slices and the number of people (both whole numbers). Print how many slices each person gets, with decimals if needed.\n\nExample: input `7 2` → output `3.5`.",tests:[{in:"7 2",out:"3.5"},{in:"8 4",out:"2"},{in:"1 4",out:"0.25"}],
  starter:R`#include <iostream>

int main() {
    int slices = 0, people = 0;
    std::cin >> slices >> people;

    return 0;
}`,hints:["`slices / people` is int / int, so 3.5 would become 3.","`static_cast<double>(slices) / people`"],
  sol:R`#include <iostream>

int main() {
    int slices = 0, people = 0;
    std::cin >> slices >> people;
    std::cout << static_cast<double>(slices) / people << "\n";
    return 0;
}`,explain:"Cast one side before dividing. `static_cast<double>(slices / people)` would be too late: the division would already have dropped the decimals."},
 {title:"Celsius to Fahrenheit",task:"Read a temperature in Celsius (it may have decimals) and print it in Fahrenheit: F = C × 9 / 5 + 32.\n\nExample: input `100` → output `212`.",tests:[{in:"100",out:"212"},{in:"37",out:"98.6"},{in:"-40",out:"-40"}],
  starter:R`#include <iostream>

int main() {

    return 0;
}`,hints:["Read into a `double`, not an `int`, because the input may have decimals.","`double f = c * 9 / 5 + 32;`"],
  sol:R`#include <iostream>

int main() {
    double c = 0.0;
    std::cin >> c;
    double f = c * 9 / 5 + 32;
    std::cout << f << "\n";
    return 0;
}`,explain:"Because `c` is a double, `c * 9` is a double, and so is everything after it. If `c` were an int, 37 × 9 / 5 would give 66, not 66.6."}]});

/* ======================= UNIT 2: DECISIONS ======================= */
DAYS.push({n:7,unit:"Making decisions",title:"if and else",
goal:"Make a program do different things depending on a condition.",
sections:[
 {h:"Comparisons",p:"A comparison asks a yes/no question and gives a `bool`: `true` or `false`. The operators are `==` (equal), `!=` (not equal), `<`, `>`, `<=` and `>=`. If you print a bool, `true` shows as 1 and `false` as 0.",code:R`std::cout << (3 < 5) << " " << (3 == 5) << "\n";`,out:"1 0"},
 {h:"if",p:"`if (condition) { ... }` runs the code in the braces only when the condition is true. Otherwise it skips it.",code:R`int balance = 30;
if (balance < 50) {
    std::cout << "Low balance\n";
}
std::cout << "Done\n";`,out:"Low balance\nDone"},
 {h:"else",p:"`else { ... }` runs when the condition is false. Exactly one of the two blocks runs, never both.",code:R`int n = 7;
if (n % 2 == 0) {
    std::cout << "even\n";
} else {
    std::cout << "odd\n";
}`,out:"odd"},
 {h:"The = vs == trap",p:"`=` stores a value; `==` compares. `if (x = 5)` stores 5 in x and counts as true, every single time. It's one of the most common C++ bugs. The compiler will warn you about it if you turn warnings on, and the Run button here does."},
 {h:"Always use braces",p:"Without braces, `if` only controls the single next line. Indentation means nothing to the compiler, so code can look as if it's inside an `if` when it isn't. Use braces every time and you'll never hit this."}],
takeaways:["Comparisons give true (1) or false (0).","`if` runs a block only when the condition is true; `else` covers the rest.","`==` compares, `=` stores.","Always use braces."],
checks:[
 {t:"out",code:R`int x = 5;
if (x > 3) {
    std::cout << "big";
} else {
    std::cout << "small";
}`,a:"big",why:"5 > 3 is true, so the first block runs."},
 {t:"out",code:R`std::cout << (4 == 4) << (4 != 4);`,a:"10",why:"true prints as 1, false as 0."},
 {t:"mc",q:"What's the bug?",code:R`int x = 2;
if (x = 5) {
    std::cout << "five\n";
}`,opts:["Missing semicolon after the if","`=` stores 5 instead of comparing, so it always prints","`5` should be in quotes","Nothing, it prints nothing"],a:1,why:"It should be `==`. As written, x becomes 5 and the condition counts as true."},
 {t:"out",q:"Careful with the braces. What does this print?",code:R`if (false)
    std::cout << "A";
    std::cout << "B";`,a:"B",why:"Without braces the `if` controls only the next line. The indentation of the B line is a lie."},
 {t:"out",code:R`int score = 50;
if (score >= 50) {
    std::cout << "pass";
} else {
    std::cout << "fail";
}`,a:"pass",why:"`>=` includes equality, and 50 >= 50 is true."}],
problems:[
 {title:"Even or odd",task:"Read a whole number and print `even` or `odd`. Negative numbers count too.",tests:[{in:"4",out:"even"},{in:"7",out:"odd"},{in:"-3",out:"odd"},{in:"0",out:"even"}],
  starter:R`#include <iostream>

int main() {
    int n = 0;
    std::cin >> n;

    return 0;
}`,hints:["An even number has remainder 0 when divided by 2.","Careful: in C++, `-3 % 2` is `-1`, not `1`. So test `n % 2 == 0` for even, not `n % 2 == 1` for odd."],
  sol:R`#include <iostream>

int main() {
    int n = 0;
    std::cin >> n;
    if (n % 2 == 0) {
        std::cout << "even\n";
    } else {
        std::cout << "odd\n";
    }
    return 0;
}`,explain:"Checking `n % 2 == 1` fails for negative odd numbers, because the remainder keeps the sign. Testing the case you're sure about (0) and letting `else` catch the rest avoids the problem."},
 {title:"The bigger one",task:"Read two whole numbers and print the larger. If they're equal, print that number.",tests:[{in:"3 9",out:"9"},{in:"12 -4",out:"12"},{in:"5 5",out:"5"}],
  starter:R`#include <iostream>

int main() {

    return 0;
}`,hints:["Read into a and b.","`if (a > b)` print a, otherwise print b. When they're equal, b is fine."],
  sol:R`#include <iostream>

int main() {
    int a = 0, b = 0;
    std::cin >> a >> b;
    if (a > b) {
        std::cout << a << "\n";
    } else {
        std::cout << b << "\n";
    }
    return 0;
}`,explain:"The standard library also has `std::max(a, b)` in `<algorithm>`. Writing it yourself once shows you there's no magic in it."}]});

DAYS.push({n:8,unit:"Making decisions",title:"else if, and combining conditions",
goal:"Choose between many options and combine conditions with and, or and not.",
sections:[
 {h:"else if chains",p:"To choose between more than two options, chain `else if`. C++ checks each condition from the top and runs the first one that's true, then skips the rest. So the order matters.",code:R`int score = 64;
if (score >= 70) {
    std::cout << "First\n";
} else if (score >= 60) {
    std::cout << "2:1\n";
} else if (score >= 50) {
    std::cout << "2:2\n";
} else {
    std::cout << "Below 2:2\n";
}`,out:"2:1"},
 {h:"And, or, not",p:"`&&` means and: true only if both sides are true. `||` means or: true if at least one side is true. `!` means not: it flips true and false.",code:R`int age = 20;
bool student = true;
if (age < 26 && student) {
    std::cout << "Discount\n";
}
std::cout << (!student) << " " << (age < 18 || student) << "\n";`,out:"Discount\n0 1"},
 {h:"Checking a range",p:"In maths you'd write 1 ≤ x ≤ 10. In C++ you must write it as two comparisons joined with and: `x >= 1 && x <= 10`. Writing `1 <= x <= 10` compiles but doesn't do what you think: `1 <= x` becomes 0 or 1 first, and that's always ≤ 10."},
 {h:"Short-circuiting",p:"`&&` stops as soon as the left side is false, and `||` stops as soon as the left side is true. That lets you guard a risky check: `if (n != 0 && total / n > 5)` never divides by zero, because the division only happens when n isn't 0."}],
takeaways:["`else if` checks top to bottom; the first true one wins.","`&&` and, `||` or, `!` not.","Ranges need two comparisons: `x >= 1 && x <= 10`.","`&&` and `||` stop early, which you can use as a guard."],
checks:[
 {t:"out",code:R`int t = 15;
if (t > 25) {
    std::cout << "hot";
} else if (t > 10) {
    std::cout << "mild";
} else {
    std::cout << "cold";
}`,a:"mild",why:"15 > 25 is false, 15 > 10 is true, so it prints mild and skips the rest."},
 {t:"out",code:R`std::cout << ((true && false) || true);`,a:"1",why:"true && false is false, and false || true is true."},
 {t:"mc",q:"What's wrong with `if (1 <= x <= 10)`?",opts:["Nothing","It's always true, because `1 <= x` becomes 0 or 1 first, which is always ≤ 10","It doesn't compile","It only works for negative x"],a:1,why:"Write `x >= 1 && x <= 10`."},
 {t:"out",code:R`int x = 8;
std::cout << !(x > 3);`,a:"0",why:"x > 3 is true, and not true is false, which prints 0."},
 {t:"out",q:"Order matters. What does this print?",code:R`int score = 85;
if (score >= 50) {
    std::cout << "pass";
} else if (score >= 80) {
    std::cout << "distinction";
}`,a:"pass",why:"85 >= 50 is checked first and is true, so the distinction branch is never reached. Put the strictest test first."}],
problems:[
 {title:"Grade",task:"Read a score from 0 to 100 and print its grade: `A` for 70 and above, `B` for 60–69, `C` for 50–59, otherwise `F`.",tests:[{in:"85",out:"A"},{in:"70",out:"A"},{in:"69",out:"B"},{in:"50",out:"C"},{in:"12",out:"F"}],
  starter:R`#include <iostream>

int main() {
    int score = 0;
    std::cin >> score;

    return 0;
}`,hints:["Start with the highest grade: `if (score >= 70)`.","Then `else if (score >= 60)`, and so on, with a final `else` for F."],
  sol:R`#include <iostream>

int main() {
    int score = 0;
    std::cin >> score;
    if (score >= 70) {
        std::cout << "A\n";
    } else if (score >= 60) {
        std::cout << "B\n";
    } else if (score >= 50) {
        std::cout << "C\n";
    } else {
        std::cout << "F\n";
    }
    return 0;
}`,explain:"Because the chain stops at the first match, the B line doesn't need `&& score < 70`: anything 70 or above was already caught."},
 {title:"Leap year",task:"Read a year and print `leap` or `not leap`.\n\nThe rule: a year is a leap year if it divides by 4, except years that divide by 100 aren't, except years that divide by 400 are.",tests:[{in:"2024",out:"leap"},{in:"2023",out:"not leap"},{in:"1900",out:"not leap"},{in:"2000",out:"leap"}],
  starter:R`#include <iostream>

int main() {
    int year = 0;
    std::cin >> year;

    return 0;
}`,hints:["\"Divides by 4\" is `year % 4 == 0`.","One way: `if (year % 400 == 0)` leap; `else if (year % 100 == 0)` not leap; `else if (year % 4 == 0)` leap; else not.","Or in one condition: `(year % 4 == 0 && year % 100 != 0) || year % 400 == 0`."],
  sol:R`#include <iostream>

int main() {
    int year = 0;
    std::cin >> year;
    if ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0) {
        std::cout << "leap\n";
    } else {
        std::cout << "not leap\n";
    }
    return 0;
}`,explain:"1900 and 2000 are the tests that catch most wrong answers. When you write a rule with exceptions, test each exception on purpose."}]});

DAYS.push({n:9,unit:"Making decisions",title:"switch and the ? : operator",
goal:"Pick between fixed options neatly, and write tiny if/else in one line.",
sections:[
 {h:"switch",p:"When you're comparing one value against a list of exact options, `switch` is tidier than a long else-if chain. It works on whole numbers and chars, not strings or doubles.",code:R`int day = 3;
switch (day) {
    case 1:
        std::cout << "Mon\n";
        break;
    case 2:
        std::cout << "Tue\n";
        break;
    case 3:
        std::cout << "Wed\n";
        break;
    default:
        std::cout << "Later\n";
}`,out:"Wed"},
 {h:"Don't forget break",p:"`break` leaves the switch. Without it, C++ falls through and keeps running the next cases' code too. Sometimes that's what you want (several cases sharing code), but usually it's a bug.",code:R`char c = 'b';
switch (c) {
    case 'a':
    case 'e':
        std::cout << "vowel\n";
        break;
    case 'b':
        std::cout << "b ";
    case 'c':
        std::cout << "c\n";
        break;
}`,out:"b c"},
 {h:"The conditional operator",p:"`condition ? valueIfTrue : valueIfFalse` is a one-line if/else that gives back a value. It's handy for small choices. Brackets around it are needed inside a `cout`.",code:R`int n = 4;
std::cout << (n % 2 == 0 ? "even" : "odd") << "\n";
int fee = (n > 3) ? 0 : 5;
std::cout << fee << "\n";`,out:"even\n0"},
 {h:"Which to use",p:"if/else if handles anything. switch is for one variable against exact values. `? :` is for choosing between two values in a single expression. If a `? :` gets hard to read, use an if."}],
takeaways:["switch compares one int or char against exact cases.","Each case needs `break`, or it falls through.","`default` catches everything else.","`cond ? a : b` picks a value in one line."],
checks:[
 {t:"out",q:"No breaks. What does this print?",code:R`int x = 2;
switch (x) {
    case 1: std::cout << "one ";
    case 2: std::cout << "two ";
    case 3: std::cout << "three ";
}`,a:"two three",why:"It jumps to case 2, then falls through into case 3 because there's no break."},
 {t:"out",code:R`int a = 3, b = 7;
std::cout << (a > b ? a : b);`,a:"7",why:"a > b is false, so you get b."},
 {t:"mc",q:"Which of these can a `switch` work on?",opts:["A std::string","A double","A char","Any type"],a:2,why:"switch needs whole-number types, and char counts as one."},
 {t:"out",code:R`char grade = 'B';
switch (grade) {
    case 'A': std::cout << "great"; break;
    case 'B': std::cout << "good"; break;
    default: std::cout << "ok";
}`,a:"good",why:"It matches case 'B', prints good, then breaks."}],
problems:[
 {title:"Calculator",task:"Read a sum like `6 * 7`: a whole number, an operator (`+`, `-`, `*` or `/`), and another whole number. Print the answer. Use integer division for `/`. If the operator is `/` and the second number is 0, print `error`.",tests:[{in:"6 * 7",out:"42"},{in:"10 - 15",out:"-5"},{in:"9 / 2",out:"4"},{in:"3 + 4",out:"7"},{in:"5 / 0",out:"error"}],
  starter:R`#include <iostream>

int main() {
    int a = 0, b = 0;
    char op = ' ';
    std::cin >> a >> op >> b;

    return 0;
}`,hints:["`switch (op)` with a case for each of `'+'`, `'-'`, `'*'` and `'/'`.","Inside `case '/'`, use an if to check for `b == 0` before dividing."],
  sol:R`#include <iostream>

int main() {
    int a = 0, b = 0;
    char op = ' ';
    std::cin >> a >> op >> b;
    switch (op) {
        case '+': std::cout << a + b << "\n"; break;
        case '-': std::cout << a - b << "\n"; break;
        case '*': std::cout << a * b << "\n"; break;
        case '/':
            if (b == 0) {
                std::cout << "error\n";
            } else {
                std::cout << a / b << "\n";
            }
            break;
        default: std::cout << "error\n";
    }
    return 0;
}`,explain:"Dividing an int by zero crashes the program, so you check first. Reading into a `char` picks up the single symbol between the numbers."},
 {title:"Day name",task:"Read a number from 1 to 7 and print the day: 1 → `Monday` up to 7 → `Sunday`. For anything else print `invalid`.",tests:[{in:"1",out:"Monday"},{in:"5",out:"Friday"},{in:"7",out:"Sunday"},{in:"9",out:"invalid"}],
  starter:R`#include <iostream>

int main() {
    int d = 0;
    std::cin >> d;

    return 0;
}`,hints:["A switch with cases 1 to 7, each printing a name and then `break`.","`default:` handles invalid."],
  sol:R`#include <iostream>

int main() {
    int d = 0;
    std::cin >> d;
    switch (d) {
        case 1: std::cout << "Monday\n"; break;
        case 2: std::cout << "Tuesday\n"; break;
        case 3: std::cout << "Wednesday\n"; break;
        case 4: std::cout << "Thursday\n"; break;
        case 5: std::cout << "Friday\n"; break;
        case 6: std::cout << "Saturday\n"; break;
        case 7: std::cout << "Sunday\n"; break;
        default: std::cout << "invalid\n";
    }
    return 0;
}`,explain:"This works, but it's repetitive. On Day 18 you'll store the names in a list and look them up in one line."}]});
