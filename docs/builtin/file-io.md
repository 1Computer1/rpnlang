# Built-In Objects

## File IO

A standard library for basic file IO.  
The library `file` can be imported like so:  

```
file << 'stdlib[file]';
```

In safe mode, this library is useless.  

## Members

- `exists = (path) => (boolean)`  
Checks if a file exists.  
Safe mode: always `false`.  

- `mkdir = (path) => (boolean)`  
Creates a new directory if it does not exist.  
Returns `true` if the directory is there, else `false`.  
Safe mode: always `false`.  

- `read = (path) => (string)`  
Reads a file.  
Returns `undefined` if it could not read.  
Safe mode: always an empty string.  

- `write = (path, data) => (boolean)`  
Writes to a file.  
Returns `true` if the file is there, else `false`.  
Safe mode: always `false`.  
