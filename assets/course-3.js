"use strict";
/* C++ Daily course, part 3: Unit 5. Shapes are described in course-1.js. */

/* ======================= UNIT 5: COLLECTIONS ======================= */
DAYS.push({n:18,unit:"Collections",title:"std::vector: a list of values",
goal:"Store many values in one variable and get at them by position.",
sections:[
 {h:"Why you need lists",p:"So far, 3 numbers meant 3 variables. But what about 1,000 prices? A `std::vector` is a list that holds any number of values of one type, in order. It needs `#include <vector>`.",code:R`std::vector<int> prices = {101, 99, 104};
std::cout << prices[0] << " " << prices[2] << "\n";
std::cout << "count: " << prices.size() << "\n";`,out:"101 104\ncount: 3"},
 {h:"Positions start at 0",p:"The first element is at index 0, the second at 1, and the last at `size() - 1`. `v[i]` gets the element at index i, and you can assign to it too: `v[1] = 50;`. Starting at 0 feels odd for about a week, then it's normal."},
 {h:"Growing a vector",p:"`push_back(x)` adds x to the end and the vector grows by one. Start with an empty vector and push values as you read them.",code:R`std::vector<int> v;
v.push_back(4);
v.push_back(7);
v[0] = 10;
std::cout << v[0] << " " << v[1] << " size " << v.size() << "\n";`,out:"10 7 size 2"},
 {h:"A vector of n values",p:"`std::vector<int> v(n);` makes a vector of n zeros. `std::vector<int> v(n, 5);` makes n fives. That's useful when you know the size up front and want to fill it by index.",code:R`std::vector<double> w(3);
w[1] = 2.5;
std::cout << w[0] << " " << w[1] << " " << w[2] << "\n";`,out:"0 2.5 0"},
 {h:"Don't go past the end",p:"`v[10]` on a vector of size 3 doesn't give a helpful error. It reads whatever memory happens to be there. This is undefined behaviour: the program might print junk, crash, or appear to work and fail later. `v.at(10)` checks the index and stops the program with an error instead, which is handy while you're learning."}],
takeaways:["`std::vector<int> v = {1, 2, 3};` holds many values in order.","Indexes run from 0 to `size() - 1`.","`push_back` adds to the end; `v(n)` makes n zeros.","Going out of range is undefined behaviour. `.at(i)` checks."],
checks:[
 {t:"out",code:R`std::vector<int> v = {3, 1, 4};
std::cout << v[1];`,a:"1",why:"Index 1 is the second element."},
 {t:"out",code:R`std::vector<int> v = {5};
v.push_back(6);
v.push_back(7);
std::cout << v.size() << v.back();`,a:"37",why:"Three elements, and `back()` is the last one, 7."},
 {t:"mc",q:"A vector `v` has 8 elements. What's the index of the last one?",opts:["8","7","9","-1"],a:1,why:"Indexes start at 0, so the last is size − 1 = 7."},
 {t:"out",code:R`std::vector<int> v(3);
v[0] = 9;
std::cout << v[0] << v[1] << v[2];`,a:"900",why:"`v(3)` starts as three zeros, and only v[0] was changed."},
 {t:"mc",q:"What happens with `v[10]` when v has 3 elements?",opts:["It returns 0","The vector grows to 11","Undefined behaviour: it reads memory outside the vector","Compile error"],a:2,why:"`[]` doesn't check. Use `.at()` if you want a check."}],
problems:[
 {title:"Backwards",task:"Read n, then n whole numbers. Print them in reverse order, separated by spaces.\n\nExample: input `4` then `1 2 3 4` → output `4 3 2 1`.",tests:[{in:"4\n1 2 3 4",out:"4 3 2 1"},{in:"1\n42",out:"42"},{in:"5\n9 -1 9 0 3",out:"3 0 9 -1 9"}],
  starter:R`#include <iostream>
#include <vector>

int main() {
    int n = 0;
    std::cin >> n;
    std::vector<int> v(n);
    // read into v[0] ... v[n-1]

    // print from the back

    return 0;
}`,hints:["Read with `for (int i = 0; i < n; i++) std::cin >> v[i];`","Print with a loop going down: `for (int i = n - 1; i >= 0; i--)`."],
  sol:R`#include <iostream>
#include <vector>

int main() {
    int n = 0;
    std::cin >> n;
    std::vector<int> v(n);
    for (int i = 0; i < n; i++) {
        std::cin >> v[i];
    }
    for (int i = n - 1; i >= 0; i--) {
        std::cout << v[i] << " ";
    }
    std::cout << "\n";
    return 0;
}`,explain:"This is the first problem you can't solve without storing the values: you need the last one before you can print anything."},
 {title:"Above average",task:"Read n, then n whole numbers. Print how many of them are strictly above their average.\n\nExample: input `4` then `1 2 3 10` → average 4 → output `1`.",tests:[{in:"4\n1 2 3 10",out:"1"},{in:"3\n5 5 5",out:"0"},{in:"5\n1 2 3 4 5",out:"2"},{in:"2\n1 2",out:"1"}],
  starter:R`#include <iostream>
#include <vector>

int main() {

    return 0;
}`,hints:["First loop: read every value into a vector and add up the total.","Work out the average as a double: `static_cast<double>(total) / n`.","Second loop: count values greater than the average."],
  sol:R`#include <iostream>
#include <vector>

int main() {
    int n = 0;
    std::cin >> n;
    std::vector<int> v(n);
    long long total = 0;
    for (int i = 0; i < n; i++) {
        std::cin >> v[i];
        total += v[i];
    }
    double avg = static_cast<double>(total) / n;
    int count = 0;
    for (int i = 0; i < n; i++) {
        if (v[i] > avg) count++;
    }
    std::cout << count << "\n";
    return 0;
}`,explain:"Two passes: the first finds the average, the second compares against it. With ints, the average of 1 and 2 would be 1 and the last test would fail."}]});

