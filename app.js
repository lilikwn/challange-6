const express = require('express');
const app = express();
const port = 3000;
const userRouter = require('./routes/user');
const authRouter = require('./routes/auth');
const biodataRouter = require('./routes/biodata');
const historyRouter = require('./routes/history');
const {mustLogin, isUserExist, isBiodataExist} = require('./helper/middleware');

app.use(express.json());
app.use('/users', userRouter);
app.use('/auth', authRouter);
app.use('/:userId/biodata', mustLogin, isUserExist, biodataRouter);
app.use('/:userId/history', mustLogin, isUserExist, historyRouter);

app.listen(port, '127.0.0.1', ()=>{
  console.log(`Connected to ${port}`);
})

module.exports = app;