const express = require('express');
const app = express();

const hostname = '192.168.0.7';
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello, Express!');
});

app.listen(port, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