DAYS.push({n:19,unit:"Collections",title:"Looping over vectors",
goal:"Visit, change and search every element of a vector.",
sections:[
 {h:"Index loops",p:"The classic way: loop i from 0 while `i < v.size()`. `size()` gives an unsigned type (it can't be negative), so compilers warn if you compare it with a plain int. Either write `size_t i` or convert once with `int n = v.size();`.",code:R`std::vector<int> v = {4, 8, 15};
for (size_t i = 0; i < v.size(); i++) {
    std::cout << i << ":" << v[i] << " ";
}`,out:"0:4 1:8 2:15"},
 {h:"Range-based for",p:"When you don't need the index, `for (int x : v)` reads as: for each x in v. It's shorter and you can't go out of range.",code:R`std::vector<int> v = {4, 8, 15};
int total = 0;
for (int x : v) {
    total += x;
}
std::cout << total << "\n";`,out:"27"},
 {h:"Changing elements in a range loop",p:"`for (int x : v)` gives you a copy of each element, so changing x changes nothing. To change the vector, loop by reference: `for (int& x : v)`. Same idea as Day 16.",code:R`std::vector<int> v = {1, 2, 3};
for (int x : v) {
    x *= 10;
}
for (int& x : v) {
    x *= 2;
}
for (int x : v) {
    std::cout << x << " ";
}`,out:"2 4 6"},
 {h:"Searching",p:"To find something, loop until you see it. Return or remember the index, and use −1 for 'not found'. This is called linear search: it checks every element, one by one.",code:R`#include <iostream>
#include <vector>

int indexOf(const std::vector<int>& v, int target) {
    for (int i = 0; i < static_cast<int>(v.size()); i++) {
        if (v[i] == target) {
            return i;
        }
    }
    return -1;
}

int main() {
    std::vector<int> v = {7, 3, 9};
    std::cout << indexOf(v, 9) << " " << indexOf(v, 4) << "\n";
    return 0;
}`,out:"2 -1"},
 {h:"Pass vectors by const reference",p:"Notice `const std::vector<int>& v` above. Passing a vector by value copies every element. Pass by `const &` to read it and by `&` to change it."}],
takeaways:["Index loop: `for (size_t i = 0; i < v.size(); i++)`.","Range loop: `for (int x : v)` when you don't need the index.","`for (int& x : v)` to change elements.","Pass vectors as `const std::vector<int>&`."],
checks:[
 {t:"out",code:R`std::vector<int> v = {2, 4, 6};
int s = 0;
for (int x : v) {
    s += x;
}
std::cout << s;`,a:"12",why:"2 + 4 + 6."},
 {t:"out",code:R`std::vector<int> v = {1, 2, 3};
for (int x : v) {
    x = 0;
}
std::cout << v[0] << v[1] << v[2];`,a:"123",why:"x was a copy each time. The vector is unchanged."},
 {t:"out",code:R`std::vector<int> v = {1, 2, 3};
for (int& x : v) {
    x = x * x;
}
std::cout << v[0] << v[1] << v[2];`,a:"149",why:"With &, x is the real element, so each one gets squared."},
 {t:"mc",q:"Why does the compiler warn about `for (int i = 0; i < v.size(); i++)`?",opts:["v.size() might be a double","It compares a signed int with an unsigned size, which can misbehave with negatives","`i++` should be `++i`","It doesn't warn"],a:1,why:"Use `size_t i`, or store `int n = v.size();` first."},
 {t:"out",code:R`std::vector<int> v = {5, 9, 2, 9};
int pos = -1;
for (int i = 0; i < 4; i++) {
    if (v[i] == 9) {
        pos = i;
        break;
    }
}
std::cout << pos;`,a:"1",why:"The first 9 is at index 1, and break stops the search there."}],
problems:[
 {title:"Running total",task:"Read n, then n whole numbers. Print the running total after each one, separated by spaces.\n\nExample: input `4` then `3 1 4 1` → output `3 4 8 9`.",tests:[{in:"4\n3 1 4 1",out:"3 4 8 9"},{in:"1\n5",out:"5"},{in:"3\n10 -10 2",out:"10 0 2"}],
  starter:R`#include <iostream>
#include <vector>

int main() {

    return 0;
}`,hints:["Keep a `long long sum = 0;`","For each value read: add it to sum, then print sum."],
  sol:R`#include <iostream>
#include <vector>

int main() {
    int n = 0;
    std::cin >> n;
    std::vector<int> v(n);
    for (int& x : v) {
        std::cin >> x;
    }
    long long sum = 0;
    for (int x : v) {
        sum += x;
        std::cout << sum << " ";
    }
    std::cout << "\n";
    return 0;
}`,explain:"`for (int& x : v) std::cin >> x;` is a neat way to fill a vector. Running totals are called prefix sums, and they turn up all the time in finance (cumulative P&L) and in interviews."},
 {title:"Daily changes",task:"Read n (2 or more), then n closing prices as whole numbers. Print the change from each day to the next, separated by spaces, then on a new line the biggest single-day rise (or the smallest fall if every day fell).\n\nExample: input `4` then `100 102 101 105` → output `2 -1 4` then `4`.",tests:[{in:"4\n100 102 101 105",out:"2 -1 4\n4"},{in:"2\n50 45",out:"-5\n-5"},{in:"5\n10 10 13 9 12",out:"0 3 -4 3\n3"}],
  starter:R`#include <iostream>
#include <vector>

int main() {
    int n = 0;
    std::cin >> n;
    std::vector<int> price(n);
    for (int& p : price) {
        std::cin >> p;
    }

    return 0;
}`,hints:["The change on day i is `price[i] - price[i - 1]`, for i from 1 to n − 1.","Track the best change as you go, starting from the first change, not 0."],
  sol:R`#include <iostream>
#include <vector>

int main() {
    int n = 0;
    std::cin >> n;
    std::vector<int> price(n);
    for (int& p : price) {
        std::cin >> p;
    }
    int best = price[1] - price[0];
    for (int i = 1; i < n; i++) {
        int change = price[i] - price[i - 1];
        std::cout << change << " ";
        if (change > best) best = change;
    }
    std::cout << "\n" << best << "\n";
    return 0;
}`,explain:"n prices give n − 1 changes, so the loop starts at 1 and looks back at i − 1. Starting at 0 would read price[−1], which is out of range."},
 {title:"Count the target",task:"Read n, then n whole numbers, then a target number. Print how many times the target appears.\n\nExample: input `5` then `1 3 1 2 1` then `1` → output `3`.",tests:[{in:"5\n1 3 1 2 1\n1",out:"3"},{in:"3\n4 5 6\n7",out:"0"},{in:"4\n-2 -2 -2 -2\n-2",out:"4"}],
  starter:R`#include <iostream>
#include <vector>

int countOf(const std::vector<int>& v, int target) {

    return 0;
}

int main() {

    return 0;
}`,hints:["Inside countOf: a range loop with a counter.","In main: read n, the vector, then the target, and print `countOf(v, target)`."],
  sol:R`#include <iostream>
#include <vector>

int countOf(const std::vector<int>& v, int target) {
    int c = 0;
    for (int x : v) {
        if (x == target) c++;
    }
    return c;
}

int main() {
    int n = 0;
    std::cin >> n;
    std::vector<int> v(n);
    for (int& x : v) {
        std::cin >> x;
    }
    int target = 0;
    std::cin >> target;
    std::cout << countOf(v, target) << "\n";
    return 0;
}`,explain:"The library has this built in as `std::count`. You'll meet it on Day 22, and now you know what it does inside."}]});

