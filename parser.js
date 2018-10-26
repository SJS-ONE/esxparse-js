const {Token} = require("./lexer")

function Parser(lexer){
    this.lexer = lexer

    this.curToken = undefined
    this.nxtToken = undefined

    this.validateType = (check, expected) => {
        if( ! (Token.IsType(check, expected) )){
            throw Error("LEXER INDEX: "+this.lexer.index+"is: >"+ check.type.id+ "< should: >"+expected+ "<")
        }
    }

    this.loadNewToken = () => {
        this.curToken = this.nxtToken
        this.nxtToken = this.lexer.getToken()	
		return this.curToken
    }

    this.getValue = (token) => {
        let val = undefined
        if( Token.IsType(token, Token.Types.TagString) ){
            val = "<"+token.value+">"
        }
        if( Token.IsType(token, Token.Types.String) ){
            val = token.value
        }
        if( Token.IsType(token, Token.Types.Identifier) ){
            val = token.value
        }
        
        if( Token.IsType(this.curToken, Token.Types.OpenBracket) ){
            val = this.dataset()
        }

        return val
    }

    this.iterateDataset = (tokenEnd, cb) => {
        let token = undefined
        while( ! Token.IsType((token = this.loadNewToken()), tokenEnd) ){
            cb(token)
            if( Token.IsType(this.nxtToken, tokenEnd)){
                continue
            }
            this.validateType(this.loadNewToken(), Token.Types.Comma)
        }
    }

    this.getObjectKeyIdentifier = (token) => {
        this.validateType(token, Token.Types.Identifier)
        const key = token.value
        this.validateType(this.loadNewToken(), Token.Types.Assignment)
        return key
    }

    this.getObject = () => {
        const obj = {}
    
        this.iterateDataset(Token.Types.CloseCurlyBracket, (token)=>{
            const key = this.getObjectKeyIdentifier(token)
            obj[key] = this.getValue(this.loadNewToken())
        })

        return obj
    }

    this.getArray = () => {
        const arr = []

        this.iterateDataset(Token.Types.CloseArrayBracket, (token )=>{
            arr.push(this.getValue(token))
        })

        return arr
    }

    this.dataset = () => {
        const data = {}
        this.validateType(this.curToken, Token.Types.OpenBracket)
        
        data["_name"] = this.loadNewToken().value
        data["_type"] = "null"
        this.validateType(this.loadNewToken(), Token.Types.CloseBracket)
        const token = this.loadNewToken()

        if(Token.IsType(token, Token.Types.OpenCurlyBracket)){
            data["_type"] = "object"
            data["object"] = this.getObject()            
        }

        if(Token.IsType(token, Token.Types.OpenArrayBracket)){
            data["_type"] = "array"
            data["array"] = this.getArray()
        }

        return data 
    }
    
    this.start = (beautify = false) => {
        this.loadNewToken()
        this.loadNewToken()
        
        let multiSets = []
        while( !Token.IsType(this.curToken, Token.Types.EOF) ){
            let data = this.dataset()
            multiSets.push(data)
            this.loadNewToken()
        }
        if(beautify){
            multiSets = this.BeautifymultiSets(multiSets)
        }
        return multiSets
    }

    this.Beautify = (data) => {
        const to = {}
        const datas = data.map(this.BeautifySingleDataset)
        for(let ds of datas){
            const top = Object.keys(ds)[0]
            to[top] = ds[top]
        }
        return to
    }

    this.BeautifySingleDataset = (dt) => {

        const nw = {}
        if(dt["_name"] === undefined){
            return dt
        }

        const name = dt["_name"]
        const type = dt["_type"]
        if(type == "null"){
            nw[name] = null
            return nw
        }
        const data = dt[type]
        if(type == "array"){
            nw[name] = []
        }
        if(type == "object"){
            nw[name] = {}
        }
        for(let key in data){
            nw[name][key] = this.BeautifySingleDataset(data[key])
        }
        return nw
    }


}

module.exports.Parser = Parser