"use strict";
/* C++ Daily course, part 4: Units 6–7. Shapes are described in course-1.js. */

/* ======================= UNIT 6: ORGANISING DATA ======================= */
DAYS.push({n:23,unit:"Organising data",title:"struct: bundling related values",
goal:"Group values that belong together into your own type.",
sections:[
 {h:"Your own types",p:"A trade has a ticker, a quantity and a price. You could keep three separate vectors, but it's easy to get them out of step. A `struct` bundles related values into one new type. Each value inside is called a member.",code:R`#include <iostream>
#include <string>

struct Trade {
    std::string ticker;
    int qty;
    double price;
};

int main() {
    Trade t = {"AAPL", 10, 189.5};
    std::cout << t.ticker << " " << t.qty * t.price << "\n";
    t.qty = 20;
    std::cout << t.qty << "\n";
    return 0;
}`,out:"AAPL 1895\n20"},
 {h:"Dot to reach inside",p:"`t.qty` means the qty member of t. You can read it, change it, and pass it around like any other variable. Note the semicolon after the struct's closing brace. Forgetting it gives a confusing error on the line after."},
 {h:"Vectors of structs",p:"This is where structs pay off: one vector holding complete records.",code:R`#include <iostream>
#include <string>
#include <vector>

struct Trade {
    std::string ticker;
    int qty;
    double price;
};

int main() {
    std::vector<Trade> book = {{"AAPL", 10, 190}, {"MSFT", 5, 410}};
    book.push_back({"TSLA", 2, 250});
    double total = 0;
    for (const Trade& t : book) {
        total += t.qty * t.price;
    }
    std::cout << book.size() << " trades, " << total << "\n";
    return 0;
}`,out:"3 trades, 4450"},
 {h:"Passing structs to functions",p:"Same rules as before. Pass by `const Trade&` to read, by `Trade&` to change. Passing by value copies the whole struct.",code:R`#include <iostream>

struct Point {
    double x;
    double y;
};

void moveRight(Point& p, double d) {
    p.x += d;
}

double manhattan(const Point& a, const Point& b) {
    double dx = a.x - b.x, dy = a.y - b.y;
    return (dx < 0 ? -dx : dx) + (dy < 0 ? -dy : dy);
}

int main() {
    Point a = {0, 0}, b = {3, 4};
    moveRight(a, 1);
    std::cout << a.x << " " << manhattan(a, b) << "\n";
    return 0;
}`,out:"1 6"},
 {h:"Reading into a struct",p:"Read straight into the members: `std::cin >> t.ticker >> t.qty >> t.price;`. Read n records into a `std::vector<Trade> v(n);` with a reference loop: `for (Trade& t : v) std::cin >> t.ticker >> t.qty >> t.price;`."}],
takeaways:["`struct Name { members };` makes a new type. Mind the semicolon.","`obj.member` reads or changes a member.","`std::vector<Trade>` holds whole records.","Pass by `const &` to read and `&` to change."],
checks:[
 {t:"out",code:R`#include <iostream>

struct P {
    int x;
    int y;
};

int main() {
    P p = {3, 4};
    p.y = 10;
    std::cout << p.x + p.y;
    return 0;
}`,a:"13",why:"3 + 10."},
 {t:"out",code:R`#include <iostream>

struct Box {
    int w;
};

void grow(Box b) {
    b.w = 99;
}

int main() {
    Box b = {1};
    grow(b);
    std::cout << b.w;
    return 0;
}`,a:"1",why:"grow got a copy. To change the original it needs `Box& b`."},
 {t:"mc",q:"What's wrong?",code:R`struct Item {
    int id;
}
int main() { return 0; }`,opts:["Members need to be public","The struct is missing a semicolon after its closing brace","`int` can't go in a struct","main must come first"],a:1,why:"A struct definition ends with `};`."},
 {t:"out",code:R`#include <iostream>
#include <vector>

struct S {
    int v;
};

int main() {
    std::vector<S> xs = {{1}, {2}, {3}};
    for (S& s : xs) s.v *= 10;
    std::cout << xs[0].v + xs[2].v;
    return 0;
}`,a:"40",why:"With &, every v is multiplied: 10 + 30."}],
problems:[
 {title:"Trade notional",task:"Read n, then n trades, each as `TICKER qty price` (qty a whole number, price a decimal). Print each trade's notional (qty × price) on its own line as `TICKER notional`, then a final line `total X`.\n\nExample: `2`, `AAPL 10 190.5`, `MSFT 3 400` → `AAPL 1905`, `MSFT 1200`, `total 3105`.",tests:[{in:"2\nAAPL 10 190.5\nMSFT 3 400",out:"AAPL 1905\nMSFT 1200\ntotal 3105"},{in:"1\nX 1 0.25",out:"X 0.25\ntotal 0.25"},{in:"3\nA 2 1.5\nB 4 2.25\nC 1 10",out:"A 3\nB 9\nC 10\ntotal 22"}],
  starter:R`#include <iostream>
#include <string>
#include <vector>

struct Trade {
    std::string ticker;
    int qty;
    double price;
};

int main() {
    int n = 0;
    std::cin >> n;
    std::vector<Trade> trades(n);

    return 0;
}`,hints:["Fill the vector: `for (Trade& t : trades) std::cin >> t.ticker >> t.qty >> t.price;`","Loop again, printing `t.ticker << \" \" << t.qty * t.price` and adding to a double total."],
  sol:R`#include <iostream>
#include <string>
#include <vector>

struct Trade {
    std::string ticker;
    int qty;
    double price;
};

int main() {
    int n = 0;
    std::cin >> n;
    std::vector<Trade> trades(n);
    for (Trade& t : trades) {
        std::cin >> t.ticker >> t.qty >> t.price;
    }
    double total = 0;
    for (const Trade& t : trades) {
        double notional = t.qty * t.price;
        std::cout << t.ticker << " " << notional << "\n";
        total += notional;
    }
    std::cout << "total " << total << "\n";
    return 0;
}`,explain:"`cout` prints doubles with up to 6 significant digits by default, so very large values switch to forms like 1.2e+06. For money you'd use `std::fixed` and `std::setprecision(2)` from `<iomanip>`."},
 {title:"Top scorer",task:"Read n, then n lines of `name score` (score a whole number). Print the name with the highest score. If there's a tie, print the one that came first.",tests:[{in:"3\nAda 82\nAlan 91\nGrace 77",out:"Alan"},{in:"2\nX 50\nY 50",out:"X"},{in:"1\nSolo 0",out:"Solo"}],
  starter:R`#include <iostream>
#include <string>
#include <vector>

struct Student {
    std::string name;
    int score;
};

int main() {

    return 0;
}`,hints:["Read into a vector of Student.","Keep the index of the best so far, starting at 0, and update it only when a score is strictly greater."],
  sol:R`#include <iostream>
#include <string>
#include <vector>

struct Student {
    std::string name;
    int score;
};

int main() {
    int n = 0;
    std::cin >> n;
    std::vector<Student> v(n);
    for (Student& s : v) {
        std::cin >> s.name >> s.score;
    }
    int best = 0;
    for (int i = 1; i < n; i++) {
        if (v[i].score > v[best].score) best = i;
    }
    std::cout << v[best].name << "\n";
    return 0;
}`,explain:"Strictly greater (`>`) keeps the first of any tied scores. With `>=` you'd get the last. Tie-breaking rules are where many hidden tests live."}]});

