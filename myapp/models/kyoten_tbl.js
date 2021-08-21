'use strict';
// const {
//   Model
// } = require('sequelize');
// module.exports = (sequelize, DataTypes) => {
//   class KYOTEN_TBL extends Model {
//     /**
//      * Helper method for defining associations.
//      * This method is not a part of Sequelize lifecycle.
//      * The `models/index` file will call this method automatically.
//      */
//     static associate(models) {
//       // define association here
//     }
//   };
//   KYOTEN_TBL.init({
//     kyotenId: DataTypes.INTEGER,
//     kyotenName: DataTypes.STRING
//   }, {
//     sequelize,
//     modelName: 'KYOTEN_TBL',
//   });
//   return KYOTEN_TBL;
// };

module.exports = (sequelize, DataTypes) => {
  const KYOTEN_TBL = sequelize.define('KYOTEN_TBL', {
    kyotenName: {
      type: DataTypes.STRING,
    }
  }, {});
  KYOTEN_TBL.associate = function(models) {
    KYOTEN_TBL.hasMany(models.SETSUBI_TBL, {foreignKey: 'kyotenId'});
  };
  return KYOTEN_TBL;
};