const { tb_mtuang, tb_coa } = require("../../models");

// exports.addDataCoa = async (req, res) => {
//   try {
//     const {
//       id_matauang,
//       kodeAcc,
//       namaAcc,
//       tipeAcc,
//       levelAcc,
//       parentAcc,
//       groupAcc,
//       controlAcc,
//       depart,
//       gainloss,
//     } = req.body;

//     const cekIdMtunag = id_matauang || null;
//     if (cekIdMtunag) {
//       const dataMataUang = await tb_mtuang.findOne({
//         where: { id: cekIdMtunag }, // Verify that `id` matches
//       });
//       if (!dataMataUang) {
//         return res.status(400).send({
//           status: "failed",
//           message: `Currency with ID ${cekIdMtunag} does not exist in tb_mtuang.`,
//         });
//       }
//     }

//     // Create new data for tb_coa
//     const newDataCoa = {
//       id_matauang: cekIdMtunag,
//       kodeAcc,
//       namaAcc,
//       tipeAcc,
//       levelAcc,
//       parentAcc,
//       groupAcc,
//       controlAcc,
//       depart,
//       gainloss,
//     };

//     // Add new data to the tb_coa table
//     const data = await tb_coa.create(newDataCoa);

//     // Retrieve the complete data with relation (join with tb_mtuang)
//     const dataCoa = await tb_coa.findOne({
//       where: { id: data.id },
//       include: [
//         {
//           model: tb_mtuang,
//           as: "tb_mtuang", // Make sure the alias is correct according to the model
//           attributes: { exclude: ["createdAt", "updatedAt"] },
//         },
//       ],
//     });

//     // Send success response
//     res.send({
//       status: "success",
//       data: dataCoa,
//     });
//   } catch (error) {
//     console.error("Error addDataCoa:", error.message);
//     res.status(500).send({
//       status: "failed",
//       message: "Terjadi kesalahan pada server",
//     });
//   }
// };

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
