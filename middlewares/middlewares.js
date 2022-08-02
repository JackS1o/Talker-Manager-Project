const fs = require('fs').promises;

const PATH = './talker.json';

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

module.exports = {
  findTalker,
  findTalkerId,
};
