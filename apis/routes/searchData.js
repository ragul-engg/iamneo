const express = require('express')
const todoModel = require('../models/model')

const searchRoute = express.Router()

searchRoute.get('/tag/:text', async (req, res) => {
    try {
        const datas = await todoModel.find({ tag: { $regex: req.params.text } })
        if (datas == null) {
            res.status(404).send("not found")
        } else {
            res.send(datas)
        }
    } catch (err) {
        res.status(404).json({ message: err.message })
    }
})

searchRoute.get("/text/:text", async (req, res) => {
    try {
        const datas = await todoModel.find({ text: { $regex: req.params.text } })
        if (datas == null) {
            res.status(404).send("not found")
        } else {
            res.send(datas)
        }
    } catch (err) {
        res.status(404).json({ message: err.message })
    }
})

searchRoute.get("/list/:text", async (req, res) => {
    try {
        const datas = await todoModel.find({ list: { $regex: req.params.text } })
        if (datas == null) {
            res.status(404).send("not found")
        } else {
            res.send(datas)
        }
    } catch (err) {
        res.status(404).json({ message: err.message })
    }
})
module.exports = searchRoute