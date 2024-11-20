/* eslint-disable no-undef */
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
  const [isGeneral, setIsGeneral] = useState(false);
  const [isDetail, setIsDetail] = useState(false);
  const [isGainLossDisabled, setIsGainLossDisabled] = useState(true); // State for disabling gainloss

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
    fetchCurrencies();
  }, []);

  const getParentAcc = (kodeAcc) => {
    if (kodeAcc.length === 1) return 0;
    if (kodeAcc.length === 2) return kodeAcc.slice(0, 1);
    if (kodeAcc.length === 3) return kodeAcc.slice(0, 2);
    if (kodeAcc.length === 5) return kodeAcc.slice(0, 3);
    if (kodeAcc.length === 7) return kodeAcc.slice(0, 5);
    if (kodeAcc.length === 8) return kodeAcc.slice(0, 5);
    return "";
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let autoGroupAcc = "";
    if (name === "kodeAcc") {
      const parentAcc = getParentAcc(value);
      const barisPertama = value.charAt(0);
      if (barisPertama === "1") autoGroupAcc = "Asset";
      else if (barisPertama === "2") autoGroupAcc = "Liabilities";
      else if (barisPertama === "3") autoGroupAcc = "Capital";
      else if (barisPertama === "4") autoGroupAcc = "Revenue";
      else if (barisPertama === "5") autoGroupAcc = "COGS";
      else if (barisPertama === "6") autoGroupAcc = "Expenses";
      else if (barisPertama === "7") autoGroupAcc = "Order Revenue";
      else if (barisPertama === "8") autoGroupAcc = "Order Expenses";
      setFormData({
        ...formData,
        [name]: value,
        parentAcc,
        groupAcc:
          formData.tipeAcc === "Detail" ? autoGroupAcc : formData.groupAcc,
      });
    } else if (name === "tipeAcc" && value === "General") {
      setIsGeneral(true);
      setIsDetail(false);
      setFormData({
        ...formData,
        [name]: value,
        levelAcc: "1",
      });
    } else if (name === "tipeAcc" && value === "Detail") {
      setIsGeneral(false);
      setIsDetail(true);
      const barisPertama = formData.kodeAcc.charAt(0);
      let autoGroupAcc = "";
      if (barisPertama === "1") autoGroupAcc = "Asset";
      else if (barisPertama === "2") autoGroupAcc = "Liabilities";
      else if (barisPertama === "3") autoGroupAcc = "Capital";
      else if (barisPertama === "4") autoGroupAcc = "Revenue";
      else if (barisPertama === "5") autoGroupAcc = "COGS";
      else if (barisPertama === "6") autoGroupAcc = "Expenses";
      else if (barisPertama === "7") autoGroupAcc = "Order Revenue";
      else if (barisPertama === "8") autoGroupAcc = "Order Expenses";
      setFormData({
        ...formData,
        [name]: value,
        groupAcc: autoGroupAcc,
      });
    } else if (name === "id_matauang") {
      const selectedCurrency = currencies.find(
        (currency) => currency.id === parseInt(value, 10)
      );
      const isIDR =
        selectedCurrency?.ccy === "IDR" || selectedCurrency?.ccy === "SGD";
      setIsGainLossDisabled(!isIDR); // Disable gainloss if currency is not IDR
      setFormData({
        ...formData,
        [name]: value,
        gainloss: isIDR ? formData.gainloss : false, // Reset gainloss to false if not IDR
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

    const currencyExists = currencies.some(
      (currency) => currency.id === parseInt(formData.id_matauang, 10)
    );

    if (!currencyExists && formData.id_matauang) {
      alert("The selected currency does not exist in the system.");
      setFormData({
        ...formData,
        id_matauang: "",
      });
      return;
    }

    try {
      const response = await API.post("/adddatacoa", formData);
      alert("Data saved successfully!");
      setFormData({
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
      setIsGeneral(false);
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
              aria-label="Account level"
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
        <Form.Group className="mb-3" controlId="accParent">
          <Form.Label>Acc Parent</Form.Label>
          <Form.Control
            type="text"
            name="parentAcc"
            value={formData.parentAcc}
            disabled={isGeneral}
            placeholder="Masukan kode dengan benar"
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="accGroup">
          <Form.Label>Acc Group</Form.Label>
          <Form.Select
            name="groupAcc"
            value={formData.groupAcc}
            onChange={handleChange}
            aria-label="Pilih Acc Group"
            disabled={isDetail}
          >
            <option value="">Pilih Acc Group</option>
            <option value="Asset">Asset</option>
            <option value="Liabilities">Liabilities</option>
            <option value="Capital">Capital</option>
            <option value="Revenue">Revenue</option>
            <option value="COGS">COGS</option>
            <option value="Expences">Expenses</option>
            <option value="Order Revenue">Order Revenue</option>
            <option value="Order Expences">Order Expenses</option>
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
              disabled={isGeneral}
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
              required
              disabled={isGeneral}
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
        <Form.Group className="mb-3" controlId="depart">
          <Form.Check
            type="checkbox"
            label="Departmental"
            name="depart"
            checked={formData.depart}
            onChange={handleChange}
            disabled={isGeneral}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="gainloss">
          <Form.Check
            type="checkbox"
            label="Gain/Loss"
            name="gainloss"
            checked={formData.gainloss}
            onChange={handleChange}
            disabled={isGainLossDisabled}
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    </div>
  );
}
