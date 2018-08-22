const express = require('express')
const bodyParser = require('body-parser')
const multer = require('multer')

const { routes, routeFns } = require('./firebase/routes')
const app = express()
const upload = multer()

const PORT = process.env.PORT || 4000

app.use(express.static('public'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', (req, res) => {
  res.send('hello world')
})

const generateDynamicRoute = (route, req) => {
  const parts = route.split('/')
  const modifiedParts = []

  parts.forEach(part => {
    const colonSplit = part.split(':')

    if (!colonSplit[1]) {
      modifiedParts.push(part)
      return
    }

    modifiedParts.push(req.params[colonSplit[1]])
  })

  return modifiedParts.join('/')
}


routes.forEach(route => {
  const types = Object.keys(routeFns)
  const parts = route.split('/')

  types.forEach(type => {
    app[type](`/firebase/${route}`, upload.array(), async (req, res) => {
      const modifiedRoute = generateDynamicRoute(route, req)
      const routeFn = routeFns[type](modifiedRoute)
      const value = await routeFn(req.body)

      res.json(value)
    })
  })
})

app.listen(PORT)