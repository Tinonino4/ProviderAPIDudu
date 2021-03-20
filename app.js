// Import dependencies
const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

// Load server files
const routes = require('./server-files/routes');
const azurestorage = require('./server-files/azurestorage');

// Starting express
const app = express();

// Serving the files
app.use(favicon(__dirname + '/public/images/favicon.png'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/api', azurestorage);

app.set('port', process.env.PORT || 3000);

app.listen(app.get('port'));

