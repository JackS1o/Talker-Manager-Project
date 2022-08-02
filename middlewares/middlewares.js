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

module.exports = {
  findTalker,
  findTalkerId,
  userToken,
};
