const { Sequelize } = require('sequelize');

module.exports= new Sequelize(
  'mysql://3wt715xtrh0mchoinbvr:pscale_pw_W5GQfPT33CbNGoZSqW0snn4DtwQ9YBL0G71QOjuNF9s@us-east.connect.psdb.cloud/ttads'
  , {dialectOptions: {
    ssl: {
      rejectUnauthorized: true,
    }
  }}
);