DAYS.push({n:24,unit:"Organising data",title:"Classes: data with rules",
goal:"Write a class that protects its data and offers actions.",
sections:[
 {h:"From struct to class",p:"A struct lets anyone change any member. Sometimes that's dangerous: a bank balance shouldn't be set to anything from anywhere. A `class` bundles data with the functions allowed to change it, and hides the data itself."},
 {h:"public and private",p:"Members under `private:` can only be used by the class's own functions. Members under `public:` can be used by anyone. Data is usually private and the actions are public. (In a class, members are private by default; in a struct they're public. That's the only real difference.)",code:R`#include <iostream>

class Counter {
public:
    void click() {
        count++;
    }
    int value() const {
        return count;
    }
private:
    int count = 0;
};

int main() {
    Counter c;
    c.click();
    c.click();
    std::cout << c.value() << "\n";
    return 0;
}`,out:"2"},
 {h:"Constructors",p:"A constructor is a special function with the same name as the class and no return type. It runs when an object is created, so the object starts in a valid state. The `: owner(name), balance(0)` part, called an initialiser list, sets members before the body runs.",code:R`#include <iostream>
#include <string>

class Account {
public:
    Account(const std::string& name) : owner(name), balance(0) {}

    void deposit(double amount) {
        if (amount > 0) balance += amount;
    }

    bool withdraw(double amount) {
        if (amount <= 0 || amount > balance) return false;
        balance -= amount;
        return true;
    }

    double getBalance() const { return balance; }

private:
    std::string owner;
    double balance;
};

int main() {
    Account a("Chakshu");
    a.deposit(100);
    std::cout << a.withdraw(30) << " " << a.withdraw(500) << " " << a.getBalance() << "\n";
    return 0;
}`,out:"1 0 70"},
 {h:"Why bother",p:"Because balance is private, the only way to change it is through deposit and withdraw, and those enforce the rules: no negative deposits, no overdrafts. Those rules are called invariants. If a bug ever makes the balance negative, you know exactly which few functions to look at."},
 {h:"const member functions",p:"`int value() const` promises that calling the function won't change the object. The compiler holds you to it, and it lets you call the function on const objects, such as one passed by `const &`. Mark every function that only reads as `const`."}],
takeaways:["A class bundles private data with public actions.","`private:` members are usable only inside the class.","A constructor sets up a valid object when it's created.","Mark read-only member functions `const`."],
checks:[
 {t:"out",code:R`#include <iostream>

class C {
public:
    void add(int x) { total += x; }
    int get() const { return total; }
private:
    int total = 0;
};

int main() {
    C c;
    c.add(5);
    c.add(-2);
    std::cout << c.get();
    return 0;
}`,a:"3",why:"0 + 5 − 2."},
 {t:"mc",q:"`balance` is private in class Account. What happens with `a.balance = 1000000;` in main?",opts:["It works","Compile error: private members can't be used outside the class","It sets the balance to 0","It only works with a constructor"],a:1,why:"That's the point of private: only the class's own functions can touch it."},
 {t:"out",code:R`#include <iostream>

class Temp {
public:
    Temp(double c) : celsius(c) {}
    double f() const { return celsius * 9 / 5 + 32; }
private:
    double celsius;
};

int main() {
    Temp t(100);
    std::cout << t.f();
    return 0;
}`,a:"212",why:"The constructor stored 100, and f() converts it."},
 {t:"mc",q:"What does `const` after `int value() const` mean?",opts:["It returns a constant","Calling value() won't change the object","value can only be called once","The function can't take parameters"],a:1,why:"It's a promise not to change any members, checked by the compiler."}],
problems:[
 {title:"Bank account",task:"Complete the `Account` class. Then read n commands, each `deposit X` or `withdraw X` (X a whole number). After each command print the balance, or `insufficient` if a withdrawal is more than the balance (the balance then stays the same).\n\nExample: `3`, `deposit 50`, `withdraw 80`, `withdraw 20` → `50`, `insufficient`, `30`.",tests:[{in:"3\ndeposit 50\nwithdraw 80\nwithdraw 20",out:"50\ninsufficient\n30"},{in:"2\nwithdraw 1\ndeposit 1",out:"insufficient\n1"},{in:"4\ndeposit 10\ndeposit 15\nwithdraw 25\nwithdraw 1",out:"10\n25\n0\ninsufficient"}],
  starter:R`#include <iostream>
#include <string>

class Account {
public:
    void deposit(int amount) {

    }
    bool withdraw(int amount) {
        // return false if there isn't enough money
        return false;
    }
    int balance() const {
        return bal;
    }
private:
    int bal = 0;
};

int main() {
    Account acc;
    int n = 0;
    std::cin >> n;
    for (int i = 0; i < n; i++) {
        std::string cmd;
        int x = 0;
        std::cin >> cmd >> x;
        // use acc here
    }
    return 0;
}`,hints:["deposit: `bal += amount;`","withdraw: `if (amount > bal) return false;` otherwise subtract and return true.","In main: if cmd is \"deposit\", deposit and print the balance. Otherwise try to withdraw: print the balance if it worked, or insufficient."],
  sol:R`#include <iostream>
#include <string>

class Account {
public:
    void deposit(int amount) {
        bal += amount;
    }
    bool withdraw(int amount) {
        if (amount > bal) return false;
        bal -= amount;
        return true;
    }
    int balance() const {
        return bal;
    }
private:
    int bal = 0;
};

int main() {
    Account acc;
    int n = 0;
    std::cin >> n;
    for (int i = 0; i < n; i++) {
        std::string cmd;
        int x = 0;
        std::cin >> cmd >> x;
        if (cmd == "deposit") {
            acc.deposit(x);
            std::cout << acc.balance() << "\n";
        } else if (acc.withdraw(x)) {
            std::cout << acc.balance() << "\n";
        } else {
            std::cout << "insufficient\n";
        }
    }
    return 0;
}`,explain:"main never touches `bal` directly. It asks the account to do things, and the account enforces its own rule. That separation is what object-oriented design is about."},
 {title:"Rectangle",task:"Write a class `Rect` with a constructor taking width and height (whole numbers), and const member functions `area()`, `perimeter()` and `isSquare()`. Read w and h and print the area, the perimeter, and `square` or `not square`, separated by spaces.\n\nThe starter won't compile until your class has the functions main uses.",tests:[{in:"3 4",out:"12 14 not square"},{in:"5 5",out:"25 20 square"},{in:"1 10",out:"10 22 not square"}],
  starter:R`#include <iostream>

class Rect {
public:

private:

};

int main() {
    int w = 0, h = 0;
    std::cin >> w >> h;
    Rect r(w, h);
    std::cout << r.area() << " " << r.perimeter() << " " << (r.isSquare() ? "square" : "not square") << "\n";
    return 0;
}`,starterBroken:true,hints:["Private members: `int w; int h;`","Constructor: `Rect(int width, int height) : w(width), h(height) {}`","`int area() const { return w * h; }`, and perimeter is 2 × (w + h)."],
  sol:R`#include <iostream>

class Rect {
public:
    Rect(int width, int height) : w(width), h(height) {}
    int area() const { return w * h; }
    int perimeter() const { return 2 * (w + h); }
    bool isSquare() const { return w == h; }
private:
    int w;
    int h;
};

int main() {
    int w = 0, h = 0;
    std::cin >> w >> h;
    Rect r(w, h);
    std::cout << r.area() << " " << r.perimeter() << " " << (r.isSquare() ? "square" : "not square") << "\n";
    return 0;
}`,explain:"The starter didn't compile because main uses functions that didn't exist yet. Writing the code that uses a class first, then the class, is a good way to design one."}]});

