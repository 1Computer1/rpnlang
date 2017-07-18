# Data Types

## Lambda

Lambdas are anonymous functions (which you can assign to a variable to make them not-so-anonymous).  
There are two types of lambdas: parameterized lambdas and rest lambdas.  
Lambdas are called with a call operator, which `@` is the most basic.  

## Parameterized

Parameterized lambdas takes a set amount of arguments (which can be 0).  
They will then consume that many values when called.  

```
// Adds three numbers
f = (x, y, z) => ($x $y $z + +);

// Prints 6
> 1 2 3 $f@;
```

## Rest

Rest lambdas take all values in the stack and puts it into one parameter.  
They are made using one paramter with a `...` prefix.  

```
// Takes all values, sum them up, multiply by 2
f = (...args) => ($args $sum@ 2 *);

// Prints 20
> 1 2 3 4 $f@;
```

## Closures

All lambdas automatically capture the arguments of lambdas it may be in.  
Lambdas may also be passed around.  

```
// Takes a number, returns a new lambda with the number
f = (x) => ((y) => ($x $y +));
add2 = 2 $f@;

// Prints 7
> 5 $add2@;
```

```
// Takes a lambda and calls it on 5
f = (lambda) => (5 $lambda@);

// Prints 6
> (n) => ($n 1 +) $f@;
```

## Calling

As shown above, lambdas are called with a call operator.  
Of course, there are more ways to call than just `@`.  

See: [call operators](../operators/call.md).  
