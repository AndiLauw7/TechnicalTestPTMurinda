"use strict";
const { Model } = require("sequelize");
const tb_mtuang = require("./tb_mtuang");
module.exports = (sequelize, DataTypes) => {
  class tb_coa extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      tb_coa.belongsTo(models.tb_mtuang, {
        as: "tb_mtuang",
        foreignKey: {
          name: "id_matauang",
        },
      });
    }
  }
  tb_coa.init(
    {
      id_matauang: DataTypes.INTEGER,
      kodeAcc: DataTypes.INTEGER,
      namaAcc: DataTypes.STRING,
      tipeAcc: {
        type: DataTypes.ENUM,
        values: ["General", "Detail"],
        // defaultValue: "General",
      },
      levelAcc: {
        type: DataTypes.INTEGER,
      },

      parentAcc: DataTypes.INTEGER,
      groupAcc: {
        type: DataTypes.ENUM,
        values: [
          "Asset",
          "Liabilities",
          "Capital",
          "Revenue",
          "COGS",
          "Expences",
          "Order Revenue",
          "Other Expences",
        ],
      },
      controlAcc: {
        type: DataTypes.ENUM,
        values: [
          "None",
          "Cash/Bnak",
          "Acc Receivable",
          "Acc Paylable",
          "Fixed Asset",
        ],
      },
      depart: DataTypes.STRING,
      gainloss: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "tb_coa",
    }
  );
  return tb_coa;
};
