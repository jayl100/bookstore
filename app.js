const express = require('express');
const app = express();

// dotenv 모듈
const dotenv = require('dotenv');
dotenv.config();

app.listen(process.env.PORT);

const userRouters = require('./routes/users');
const booksRouters = require('./routes/books');
const likesRouters = require('./routes/likes');
const cartsRouters = require('./routes/carts');
const ordersRouters = require('./routes/orders');

app.use("/users", userRouters);
app.use("/books", booksRouters);
app.use("/likes", likesRouters);
app.use("/carts", cartsRouters);
app.use("/orders", ordersRouters);