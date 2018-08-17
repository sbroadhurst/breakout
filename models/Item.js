const mongoose = require('mongoose')
const Schema = mongoose.Schema

//create schema
const ItemSchema = new Schema({
  name: { type: String },
  score: { type: Number }
})

module.exports = Item = mongoose.model('item', ItemSchema)
