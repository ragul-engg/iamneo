const mongoose = require('mongoose')

const dataModel = new mongoose.Schema({
    text: { type: String },
    list: { type: [String] },
    tag: { type: [String] },
    imageUrl: { type: String }
})
module.exports = mongoose.model('dataModel', dataModel)