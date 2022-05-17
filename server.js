const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const cors = require('cors');
const authenticate = require('./helpers/authenticate');
const login = require('./helpers/login');
const user = require('./routes/user/user');
const home = require('./routes/home/home');
const projects = require('./routes/projects/projects');
const intel = require('./routes/intel/intel');
const vision = require('./routes/vision/vision');

const { HOST, PORT } = process.env;

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/user/login', login);

app.use(authenticate);

app.use('/user', user);
app.use('/home', home);
app.use('/projects', projects);
app.use('/intel', intel);
app.use('/vision', vision);

app.listen(PORT, HOST);
// eslint-disable-next-line
console.log(`Running on http://${HOST}:${PORT}`);