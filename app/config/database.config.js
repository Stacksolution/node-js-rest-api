require('dotenv').config();

module.exports = {
   url: 'mongodb://'+process.env.MONGO_HOST+':'+process.env.MONGO_PORT+'/'+ process.env.DB_NAME
}