DAYS.push({n:25,unit:"Organising data",title:"std::map: look things up by name",
goal:"Store key → value pairs and look values up by key.",
sections:[
 {h:"A dictionary",p:"A vector finds things by position: 0, 1, 2… A `std::map` finds things by a key you choose, like a ticker or a word. `std::map<std::string, int> m;` maps strings to ints. It needs `#include <map>`.",code:R`std::map<std::string, int> position;
position["AAPL"] = 100;
position["MSFT"] = -50;
position["AAPL"] += 25;
std::cout << position["AAPL"] << " " << position.size() << "\n";`,out:"125 2"},
 {h:"Counting with a map",p:"`m[key]` creates the key with value 0 if it isn't there yet. So `m[word]++` counts occurrences in one line, which is the most common use of a map.",code:R`std::vector<std::string> words = {"buy", "sell", "buy", "hold", "buy"};
std::map<std::string, int> count;
for (const std::string& w : words) {
    count[w]++;
}
std::cout << count["buy"] << " " << count["hold"] << "\n";`,out:"3 1"},
 {h:"Looping in key order",p:"A map keeps its keys sorted, so a loop visits them in order: alphabetical for strings. Each element is a pair with `.first` (the key) and `.second` (the value). `auto& [key, value]` unpacks the pair into two names.",code:R`std::map<std::string, int> m = {{"pear", 3}, {"apple", 5}, {"fig", 1}};
for (const auto& [fruit, n] : m) {
    std::cout << fruit << "=" << n << " ";
}`,out:"apple=5 fig=1 pear=3"},
 {h:"Checking without creating",p:"Because `m[key]` creates missing keys, just looking can change the map. To check whether a key exists, use `m.count(key)`, which is 1 or 0, or `m.find(key) != m.end()`.",code:R`std::map<std::string, int> m;
std::cout << m.count("x") << " ";
int v = m["x"];
std::cout << v << " " << m.size() << " " << m.count("x") << "\n";`,out:"0 0 1 1"},
 {h:"Removing",p:"`m.erase(key)` removes a key and its value. Maps work with other key types too: `std::map<int, std::string>` maps numbers to names, which would tidy up Day 9's day-name problem."}],
takeaways:["`std::map<Key, Value>` looks values up by key.","`m[key]` creates missing keys with 0, so `m[w]++` counts.","Loops visit keys in sorted order: `for (const auto& [k, v] : m)`.","Use `m.count(key)` to check without creating."],
checks:[
 {t:"out",code:R`std::map<std::string, int> m;
m["a"] = 1;
m["b"] = 2;
m["a"] = 5;
std::cout << m["a"] << m.size();`,a:"52",why:"Assigning to an existing key replaces its value. There are still 2 keys."},
 {t:"out",code:R`std::map<std::string, int> m = {{"z", 1}, {"a", 2}, {"m", 3}};
for (const auto& [k, v] : m) std::cout << k;`,a:"amz",why:"Maps keep keys sorted."},
 {t:"mc",q:"`m` is empty. What does `std::cout << m[\"x\"];` do?",opts:["Crashes","Prints 0, and adds \"x\" to the map","Prints nothing","Compile error"],a:1,why:"[] creates the missing key with a default value of 0."},
 {t:"out",code:R`std::string s = "banana";
std::map<char, int> c;
for (char ch : s) c[ch]++;
std::cout << c['a'] << c['n'] << c.size();`,a:"323",why:"3 a's, 2 n's and 3 different letters (a, b, n)."}],
problems:[
 {title:"Word frequency",task:"Read n, then n words. Print each different word and how many times it appeared, as `word count`, one per line, in alphabetical order.",tests:[{in:"5\nbuy sell buy hold buy",out:"buy 3\nhold 1\nsell 1"},{in:"1\nhi",out:"hi 1"},{in:"4\nb a b a",out:"a 2\nb 2"}],
  starter:R`#include <iostream>
#include <map>
#include <string>

int main() {

    return 0;
}`,hints:["`std::map<std::string, int> count;` then `count[w]++` for each word.","Loop with `for (const auto& [w, c] : count)`. It's already alphabetical."],
  sol:R`#include <iostream>
#include <map>
#include <string>

int main() {
    int n = 0;
    std::cin >> n;
    std::map<std::string, int> count;
    for (int i = 0; i < n; i++) {
        std::string w;
        std::cin >> w;
        count[w]++;
    }
    for (const auto& [w, c] : count) {
        std::cout << w << " " << c << "\n";
    }
    return 0;
}`,explain:"Five lines of real logic. Without a map you'd need nested loops and lots of bookkeeping."},
 {title:"Net positions",task:"Read n trades, each `TICKER qty`. Positive qty is a buy and negative is a sell. Print each ticker's net position as `TICKER qty` in alphabetical order, leaving out tickers whose position is 0. If every position is 0, print `flat`.",tests:[{in:"5\nAAPL 100\nMSFT 20\nAAPL -40\nTSLA 5\nTSLA -5",out:"AAPL 60\nMSFT 20"},{in:"2\nX 3\nX -3",out:"flat"},{in:"3\nB -10\nA 1\nB 4",out:"A 1\nB -6"}],
  starter:R`#include <iostream>
#include <map>
#include <string>

int main() {

    return 0;
}`,hints:["Add each qty into `pos[ticker]`.","When printing, skip entries where the value is 0, and use a bool to remember whether you printed anything."],
  sol:R`#include <iostream>
#include <map>
#include <string>

int main() {
    int n = 0;
    std::cin >> n;
    std::map<std::string, long long> pos;
    for (int i = 0; i < n; i++) {
        std::string t;
        long long q = 0;
        std::cin >> t >> q;
        pos[t] += q;
    }
    bool any = false;
    for (const auto& [t, q] : pos) {
        if (q != 0) {
            std::cout << t << " " << q << "\n";
            any = true;
        }
    }
    if (!any) std::cout << "flat\n";
    return 0;
}`,explain:"This is a tiny version of what a real trading system does all day: keep a map from instrument to position and update it on every fill."}]});

