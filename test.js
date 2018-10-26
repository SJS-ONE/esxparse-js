const Esxparse = require("./esxparse")
const fs = require("fs")

let fileName = "example2.txt"

const inputString = fs.readFileSync(fileName).toString()

const esxparse = new Esxparse(inputString)

let data = esxparse.parse()

console.log(Array.isArray(data))

console.log(JSON.stringify(data, null, 4))

data = esxparse.parser.Beautify(data)
console.log(JSON.stringify(data, null, 4))



