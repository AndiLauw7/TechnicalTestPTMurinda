/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { API } from "../config/api";
import { Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function AddCoa() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    kodeAcc: "",
    namaAcc: "",
    tipeAcc: "",
    levelAcc: "",
    parentAcc: "",
    groupAcc: "",
    controlAcc: "",
    id_matauang: "",
    depart: false,
    gainloss: false,
  });

  const [currencies, setCurrencies] = useState([]);
  const [dataCoa, setDataCoa] = useState([]);
  const [filteredParents, setFilteredParents] = useState([]);
  const [isGainLossDisabled, setIsGainLossDisabled] = useState(true);

  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        const response = await API.get("/get-mata-uang");
        setCurrencies(response.data.data);
      } catch (error) {
        console.error("Failed to load currencies:", error);
        alert("Failed to load currencies. Please try again.");
      }
    };

    const fetchDataCoa = async () => {
      try {
        const response = await API.get("/getdatacoa");
        console.log("Data COA:", response.data.data);
        setDataCoa(response.data.data);
      } catch (error) {
        console.error("Failed to get data COA:", error);
      }
    };

    fetchCurrencies();
    fetchDataCoa();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "tipeAcc" && value === "General") {
      setFormData({
        ...formData,
        [name]: value,
        levelAcc: 1, // Reset levelAcc jika tipeAcc diubah ke General
        groupAcc: "", // Reset groupAcc jika tipeAcc diubah ke General
      });
      setFilteredParents([]);
    } else if (name === "tipeAcc" && value === "Detail") {
      setFormData({
        ...formData,
        [name]: value,
        levelAcc: 1, // Set default levelAcc to 2 when tipeAcc is Detail
        parentAcc: "", // Reset parentAcc when tipeAcc is Detail
        groupAcc: "", // Reset groupAcc when tipeAcc is Detail
      });
      setFilteredParents([]); // Clear filtered parents when switching to Detail
    } else if (name === "levelAcc" && formData.tipeAcc === "General") {
      const levelBaru = parseInt(value, 10);
      setFormData({
        ...formData,
        [name]: value,
      });

      if (levelBaru > 1) {
        const parents = dataCoa.filter(
          (item) =>
            item.tipeAcc === "General" && item.levelAcc === levelBaru - 1
        );
        setFilteredParents(parents);
      } else {
        setFilteredParents([]);
      }
    } else if (name === "levelAcc" && formData.tipeAcc === "Detail") {
      const levelBaru = parseInt(value, 10);
      setFormData({
        ...formData,
        [name]: value,
      });

      if (levelBaru > 1) {
        // Jika tipeAcc Detail, cari parent dari tipeAcc General dengan levelAcc - 1
        const parents = dataCoa.filter(
          (item) =>
            item.tipeAcc === "General" && item.levelAcc === levelBaru - 1
        );
        setFilteredParents(parents);
      } else {
        setFilteredParents([]);
      }
    } else if (
      name === "parentAcc" &&
      formData.tipeAcc === "General" &&
      formData.levelAcc > 1
    ) {
      const pilihParent = dataCoa.find(
        (item) =>
          parseInt(item.kodeAcc, 10) === parseInt(value, 10) &&
          item.levelAcc === parseInt(formData.levelAcc, 10) - 1
      );

      if (!pilihParent) {
        alert("Parent Account tidak valid.");
        setFormData({
          ...formData,
          [name]: "",
          groupAcc: "",
        });
        return;
      }

      setFormData({
        ...formData,
        [name]: value,
        groupAcc: pilihParent.groupAcc || "", // Isi groupAcc otomatis berdasarkan parentAcc
      });
    } else if (
      name === "parentAcc" &&
      formData.tipeAcc === "Detail" &&
      formData.levelAcc > 1
    ) {
      // Ketika tipeAcc Detail, cari parentAcc dari tipeAcc General
      const pilihParent = dataCoa.find(
        (item) =>
          parseInt(item.kodeAcc, 10) === parseInt(value, 10) &&
          item.tipeAcc === "General" && // Cek tipeAcc General
          item.levelAcc === parseInt(formData.levelAcc, 10) - 1 // Cari levelAcc - 1
      );

      if (!pilihParent) {
        alert("Parent Account tidak valid.");
        setFormData({
          ...formData,
          [name]: "",
          groupAcc: "",
        });
        return;
      }

      setFormData({
        ...formData,
        [name]: value,
        groupAcc: pilihParent.groupAcc || "", // Isi groupAcc otomatis berdasarkan parentAcc
      });
    } else if (name === "id_matauang") {
      const pilihCcy = currencies.find(
        (currency) => currency.id === parseInt(value, 10)
      );
      const isCcy = pilihCcy?.ccy === "IDR" || pilihCcy?.ccy === "SGD";
      setIsGainLossDisabled(!isCcy);
      setFormData({
        ...formData,
        [name]: value,
        gainloss: isCcy ? formData.gainloss : false,
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === "checkbox" ? checked : value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.groupAcc) {
      alert("GroupAcc harus diisi berdasarkan Parent Account.");
      return;
    }

    try {
      await API.post("/adddatacoa", formData);
      alert("Data saved successfully!");
      navigate("/data-coa");
    } catch (error) {
      console.error("Failed to submit data:", error);
      const serverMessage =
        error.response?.data?.message || "An error occurred on the server.";
      alert(`Server error: ${serverMessage}`);
    }
  };

  return (
    <div className="container">
      <Form className="px-4 py-4 mx-auto my-5 col-6" onSubmit={handleSubmit}>
        <div className="mb-3">
          <Button onClick={() => navigate("/data-coa")}>
            Back to Data COA
          </Button>
        </div>
        <Form.Group className="mb-3" controlId="kodeAcc">
          <Form.Label>Acc Code</Form.Label>
          <Form.Control
            type="text"
            name="kodeAcc"
            value={formData.kodeAcc}
            onChange={handleChange}
            placeholder="Enter account code"
            required
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="accName">
          <Form.Label>Acc Name</Form.Label>
          <Form.Control
            type="text"
            name="namaAcc"
            value={formData.namaAcc}
            onChange={handleChange}
            placeholder="Enter account name"
            required
          />
        </Form.Group>
        <div className="row">
          <Form.Group className="mb-3 col-6" controlId="tipeAcc">
            <Form.Label>Acc Type</Form.Label>
            <Form.Select
              name="tipeAcc"
              value={formData.tipeAcc}
              onChange={handleChange}
              aria-label="Account type"
              required
            >
              <option value="">Select type</option>
              <option value="General">General</option>
              <option value="Detail">Detail</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3 col-6" controlId="level">
            <Form.Label>Level</Form.Label>
            <Form.Select
              name="levelAcc"
              value={formData.levelAcc}
              onChange={handleChange}
              required
            >
              <option value="">Select level</option>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </div>
        <Form.Group className="mb-3" controlId="parentAcc">
          <Form.Label>Parent Acc</Form.Label>
          <Form.Select
            name="parentAcc"
            value={formData.parentAcc}
            onChange={handleChange}
            // disabled={
            //   formData.tipeAcc !== "General" ||
            //   parseInt(formData.levelAcc, 10) <= 1
            // }
            disabled={
              (formData.tipeAcc !== "General" &&
                formData.tipeAcc !== "Detail") || // Enable for "Detail" as well
              parseInt(formData.levelAcc, 10) <= 1
            }
          >
            <option value="">Select Parent Acc</option>
            {filteredParents.length > 0 ? (
              filteredParents.map((parent) => (
                <option key={parent.kodeAcc} value={parent.kodeAcc}>
                  {parent.namaAcc} ({parent.kodeAcc})
                </option>
              ))
            ) : (
              <option value="">No valid Parent Accounts available</option>
            )}
          </Form.Select>
        </Form.Group>
        <Form.Group className="mb-3" controlId="accGroup">
          <Form.Label>Acc Group</Form.Label>
          <Form.Select
            name="groupAcc"
            value={formData.groupAcc}
            onChange={handleChange}
            aria-label="Pilih Acc Group"
            disabled={formData.levelAcc > 1} // Disabled based on levelAcc
          >
            <option value="">Pilih Acc Group</option>
            <option value="Asset">Asset</option>
            <option value="Liabilities">Liabilities</option>
            <option value="Capital">Capital</option>
            <option value="Revenue">Revenue</option>
            <option value="COGS">COGS</option>
            <option value="Expenses">Expenses</option>
            <option value="Order Revenue">Order Revenue</option>
            <option value="Order Expenses">Order Expenses</option>
          </Form.Select>
        </Form.Group>
        <div className="row">
          <Form.Group className="mb-3 col-6" controlId="controlAcc">
            <Form.Label>Acc Control</Form.Label>
            <Form.Select
              name="controlAcc"
              value={formData.controlAcc}
              onChange={handleChange}
              aria-label="Account control"
              disabled={formData.levelAcc <= 1}
            >
              <option value="">Select account control</option>
              <option value="None">None</option>
              <option value="Cash/Bank">Cash/Bank</option>
              <option value="Acc Receivable">Acc Receivable</option>
              <option value="Acc Paylable">Acc Paylable</option>
              <option value="Fixed Asset">Fixed Asset</option>
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3 col-6" controlId="id_matauang">
            <Form.Label>Currency</Form.Label>
            <Form.Select
              name="id_matauang"
              value={formData.id_matauang}
              onChange={handleChange}
              aria-label="Select currency"
              // disabled={isGeneral}
              disabled={formData.levelAcc <= 1}
            >
              <option value="">Select Currency</option>
              {currencies.map((currency) => (
                <option key={currency.id} value={currency.id}>
                  {currency.ccy}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </div>

        <div className="form-check">
          <Form.Check
            type="checkbox"
            name="depart"
            label="Department"
            checked={formData.depart}
            onChange={handleChange}
            disabled={formData.levelAcc <= 1}
          />
        </div>
        <div className="form-check">
          <Form.Check
            type="checkbox"
            name="gainloss"
            label="Gain Loss"
            checked={formData.gainloss}
            onChange={handleChange}
            disabled={isGainLossDisabled}
            // disabled={formData.levelAcc <= 1}
          />
        </div>
        <div className="flex row mt-3">
          <Button variant="primary" className="col-3 " type="submit">
            Simpan
          </Button>
          <Button variant="danger" className="col-3 mx-3" type="submit">
            Batal
          </Button>
        </div>
      </Form>
    </div>
  );
}
