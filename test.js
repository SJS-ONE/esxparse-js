const Esxparse = require("./esxparse")
const fs = require("fs")

let fileName = "example.txt"

const inputString = fs.readFileSync(fileName).toString()

const esxparse = new Esxparse(inputString)

let data = esxparse.parse()
console.log(JSON.stringify(data, null, 4))
data = esxparse.parser.Beautify(data)
console.log(JSON.stringify(data, null, 4))





