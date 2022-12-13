const express = require('express')
const router = express.Router()

router.get('/', function (req, res, next) {
  res.render('simple')
})

router.get('/get', function (req, res, next) {
  res.json({
    msg: 'hello'
  })
})

router.post('/post', function (req, res, next) {
  res.status(201).json({
    msg: 'hello'
  })
})

router.post('/buffer', function (req, res, next) {
  const msg = []
  req.on('data', chunk => {
    msg.push(chunk)
  })
  req.on('end', () => {
    const buf = Buffer.concat(msg)
    res.json(buf.toJSON())
  })
})

module.exports = router
