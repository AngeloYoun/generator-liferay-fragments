const fs = require('fs');
const path = require('path');

const getPkg = () =>
  JSON.parse(
    fs.readFileSync(path.join(__dirname, '..', '..', 'package.json'), 'utf-8')
  );

module.exports = {
  getPkg
};
