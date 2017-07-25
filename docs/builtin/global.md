# Built-In Objects

## Global

These variables are accessible in the global scope.  

- `NAN`  
Value of `NaN`, equal to `!%`.  

- `TRUE`  
Value of `true`, equal to `!!`.  

- `FALSE`  
Value of `false`, equal to `!?`.  

- `UNDEFINED`  
Value of `undefined`, almost equal to `[]`.  

- `string = (value) => (string)`  
Converts a value to string.  

- `number = (value) => (number)`  
Converts a value to number.  
If the value cannot be a number, `NaN` is returned.  

- `int = (value) => (number)`  
Converts value to integer.  
If the value cannot be a number, `NaN` is returned.  

- `base = (value, base) => (number)`  
Converts value to a number in a base, up to 36.  
If the value cannot be a number, `NaN` is returned.  

- `nan = (value) => (boolean)`  
Checks if a value could be NaN.  

- `nanbase = (value, base) => (boolean)`  
Checks if a value could be NaN in a base, up to 36.  

- `random = (limit) => (number)`  
Gets a random number in range [0, n).  

- `length = (string) => (number)`  
Gets the length of a string.  

- `type = (value) => (string)`  
Gets the type of the value.  
Returns one of `boolean`, `number`, `string`, `lambda`, `native`, or `undefined`.  
