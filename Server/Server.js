const express = require("express")
const bodyParser = require("body-parser")
const api = require("./Routes/api")
const cors = require('cors')

const PORT = process.env.PORT || 3000
const app = express()
app.use(cors())

app.use(bodyParser.json())
app.use('/api', api)

app.get('/', (req, res) => {
    res.send("hello world")
})

app.listen(PORT, () => {
   console.log (`Server is runing in port ${PORT}`) 
})