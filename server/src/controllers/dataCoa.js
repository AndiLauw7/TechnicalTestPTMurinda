const { tb_mtuang, tb_coa } = require("../../models");

exports.addDataCoa = async (req, res) => {
  try {
    const {
      id_matauang,
      kodeAcc,
      namaAcc,
      tipeAcc,
      levelAcc,
      parentAcc,
      groupAcc,
      controlAcc,
      depart,
      gainloss,
    } = req.body;

    const cekIdMtunag = id_matauang || null;
    if (cekIdMtunag) {
      const dataMataUang = await tb_mtuang.findOne({
        wher: { id: cekIdMtunag },
      });
      if (!dataMataUang) {
        return res.status(400).send({
          status: "failed",
          message: "id_matauang tidak ditemukan di tabel tb_mtuang",
        });
      }
    }

    // Buat data baru untuk tb_coa
    const newDataCoa = {
      id_matauang: cekIdMtunag,
      kodeAcc,
      namaAcc,
      tipeAcc,
      levelAcc,
      parentAcc,
      groupAcc,
      controlAcc,
      depart,
      gainloss,
    };

    // Tambahkan data baru ke tabel tb_coa
    const data = await tb_coa.create(newDataCoa);

    // Ambil data lengkap dengan relasi (join dengan tb_mtuang)
    const dataCoa = await tb_coa.findOne({
      where: { id: data.id },
      include: [
        {
          model: tb_mtuang,
          as: "tb_mtuang", // Pastikan sesuai alias relasi di model
          attributes: { exclude: ["createdAt", "updatedAt"] },
        },
      ],
    });

    // Kirimkan respons sukses
    res.send({
      status: "success",
      data: dataCoa,
    });
  } catch (error) {
    console.error("Error addDataCoa:", error.message);
    res.status(500).send({
      status: "failed",
      message: "Terjadi kesalahan pada server",
    });
  }
};

exports.getDataCoa = async (req, res) => {
  try {
    const data = await tb_coa.findAll({
      include: [
        {
          model: tb_mtuang,
          as: "tb_mtuang",
          attributes: { exclude: ["createdAt", "updatedAt"] },
        },
      ],
      attributes: { exclude: ["createdAt", "updatedAt"] },
    });

    if (!data || data.length === 0) {
      return res.status(404).send({
        status: "Error",
        message: "No data found",
      });
    }

    const formatedData = JSON.parse(JSON.stringify(data));

    res.status(200).send({
      status: "success",
      message: "Successfully fetched data",
      data: formatedData,
    });
  } catch (error) {
    console.error(error); // Untuk debugging
    res.status(500).send({
      status: "Internal Server Error",
      message: "Failed to fetch data",
    });
  }
};

exports.deleteCoa = async (req, res) => {
  try {
    const { id } = req.params;

    const dataCoa = await tb_coa.findOne({
      where: { id },
    });
    if (!dataCoa) {
      return res.status(404).send({
        status: "failed",
        message: "data coa not found",
      });
    }
    if (dataCoa.id_matauang !== null) {
      return res.status(400).send({
        status: "failed",
        message: `Data COA dengan id tidak dapat dihapus karena memiliki nilai currency`,
      });
    }
    // const relasi = await tb_coa.count({
    //   where: { id_matauang: id },
    // });

    // console.log("Jumlah relasi ditemukan:", relasi);

    // if (relasi > 0) {
    //   return res.status(400).send({
    //     status: "failed",
    //     message: `cannot delete coa ${id} karena terikat dengan tabel mata uang`,
    //   });
    // }
    // const relasi = await tb_coa.findOne({
    //   where: { id_matauang: id },
    // });
    // if (relasi) {
    //   return res.status(400).send({
    //     status: "failed",
    //     message: `cannot delete coa ${id} karena terikat dengan tabel mata uang`,
    //   });
    // }
    await tb_coa.destroy({ where: { id } });
    res.status(200).send({
      status: "success",
      message: `Data Coa  dengan ${id} berhasil dihapus`,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "failed",
      message: "server error",
    });
  }
};

exports.updateCoa = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      id_matauang,
      kodeAcc,
      namaAcc,
      tipeAcc,
      levelAcc,
      parentAcc,
      groupAcc,
      controlAcc,
      depart,
      gainloss,
    } = req.body;
    const dataCoa = await tb_coa.findOne({ where: { id } });

    if (!dataCoa) {
      return res.status(404).send({
        status: "failed",
        message: "Data Coa tidak ditemukan",
      });
    }

    if (dataCoa.id_matauang !== null) {
      return res.status(400).send({
        status: "failed",
        message: `Data COA dengan id ${id} tidak dapat diupdate karena memiliki id_matauang`,
      });
    }

    if (id_matauang) {
      const mataUangAda = await tb_mtuang.findOne({
        where: { id: id_matauang },
      });
      if (!mataUangAda) {
        return res.status(400).send({
          status: "failed",
          message: `id_matauang ${id_matauang} tidak ditemukan di tb_mtuangs`,
        });
      }
    }

    await tb_coa.update(
      {
        id_matauang,
        kodeAcc,
        namaAcc,
        tipeAcc,
        levelAcc,
        parentAcc,
        groupAcc,
        controlAcc,
        depart,
        gainloss,
      },
      { where: { id } }
    );
    res.status(200).send({
      status: "success",
      message: `Data COA dengan id ${id} berhasil diupdate`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      status: "failed",
      message: "Server error",
    });
  }
};

exports.getDataCoaById = async (req, res) => {
  try {
    const { id } = req.params;
    let dataCoa = await tb_coa.findOne({
      where: { id },
    });
    // dataKelas = JSON.parse(JSON.stringify(dataKelas));

    res.status(200).send({
      data: { dataCoa },
      status: "success",
      message: "Success get data by id",
    });
  } catch (error) {
    res.status(500).send({
      status: "failed",
      message: "Internal Server Error",
    });
  }
};
