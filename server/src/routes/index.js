const express = require("express");
const {
  addMataUang,
  getDataMataUang,
  getDataMataUangById,
} = require("../controllers/MataUang");
const { addDataCoa, getDataCoa } = require("../controllers/dataCoa");

const router = express.Router();
router.post("/add-mata-uang", addMataUang);
router.get("/get-mata-uang", getDataMataUang);
router.get("/get-mata-uang/:id", getDataMataUangById);

router.post("/adddatacoa", addDataCoa);
router.get("/getdatacoa", getDataCoa);
module.exports = router;
