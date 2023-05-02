const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = process.env.PORT || 5000;

// Enable CORS for all requests
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  next();
});

app.get('/api/pdfList', (req, res) => {
  const { dir } = req.query;
  const pdfDir = path.join(__dirname, 'public', dir);

  // Check if the directory exists
  if (fs.existsSync(pdfDir)) {
    // Read the list of files and subdirectories in the directory and filter out non-PDF files
    const fileList = fs.readdirSync(pdfDir);
    const pdfList = fileList.filter(file => path.extname(file).toLowerCase() === '.pdf');
    const subDirs = fileList.filter(file => fs.statSync(path.join(pdfDir, file)).isDirectory());

    if (pdfList.length > 0) {
      res.json(pdfList);
    } else if (subDirs.length > 0) {
      res.json(subDirs);
    } else {
      res.status(404).send('No PDFs or subdirectories found');
    }
  } else {
    res.status(404).send('Directory not found');
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
module.exports = app;