"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("tb_coas", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      id_matauang: {
        type: Sequelize.INTEGER,
        references: {
          model: "tb_mtuangs",
          key: "id",
        },
      },
      kodeAcc: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      namaAcc: {
        type: Sequelize.STRING,
      },
      tipeAcc: {
        type: Sequelize.ENUM,
        values: ["General", "Detail"],
        // defaultValue: "General",
      },
      levelAcc: {
        type: Sequelize.INTEGER,
      },
      parentAcc: {
        type: Sequelize.INTEGER,
      },
      groupAcc: {
        type: Sequelize.ENUM,
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
        // defaultValue: "Asset",
      },
      controlAcc: {
        type: Sequelize.ENUM,
        values: [
          "None",
          "Cash/Bnak",
          "Acc Receivable",
          "Acc Paylable",
          "Fixed Asset",
        ],
        // defaultValue: "None",
      },
      depart: {
        type: Sequelize.STRING,
      },
      gainloss: {
        type: Sequelize.STRING,
      },

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("tb_coas");
  },
};
