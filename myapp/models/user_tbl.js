'use strict';
// const {
//   Model
// } = require('sequelize');
// module.exports = (sequelize, DataTypes) => {
//   class USER_TBL extends Model {
//     /**
//      * Helper method for defining associations.
//      * This method is not a part of Sequelize lifecycle.
//      * The `models/index` file will call this method automatically.
//      */
//     static associate(models) {
//       // define association here
//     }
//   };
//   USER_TBL.init({
//     userId: DataTypes.INTEGER,
//     userName: DataTypes.STRING,
//     password: DataTypes.STRING,
//     email: DataTypes.STRING
//   }, {
//     sequelize,
//     modelName: 'USER_TBL',
//   });
//   return USER_TBL;
// };


module.exports = (sequelize, DataTypes) => {
  const USER_TBL = sequelize.define('USER_TBL', {
    userName: {
      type: DataTypes.STRING,
    },
    password: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
    }
  }, {});
  USER_TBL.associate = function(models) {
    USER_TBL.hasMany(models.RESERVATION_TBL, {foreignKey: 'userId'});
  };
  return USER_TBL;
};