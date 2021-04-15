//=============== SETUP ===============//

// express
const express = require('express');
const app = express();

// route table
const routesReport = require('rowdy-logger').begin(app);

const path = require('path');
const replaceInFile = require('replace-in-file');


//=============== ROUTES ===============//


app.get('/', (req, res) => {
  const filepath = path.join(__dirname, 'index.html')
  res.sendFile(filepath)
})

app.get('/main.js', async (req, res) => {
  const filepath = path.join(__dirname, 'main.js')
  // check if running locally
  if (process.env.NODE_ENV === 'development')
  {
    await replaceInFile(
    {
      files: filepath,
      from: 'https://minecraft-recipe-app.herokuapp.com',
      to: 'http://localhost:3001'
    })
  }
  res.sendFile(filepath)
})

app.get('/style.css', (req, res) => {
  const filepath = path.join(__dirname, 'style.css')
  res.type('css').sendFile(filepath)
})


//=============== SERVER ===============//
const port = process.env.PORT || 3000
app.listen(port, () => {
    routesReport.print();
})
