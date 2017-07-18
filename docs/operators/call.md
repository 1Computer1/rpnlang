# Operators

## Call

Call operators are used to call a lambda, possibly with arguments.  
The most basic type is `@`.  

```
f = () => (5);

// Prints 5
> $f@;
```

There are two modifiers, the keep stack modifier, and the recursion modifier.  

## Keep Stack

When called with the keep stack modifier `#` the entire stack is returned rather than the lastest value.  

```
f = () => (1 2 3);

// Prints [3]
< $f@ [>];

// Prints [3, 2, 1]
< $f#@ [>];
```

## Recursion

The recursion modifier `$` will call the lambda that the call it took place in.  
It is useful for lambdas that are not named or simply for shortening code.  

```
// Multiply n by x until n is over 100
// In which case, return n
f = (n, x) => ({
    $n 100 > : $n,
    !! : $n $x * $x $@
});

// Prints 135
> 5 3 $f@;
```  

Both modifiers can be combined to create `#$@`.  
To choose specific parts of the stack when using `#`, a slice is required.  

See: [slice operators](../operators/slice.md).  