DAYS.push({n:26,unit:"Organising data",title:"Sets, hash maps and choosing a container",
goal:"Use std::set and std::unordered_map, and know which container to reach for.",
sections:[
 {h:"std::set: unique and sorted",p:"A `std::set` holds each value at most once and keeps them sorted. Inserting something that's already there does nothing. `s.count(x)` tells you if x is in the set. It needs `#include <set>`.",code:R`std::set<int> s = {3, 1, 3, 2, 1};
s.insert(5);
s.insert(2);
for (int x : s) std::cout << x << " ";
std::cout << "\nsize " << s.size() << ", has 4? " << s.count(4) << "\n";`,out:"1 2 3 5\nsize 4, has 4? 0"},
 {h:"Have I seen this before?",p:"The classic use of a set: walk through data and remember what you've already seen. Checking a set takes about log₂(n) steps, so it stays fast even for a million items, while searching a vector checks every element.",code:R`std::vector<int> v = {4, 7, 1, 7, 4};
std::set<int> seen;
for (int x : v) {
    if (seen.count(x)) {
        std::cout << "repeat " << x << "\n";
        break;
    }
    seen.insert(x);
}`,out:"repeat 7"},
 {h:"Unordered versions",p:"`std::unordered_map` and `std::unordered_set` work almost the same way as map and set, but they use hashing, so lookups are usually faster (about one step on average). The cost: there's no order. Looping over them visits elements in an order that looks random. Use them when you need speed and don't care about order."},
 {h:"Which container?",p:"`std::vector`: the default. Ordered by position, fast to loop over. `std::map`: look up by key and keep keys sorted. `std::unordered_map`: look up by key as fast as possible, no order. `std::set` / `std::unordered_set`: just 'is it in there?' and no duplicates. When unsure, start with vector, and switch when you find yourself searching it again and again."},
 {h:"A taste of Big-O",p:"Programmers describe speed by how the work grows with the input size n. Searching a vector is O(n): double the data, double the time. A set lookup is O(log n), and a hash lookup is O(1) on average. Two nested loops over the data are O(n²). For n = 100,000, that's the difference between instant and minutes. Interviewers will ask for the Big-O of every solution you write."}],
takeaways:["`std::set`: unique values, sorted, `count(x)` to check.","Use a set to remember what you've seen.","unordered_ versions are faster but have no order.","Vector by default; map/set when you look things up."],
checks:[
 {t:"out",code:R`std::set<int> s = {3, 1, 3, 2};
for (int x : s) std::cout << x;`,a:"123",why:"Duplicates vanish and values come out sorted."},
 {t:"out",code:R`std::set<std::string> s;
s.insert("b");
s.insert("a");
s.insert("b");
std::cout << s.size() << s.count("b") << s.count("c");`,a:"210",why:"Two unique values. \"b\" is there, \"c\" isn't."},
 {t:"mc",q:"You need to check, again and again, whether user IDs have already been seen. Order doesn't matter. Best choice?",opts:["std::vector with a loop","std::unordered_set","std::string","A 2D vector"],a:1,why:"Fast membership checks with no need for order."},
 {t:"mc",q:"Two nested loops, each over all n items. Roughly how does the time grow?",opts:["O(1)","O(log n)","O(n)","O(n²)"],a:3,why:"n × n steps. Ten times the data means a hundred times the work."}],
problems:[
 {title:"First repeat",task:"Read n, then n whole numbers. Print the first number that appears for a second time (the one whose second appearance comes earliest), or `none`.\n\nExample: `6` then `5 3 8 3 5 9` → `3`.",tests:[{in:"6\n5 3 8 3 5 9",out:"3"},{in:"3\n1 2 3",out:"none"},{in:"4\n7 7 1 1",out:"7"}],
  starter:R`#include <iostream>
#include <set>

int main() {

    return 0;
}`,hints:["Read numbers one at a time into a set called seen.","Before inserting, check `seen.count(x)`. If it's already there, print it and stop."],
  sol:R`#include <iostream>
#include <set>

int main() {
    int n = 0;
    std::cin >> n;
    std::set<int> seen;
    for (int i = 0; i < n; i++) {
        int x = 0;
        std::cin >> x;
        if (seen.count(x)) {
            std::cout << x << "\n";
            return 0;
        }
        seen.insert(x);
    }
    std::cout << "none\n";
    return 0;
}`,explain:"`return 0;` inside the loop ends main straight away, a neat way to stop once you have the answer. With two nested loops this would be O(n²); with a set it's O(n log n)."},
 {title:"Two sum",task:"Read n, then n whole numbers, then a target. Print `yes` if two numbers at different positions add up to the target, otherwise `no`.\n\nExample: `4`, `2 7 11 15`, target `9` → `yes` (2 + 7).",tests:[{in:"4\n2 7 11 15\n9",out:"yes"},{in:"3\n1 2 3\n7",out:"no"},{in:"2\n4 4\n8",out:"yes"},{in:"1\n4\n8",out:"no"},{in:"3\n-3 10 5\n2",out:"yes"}],
  starter:R`#include <iostream>
#include <vector>
#include <set>

int main() {

    return 0;
}`,hints:["The slow way: try every pair i < j. That's O(n²).","The fast way: for each x, the partner you need is target − x. Have you already seen it? Check a set, then add x."],
  sol:R`#include <iostream>
#include <vector>
#include <set>

int main() {
    int n = 0;
    std::cin >> n;
    std::vector<long long> v(n);
    for (long long& x : v) std::cin >> x;
    long long target = 0;
    std::cin >> target;
    std::set<long long> seen;
    bool found = false;
    for (long long x : v) {
        if (seen.count(target - x)) {
            found = true;
            break;
        }
        seen.insert(x);
    }
    std::cout << (found ? "yes" : "no") << "\n";
    return 0;
}`,explain:"This is one of the most famous interview questions. Checking before inserting is what stops a single 4 from pairing with itself when the target is 8. The `4 4` and `1` tests check exactly that."}]});