DAYS.push({n:20,unit:"Collections",title:"Strings in depth",
goal:"Treat text as a sequence of characters you can loop over, slice and search.",
sections:[
 {h:"A string is a list of chars",p:"A `std::string` works a lot like a vector of `char`. `s.size()` is its length, `s[i]` is the character at index i, and a range loop visits each character.",code:R`std::string s = "quant";
std::cout << s.size() << " " << s[0] << s[4] << "\n";
for (char c : s) {
    std::cout << c << "-";
}`,out:"5 qt\nq-u-a-n-t-"},
 {h:"Joining and comparing",p:"`+` joins strings and `+=` adds to the end. `==` compares two strings, and `<` compares them alphabetically, which is useful for sorting. (Uppercase letters come before lowercase, so \"Zebra\" < \"apple\".)",code:R`std::string a = "C";
a += "++";
std::string b = a + " rocks";
std::cout << b << " " << (a == "C++") << " " << (std::string("ant") < "bee") << "\n";`,out:"C++ rocks 1 1"},
 {h:"Slicing and searching",p:"`s.substr(start, length)` gives part of a string. `s.find(\"x\")` gives the index where x first appears, or the special value `std::string::npos` if it isn't there.",code:R`std::string s = "AAPL,190";
size_t comma = s.find(",");
std::string ticker = s.substr(0, comma);
std::string rest = s.substr(comma + 1);
std::cout << ticker << " " << rest << "\n";
if (s.find("MSFT") == std::string::npos) {
    std::cout << "no MSFT\n";
}`,out:"AAPL 190\nno MSFT"},
 {h:"Characters are small numbers",p:"Each char is stored as a number (its ASCII code): 'A' is 65, 'a' is 97 and '0' is 48. Letters and digits are in order, so `c - 'a'` gives a letter's position in the alphabet and `c - '0'` turns the digit character '7' into the number 7. `<cctype>` has helpers like `std::isdigit(c)`, `std::isalpha(c)`, `std::toupper(c)` and `std::tolower(c)`.",code:R`char c = 'd';
std::cout << c - 'a' << " " << '7' - '0' << " " << char(std::toupper(c)) << "\n";`,out:"3 7 D"},
 {h:"Reading lines",p:"Remember `std::getline(std::cin, s)` reads a whole line, spaces included. One trap: after `std::cin >> n`, the new line is still waiting, so a getline straight after reads an empty line. Call `std::cin.ignore();` once between them, or read everything with getline."}],
takeaways:["`s.size()`, `s[i]` and range loops work like a vector.","`+` joins; `==` and `<` compare.","`substr(start, len)` slices; `find` gives an index or `npos`.","Chars are numbers: `c - 'a'`, `c - '0'`, and `<cctype>` helpers."],
checks:[
 {t:"out",code:R`std::string s = "hello";
std::cout << s[1] << s.size();`,a:"e5",why:"Index 1 is the second letter, and there are 5 letters."},
 {t:"out",code:R`std::string s = "quant";
std::cout << s.substr(1, 3);`,a:"uan",why:"Start at index 1 and take 3 characters."},
 {t:"out",code:R`std::string a = "ab";
std::string b = a + "cd";
b += "!";
std::cout << b;`,a:"abcd!",why:"+ joins, += adds to the end."},
 {t:"out",code:R`char c = 'a';
c++;
std::cout << c;`,a:"b",why:"chars are numbers, so a + 1 is the next letter."},
 {t:"out",code:R`std::string s = "banana";
std::cout << s.find("na");`,a:"2",why:"\"na\" first appears starting at index 2."}],
problems:[
 {title:"Count vowels",task:"Read a whole line of text and print how many vowels (a, e, i, o, u) it contains, upper or lower case.\n\nExample: input `Hello World` → output `3`.",tests:[{in:"Hello World",out:"3"},{in:"AEIOU aeiou",out:"10"},{in:"rhythm",out:"0"}],
  starter:R`#include <iostream>
#include <string>
#include <cctype>

int main() {
    std::string line;
    std::getline(std::cin, line);

    return 0;
}`,hints:["Loop over each char c in line.","Convert to lower case first: `char l = std::tolower(c);`","Then `if (l == 'a' || l == 'e' || ...)`."],
  sol:R`#include <iostream>
#include <string>
#include <cctype>

int main() {
    std::string line;
    std::getline(std::cin, line);
    int count = 0;
    for (char c : line) {
        char l = std::tolower(c);
        if (l == 'a' || l == 'e' || l == 'i' || l == 'o' || l == 'u') {
            count++;
        }
    }
    std::cout << count << "\n";
    return 0;
}`,explain:"Lower-casing first halves the number of comparisons. Another trick: `std::string(\"aeiou\").find(l) != std::string::npos`."},
 {title:"Reverse a word",task:"Read one word and print it backwards.\n\nExample: input `stressed` → output `desserts`.",tests:[{in:"stressed",out:"desserts"},{in:"a",out:"a"},{in:"Imperial",out:"lairepmI"}],
  starter:R`#include <iostream>
#include <string>

int main() {
    std::string w;
    std::cin >> w;

    return 0;
}`,hints:["Loop i from `w.size() - 1` down to 0? Careful: size_t can't go below 0, so the loop never ends. Use int.","`for (int i = static_cast<int>(w.size()) - 1; i >= 0; i--) std::cout << w[i];`"],
  sol:R`#include <iostream>
#include <string>

int main() {
    std::string w;
    std::cin >> w;
    for (int i = static_cast<int>(w.size()) - 1; i >= 0; i--) {
        std::cout << w[i];
    }
    std::cout << "\n";
    return 0;
}`,explain:"With `size_t i`, `i >= 0` is always true, because an unsigned number can't be negative: 0 − 1 wraps round to a huge number. That's a classic bug. Using int avoids it."},
 {title:"Palindrome",task:"Read one word and print `yes` if it reads the same backwards (ignoring case), otherwise `no`.\n\nExample: `Level` → `yes`.",tests:[{in:"Level",out:"yes"},{in:"racecar",out:"yes"},{in:"quant",out:"no"},{in:"x",out:"yes"},{in:"ab",out:"no"}],
  starter:R`#include <iostream>
#include <string>
#include <cctype>

int main() {
    std::string w;
    std::cin >> w;

    return 0;
}`,hints:["Compare the first char with the last, the second with the second-last, and so on.","Use two indexes: `int i = 0, j = w.size() - 1;` and move them towards each other while `i < j`.","Compare `std::tolower(w[i])` with `std::tolower(w[j])`."],
  sol:R`#include <iostream>
#include <string>
#include <cctype>

int main() {
    std::string w;
    std::cin >> w;
    int i = 0;
    int j = static_cast<int>(w.size()) - 1;
    bool ok = true;
    while (i < j) {
        if (std::tolower(w[i]) != std::tolower(w[j])) {
            ok = false;
            break;
        }
        i++;
        j--;
    }
    std::cout << (ok ? "yes" : "no") << "\n";
    return 0;
}`,explain:"Two indexes moving towards each other is called the two-pointer technique. It's one of the most common patterns in coding interviews."}]});

