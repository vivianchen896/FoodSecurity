const express = require('express')
const app = express()

app.get('/', (req, res) => res.send('Hello World!'))

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(express.static('data'));

app.listen(3000, () => console.log('Express listening on port 3000!'))
