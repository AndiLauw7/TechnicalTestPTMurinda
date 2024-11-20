"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class tb_mtuang extends Model {
    static associate(models) {
      // tb_mtuang.hasMany(models.tb_coa, {
      //   as: "coa",
      //   foreignKey: {
      //     name: "id_coa",
      //   },
      // });
    }
  }
  tb_mtuang.init(
    {
      ccy: DataTypes.STRING,
      currencyName: DataTypes.STRING,
      rate: DataTypes.NUMBER,
      std: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "tb_mtuang",
    }
  );
  return tb_mtuang;
};
