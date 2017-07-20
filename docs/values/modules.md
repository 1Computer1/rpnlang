# Values

## Modules

Modules are used to separate code into separate files.  

## Import

Importing is done using the `<<` token.  
A single string must come after it, it is the path to the file based on the CWD.  

You must the imported module a name, just like a variable.  
Imported modules can have the same name as a variable since they are accessed differently.  

```
module << 'file.rpn';
```

Getting a member of a module is done with the `::` token.  
The name of the module comes first, then the name of the member.  
To get a slice of a stack member, the syntax `module[::member, ...]` is used.  

```
module << 'file.rpn';
module = 5;

// Two different things
> module::member;
> $module;
```

## Export

Values can be exported with `>>` or `#>`.  
The former exports the latest value while the latter exports the entire stack.  

```
// colors.rpn

paint >> (item, color) => ($color $item +);
colors #> 'red' 'blue' 'green';

// main.rpn

colors << 'colors.rpn';
> 'car' colors[::colors, -1] colors::paint@;
```

To access a module's own export, simply not prefix `::` with a module name:  

```
numbers #> 1 2 3;

> ::numbers;
> [::number, 0];
```
