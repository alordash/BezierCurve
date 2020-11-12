const path = require('path');
const express = require('express');
const favicon = require('serve-favicon');

const app = express();
app.use(express.static(path.join(__dirname, 'static')));
app.use(favicon(path.join(__dirname, 'static', 'favicon.ico')));
app.get('/', (req, res) => {
   res.sendFile(path.join(__dirname, 'static/index.html'));
});
app.listen(process.env.port || 3000);

console.log('Server launched');