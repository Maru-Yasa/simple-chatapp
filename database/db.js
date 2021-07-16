const mongoose = require('mongoose')
require('dotenv').config()

mongoose.connect(process.env.URI,{
    useNewUrlParser: true,
    useUnifiedTopology: true
  })

module.exports = mongoose.connection