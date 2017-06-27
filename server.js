const express = require('express');
const app = express();
const port = 9999;


app.use(express.static('dist'));

app.listen(port, function () {
  console.log('Example app listening on port ' + port + '!');
});