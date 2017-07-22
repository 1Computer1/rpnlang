# Operators

## Arithmetic

The arithmethic operators are:  

- `+` - Addition
- `-` - Subtraction
- `*` - Multiplication
- `/` - Division
- `%` - Modulus
- `**` - Exponentation
- `//` - Integer division

## Bitwise

The bitwise operators are:  

- `~` - NOT
- `&` - AND
- `|` - OR
- `^` - XOR
- `<<` - Left shift
- `>>` - Sign-propagating right shift
- `>>>` - Zero-fill right shift

Note that the NOT operator is unary rather than binary.  

## Comparison

The comparison operators are:  

- `>` - Greater than
- `<` - Less than
- `>=` - Greather than or equal to
- `<=` - Less than or equal to 
- `==` - Equal to
- `!=` - Not equal to

## Logical

The logical operators are:  

- `!` - Not
- `?` - Not not
- `&&` - And
- `||` - Or

There is short-circuting for `&&` and `||`.  
Note that `!` and `?` are both unary operators.  

## Lambda

All of the above operators can be turned into a lambda by wrapping them with `()`.  
The following two are equivalent.  

```
> 1 1 +;
> 1 1 (+)@;
```
