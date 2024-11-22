const express = require("express");
const {
  addMataUang,
  getDataMataUang,
  getDataMataUangById,
  deleteMataUangByid,
  updateCurrency,
} = require("../controllers/MataUang");
const {
  addDataCoa,
  getDataCoa,
  deleteCoa,
  updateCoa,
  getDataCoaById,
} = require("../controllers/dataCoa");

const router = express.Router();
router.post("/add-mata-uang", addMataUang);
router.get("/get-mata-uang", getDataMataUang);
router.get("/get-mata-uang/:id", getDataMataUangById);
router.delete("/delete-mata-uang/:id", deleteMataUangByid);
router.patch("/updateccy/:id", updateCurrency);

router.post("/adddatacoa", addDataCoa);
router.get("/getdatacoa", getDataCoa);
router.get("/getdatacoa/:id", getDataCoaById);

router.delete("/deletecoa/:id", deleteCoa);
router.patch("/update-coa/:id", updateCoa);
module.exports = router;
