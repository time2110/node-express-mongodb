
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 3000
const route = require('./router/index')
const mongo = require('./config/db')

mongo(app)

app
    .use(bodyParser.json())
    .use(bodyParser.urlencoded({extended:true}))

route(app)

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})