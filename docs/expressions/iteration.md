# Expressions

## Iteration

The syntax for iteration is `[<lambda> <mode> <method> [lambda]]`.  

The first lambda is the iterator, the second lambda (optional) is the conditional.  
There are two types of iteration modes: stack `#` and in-place `@`.  
The three methods are: map `&`, filter `|`, and consume `<`.  

## Stack Mode

Stack mode is done with the `#` token.  
It iterates through the stack.  
Lambdas #1 and #2 needs two params, element and index.  

The process is:  

1. Consume a value in the stack.
2. Run the value and index through the iterator.
3. Run the returned value of the iterator and index through the conditional.
4. If the conditional returns something truthy, stop the iteration.
5. If the mode is `&`, keep the return value.  
If the mode is `|`, and the return value is truthy, keep the element.  
If the mode is `<`, do not keep anything.
6. Repeat from beginning.

```
// Prints [6, 4, 2]
< 1 2 3 [(e, i) => ($e 2 *) #&] [>];

// Prints [3, 1]
< 1 2 3 [(e, i) => ($e 2 % 1 ==) #|] [>];
```

## In-Place Mode

In-place mode is done with the `@` token.  
It iterates until the conditional lambda returns a truthy value.  
If the conditional is not provided, it runs only once.  
Lambda #1 needs one param, the index, and lambda #2 needs two params, value and index.  

The process is:  

1. Run the index through the iterator.
2. Run the returned value of the iterator and index through the conditional.
4. If the conditional returns something truthy, stop the iteration.
5. If the mode is `&`, keep the return value.  
If the mode is `|`, and the return value is truthy, keep the return value.  
If the mode is `<`, do not keep anything.
6. Repeat from beginning.

```
// Prints [0, 2, 4, 6]
< [(i) => ($i 2 *) @& (e, i) => ($i 3 ==)] [>];
```