/* ======================= UNIT 7: UNDER THE HOOD ======================= */
DAYS.push({n:27,unit:"Under the hood",title:"Memory, addresses and pointers",
goal:"Understand where variables live and use pointers safely.",
sections:[
 {h:"Every variable has an address",p:"Memory is a long row of numbered slots. Each variable sits at some slot number, its address. `&x` gives x's address, printed as a hex number like 0x7ffd…. You rarely care about the actual number, but the idea explains a lot of C++."},
 {h:"Pointers hold addresses",p:"A pointer is a variable that stores an address. `int* p = &x;` reads: p is a pointer to an int, and it holds the address of x. `*p` follows the pointer to the value there. This is called dereferencing, and you can read or change the value through it.",code:R`int x = 5;
int* p = &x;
std::cout << *p << "\n";
*p = 9;
std::cout << x << "\n";`,out:"5\n9"},
 {h:"One symbol, two jobs",p:"The symbols do different jobs depending on where they appear. In a type, `int*` means pointer to int and `int&` means reference to int. In an expression, `&x` means address of x and `*p` means the value p points to. It's confusing at first. Read declarations slowly."},
 {h:"nullptr",p:"A pointer that points at nothing should hold `nullptr`. Dereferencing a null pointer is undefined behaviour and usually crashes, so check `if (p != nullptr)` before using a pointer that might be empty.",code:R`int* p = nullptr;
if (p == nullptr) {
    std::cout << "points at nothing\n";
}
int y = 3;
p = &y;
if (p) {
    std::cout << "now " << *p << "\n";
}`,out:"points at nothing\nnow 3"},
 {h:"Pointers vs references",p:"Both let you reach another variable. A reference must be attached when it's created, can never be re-pointed and can't be null. A pointer can be null and can be moved to point somewhere else. Prefer references, and use pointers when 'nothing' is a valid answer, or when you meet C-style code and data structures like linked lists."}],
takeaways:["`&x` is x's address; `int* p = &x;` stores it.","`*p` is the value p points to: read it or change it.","Use `nullptr` for nothing, and check before you dereference.","Prefer references; use pointers when 'nothing' is possible."],
checks:[
 {t:"out",code:R`int a = 5;
int* p = &a;
*p = 9;
std::cout << a;`,a:"9",why:"p points at a, so *p = 9 changes a."},
 {t:"out",code:R`int a = 1, b = 2;
int* p = &a;
p = &b;
*p = 7;
std::cout << a << b;`,a:"17",why:"p was moved to point at b before the change."},
 {t:"mc",q:"In `int* p = &x;` what does `&` mean?",opts:["Reference to int","Address of x","Logical and","Bitwise and"],a:1,why:"In an expression, & before a variable gives its address."},
 {t:"mc",q:"What happens with `int* p = nullptr; std::cout << *p;`?",opts:["Prints 0","Prints nullptr","Undefined behaviour: usually a crash","Compile error"],a:2,why:"There's nothing at a null pointer to read."},
 {t:"out",code:R`#include <iostream>

void setTo(int* p, int v) {
    if (p) *p = v;
}

int main() {
    int x = 0;
    setTo(&x, 4);
    setTo(nullptr, 9);
    std::cout << x;
    return 0;
}`,a:"4",why:"The first call changes x. The second is safely ignored thanks to the null check."}],
problems:[
 {title:"Swap with pointers",task:"Write `void swapPtr(int* a, int* b)` that swaps the two values the pointers point at. Read two numbers, call `swapPtr(&x, &y)`, and print `x y`.",tests:[{in:"3 8",out:"8 3"},{in:"0 -1",out:"-1 0"}],
  starter:R`#include <iostream>

void swapPtr(int* a, int* b) {

}

int main() {
    int x = 0, y = 0;
    std::cin >> x >> y;
    swapPtr(&x, &y);
    std::cout << x << " " << y << "\n";
    return 0;
}`,hints:["Same three steps as before, but through the pointers: `int temp = *a;`","Then `*a = *b;` and `*b = temp;`"],
  sol:R`#include <iostream>

void swapPtr(int* a, int* b) {
    int temp = *a;
    *a = *b;
    *b = temp;
}

int main() {
    int x = 0, y = 0;
    std::cin >> x >> y;
    swapPtr(&x, &y);
    std::cout << x << " " << y << "\n";
    return 0;
}`,explain:"This is how swap was written in C, which has no references. Compare it with Day 16: the reference version is cleaner, which is why C++ prefers references."},
 {title:"Zero the biggest",task:"Write `int* largest(std::vector<int>& v)` that returns a pointer to the largest element (the first one if there's a tie), or `nullptr` if v is empty. In main, read n and n numbers, set the largest to 0 through the pointer, and print the vector. If n is 0, print `empty`.",tests:[{in:"4\n3 9 2 9",out:"3 0 2 9"},{in:"1\n5",out:"0"},{in:"0",out:"empty"}],
  starter:R`#include <iostream>
#include <vector>

int* largest(std::vector<int>& v) {

    return nullptr;
}

int main() {
    int n = 0;
    std::cin >> n;
    std::vector<int> v(n);
    for (int& x : v) std::cin >> x;
    int* p = largest(v);
    // if p is null print empty, otherwise set *p to 0 and print v

    return 0;
}`,hints:["If v is empty, return nullptr.","Otherwise start with `int* best = &v[0];` and loop i from 1, moving best when `v[i] > *best`."],
  sol:R`#include <iostream>
#include <vector>

int* largest(std::vector<int>& v) {
    if (v.empty()) return nullptr;
    int* best = &v[0];
    for (size_t i = 1; i < v.size(); i++) {
        if (v[i] > *best) best = &v[i];
    }
    return best;
}

int main() {
    int n = 0;
    std::cin >> n;
    std::vector<int> v(n);
    for (int& x : v) std::cin >> x;
    int* p = largest(v);
    if (p == nullptr) {
        std::cout << "empty\n";
        return 0;
    }
    *p = 0;
    for (int x : v) std::cout << x << " ";
    std::cout << "\n";
    return 0;
}`,explain:"Here a pointer earns its place: 'no answer' (an empty vector) is a real possibility, and nullptr expresses it. One warning: a pointer into a vector becomes invalid if the vector grows with push_back, because the elements may move."}]});

