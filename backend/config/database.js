const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'mysql',
  logging: false,
  dialectOptions: {
    ssl: process.env.NODE_ENV === 'production' ? {
      require: true,
      rejectUnauthorized: false
    } : false
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  timezone: '+00:00'
});

sequelize.authenticate()
  .then(() => {
    console.log('Database connection established successfully');
  })
  .catch(err => {
    console.error('Unable to connect to database:', err.message);
  });

module.exports = sequelize;