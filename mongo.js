const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url =
`mongodb+srv://mongotravis:${password}@cluster0.cgkmpno.mongodb.net/phonebookApp?retryWrites=true&w=majority`

mongoose.set('strictQuery',false)
mongoose.connect(url)


const personSchema = new mongoose.Schema({
  id: Number,
  name: String,
  number: String,
})
const Person = mongoose.model('Person', personSchema)


if(process.argv[3] === undefined){
  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(person)
    })
    mongoose.connection.close()
  })

}else{

  const person = new Person({
    name: process.argv[3],
    number: process.argv[4],
  })
  
  
  
  person.save().then(result => {
    console.log(`added ${result.name} number ${result.number} to phonebook`)
    mongoose.connection.close()
  })
  
}


