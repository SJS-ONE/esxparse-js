const fs = require("fs")

class Token{
    constructor(type, value = undefined){
        this.type = type
        this.value = value 
    }
    static get Types(){
        return {
            Unknown:            {id: 1, char: undefined},
            Assignment:         {id: 2, char: '='},
            Comma:              {id: 3, char: ','},
            OpenCurlyBracket:   {id: 4, char: '{'},
            CloseCurlyBracket:  {id: 5, char: '}'},
            OpenBracket:        {id: 6, char: '('},
            CloseBracket:       {id: 7, char: ')'},
            TagString:          {id: 8, char: undefined},
            OpenArrayBracket:   {id: 9, char: '['},
            CloseArrayBracket:  {id: 10, char: ']'},
            String:             {id: 11, char: undefined},
            Identifier:         {id: 12, char: undefined},

            EOF:                {id: 99, char: undefined},
        }
    }

    isType(type){
        return Token.IsType(this, type)
    }

    static IsType(token, type){
        return token.type.id === type.id
    }
}

class Lexer{
    constructor(text){
        this.text = text
        this.index = 0
    }

    getToken(){
        if(this.index >= this.text.length){
            return new Token(Token.Types.EOF)
        }

        let char = undefined
        while( this.index < this.text.length && (char = this.text[this.index]).trim() === '' ){
            this.index += 1
        }
        this.index += 1

        for(let typeName in Token.Types){
            if(char == Token.Types[typeName].char){
                return new Token(Token.Types[typeName])
            }
        }

        const multiChar = {
            '"':    { end: '"', type: Token.Types.String},
            "'":   { end: "'", type: Token.Types.String},
            '<' :   { end: '>', type: Token.Types.TagString},
        }[char]
        
        if(multiChar != undefined){
            const val = this.extractString(char=>char != multiChar.end)
            return new Token(multiChar.type, val)
        }
        
        if (Lexer.IsAlpha(char) || Lexer.IsNumeric(char) || char == '-' ){
			const ident = char + this.extractString(char=>Lexer.IsAlpha(char) || char == '.' || Lexer.IsNumeric(char))
			this.index -= 1
            return new Token(Token.Types.Identifier, ident)
        }
        
        return new Token(Token.Types.Unknown)
    }
    
    static IsAlpha(char){
        const charCode = char.charCodeAt(0);
        return (((charCode > 64) && (charCode <  91)) || ((charCode > 96) && (charCode < 123)))
    }

    static IsNumeric(char){
        return /\d/.test(char);
    }

    extractString(checkFunction){
        let val = ''
        let char = this.text[this.index]
        this.index += 1 
        while (checkFunction(char)){
            val += char 
            char = this.text[this.index]
            this.index += 1
        }
        return val
    }
}

module.exports.Lexer = Lexer
module.exports.Token = Token