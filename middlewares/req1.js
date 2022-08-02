const fs = require('fs').promises;

const PATH = './talker.json';

const findTalker = async (_req, res) => {
  const talkers = await fs.readFile(PATH, 'utf8').then((data) => JSON.parse(data));

  if (!talkers) return res.status(200).send([]);

  return res.status(200).send(talkers);
};

module.exports = findTalker;
