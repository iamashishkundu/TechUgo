1: Why does obj.key evaluate to undefined if key is a variable holding "name"?

sol: if a key is a variable holding name then accesing the object property through dot operator will not evaluate the variable first like bracket [] operator instead it will directly go for the variable as a key. this dynamic evaluation is the major drawback of dot operator.

2: What is the difference between obj.prop = undefined and delete obj.prop?

sol: doing obj.prop = undefined by doing this we will loose the value but still we have the key and by using this delete obj.prop we will losse both the key and value.

3: Predict the exact console output of this code:

```js
const stats = { wins: 4, losses: 2 };
const statToUpdate = "wins";

stats[statToUpdate] += 1;
stats.statToUpdate = 0;

console.log(stats.wins);
console.log(stats.statToUpdate);
```

sol:
5
0



4: Predict the output of this code:

```js
const inventory = { apples: 10, oranges: 5 };
const keys = Object.keys(inventory);

for (const k of keys) {
  console.log(`${k}: ${inventory[k]}`);
}
```

sol:
apples: 10
oranges: 5