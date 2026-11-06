const leadsHandler = require('../leads');

module.exports = async function handler(req, res) {
  return leadsHandler(req, res);
};