DAYS.push({n:21,unit:"Collections",title:"Grids: vectors of vectors",
goal:"Store and work with tables of numbers.",
sections:[
 {h:"A vector of rows",p:"A grid is a vector whose elements are themselves vectors: each inner vector is one row. `g[r][c]` is row r, column c.",code:R`std::vector<std::vector<int>> g = {
    {1, 2, 3},
    {4, 5, 6}
};
std::cout << g[0][2] << " " << g[1][0] << "\n";
std::cout << g.size() << " rows, " << g[0].size() << " columns\n";`,out:"3 4\n2 rows, 3 columns"},
 {h:"Making an empty grid",p:"To make R rows of C zeros: `std::vector<std::vector<int>> g(R, std::vector<int>(C, 0));`. Read it as: R copies of a row, where each row is C zeros. It looks heavy, but you'll write it often enough that it sticks."},
 {h:"Visiting every cell",p:"Nested loops from Day 13: outer over rows, inner over columns.",code:R`std::vector<std::vector<int>> g(2, std::vector<int>(3, 0));
for (int r = 0; r < 2; r++) {
    for (int c = 0; c < 3; c++) {
        g[r][c] = r * 10 + c;
    }
}
for (const auto& row : g) {
    for (int x : row) {
        std::cout << x << " ";
    }
    std::cout << "\n";
}`,out:"0 1 2\n10 11 12"},
 {h:"Reading a grid",p:"Problems usually give rows and columns first, then the numbers row by row. Make the grid with the right size, then read into `g[r][c]` with nested loops. Note `const auto& row` above: `auto` saves writing the long type, and `const &` avoids copying each row."}],
takeaways:["`g[r][c]` = row r, column c.","`g(R, std::vector<int>(C, 0))` makes an R × C grid of zeros.","Outer loop rows, inner loop columns.","`for (const auto& row : g)` visits rows without copying."],
checks:[
 {t:"out",code:R`std::vector<std::vector<int>> g = {{1, 2}, {3, 4}, {5, 6}};
std::cout << g[2][1] << g.size() << g[0].size();`,a:"632",why:"Row 2, column 1 is 6. There are 3 rows of 2."},
 {t:"mc",q:"In `g[r][c]`, which index picks the row?",opts:["c","r","Both","Neither"],a:1,why:"The first index picks the row, the second picks the position in that row."},
 {t:"out",code:R`std::vector<std::vector<int>> g(2, std::vector<int>(2, 7));
g[1][0] = 1;
int s = 0;
for (const auto& row : g) {
    for (int x : row) s += x;
}
std::cout << s;`,a:"22",why:"Four 7s is 28, but one became 1: 7 + 7 + 1 + 7 = 22."},
 {t:"out",code:R`std::vector<std::vector<int>> g = {{1, 2, 3}, {4, 5, 6}};
int s = 0;
for (int r = 0; r < 2; r++) {
    s += g[r][r];
}
std::cout << s;`,a:"6",why:"g[0][0] + g[1][1] = 1 + 5."}],
problems:[
 {title:"Row and column sums",task:"Read R and C, then an R × C grid of whole numbers. Print each row's sum on its own line, then one more line with each column's sum separated by spaces.\n\nExample: input `2 3` then `1 2 3` and `4 5 6` → output `6`, `15`, then `5 7 9`.",tests:[{in:"2 3\n1 2 3\n4 5 6",out:"6\n15\n5 7 9"},{in:"1 1\n8",out:"8\n8"},{in:"3 2\n1 -1\n2 -2\n3 -3",out:"0\n0\n0\n6 -6"}],
  starter:R`#include <iostream>
#include <vector>

int main() {
    int R = 0, C = 0;
    std::cin >> R >> C;
    std::vector<std::vector<int>> g(R, std::vector<int>(C, 0));

    return 0;
}`,hints:["Read with two nested loops into `g[r][c]`.","Row sums: for each r, add up g[r][c] over c.","Column sums: for each c, add up g[r][c] over r. Notice the loops swap."],
  sol:R`#include <iostream>
#include <vector>

int main() {
    int R = 0, C = 0;
    std::cin >> R >> C;
    std::vector<std::vector<int>> g(R, std::vector<int>(C, 0));
    for (int r = 0; r < R; r++) {
        for (int c = 0; c < C; c++) {
            std::cin >> g[r][c];
        }
    }
    for (int r = 0; r < R; r++) {
        int s = 0;
        for (int c = 0; c < C; c++) s += g[r][c];
        std::cout << s << "\n";
    }
    for (int c = 0; c < C; c++) {
        int s = 0;
        for (int r = 0; r < R; r++) s += g[r][c];
        std::cout << s << " ";
    }
    std::cout << "\n";
    return 0;
}`,explain:"For column sums the outer loop is over columns. Which loop is outside decides what you're totalling."},
 {title:"Transpose",task:"Read R and C, then an R × C grid. Print its transpose: a C × R grid where row i is column i of the original.\n\nExample: input `2 3` then `1 2 3` and `4 5 6` → output `1 4`, `2 5`, `3 6`.",tests:[{in:"2 3\n1 2 3\n4 5 6",out:"1 4\n2 5\n3 6"},{in:"1 3\n7 8 9",out:"7\n8\n9"},{in:"2 2\n1 2\n3 4",out:"1 3\n2 4"}],
  starter:R`#include <iostream>
#include <vector>

int main() {

    return 0;
}`,hints:["Read the grid as normal.","To print, loop c from 0 to C − 1 on the outside and r on the inside, printing g[r][c]."],
  sol:R`#include <iostream>
#include <vector>

int main() {
    int R = 0, C = 0;
    std::cin >> R >> C;
    std::vector<std::vector<int>> g(R, std::vector<int>(C, 0));
    for (int r = 0; r < R; r++) {
        for (int c = 0; c < C; c++) {
            std::cin >> g[r][c];
        }
    }
    for (int c = 0; c < C; c++) {
        for (int r = 0; r < R; r++) {
            std::cout << g[r][c] << " ";
        }
        std::cout << "\n";
    }
    return 0;
}`,explain:"You don't need to build a second grid: just read the first one in a different order. Matrices like this sit underneath a lot of quant work (covariance matrices, for a start)."}]});

