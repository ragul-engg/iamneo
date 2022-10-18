const express = require('express')
const path = require('path')
const todoData = require('../models/model')
const multer = require('multer')
const upath = require('upath')

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true)
  } else {
    cb(null, false)
  }
}

const storage = multer.diskStorage({
  destination: function (req, file, res) {
    res(null, './images/')
  },
  filename: function (req, file, res) {
    res(null, new Date().getTime() + file.originalname)
  }
})
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: fileFilter
})
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
 * info:
 *   title: TodoBackendAPI
 *   description: An Api which can respond to the to-do app requests
 *   version: '0.1'
 * servers:
 *   - url: https://todobackendapi.herokuapp.com
 * paths:
 *   /datas/:
 *     get:
 *       description: To get all the notes stored in the api
 *       responses:
 *         '200':
 *            description: all the data is being received by the reques
 *            content:
 *              application/json; charset=utf-8:
 *                schema:
 *                  type: string
 *                examples: 
 *                  {
 *                    'text': 'new todo',
 *                    'list': ['todo_task 1','todo_task 2'],
 *                    'tag': ['important'],
 *                    'imageUrl': '/images/2432432.jpg'
 *                  }
 *      post:
 *        description: store a single to do task
 *        requestBody:
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  text:
 *                    type: string
 *                  tag:
 *                    type: array
 *                    items:
 *                       type: string
 *                  list:
 *                    type: array
 *                    items: string
 *                  imageUrl:
 *                    type: string
 *             examples:
 *               '0':
 *                  values: 
 *                    {
 *                      "text":"test todo",
 *                      "list":["test1","test2"],
 *                      "tag":["important"]  
 *                    }
 *        responses:
 *          '201':
 *            description: created a successful todo
 *            content:
 *              application/json; charset=utf-8:
 *                schema:
 *                  type: string
 *                  examples:
 *                    {
 *                      "text":"test todo",
 *                      "list":["test1","test2"],
 *                      "tag":["important"]  
 *                    }
 *          serverse:
 *            - url: https://todobackendapi.herokuapp.com
 *        serverse:
 *          - url:  https://todobackendapi.herokuapp.com
 *  /datas/:id:
 *    get:
 *      description: to get a todo with the given id
 *      responses:
 *        '200':
 *          description: succesfully got the data from the database
 *          content:
 *            application/json; charset=utf-8:
 *              schema:
 *                type: string
 *              examples: 
 *                {
 *                  "text":"test todo",
 *                  "list":["test1","test2"],
 *                  "tag":["important"]  
 *                }
 *      servers:
 *        - url: https://todobackendapi.herokuapp.com
 *    servers:
 *      - url: https://todobackendapi.herokuapp.com
 *    delete:
 *      description: the given id data is deleted from the database
 *      response:
 *        '200':
 *          description: succesfull deletion
 *          content:
 *            text/html; charset=utf-8:
 *            schema:
 *              type: string
 *            examples:
 *              successfully deleted
 *    patch:
 *      description: to update a value or entierly change the data
 *      requestBody:
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                text:
 *                  type: string
 *                tag:
 *                  type: array
 *                  items:
 *                    type: string
 *                list:
 *                  type: array
 *                  items:
 *                    type: string
 *              examples:
 *                '0':
 *                  value:
 *                    {
 *                      "text":"updated test todo",
 *                      "list":["test1","test2"],
 *                      "tag":["important"]  
 *                    }
 *        responses:  
 *          '200':
 *            description: updated todo
 *            content:
 *              application/json; charset=utf-8:
 *        servers:
 *          - url: https://todobackendapi.herokuapp.com
 *      serverse:
 *        - url: https://todobackendapi.herokuapp.com
 *      
 *              
 */