DAYS.push({n:28,unit:"Under the hood",title:"Arrays, the heap and smart pointers",
goal:"Know the older tools you'll see in other people's code, and the modern ones to use instead.",
sections:[
 {h:"C-style arrays",p:"Before vectors there were plain arrays: `int a[5];`. They have a fixed size, don't know their own size, can't be resized, and don't check indexes. You'll see them in older code and in C. For a fixed size in modern C++, use `std::array<int, 5>` from `<array>`: same speed, but it knows its size and works with range loops and algorithms.",code:R`int old[3] = {1, 2, 3};
std::array<int, 3> modern = {4, 5, 6};
std::cout << old[0] + old[2] << " " << modern.size() << " " << modern.back() << "\n";`,out:"4 3 6"},
 {h:"Stack and heap",p:"Normal local variables live on the stack: they're created when their block starts and destroyed automatically when it ends. Memory you ask for with `new` lives on the heap and stays until something deletes it. A vector keeps its elements on the heap but manages that for you."},
 {h:"new and delete, and why to avoid them",p:"`int* p = new int(5);` creates an int on the heap; `delete p;` frees it. Forget the delete and the memory is never returned: a memory leak. Delete twice, or use p after deleting, and you get undefined behaviour. These bugs are notoriously hard to find. Modern C++ almost never needs `new` written by hand."},
 {h:"Smart pointers",p:"`std::unique_ptr` from `<memory>` owns a heap object and deletes it automatically when the unique_ptr goes out of scope. Create one with `std::make_unique<T>(...)`. You use it like a normal pointer, with `*` and `->`. There's also `std::shared_ptr`, for when several owners share one object.",code:R`#include <iostream>
#include <memory>
#include <string>

struct Order {
    std::string side;
    int qty;
};

int main() {
    std::unique_ptr<Order> o = std::make_unique<Order>(Order{"BUY", 100});
    o->qty += 50;
    std::cout << o->side << " " << (*o).qty << "\n";
    return 0;
}`,out:"BUY 150"},
 {h:"The arrow",p:"`o->qty` is shorthand for `(*o).qty`: follow the pointer, then take the member. You'll use `->` with any pointer to a struct or class. The rule to take away: let objects clean up after themselves. Use vectors for lists, unique_ptr for single heap objects, and never a bare `new` without a very good reason. This idea is called RAII, and it's one of C++'s best features."}],
takeaways:["Prefer `std::vector` or `std::array` to C arrays.","Stack variables clean up automatically; heap memory needs freeing.","Raw new/delete cause leaks and crashes. Avoid them.","`std::make_unique` creates; the unique_ptr deletes for you. `p->m` = `(*p).m`."],
checks:[
 {t:"out",code:R`int a[3] = {1, 2, 3};
std::cout << a[0] + a[2];`,a:"4",why:"1 + 3."},
 {t:"mc",q:"What happens if you `new` an object and never `delete` it?",opts:["Compile error","The memory is freed when main starts","A memory leak: the memory is never given back while the program runs","It's deleted automatically"],a:2,why:"Raw new has no automatic clean-up. That's exactly what unique_ptr fixes."},
 {t:"out",code:R`std::unique_ptr<int> p = std::make_unique<int>(5);
*p += 1;
std::cout << *p;`,a:"6",why:"You use it like a normal pointer, and it deletes itself at the end."},
 {t:"mc",q:"In modern C++, what's the best way to hold a list of 1,000 numbers?",opts:["`int* a = new int[1000];`","`std::vector<int> a(1000);`","1,000 separate variables","A std::map"],a:1,why:"A vector manages its own memory and knows its size."},
 {t:"out",code:R`#include <iostream>
#include <memory>

struct P {
    int x;
};

int main() {
    auto p = std::make_unique<P>(P{2});
    p->x *= 21;
    std::cout << p->x;
    return 0;
}`,a:"42",why:"`p->x` is `(*p).x`."}],
problems:[
 {title:"Hottest day",task:"Read 7 daily temperatures (whole numbers) into a `std::array<int, 7>`. Print the day number (1 to 7) of the hottest day (the first if there's a tie), then the average temperature on the next line.",tests:[{in:"12 15 19 14 19 11 10",out:"3\n14.2857"},{in:"0 0 0 0 0 0 0",out:"1\n0"},{in:"-5 -3 -8 -1 -2 -9 -4",out:"4\n-4.57143"}],
  starter:R`#include <iostream>
#include <array>

int main() {
    std::array<int, 7> t{};

    return 0;
}`,hints:["Read with `for (int& x : t) std::cin >> x;`","Use `std::max_element` (include `<algorithm>`) and subtract `t.begin()` to get the index, then add 1."],
  sol:R`#include <iostream>
#include <array>
#include <algorithm>
#include <numeric>

int main() {
    std::array<int, 7> t{};
    for (int& x : t) std::cin >> x;
    auto it = std::max_element(t.begin(), t.end());
    std::cout << (it - t.begin()) + 1 << "\n";
    std::cout << std::accumulate(t.begin(), t.end(), 0) / 7.0 << "\n";
    return 0;
}`,explain:"Everything you learned for vectors (range loops, begin/end, algorithms) works on std::array too. The `{}` in `t{}` starts all seven values at zero."},
 {title:"Order on the heap",task:"Use `std::make_unique` to create an `Order` from input `SIDE qty price`. Then read k amendments, each a whole number to add to qty, and apply them through the pointer with `->`. Print `SIDE qty notional`, where notional = qty × price.",tests:[{in:"BUY 100 2.5\n2\n50 -30",out:"BUY 120 300"},{in:"SELL 10 1\n0",out:"SELL 10 10"}],
  starter:R`#include <iostream>
#include <memory>
#include <string>

struct Order {
    std::string side;
    int qty;
    double price;
};

int main() {
    std::string side;
    int qty = 0;
    double price = 0;
    std::cin >> side >> qty >> price;
    // create the order with std::make_unique

    return 0;
}`,hints:["`auto o = std::make_unique<Order>(Order{side, qty, price});`","Loop k times: read d, then `o->qty += d;`"],
  sol:R`#include <iostream>
#include <memory>
#include <string>

struct Order {
    std::string side;
    int qty;
    double price;
};

int main() {
    std::string side;
    int qty = 0;
    double price = 0;
    std::cin >> side >> qty >> price;
    auto o = std::make_unique<Order>(Order{side, qty, price});
    int k = 0;
    std::cin >> k;
    for (int i = 0; i < k; i++) {
        int d = 0;
        std::cin >> d;
        o->qty += d;
    }
    std::cout << o->side << " " << o->qty << " " << o->qty * o->price << "\n";
    return 0;
}`,explain:"No delete anywhere, and no leak: the unique_ptr frees the Order when main ends. In real systems, objects like orders often live on the heap because their lifetime doesn't match any single function."}]});

