const express = require('express');
const fs = require('fs').promises;
const bodyParser = require('body-parser');
const { findTalker, findTalkerId, userToken, createTalker,
  createTalkerPart2, createTalkerPart3, addNewTalker,
  watchedAtValidation } = require('./middlewares/middlewares');

const app = express();
app.use(bodyParser.json());

const HTTP_OK_STATUS = 200;
const PORT = '3000';
const PATH = './talker.json';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.get('/talker/search', async (req, res) => {
  const { q } = req.query;
  const { authorization } = req.headers;

  if (!authorization) return res.status(401).json({ message: 'Token não encontrado' });
  if (authorization.length !== 16) return res.status(401).json({ message: 'Token inválido' });

  const talker = await fs.readFile(PATH, 'utf8');
  const talkers = JSON.parse(talker);
  const filterTalker = talkers.filter((r) => r.name.includes(q));

  return res.status(200).json(filterTalker);
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

app.put('/talker/:id', createTalker, createTalkerPart2, watchedAtValidation,
createTalkerPart3, async (req, res) => {
  const { id } = req.params;
  const { age, name, talk } = req.body;

  const talkers = await fs.readFile(PATH, 'utf8');
  const talkers2 = JSON.parse(talkers);

  const talkerIndex = talkers2.findIndex((r) => r.id === Number(id));
  talkers2[talkerIndex] = { ...talkers2[talkerIndex], age, name, talk };
  await fs.writeFile(PATH, JSON.stringify(talkers2));

  return res.status(200).json(talkers2[talkerIndex]);
});

app.delete('/talker/:id', async (req, res) => {
  const { authorization } = req.headers;
  const { id } = req.params;

  if (!authorization) return res.status(401).json({ message: 'Token não encontrado' });
  if (authorization.length !== 16) return res.status(401).json({ message: 'Token inválido' });

  const talker = await fs.readFile(PATH, 'utf8');
  const talkers = JSON.parse(talker);
  const talkerIndex = talkers.findIndex((r) => r.id === Number(id));
  talkers.splice(talkerIndex, 1);
  await fs.writeFile(PATH, JSON.stringify(talkers));
  return res.status(204).end();
});

app.listen(PORT, () => {
  console.log('Online');
});
