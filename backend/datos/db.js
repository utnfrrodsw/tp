const { Sequelize } = require('sequelize');

module.exports= new Sequelize(
  // TODO no ser un sucio y usar variables de entorno
  'mysql://bcye2u6u9jo2rw6fa7zd:pscale_pw_sPJenqBk1FpMOI7EcKQUQORlb7n9lbMMb1WwDCNgIq9@aws.connect.psdb.cloud/ttads'//?ssl={"rejectUnauthorized":true}
  , {dialectOptions: {
    ssl: {
      rejectUnauthorized: true,
    }
  }}
);