const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const https = require('https');
const fs = require('fs');

const corsOptions = {
  origin: '*',
  methods: 'GET, POST, OPTIONS, PUT, PATCH, DELETE',
  allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept, Authorization'
};

app.use(express.json({ limit: '500mb' }));
app.use(express.urlencoded({ limit: '500mb' }));
app.use(cors(corsOptions));

const privateKey = fs.readFileSync('key.pem', 'utf8');
const certificate = fs.readFileSync('cert.pem', 'utf8');

const options = {
  key: privateKey,
  cert: certificate
};

app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  
  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  // Pass to next layer of middleware
  next();
});

const router = require('./routes/router.js');
app.use('/api', router);

const PORT = process.env.PORT || 3001;

const server = https.createServer(options, app);

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
