number                  \d+(?:"."\d+)?
alpha                   [A-Za-z_]
hex                     [0-9a-fA-F]
exp                     (?:[eE][+-]?[0-9]+)

%s LMB
%x CMT
%x STR
%%

\s+                     // Ignore whitespace
"//".*                  // Ignore comments
"/*"                    this.begin('CMT');
<CMT>"*/"               this.popState();
<CMT>[\s\S]             // Ignore comments
"-"?"0"[bB][01]+        return 'NUMBER';
"-"?"0"[oO][0-7]+       return 'NUMBER';
"-"?"0"[xX]{hex}+       return 'NUMBER';
"-"?{number}{exp}?      return 'NUMBER';
{alpha}\w*              return 'NAME';
">>>"                   return '>>>';
"..."                   return '...';
"#="                    return '#=';
"=>"                    return this.begin('LMB'), '=>';
"<="                    return '<=';
">="                    return '>=';
"=="                    return '==';
"!="                    return '!=';
">>"                    return '>>';
"<<"                    return '<<';
"//"                    return '//';
"**"                    return '**';
"&&"                    return '&&';
"||"                    return '||';
"$@"                    return '$@';
"!?"                    return '!?';
"!!"                    return '!!';
"!%"                    return '!%';
"'"                     return this.begin('STR'), '\'';
<STR>\\[0bfnrtv'\\]     return "CHAR_ESCAPE";
<STR>\\"{"{hex}{1,6}"}" return "HEX_ESCAPE";
<STR>"'"                return this.popState(), '\'';
<STR>.                  return "ANY";
"="                     return '=';
":"                     return ':';
"#"                     return '#';
"@"                     return '@';
"$"                     return '$';
","                     return ',';
"."                     return '.';
";"                     return ';';
"["                     return '[';
"]"                     return ']';
"{"                     return '{';
"}"                     return '}';
"("                     return '(';
<INITIAL>")"            return ')';
<LMB>")"                return this.popState(), ')';
"+"                     return '+';
"-"                     return '-';
"*"                     return "*";
"/"                     return '/';
">"                     return '>';
"<"                     return '<';
"!"                     return '!';
"?"                     return '?';
"~"                     return '~';
"%"                     return '%';
"^"                     return '^';
"&"                     return '&';
"|"                     return '|';
<<EOF>>                 return 'EOF';
