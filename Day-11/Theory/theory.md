Day-11(17/09/2026)

Async/Await:
they are build on top of promises, working mechanism is exactly same. they are just to improve the readability of asynchronous code as synchronous.

Async:
This keyword can be used in front of every kind of function, the func. will run like synchronous until it encounters await keyword then return back to where called.
Errors thrown inside async function automatically becomes a rejected promise.

It does 2 things:
1: everthing it returns will be a promise.
2: enables the use of await keyword in the func. 

Await:
await pauses the execution of the current async function until the promise settles into fullfilled or Throws for rejection 

Await can only be used inside async func. except if declare it globally ,not inside any function at all
ex:
const data = await fetch("/api/data");


await unwraps the Promise's fulfilled value directly
await on a REJECTED Promise throws. so we can use try catch with it normally unlike promises
await on a NON-Promise value just passes it through immediately

Unified Error Handling - try, catch, finally

As await on rejected promise throws. So we can use try/catch/finally similar to synchronous error handling 

ONE try/catch block can wrap multiple await calls

the error thrown inside catch as when plan A fails it is catched in .catch() then we have plan B inside that .catch() but if that also fails then we cant catch that error , so for that we can use nested try catch or use one more catch on the function call to catch plan B fail ie when everything fails thats why we have on the function call


Sequential vs. Concurrent (Parallel) Execution Pitfall:

If the operations are dependent on each other then we will do as same as sequential await order
ex:
async function checkout(cartId) {
  const cart = await getCart(cartId);         
  const total = await calculateTotal(cart);     
  const payment = await processPayment(total);   
  return payment;
}

But if the operations are independent then we might prefer to call them parallel to reduce the time which we can do by 2 way 
1:
async function loadDashboard() {
  const userPromise = fetchUser();       
  const postsPromise = fetchPosts();     
  const commentsPromise = fetchComments(); 

  const user = await userPromise;         
  const posts = await postsPromise;
  const comments = await commentsPromise;

  return { user, posts, comments };
}

2: or more cleaner we can use promise combinators

async function loadDashboard() {
  const [user, posts, comments] = await Promise.allSettled([
    fetchUser(),
    fetchPosts(),
    fetchComments()
  ]);
  return { user, posts, comments };
}

The Loop Trap  forEach vs. for of

forEach: It is just a regular method living on Array.prototype that internally use a loop to call your function repeatedly. So it does not have break continue feature . It does not respect await.

whereas for of , for, while are real loop they work fine with await.
