# Built-In Objects

## Lambdas

These are built-in methods that perform operations that are tough or impossible to do in RPNLang.  

#### `$string = (value) => string`

Converts value to string.  

#### `$number = (value) => number`

Converts value to number.  

#### `$int = (value) => number`

Converts value to integer.  

#### `$base = (value, base) => number`

Converts value to a number in a base.  

#### `$nan = (value) => boolean`

Checks if a value could be NaN.  

#### `$nanbase = (value, base) => boolean`

Checks if a value could be NaN in a base.  

#### `$sum = (...args) => any`

Sums up the stack.  

#### `$product = (...args) => number`

Multiplies the values of the stack together.  

#### `$charcode = (string, pos) => number`

Gets char code of character in string.  

#### `$fromcode = (number) => string`

Converts char code to string.  

#### `$random = (limit) => number`

Gets a random number [0, n).  

#### `$length = (string) => number`

Gets length of string. 

#### `$type = (value) => string`

Gets type of value.  

#### `$read = (path) => string`

Reads a file.  

#### `$write = (path, string) => boolean`

Writes to a file.  
