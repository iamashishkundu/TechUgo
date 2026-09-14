# JavaScript Destructuring & Spread/Rest Q&A

## T1: Predict the output of this code

```js
const dimensions = [1920, 1080];
const [width, height, depth = 0] = dimensions;

console.log(width);
console.log(depth);
```

**Answer:**
```
1920
0
```

---

## T2: What will print to the console?

```js
const defaultSettings = { theme: "light", autoSave: true };
const userSettings = { autoSave: false };

const finalSettings = {
  theme: "dark",
  ...defaultSettings,
  ...userSettings
};

console.log(finalSettings.theme);
console.log(finalSettings.autoSave);
```

**Answer:**
```
light
false
```

---

## T3: What is the difference between these two uses of `...`?

```js
const multiply = (multiplier, ...numbers) => {
  return numbers.map((n) => n * multiplier);
};

const myNumbers = [2, 4, 6];
console.log(multiply(2, ...myNumbers));
```

**Answer:**
The first one (`...numbers` in the function parameters) is the **rest operator**, and the second one (`...myNumbers` in the function call) is the **spread operator**.

---

## T4: Shallow Copy Mutation Trap — Predict the output

```js
const original = {
  title: "Dev Guide",
  meta: { views: 100 }
};

const clone = { ...original };
clone.title = "Master Guide";
clone.meta.views = 500;

console.log(original.title);
console.log(original.meta.views);
```

**Answer:**
```
Dev Guide
500
```