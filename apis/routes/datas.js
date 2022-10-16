const express = require('express')
const path = require('path')
const todoData = require('../models/model')
const multer = require('multer')
const upath = require('upath')


const storage = multer.diskStorage({
    destination: function (req, file, res) {
        res(null, './images/')
    },
    filename: function (req, file, res) {
        res(null, new Date().getTime() + file.originalname)
    }
})

const upload = multer({ storage: storage })
const route = express.Router()

route.get("/", async (req, res) => {
    try {
        const data = await todoData.find()
        res.json(data)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

route.get("/:id", getTodoData, async (req, res) => {
    try {
        const datas = await res.toDo
        if (datas == null) {
            res.status(404).send("not found")
        } else {
            res.status(200).json(datas)
        }
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

route.post("/", upload.single('img'), async (req, res) => {
    try {
        const data = new todoData({
            text: req.body.text,
            list: req.body.list,
            tag: req.body.tag,
        })
        if (req.file) {
            data.imageUrl = upath.toUnix(req.file.path)
        }
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

/**
 * Swagger Docs
 * openapi: 3.0.1
info:
  title: defaultTitle
  description: defaultDescription
  version: '0.1'
servers:
  - url: https://todobackendapi.herokuapp.com
paths:
  /datas/634c19a7eb7bc192305734f3:
    delete:
      description: Auto generated using Swagger Inspector
      responses:
        '200':
          description: Auto generated using Swagger Inspector
          content:
            text/html; charset=utf-8:
              schema:
                type: string
              examples: {}
      servers:
        - url: https://todobackendapi.herokuapp.com
    patch:
      description: Auto generated using Swagger Inspector
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                text:
                  type: string
                tag:
                  type: array
                  items:
                    type: string
                list:
                  type: array
                  items:
                    type: string
            examples:
              '0':
                value: |-
                  {
                      "text":"test todo update"
                  }
              '1':
                value: |-
                  {
                      "text":"test todo update 2",
                      "list":["update list"],
                      "tag":["imp"]
                  }
              '2':
                value: |-
                  {
                      "text":"test todo update 2",
                      "list":["update list"],
                      "tag":["imp"]
                  }
      responses:
        '200':
          description: Auto generated using Swagger Inspector
          content:
            application/json; charset=utf-8:
              schema:
                type: string
              examples: {}
      servers:
        - url: https://todobackendapi.herokuapp.com
    servers:
      - url: https://todobackendapi.herokuapp.com
  /datas/:
    get:
      description: Auto generated using Swagger Inspector
      responses:
        '200':
          description: Auto generated using Swagger Inspector
          content:
            application/json; charset=utf-8:
              schema:
                type: string
              examples: {}
      servers:
        - url: https://todobackendapi.herokuapp.com
    post:
      description: Auto generated using Swagger Inspector
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                text:
                  type: string
                tag:
                  type: array
                  items:
                    type: string
                list:
                  type: array
                  items:
                    type: string
            examples:
              '0':
                value: |-
                  {
                      "text":"test todo",
                      "list":["test1","test2"],
                      "tag":["important"]
                  }
      responses:
        '201':
          description: Auto generated using Swagger Inspector
          content:
            application/json; charset=utf-8:
              schema:
                type: string
              examples: {}
      servers:
        - url: https://todobackendapi.herokuapp.com
    servers:
      - url: https://todobackendapi.herokuapp.com
  /datas/634c17d7eb7bc192305734e8:
    get:
      description: Auto generated using Swagger Inspector
      responses:
        '200':
          description: Auto generated using Swagger Inspector
          content:
            application/json; charset=utf-8:
              schema:
                type: string
              examples: {}
      servers:
        - url: https://todobackendapi.herokuapp.com
    servers:
      - url: https://todobackendapi.herokuapp.com
 */