const express = require('express');
const app = express();

app.listen(5555)

const fakeUsers = require('./random-users');

app.use('/fake/users', fakeUsers)



