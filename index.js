require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const morgan = require('morgan')
const Person = require('./models/person')


app.use(express.static('dist'))
app.use(express.json())
app.use(morgan('tiny'))
app.use(cors())


app.get('/info', (request, response) => {
  const timestamp = Date.now()
  const requestDate = new Date(timestamp)
  const requestDateUTC = requestDate.toUTCString() 
  Person.find({}).then(persons => {
    response.send(`<p>Phonebook has info for ${persons.length} people</p> <p>${requestDateUTC}</p>`)
  })

})
app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})
app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id).then(person => {
    response.json(person)
  }).catch((error)=> {
    console.log('find by id error:', error.message)
  })
})

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (body.name === undefined) {
    return response.status(400).json({ error: 'name missing' })
  }
  if (body.number === undefined) {
    return response.status(400).json({ error: 'number missing' })
  }
  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person.save().then(savedPerson => {
    console.log(`added ${savedPerson.name} number ${savedPerson.number} to phonebook`)
    response.json(savedPerson)
  })
})


app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})


const PORT = process.env.PORT
app.listen(PORT)
console.log(`Server running on port ${PORT}`)