DAYS.push({n:29,unit:"Under the hood",title:"Bugs, debugging and good habits",
goal:"Find and fix bugs on purpose instead of by luck.",
sections:[
 {h:"Three kinds of error",p:"Compile errors: the code breaks the language's rules and won't build. The compiler tells you where. Runtime errors: it builds but crashes or misbehaves while running, like dividing by zero or going out of range. Logic errors: it runs fine and gives the wrong answer. Those are the hardest, because nothing complains."},
 {h:"Undefined behaviour",p:"C++ trusts you. Some mistakes aren't caught at all and make the program's behaviour undefined: it might crash, print junk, or work today and fail tomorrow. The usual suspects: reading an uninitialised variable, going out of a vector's range, int overflow, dividing by zero, using a deleted or null pointer. Most of C++'s reputation for being hard comes from this list."},
 {h:"Let the compiler help",p:"Turn warnings on: `-Wall -Wextra` with g++ or clang. Warnings flag likely bugs like `if (x = 5)`, unused variables and signed/unsigned comparisons. Treat every warning as a bug until you've proved it isn't. The Run button here compiles with `-Wall`. Sanitisers (`-fsanitize=address,undefined`) go further and catch out-of-range reads and overflow while the program runs."},
 {h:"Print debugging",p:"The simplest technique, and one professionals use every day: print the values you think you know. `std::cerr` writes to a separate error stream, so it doesn't mix with your real output. The checker here ignores it. Find the first line where reality differs from what you expected, and the bug is just above it.",code:R`int total = 0;
for (int i = 1; i <= 3; i++) {
    total += i;
    std::cerr << "i=" << i << " total=" << total << "\n";
}
std::cout << total << "\n";`,out:"6"},
 {h:"Habits that prevent bugs",p:"Initialise every variable. Use braces on every if and loop. Make things `const` when they don't change. Write small functions and test each one. Test edge cases on purpose: zero, one item, negatives, the biggest input. Change one thing at a time, then run again. And read the first error message, slowly."}],
takeaways:["Compile, runtime and logic errors.","Undefined behaviour: uninitialised, out of range, overflow, ÷0, bad pointers.","Compile with `-Wall -Wextra`; try sanitisers.","Debug with `std::cerr`, and test edge cases on purpose."],
checks:[
 {t:"mc",q:"Your program builds and runs, but prints 41 when the answer is 42. What kind of error is that?",opts:["Compile error","Runtime error","Logic error","Undefined behaviour, definitely"],a:2,why:"Nothing crashed. The logic is wrong somewhere."},
 {t:"mc",q:"Which of these is undefined behaviour?",opts:["Printing a negative number","Reading `v[5]` when v has 5 elements","Dividing a double by 2","Calling a function twice"],a:1,why:"Valid indexes are 0 to 4, so index 5 is out of range."},
 {t:"mc",q:"What does compiling with `-Wall` do?",opts:["Makes the program faster","Turns on warnings about likely bugs","Deletes all variables","Runs the tests"],a:1,why:"Warnings catch things like `=` vs `==` and unused variables."},
 {t:"out",q:"What appears on standard output (`cout`), ignoring `cerr`?",code:R`std::cerr << "debug: starting\n";
std::cout << "result ";
std::cerr << "debug: x=3\n";
std::cout << 3;`,a:"result 3",why:"cerr goes to a separate stream. Only the cout parts count as program output."},
 {t:"mc",q:"Which habit stops 'garbage value' bugs?",opts:["Using long variable names","Always giving variables a starting value","Avoiding comments","Using more global variables"],a:1,why:"An uninitialised variable holds whatever was in memory before."}],
problems:[
 {title:"Bug hunt: average",task:"This program should read n and then n whole numbers, and print their average (decimals allowed). It has three bugs. Find and fix them. Running it with the example input is a good start.\n\nExample: `4` then `1 2 3 5` → `2.75`.",tests:[{in:"4\n1 2 3 5",out:"2.75"},{in:"1\n7",out:"7"},{in:"3\n-1 -2 -4",out:"-2.33333"}],
  starter:R`#include <iostream>
#include <vector>

int main() {
    int n = 0;
    std::cin >> n;
    std::vector<int> v(n);
    for (int i = 0; i <= n; i++) {
        std::cin >> v[i];
    }
    int sum;
    for (int x : v) {
        sum += x;
    }
    std::cout << sum / n << "\n";
    return 0;
}`,hints:["Look at the first loop's condition. How many times does it run? Which indexes does it touch?","Look at `int sum;`. What's its value before the first addition?","`sum / n` with two ints: what happens to the decimals?"],
  sol:R`#include <iostream>
#include <vector>

int main() {
    int n = 0;
    std::cin >> n;
    std::vector<int> v(n);
    for (int i = 0; i < n; i++) {
        std::cin >> v[i];
    }
    int sum = 0;
    for (int x : v) {
        sum += x;
    }
    std::cout << static_cast<double>(sum) / n << "\n";
    return 0;
}`,explain:"`<=` wrote past the end of the vector (undefined behaviour), `sum` started as garbage (undefined behaviour), and int division dropped the decimals (a logic error). The compiler warns about the uninitialised sum with -Wall. Did you notice the warning?"},
 {title:"Bug hunt: maximum",task:"This program should print the largest of n whole numbers, but it fails some tests. Find out which inputs break it, then fix it.",tests:[{in:"3\n4 9 2",out:"9"},{in:"3\n-4 -9 -2",out:"-2"},{in:"1\n-7",out:"-7"}],
  starter:R`#include <iostream>

int main() {
    int n = 0;
    std::cin >> n;
    int best = 0;
    for (int i = 0; i < n; i++) {
        int x = 0;
        std::cin >> x;
        if (x > best) {
            best = x;
        }
    }
    std::cout << best << "\n";
    return 0;
}`,hints:["Try the input `3` then `-4 -9 -2`. What does it print?","best starts at 0, which beats every negative number. Start it from the first value read instead."],
  sol:R`#include <iostream>

int main() {
    int n = 0;
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
    std::cout << best << "\n";
    return 0;
}`,explain:"The bug from Day 12, in the wild. It passed the obvious test and failed the edge case. That's why tests with negatives, single items and zeros matter. (Starting best at `INT_MIN` from `<climits>` also works.)"}]});

