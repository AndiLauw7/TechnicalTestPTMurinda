const { tb_mtuang } = require("../../models");

exports.addMataUang = async (req, res) => {
  try {
    const data = {
      ccy: req.body.ccy,
      currencyName: req.body.currencyName,
      rate: req.body.rate,
      std: req.body.std,
    };
    let newData = await tb_mtuang.create(data);
    res.send({
      status: "succes",
      data: {
        newData,
      },
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "Failed",
      message: "server error",
    });
  }
};

exports.getDataMataUang = async (req, res) => {
  try {
    const data = await tb_mtuang.findAll({
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });
    res.send({
      status: "success",
      data,
    });
  } catch (error) {
    res.status(500).send({
      status: "failed",
      message: "server Error",
    });
  }
};

exports.getDataMataUangById = async (req, res) => {
  try {
    const { id } = req.params;
    let dataMataUang = await tb_mtuang.findOne({
      where: { id },
    });
    cekData = JSON.parse(JSON.stringify(dataMataUang));

    res.status(200).send({
      data: { cekData },
      status: "success",
      message: "Succes get data by id",
    });
  } catch (error) {
    res.status(500).send({
      status: "failed",
      message: "Internal Server Error",
    });
  }
};

exports.deleteMataUangByid = async (req, res) => {
  try {
    const { id } = req.params;
    const dataCurrency = await tb_mtuang.findOne({ where: { id } });

    if (!dataCurrency) {
      return req.status(404).send({
        status: "Failed",
        message: "Siswa tidak ditemukan",
      });
    }
    await tb_mtuang.destroy({ where: { id } });
    res.status(200).send({
      status: "succes",
      message: `Siswa dengan id ${id} berhasil dihapus`,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "failed",
      message: "Server Error",
    });
  }
};

exports.updateCurrency = async (req, res) => {
  try {
    const { id } = req.params;
    const [updated] = await tb_mtuang.update(req.body, {
      where: { id },
    });
    if (updated) {
      const updatedCurrency = await tb_mtuang.findOne({ where: { id } });
      res.send({
        status: "success",
        data: {
          id: updatedCurrency.id,
          ccy: updatedCurrency.ccy,
          currencyName: updatedCurrency.currencyName,
          rate: updatedCurrency.rate,
          std: updatedCurrency.std,
        },
      });
    } else {
      res.status(404).send({
        statu: "failed",
        message: "CCy not Found",
      });
    }
  } catch (error) {
    res.status(500).send({
      status: "failed",
      message: "internal server error",
      error: error.message,
    });
  }
};