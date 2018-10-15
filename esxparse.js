const {Parser} = require("./parser")
const {Lexer} = require("./lexer")

const DEFAULT_CONFIG = {
    beautify: false
}

class Esxparse{
    constructor(text){
        this.lexer = new Lexer(text)
        this.parser = new Parser(this.lexer)
    }

    parse(obj){
        const cfg = Object.assign({}, DEFAULT_CONFIG, obj)
        return this.parser.start(cfg.beautify)
    }

}

module.exports = Esxparse