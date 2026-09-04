Techugo Fullstack Training
Day 02 (04/09/2026)


1: Comparison Operators — Strict vs. Loose

    
    JavaScript gives us two ways to check equality:

    Loose equality (==) : compares after converting types to match (coercion).
    Strict equality (===) : compares type AND value, no conversion at all.

    -> null == undefined → true (this is the ONLY thing null or undefined loosely equal. not 0, not "", nothing else).
    -> Objects get converted to primitives first.  arrays via their .toString() (which joins elements with commas), plain objects give       "[object Object]".
    -> Two objects are never loosely OR strictly equal by value because objects compare by reference, not by contents
    eg: const obj = { a: 1 };
        console.log(obj === obj);  // true — same reference
    -> NaN is never equal anything, including itself. neither == nor === can catch it.

    Relational comparisons (<, >, <=, >=)
    These don't have a "strict" version. they always coerce.
    -> null >= 0 is true, but null == 0 is false. Relational operators and loose equality use different internal conversion algorithms for null.  equality treats null as a special case that only matches undefined, but relational comparisons convert null straight to 0.

2: Logical Operators (&&, ||, !)

    && (AND) returns the first falsy value, or the last value if all are truthy
    || (OR) returns the first truthy value, or the last value if all are falsy
    ! (NOT) flips truthy/falsy into an actual boolean
    
3: Control Flow if, else if, else

    if (condition) {
    // runs if condition is truthy
    } else if (anotherCondition) {
    // runs if the first was falsy AND this one is truthy
    } else {
    // runs if NONE of the above were truthy
    }

    JS evaluates conditions top to bottom and stops at the first truthy one everything after that is skipped entirely, even if a later condition would also be true.

    Ternary operator a compact if/else for expressions
    eg:
    const age = 20;
    const status = age >= 18 ? "adult" : "minor";

4: Truthy and Falsy Values

    there are ONLY 8 Falsy Values: false, 0, -0, 0n // BigInt zero, "" // empty string (also '' and ``), null, undefined, NaN
    Rest are all Truthy
