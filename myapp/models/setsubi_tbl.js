'use strict';
// const {
//   Model
// } = require('sequelize');
// module.exports = (sequelize, DataTypes) => {
//   class SETSUBI_TBL extends Model {
//     /**
//      * Helper method for defining associations.
//      * This method is not a part of Sequelize lifecycle.
//      * The `models/index` file will call this method automatically.
//      */
//     static associate(models) {
//       // define association here
//     }
//   };
//   SETSUBI_TBL.init({
//     setsubiId: DataTypes.INTEGER,
//     setsubiName: DataTypes.STRING,
//     kyotenId: DataTypes.INTEGER
//   }, {
//     sequelize,
//     modelName: 'SETSUBI_TBL',
//   });
//   return SETSUBI_TBL;
// };


module.exports = (sequelize, DataTypes) => {
  const SETSUBI_TBL = sequelize.define('SETSUBI_TBL', {
    setsubiName: {
      type: DataTypes.STRING,
    },
    kyotenId: {
      type:DataTypes.INTEGER,
    }
  }, {});
  SETSUBI_TBL.associate = function(models) {
    SETSUBI_TBL.belongsTo(models.KYOTEN_TBL, {foreignKey: 'kyotenId'});
  };
  return SETSUBI_TBL;
};