DAYS.push({n:30,unit:"Under the hood",title:"Capstone: a mini trading ledger",
goal:"Combine everything into one small, complete program.",
sections:[
 {h:"Building something bigger",p:"Real programs are made of the pieces you now know: structs or classes to model things, containers to hold them, functions to keep each job small, and loops and ifs to drive it all. The skill now is breaking a problem into pieces before typing anything."},
 {h:"The brief",p:"Build a ledger that processes trading commands. It tracks cash, starting at 0, and a position per ticker. `BUY T q p` buys q of ticker T at price p: the position goes up by q and cash goes down by q × p. `SELL T q p` does the opposite. `PRINT` prints `cash X`, then each ticker with a non-zero position as `T q`, alphabetically. All numbers are whole numbers."},
 {h:"Plan first",p:"What's the state? An int for cash (a long long, to be safe) and a map from ticker to position. What are the actions? buy, sell, print, so three functions or three methods on a class. What's the main loop? Read n, then for each command read the first word and decide what else to read. Writing this plan as comments first, then filling in the code beneath each comment, is a technique that works at any size."},
 {h:"A skeleton",p:"Here's a starting shape using a class. Notice that main only reads input and calls methods: all the rules live in the class.",code:R`#include <iostream>
#include <map>
#include <string>

class Ledger {
public:
    void buy(const std::string& t, int q, int p) {
        pos[t] += q;
        cash -= static_cast<long long>(q) * p;
    }
    void print() const {
        std::cout << "cash " << cash << "\n";
    }
private:
    long long cash = 0;
    std::map<std::string, int> pos;
};

int main() {
    Ledger L;
    L.buy("AAPL", 10, 190);
    L.print();
    return 0;
}`,out:"cash -1900"},
 {h:"Where to go after this",p:"You've covered the core of C++. From here: keep the daily review going. Practise problems on sites like Codeforces, LeetCode or HackerRank (choose C++). Read learncpp.com for deeper detail on anything here. Then move on to templates, operator overloading, move semantics, lambdas, iterators and multithreading, which are what quant developer interviews dig into. And build something of your own: an order book, a backtester or a Monte Carlo option pricer."}],
takeaways:["Plan the state, the actions and the main loop before coding.","Keep the rules inside the class; main just reads and calls.","Write the plan as comments, then fill them in.","Next: practise problems, learncpp.com, then templates, lambdas and move semantics."],
checks:[
 {t:"mc",q:"For the ledger, which container fits 'position per ticker, printed alphabetically'?",opts:["std::vector<int>","std::map<std::string, int>","std::unordered_map<std::string, int>","std::set<std::string>"],a:1,why:"Key lookup by ticker, and a map keeps keys sorted for printing."},
 {t:"mc",q:"Why use `long long` for cash?",opts:["It's faster","Quantity × price can exceed an int's limit of about 2.1 billion","int can't be negative","map needs long long"],a:1,why:"A few big trades could overflow an int."},
 {t:"out",code:R`#include <iostream>
#include <map>
#include <string>

int main() {
    std::map<std::string, int> pos;
    long long cash = 0;
    pos["X"] += 10; cash -= 10 * 5;
    pos["X"] -= 4;  cash += 4 * 7;
    std::cout << cash << " " << pos["X"];
    return 0;
}`,a:"-22 6",why:"−50 + 28 = −22, and 10 − 4 = 6 left."}],
problems:[
 {title:"Mini trading ledger",task:"Read n, then n commands:\n\n`BUY T q p`: position of T goes up by q, cash goes down by q × p.\n`SELL T q p`: position of T goes down by q, cash goes up by q × p.\n`PRINT`: print `cash X`, then each ticker with a non-zero position as `T q`, in alphabetical order.\n\nCash starts at 0. All numbers are whole numbers.",tests:[{in:"4\nBUY AAPL 10 190\nBUY MSFT 5 400\nSELL AAPL 4 200\nPRINT",out:"cash -3100\nAAPL 6\nMSFT 5"},{in:"3\nBUY X 3 10\nSELL X 3 12\nPRINT",out:"cash 6"},{in:"5\nSELL Z 2 50\nPRINT\nBUY A 1 1\nBUY Z 2 40\nPRINT",out:"cash 100\nZ -2\ncash 19\nA 1"}],
  starter:R`#include <iostream>
#include <map>
#include <string>

class Ledger {
public:
    void buy(const std::string& t, int q, int p) {

    }
    void sell(const std::string& t, int q, int p) {

    }
    void print() const {

    }
private:
    long long cash = 0;
    std::map<std::string, int> pos;
};

int main() {
    Ledger L;
    int n = 0;
    std::cin >> n;
    for (int i = 0; i < n; i++) {
        std::string cmd;
        std::cin >> cmd;
        // PRINT has nothing after it; BUY and SELL are followed by T q p
    }
    return 0;
}`,hints:["buy: `pos[t] += q; cash -= static_cast<long long>(q) * p;` and sell is the mirror image.","print: print cash, then loop `for (const auto& [t, q] : pos)` and skip q == 0.","In main: `if (cmd == \"PRINT\") L.print(); else { read t, q, p, then call buy or sell }`."],
  sol:R`#include <iostream>
#include <map>
#include <string>

class Ledger {
public:
    void buy(const std::string& t, int q, int p) {
        pos[t] += q;
        cash -= static_cast<long long>(q) * p;
    }
    void sell(const std::string& t, int q, int p) {
        pos[t] -= q;
        cash += static_cast<long long>(q) * p;
    }
    void print() const {
        std::cout << "cash " << cash << "\n";
        for (const auto& [t, q] : pos) {
            if (q != 0) std::cout << t << " " << q << "\n";
        }
    }
private:
    long long cash = 0;
    std::map<std::string, int> pos;
};

int main() {
    Ledger L;
    int n = 0;
    std::cin >> n;
    for (int i = 0; i < n; i++) {
        std::string cmd;
        std::cin >> cmd;
        if (cmd == "PRINT") {
            L.print();
        } else {
            std::string t;
            int q = 0, p = 0;
            std::cin >> t >> q >> p;
            if (cmd == "BUY") L.buy(t, q, p);
            else L.sell(t, q, p);
        }
    }
    return 0;
}`,explain:"That's a complete, well-structured C++ program using classes, maps, references, const, functions, loops and input parsing. Ideas to extend it: reject sells that would go short, track average entry price, or add a `MARK T p` command and print unrealised P&L. Each is a good next day of practice."}]});
