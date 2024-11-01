const fs = require('fs');
const path = require('path');

module.exports = async () => {
  const coverageDir = path.resolve(__dirname, 'coverage');
  if (!fs.existsSync(coverageDir)) {
    fs.mkdirSync(coverageDir);
  }
};
