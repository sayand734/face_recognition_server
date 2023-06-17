const express = require('express');
const multer = require('multer');
const fs = require('fs');
const faceapi = require('face-api.js');
const tf = require('@tensorflow/tfjs-node');
const { processImage } = require('./model/model');



const app = express();
const port = 3000;


const upload = multer({ dest: 'uploads/' });


app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});


app.post('/', upload.single('image'), (req, res) => {
  
  const imageFile = req.file;
  processImage(imageFile)

});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


