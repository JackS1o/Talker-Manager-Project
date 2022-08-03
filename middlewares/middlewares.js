const fs = require('fs').promises;

const PATH = './talker.json';
const crypto = require('crypto');

const findTalker = async (_req, res) => {
  const talkers = await fs.readFile(PATH, 'utf8').then((data) => JSON.parse(data));

  if (!talkers) return res.status(200).send([]);

  return res.status(200).send(talkers);
};

const findTalkerId = async (req, res) => {
  const { id } = req.params;
  const talkers = await fs.readFile(PATH, 'utf8').then((data) => JSON.parse(data));
  const talker = talkers.find((talk) => talk.id === Number(id));

  if (!talker) return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });

  return res.status(200).send(talker);
};

const userToken = (req, res) => {
  const { email, password } = req.body;
  const emailFormat = /[a-zA-Z0-9._]+@[a-zA-Z]+\.[a-zA-Z.]*\w$/;
  if (!email) {
    return res.status(400).json({ message: 'O campo "email" é obrigatório' });
  }
  if (!emailFormat.test(email)) {
    return res.status(400).json({ message: 'O "email" deve ter o formato "email@email.com"' });
  }
  if (!password) {
    return res.status(400).json({ message: 'O campo "password" é obrigatório' });
  }
   if (password.length < 6) {
    return res.status(400).json({ message: 'O "password" deve ter pelo menos 6 caracteres' });
  }
  const token = crypto.randomBytes(8).toString('hex');
  return res.status(200).json({ token });
};

const createTalker = (req, res, next) => {
  const { authorization } = req.headers;
  const { name } = req.body;
  if (!authorization) return res.status(401).json({ message: 'Token não encontrado' });
  if (authorization.length !== 16) return res.status(401).json({ message: 'Token inválido' });
  if (!name) return res.status(400).json({ message: 'O campo "name" é obrigatório' });
  if (name.length < 3) {
    return res.status(400).json({ message: 'O "name" deve ter pelo menos 3 caracteres' });
  }
  next();
};

const createTalkerPart2 = (req, res, next) => {
  const { age, talk } = req.body;
  if (!age) return res.status(400).json({ message: 'O campo "age" é obrigatório' });
  if (age < 18) {
    return res.status(400).json({ message: 'A pessoa palestrante deve ser maior de idade' });
  }
  if (!talk) return res.status(400).json({ message: 'O campo "talk" é obrigatório' });
  next();
};

const watchedAtValidation = (req, res, next) => {
  const { talk: { watchedAt } } = req.body;
  const dateRegex = /^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$/i;
  if (!watchedAt) return res.status(400).json({ message: 'O campo "watchedAt" é obrigatório' });
  if (!dateRegex.test(watchedAt)) {
    return res.status(400).json({ message: 'O campo "watchedAt" deve ter o formato "dd/mm/aaaa"' });
  }
  next();
};

const createTalkerPart3 = (req, res, next) => {
  const { talk: { rate } } = req.body;
  if (rate < 1 || rate > 5 || rate === 0) {
    return res.status(400).json({ message: 'O campo "rate" deve ser um inteiro de 1 à 5' });
  }
  if (!rate) return res.status(400).json({ message: 'O campo "rate" é obrigatório' });
  next();
};

const addNewTalker = async (req, res) => {
  const talkers = await fs.readFile(PATH, 'utf8').then((data) => JSON.parse(data));
  const id = talkers.length + 1;
  const newTalker = { ...req.body, id };
  talkers.push(newTalker);
  fs.writeFile(PATH, JSON.stringify(talkers));
  return res.status(201).json(newTalker);
};

module.exports = {
  findTalker,
  findTalkerId,
  userToken,
  createTalker,
  createTalkerPart2,
  createTalkerPart3,
  addNewTalker,
  watchedAtValidation,
};
