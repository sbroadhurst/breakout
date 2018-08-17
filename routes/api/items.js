const express = require('express')
const router = express.Router()

//item model
const Item = require('../../models/Item')

// @route GET api/items
// @desc get all items
// @access Public
router.get('/', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')

  Item.find()
    .sort({ score: -1 })
    .then(items => res.json(items))
})

// @route POST   api/items
// @desc create an item
// @access Public
router.post('/', (req, res) => {
  const newItem = new Item({
    name: req.body.name,
    score: req.body.score
  })
  newItem.save().then(item => res.json(item))
})

// @route DELETE api/items/:id
// @desc delete an item
// @access Public
router.delete('/:id', (req, res) => {
  Item.findById(req.params.id)
    .then(item => item.remove().then(() => res.json({ success: true })))
    .catch(err => res.status(404).json({ success: false }))
})

module.exports = router
