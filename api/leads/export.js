const crm = require('../../js/crm-backend');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const csvData = crm.exportCsv();
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', 'attachment; filename="salowtech-leads.csv"');
  return res.status(200).send(csvData);
};

