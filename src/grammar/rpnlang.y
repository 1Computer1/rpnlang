%start PROGRAM
%%

PROGRAM
    : STATEMENT_LIST ";" EOF
        { return $1; }
    | EOF
        { return []; }
    ;

STATEMENT_LIST
    : STATEMENT -> [$1]
    | STATEMENT_LIST ";" STATEMENT
        {{
            $$ = $1;
            $$.push($3);
        }}
    ;

STATEMENT
    : ASSIGN_STATEMENT
    | PRINT_STATEMENT
    ;

ASSIGN_STATEMENT
    : NAME ASSIGN_TOKEN EXPRESSION
        {{
            $$ = {
                type: 'assign',
                token: $2,
                name: $1,
                expression: $3,
                pos: this._$
            };
        }}
    ;

ASSIGN_TOKEN
    : "="
    | "#="
    ;

PRINT_STATEMENT
    : PRINT_TOKEN EXPRESSION
        {{
            $$ = {
                type: 'print',
                token: $1,
                expression: $2,
                pos: this._$
            };
        }}
    ;

PRINT_TOKEN
    : ">"
    | "<"
    | "!"
    ;

EXPRESSION
    : OPERATION -> [$1]
    | EXPRESSION OPERATION
        {{
            $$ = $1;
            $$.push($2);
        }}
    ;

OPERATION
    : LITERAL
    | OPERATOR
    | GET
    | INDEX
    | LAMBDA
    | CALL
    | BRANCH
    | CASES
    | STACK
    | ITERATE
    ;

LITERAL
    : NUMBER -> Number($1)
    | "!!" -> true
    | "!?" -> false
    | "!%" -> NaN
    | "[" "]" -> undefined
    | STRING
    ;

STRING
    : "'" CHARACTERS "'" -> $2
    | "'" "'" -> ''
    ;

CHARACTERS
    : CHARACTER
    | CHARACTERS CHARACTER -> $1 + $2
    ;

CHARACTER
    : ANY
    | ESCAPE
    ;

ESCAPE
    : CHAR_ESCAPE
        {{
            $$ = {
                '0': '\0',
                'b': '\b',
                'f': '\f',
                'n': '\n',
                'r': '\r',
                't': '\t',
                'v': '\v',
                '\'': '\'',
                '\\': '\\',
            }[yytext.slice(1)];
        }}
    | HEX_ESCAPE
        {{
            const num = parseInt(yytext.slice(2, -1), 16);
            $$ = String.fromCharCode(num);
        }}
    ;

OPERATOR
    : OPERATOR_TOKEN
        {{
            $$ = {
                type: 'operator',
                token: $1,
                pos: this._$
            };
        }}
    ;

OPERATOR_TOKEN
    : "+"
    | "-"
    | "*"
    | "/"
    | "%"
    | "&"
    | "|"
    | "^"
    | ">"
    | "<"
    | "!"
    | "?"
    | "~"
    | ">="
    | "<="
    | "=="
    | "!="
    | ">>"
    | "<<"
    | "//"
    | "**"
    | "&&"
    | "||"
    | ">>>"
;

GET
    : "$" NAME
        {{
            $$ = {
                type: 'get',
                token: $1,
                name: $2,
                pos: this._$
            };
        }}
    | "$" "[" NAME "," SLICE "]"
        {{
            $$ = {
                type: 'get',
                token: '$...',
                name: $3,
                slice: $5,
                pos: this._$
            };
        }}
    ;

INDEX
    : "[" "." "," SLICE "]"
        {{
            $$ = {
                type: 'index',
                slice: $4,
                pos: this._$
            };
        }}
    ;

