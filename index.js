const express = require('express');
const bodyParser = require('body-parser');
const { findTalker, findTalkerId, userToken, createTalker,
  createTalkerPart2, createTalkerPart3, addNewTalker,
  watchedAtValidation } = require('./middlewares/middlewares');

const app = express();
app.use(bodyParser.json());

const HTTP_OK_STATUS = 200;
const PORT = '3000';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.get('/talker', findTalker, (_request, response) => {
  response.status(HTTP_OK_STATUS);
});

app.get('/talker/:id', findTalkerId, (_req, res) => {
  res.status(HTTP_OK_STATUS);
});

app.post('/login', userToken, (_req, res) => {
  res.status(HTTP_OK_STATUS);
});

app.post('/talker', createTalker, createTalkerPart2, watchedAtValidation,
  createTalkerPart3, addNewTalker, (_req, res) => {
  res.status(HTTP_OK_STATUS);
});

app.listen(PORT, () => {
  console.log('Online');
});
