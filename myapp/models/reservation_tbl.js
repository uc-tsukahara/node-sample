'use strict';
// const {
//   Model
// } = require('sequelize');
// module.exports = (sequelize, DataTypes) => {
//   class RESERVATION_TBL extends Model {
//     /**
//      * Helper method for defining associations.
//      * This method is not a part of Sequelize lifecycle.
//      * The `models/index` file will call this method automatically.
//      */
//     static associate(models) {
//       // define association here
//     }
//   };
//   RESERVATION_TBL.init({
//     reservationId: DataTypes.INTEGER,
//     userId: DataTypes.INTEGER,
//     statDateTime: DataTypes.DATE,
//     endDateTime: DataTypes.DATE,
//     bikou: DataTypes.STRING,
//     setsubiId: DataTypes.INTEGER
//   }, {
//     sequelize,
//     modelName: 'RESERVATION_TBL',
//   });
//   return RESERVATION_TBL;
// };


module.exports = (sequelize, DataTypes) => {
  const RESERVATION_TBL = sequelize.define('RESERVATION_TBL', {
    userId: {
      type:DataTypes.INTEGER,
    },
    statDateTime: {
      type: DataTypes.DATE,
    },
    endDateTime: {
      type: DataTypes.DATE,
    },
    bikou: {
      type:DataTypes.STRING,
    },
    setsubiId: {
      type:DataTypes.INTEGER,
    }
  }, {});
  RESERVATION_TBL.associate = function(models) {
    //RESERVATION_TBL.belongTo(models.USER_TBL);
    //RESERVATION_TBL.belongTo(models.SETSUBI_TBL);
  };
  return RESERVATION_TBL;
};