LAMBDA
    : "(" NAME_LIST ")" "=>" "(" EXPRESSION ")"
        {{
            $$ = {
                type: 'lambda',
                params: $2,
                expression: $6,
                pos: this._$
            };
        }}
    | "(" "@" EXPRESSION ")"
        {{
            $$ = {
                type: 'lambda',
                params: [],
                expression: $3,
                call: {
                    token: $2,
                    pos: this._$
                },
                pos: this._$
            };
        }}
    | "(" "#" "@" EXPRESSION ")"
        {{
            $$ = {
                type: 'lambda',
                params: [],
                expression: $4,
                call: {
                    token: $2 + $3,
                    pos: this._$
                },
                pos: this._$
            };
        }}
    ;

NAME_LIST
    : NAME -> [$1]
    | NAME_LIST "," NAME
        {{
            $$ = $1;
            $$.push($3);
        }}
    | "..." NAME
        {{
            $$ = [$2];
            $$.rest = true;
        }}
    | -> []
    ;

CALL
    : CALL_TOKEN
        {{
            $$ = {
                type: 'call',
                token: $1,
                pos: this._$
            };
        }}
    | "#" CALL_TOKEN
        {{
            $$ = {
                type: 'call',
                token: $1 + $2,
                pos: this._$
            };
        }}
    | "#" "[" CALL_TOKEN "," SLICE "]"
        {{
            $$ = {
                type: 'call',
                token: $1 + $3,
                slice: $5,
                pos: this._$
            };
        }}
    ;

CALL_TOKEN
    : "@"
    | "$@"
    ;

BRANCH
    : "{" EXPRESSION "," EXPRESSION "}"
        {{
            $$ = {
                type: 'branch',
                yes: $2,
                no: $4,
                pos: this._$
            };
        }}
    | "{" EXPRESSION "}"
        {{
            $$ = {
                type: 'branch',
                yes: $2,
                pos: this._$
            };
        }}
    ;

CASES
    : "{" CASE_LIST "}"
        {{
            $$ = {
                type: 'cases',
                cases: $2
            };
        }}
    ;

CASE_LIST
    : CASE_ENTRY -> [$1]
    | CASE_LIST "," CASE_ENTRY
        {{
            $$ = $1;
            $$.push($3);
        }}
    ;

CASE_ENTRY
    : EXPRESSION ":" EXPRESSION
        {{
            $$ = {
                type: 'branch',
                condition: $1,
                yes: $3
            };
        }}
    ;

STACK
    : "[" STACK_OPERATOR "]"
        {{
            $$ = {
                type: 'stack',
                token: $2,
                pos: this._$
            };
        }}
    | "[" STACK_OPERATOR "," SLICE "]"
        {{
            $$ = {
                type: 'stack',
                token: $2,
                slice: $4,
                pos: this._$
            };
        }}
    ;

STACK_OPERATOR
    : ">"
    | "<"
    | "+"
    | "-"
    | "&"
    | "@"
    | "!"
    | "?"
    | "%"
    ;

ITERATE
    : "[" LAMBDA ITERATE_MODE ITERATE_TOKEN "]"
        {{
            $$ = {
                type: 'iterate',
                lambda: $2,
                mode: $3,
                token: $4,
                pos: this._$
            };
        }}
    | "[" LAMBDA ITERATE_MODE ITERATE_TOKEN LAMBDA "]"
        {{
            $$ = {
                type: 'iterate',
                lambda: $2,
                condition: $5,
                mode: $3,
                token: $4,
                pos: this._$
            };
        }}
    ;

ITERATE_MODE
    : "#"
    | "@"
    ;

ITERATE_TOKEN
    : "&"
    | "|"
    | "<"
    ;

SLICE
    : EXPRESSION
        {{
            $$ = {
                type: 'slice',
                index: $1,
                pos: this._$
            };
        }}
    | EXPRESSION ","
        {{
            $$ = {
                type: 'slice',
                from: $1,
                pos: this._$
            };
        }}
    | EXPRESSION "," EXPRESSION
        {{
            $$ = {
                type: 'slice',
                from: $1,
                to: $3,
                pos: this._$
            };
        }}
    ;

%%