DAYS.push({n:22,unit:"Collections",title:"The algorithms library",
goal:"Sort, count and find with ready-made, tested functions.",
sections:[
 {h:"Don't reinvent the wheel",p:"`<algorithm>` and `<numeric>` hold dozens of well-tested functions. Using them makes your code shorter and less buggy, and interviewers expect you to know the common ones. Most take a range: the start and end of what to work on, written `v.begin(), v.end()` for the whole vector."},
 {h:"Sorting",p:"`std::sort(v.begin(), v.end());` sorts smallest to largest. For largest first, add `std::greater<int>()` as a third argument. It works on strings too, alphabetically.",code:R`std::vector<int> v = {5, 2, 9, 1};
std::sort(v.begin(), v.end());
for (int x : v) std::cout << x << " ";
std::cout << "\n";
std::sort(v.begin(), v.end(), std::greater<int>());
for (int x : v) std::cout << x << " ";`,out:"1 2 5 9\n9 5 2 1"},
 {h:"Counting, reversing, summing",p:"`std::count(b, e, x)` counts how many times x appears. `std::reverse(b, e)` reverses in place. `std::accumulate(b, e, 0)` from `<numeric>` adds everything up, starting from the third argument. Use `0LL` there if the total might be big, and `0.0` for doubles.",code:R`std::vector<int> v = {3, 1, 3, 2};
std::cout << std::count(v.begin(), v.end(), 3) << "\n";
std::cout << std::accumulate(v.begin(), v.end(), 0) << "\n";
std::reverse(v.begin(), v.end());
std::cout << v[0] << v[1] << v[2] << v[3] << "\n";`,out:"2\n9\n2313"},
 {h:"Min and max",p:"`std::max_element(b, e)` doesn't give the biggest value directly. It gives an iterator, a pointer-like marker to where the biggest value is. Put `*` in front to get the value. Subtract `v.begin()` to get its index.",code:R`std::vector<int> v = {4, 11, 7};
auto it = std::max_element(v.begin(), v.end());
std::cout << *it << " at index " << it - v.begin() << "\n";
std::cout << *std::min_element(v.begin(), v.end()) << "\n";`,out:"11 at index 1\n4"},
 {h:"Sorted data is easier",p:"Once data is sorted, lots of problems get easy: the median is in the middle, duplicates sit next to each other, and the k largest are at the end. If you're stuck on a problem, ask whether sorting first would help."}],
takeaways:["`std::sort(v.begin(), v.end())`; add `std::greater<int>()` for descending.","`std::count`, `std::reverse`, `std::accumulate`.","`*std::max_element(...)` gives the value; minus `v.begin()` gives the index.","Stuck? Try sorting first."],
checks:[
 {t:"out",code:R`std::vector<int> v = {3, 1, 2};
std::sort(v.begin(), v.end());
std::cout << v[0] << v[1] << v[2];`,a:"123",why:"Ascending order."},
 {t:"out",code:R`std::vector<int> v = {1, 2, 2, 2, 5};
std::cout << std::count(v.begin(), v.end(), 2);`,a:"3",why:"Three 2s."},
 {t:"out",code:R`std::vector<int> v = {6, 2, 8};
std::cout << *std::max_element(v.begin(), v.end());`,a:"8",why:"The * turns the iterator into the value it points at."},
 {t:"mc",q:"Why the `*` in `*std::max_element(v.begin(), v.end())`?",opts:["It multiplies","max_element returns an iterator (a marker to a position), and * gets the value there","It's a comment","It makes the result a pointer"],a:1,why:"Iterators point at positions; * reads the value."},
 {t:"out",code:R`std::vector<int> v = {1, 2, 3, 4};
std::cout << std::accumulate(v.begin(), v.end(), 10);`,a:"20",why:"It starts from 10 and adds 1 + 2 + 3 + 4."}],
problems:[
 {title:"Median",task:"Read n (1 or more), then n whole numbers. Print the median: the middle value once sorted. If n is even, it's the average of the two middle values (which may be a decimal).\n\nExample: `5` then `7 1 3 9 4` → `4`. `4` then `1 2 3 4` → `2.5`.",tests:[{in:"5\n7 1 3 9 4",out:"4"},{in:"4\n1 2 3 4",out:"2.5"},{in:"1\n-3",out:"-3"},{in:"2\n10 20",out:"15"}],
  starter:R`#include <iostream>
#include <vector>
#include <algorithm>

int main() {

    return 0;
}`,hints:["Sort the vector.","Odd n: the middle index is n / 2. Even n: average v[n/2 − 1] and v[n/2], dividing by 2.0."],
  sol:R`#include <iostream>
#include <vector>
#include <algorithm>

int main() {
    int n = 0;
    std::cin >> n;
    std::vector<int> v(n);
    for (int& x : v) std::cin >> x;
    std::sort(v.begin(), v.end());
    if (n % 2 == 1) {
        std::cout << v[n / 2] << "\n";
    } else {
        std::cout << (v[n / 2 - 1] + v[n / 2]) / 2.0 << "\n";
    }
    return 0;
}`,explain:"For n = 5 the indexes are 0 to 4, and n / 2 = 2 is the middle. Check index maths with a tiny example like this every time."},
 {title:"Top three",task:"Read n (3 or more), then n whole numbers. Print the three largest, biggest first, separated by spaces.",tests:[{in:"6\n5 1 9 3 7 2",out:"9 7 5"},{in:"3\n1 2 3",out:"3 2 1"},{in:"5\n4 4 4 1 4",out:"4 4 4"}],
  starter:R`#include <iostream>
#include <vector>
#include <algorithm>

int main() {

    return 0;
}`,hints:["Sort descending with `std::greater<int>()`.","Then print v[0], v[1] and v[2]."],
  sol:R`#include <iostream>
#include <vector>
#include <algorithm>

int main() {
    int n = 0;
    std::cin >> n;
    std::vector<int> v(n);
    for (int& x : v) std::cin >> x;
    std::sort(v.begin(), v.end(), std::greater<int>());
    std::cout << v[0] << " " << v[1] << " " << v[2] << "\n";
    return 0;
}`,explain:"Sorting everything to get three values is a bit wasteful for huge inputs. `std::partial_sort` exists for exactly this, but sort is perfectly fine here."},
 {title:"How many different?",task:"Read n, then n whole numbers. Print how many distinct values there are.\n\nExample: `6` then `3 1 3 2 1 3` → `3`.",tests:[{in:"6\n3 1 3 2 1 3",out:"3"},{in:"1\n5",out:"1"},{in:"4\n7 7 7 7",out:"1"},{in:"5\n5 4 3 2 1",out:"5"}],
  starter:R`#include <iostream>
#include <vector>
#include <algorithm>

int main() {

    return 0;
}`,hints:["After sorting, equal values sit next to each other.","Count position 0, plus every i where `v[i] != v[i - 1]`."],
  sol:R`#include <iostream>
#include <vector>
#include <algorithm>

int main() {
    int n = 0;
    std::cin >> n;
    std::vector<int> v(n);
    for (int& x : v) std::cin >> x;
    std::sort(v.begin(), v.end());
    int distinct = (n > 0) ? 1 : 0;
    for (int i = 1; i < n; i++) {
        if (v[i] != v[i - 1]) distinct++;
    }
    std::cout << distinct << "\n";
    return 0;
}`,explain:"Sorting turned 'have I seen this anywhere before?' into 'is this different from the one before it?'. On Day 26 you'll do it even more simply with a set."}]});
