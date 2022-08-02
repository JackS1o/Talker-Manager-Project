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

  if (!email || !password) {
    return res.status(400).json({ message: 'Email e senha são obrigatórios' });
  }
  
  const token = crypto.randomBytes(8).toString('hex');

  return res.status(200).json({ token });
};

module.exports = {
  findTalker,
  findTalkerId,
  userToken,
};
