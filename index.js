require('dotenv').config()
const github = require('./github')

const args = process.argv.slice(2)
const [ command, repo, branch ] = args

if (!github.hasOwnProperty(command)) {
  throw new Error('Command not recognised')
}

github[command](repo, branch)
  .then(response => console.log(response))
  .catch(error => console.log(error))

