const express = require('express')
const todoData = require('../model')
const multer = require('multer')
const upload = multer({ dest: 'images/' })
const route = express.Router()

route.get("/", async (req, res) => {
    try {
        const data = await todoData.find()
        res.json(data)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

route.get("/:searchQuery", async (req, res) => {
    try {
        const datas = await todoData.findOne({ _id: req.params.searchQuery })
        if (datas == null) {
            res.status(404).send("not found")
        } else {
            res.status(200).json(datas)
        }
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

route.post("/", upload.single('imgAdded'), async (req, res) => {
    try {
        console.log(req.file)
        const data = new todoData({
            text: req.body.text,
            list: req.body.list,
            tag: req.body.tag
        })
        await data.save().then(data => {
            res.status(201).json(data)
        }).catch(err => {
            res.json({ message: err.message })
        })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

route.patch("/:id", getTodoData, async (req, res) => {
    if (req.body.text != null) {
        res.toDo.text = req.body.text
    }
    if (req.body.list != null) {
        res.toDo.list = req.body.list
    }
    if (req.body.tag != null) {
        res.toDo.tag = req.body.tag
    }
    try {
        const updateToDo = await res.toDo.save()
        res.status(200).json(updateToDo)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

route.delete("/:id", getTodoData, async (req, res) => {
    try {
        const dataDeleted = await todoData.deleteOne(res.toDo)
        if (dataDeleted.deletedCount === 1) {
            res.status(200).send("successfully deleted");
        } else {
            res.status(404).send("Not found")
        }
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

async function getTodoData(req, res, next) {
    let toDo
    try {
        toDo = await todoData.findById(req.params.id)
        if (toDo == null) {
            return res.status(404).json({ message: "Not found" })
        }
    } catch (err) {
        res.json({ message: err.message })
    }
    res.toDo = toDo
    next()
}

module.exports = route