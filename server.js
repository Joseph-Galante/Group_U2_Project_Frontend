//=============== SETUP ===============//

// express
const express = require('express');
const app = express();

// route table
const routesReport = require('rowdy-logger').begin(app);

// find files for server
const path = require('path');
// replace instances of local url with heroku url
const replaceInFile = require('replace-in-file');


//=============== ROUTES ===============//


app.get('/', (req, res) => {
  const filepath = path.join(__dirname, 'index.html')
  res.sendFile(filepath)
})

app.get('/main.js', async (req, res) => {
  const filepath = path.join(__dirname, 'main.js')
//   // check if running locally
//   if (process.env.NODE_ENV === 'production')
//   {
//     await replaceInFile(
//     {
//       files: filepath,
//       from: 'http://localhost:3001',
//       to: 
//     })
//   }
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
