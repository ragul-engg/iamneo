const express = require('express')
const datas = require("./apis/routes/datas")
const searchData = require("./apis/routes/searchData")
const mongoose = require('mongoose')
const app = express()

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true })
let port = process.env.PORT || 3000

const dbConnect = mongoose.connection
dbConnect.on("error", (error) => {
    console.error(error)
})
dbConnect.once("open", () => {
    console.log("db connected")
})
app.use(express.json())
app.get("/", (req, res) => {
    res.send("Homepage")
})
app.use('/datas/images', express.static('images'))
app.use('/datas', datas)
app.use('/searchData', searchData)

app.listen(port, () => {
    console.log("Server started and listening ")
})