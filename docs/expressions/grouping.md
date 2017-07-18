# Expressions

## Grouping

Grouping is syntax sugar for an immediately-called lambda.  
The only limitation is the inability for slicing.  

A grouping can either be `(@ ...)` or `(#@ ...)`, depending if the stack is to be kept.  

```
// Errors, not enough values for an addition
> 1 2 3 $product@ 2 3 $product@ +;

// Prints 12
> (@ 1 2 3 $product@) (@ 2 3 $product@) +;
```

## Equivalent

These expressions are equal:  

```
() => (1 2 3)@
(@ 1 2 3)
```

```
() => (1 2 3)#@
(#@ 1 2 3)
```
