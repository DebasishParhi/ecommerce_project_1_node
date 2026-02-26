const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27017/e_comm')
  .then(() => {
    console.log("Database connected successfully")
  })
  .catch((err) => {
    console.log("Database connection error:", err)
  })
