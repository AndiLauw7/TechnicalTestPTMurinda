/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { API } from "../config/api";
import { Button, Form } from "react-bootstrap";
import { useNavigate, useLocation, useParams } from "react-router-dom";

export default function UpdateCoa() {
  const navigate = useNavigate();
  const [dataCurrency, setDataCurrency] = useState([]);
 
  const [isGainLossDisabled, setIsGainLossDisabled] = useState(true);
  const [dataCoa, setDataCoa] = useState([]);
  const [Coa, setCoa] = useState([]);
  const [filteredParents, setFilteredParents] = useState([]);
  const [form, setForm] = useState({
    id: null,
    id_matauang: "",
    kodeAcc: "",
    namaAcc: "",
    tipeAcc: "",
    levelAcc: "",
    parentAcc: "",
    groupAcc: "",
    controlAcc: "",
    depart: false,
    gainloss: false,
  });
  const location = useLocation();
  console.log(location);

  const { id } = useParams();
  // console.log(id);

  // Fetch data mata uang (currency)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await API.get("/get-mata-uang");
        setDataCurrency(response.data?.data || []);
        console.log(response.data.data);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    const fetchDataCoa = async () => {
      try {
        const response = await API.get("/getdatacoa");
        setCoa(response.data.data);
        console.log(response.data.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchDataCoa();
    fetchData();
  }, []);

  // ini untuk nilai parent Acc ketika pertama kali dirender
  useEffect(() => {
    if (form.levelAcc > 1) {
      const levelBaru = parseInt(form.levelAcc, 10);
      const parents = Coa.filter(
        (item) => item.tipeAcc === "General" && item.levelAcc === levelBaru - 1
      );
      setFilteredParents(parents);
      if (parents.length > 0 && !form.parentAcc) {
        setForm((parentForm) => ({
          ...parentForm,
          parentAcc: parents[0].kodeAcc,
        }));
      }
    } else {
      setFilteredParents([]);
    }
  }, [form.levelAcc, Coa]);

  useEffect(() => {
    if (location.state) {
      setForm(location.state);
    } else {
      // Otherwise, fetch COA data using the id
      const fetchCoaData = async (id) => {
        try {
          const response = await API.get(`/getdatacoa/${id}`);
          console.log("API Response:", response.data.data);
          setDataCoa(response.data?.data || []);
          const coaData = response.data?.data || {};
          setForm({
            id: coaData.id || null,
            id_matauang: coaData.id_matauang || "",
            kodeAcc: coaData.kodeAcc || "",
            namaAcc: coaData.namaAcc || "",
            tipeAcc: coaData.tipeAcc || "",
            levelAcc: coaData.levelAcc || "",
            parentAcc: coaData.parentAcc || "",
            groupAcc: coaData.groupAcc || "",
            controlAcc: coaData.controlAcc || "",
            depart: coaData.depart || false, // Set checkbox sesuai dengan data dari API
            gainloss: coaData.gainloss || false, // Set checkbox sesuai dengan data dari API
          });
        } catch (error) {
          console.log("Error fetching COA data:", error);
        }
      };

      fetchCoaData(id);
      // console.log(fetchCoaData);
    }
  }, [location.state, id]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    // if (name === "levelAcc") {
    //   const levelBaru = parseInt(value, 10);
    //   setForm({
    //     ...form,
    //     [name]: value,
    //     parentAcc: "",
    //     groupAcc: "",
    //   });
    //   if (levelBaru > 1) {
    //     const parents = Coa.filter(
    //       (item) =>
    //         item.tipeAcc === "General" && item.levelAcc === levelBaru - 1
    //     );
    //     setFilteredParents(parents);
    //     if (parents.length > 0) {
    //       setForm((nilaiParents) => ({
    //         ...nilaiParents,
    //         parentAcc: parents[0].kodeAcc,
    //       }));
    //     }
    //   } else {
    //     setFilteredParents([]);
    //   }
    // } else if (name === "parentAcc") {
    //   const pilihParents = Coa.find(
    //     (item) =>
    //       parseInt(item.kodeAcc, 10) === parseInt(value, 10) &&
    //       item.levelAcc === parseInt(form.levelAcc, 10) - 1
    //   );
    //   if (!pilihParents) {
    //     alert("parent acc tidak valid");
    //     setForm({
    //       ...form,
    //       [name]: "",
    //       groupAcc: "",
    //     });
    //     return;
    //   }
    // } else if (name === "id_matauang") {
    //   const pilihCcy = dataCurrency.find(
    //     (currency) => currency.id === parseInt(value, 10)
    //   );
    //   const isCcy = pilihCcy?.ccy === "IDR" || pilihCcy?.ccy === "SGD";
    //   setIsGainLossDisabled(!isCcy);
    //   setForm({
    //     ...form,
    //     [name]: value,
    //     gainloss: isCcy ? form.gainloss : false,
    //   });
    //   setForm({
    //     ...form,
    //     [name]: type === "checkbox" ? checked : value,
    //   });
    // }

    if (type === "checkbox") {
      setForm({
        ...form,
        [name]: checked, // Prioritaskan perubahan manual untuk checkbox
      });
    } else if (name === "id_matauang") {
      const pilihCcy = dataCurrency.find(
        (currency) => currency.id === parseInt(value, 10)
      );
      const isCcy = pilihCcy?.std === "Y";
      // || pilihCcy?.ccy === "SGD";
      setIsGainLossDisabled(!isCcy);
      setForm({
        ...form,
        [name]: value,
        gainloss: isCcy ? form.gainloss : false,
      });
    } else {
      setForm({
        ...form,
        [name]: value,
      });
    }
  };

  // Handle update COA
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await API.patch(`/update-coa/${id}`, form);
      alert("Data successfully updated");
      navigate("/data-coa");
    } catch (error) {
      console.error("Error updating data:", error);
      alert("Failed to update data.");
    }
  };

  // Filter parents based on levelAcc
  // const filteredParents = Coa.filter(
  //   (coa) =>
  //     parseInt(coa.levelAcc, 10) < parseInt(form.levelAcc, 10) &&
  //     coa.levelAcc > 1
  // );

  // const filteredParents = Coa.filter((coa) => {
  //   const levelAcc = parseInt(coa.levelAcc, 10);
  //   const formLevel = parseInt(form.levelAcc, 10);

  //   // Check if levelAcc and formLevel are valid numbers before comparing
  //   return !isNaN(levelAcc) && !isNaN(formLevel) && levelAcc < formLevel;
  // });

  // console.log("ini filter parents", filteredParents);

  // Reset form to initial state
  const resetForm = () => {
    setForm({
      id: null,
      id_matauang: "",
      kodeAcc: "",
      namaAcc: "",
      tipeAcc: "",
      levelAcc: "",
      parentAcc: "",
      groupAcc: "",
      controlAcc: "",
      depart: false,
      gainloss: false,
    });
  };

  return (
    <div className="container">
      <Form className="px-4 py-4 mx-auto my-5 col-6" onSubmit={handleUpdate}>
        <h1 className="text-center mb-3">Update COA</h1>
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
            value={form.kodeAcc}
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
            value={form.namaAcc}
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
              value={form.tipeAcc}
              onChange={handleChange}
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
              value={form.levelAcc}
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
            value={form.parentAcc}
            onChange={handleChange}
            // disabled={
            //   parseInt(form.levelAcc, 10) <= 1}
            disabled={
              (form.tipeAcc !== "General" && form.tipeAcc !== "Detail") ||
              parseInt(form.levelAcc, 10) <= 1
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
              <option value="">No parents available</option>
            )}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3" controlId="accGroup">
          <Form.Label>Acc Group</Form.Label>
          <Form.Select
            name="groupAcc"
            value={form.groupAcc}
            onChange={handleChange}
            disabled={form.levelAcc > 1}
          >
            <option value="">Select Acc Group</option>
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
              value={form.controlAcc}
              onChange={handleChange}
              disabled={form.levelAcc <= 1}
            >
              <option value="">Select account control</option>
              <option value="None">None</option>
              <option value="Cash/Bank">Cash/Bank</option>
              <option value="Acc Receivable">Acc Receivable</option>
              <option value="Acc Payable">Acc Payable</option>
              <option value="Fixed Asset">Fixed Asset</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3 col-6" controlId="id_matauang">
            <Form.Label>Currency</Form.Label>
            <Form.Select
              name="id_matauang"
              value={form.id_matauang}
              onChange={handleChange}
              disabled={form.levelAcc <= 1}
            >
              <option value="">Select Currency</option>
              {(dataCurrency || []).map((currency) => (
                <option key={currency.id} value={currency.id}>
                  {currency.ccy} - {currency.currencyName}
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
            checked={form.depart}
            onChange={handleChange}
            disabled={form.levelAcc <= 1}
          />
        </div>

        <div className="form-check">
          <Form.Check
            type="checkbox"
            name="gainloss"
            label="Gain/Loss"
            checked={form.gainloss}
            onChange={handleChange}
            // disabled={form.levelAcc <= 1}
            disabled={isGainLossDisabled}
          />
        </div>

        <div className="mt-4">
          <Button type="submit" variant="primary">
            Save
          </Button>
          <Button className="ms-2" variant="secondary" onClick={resetForm}>
            Reset
          </Button>
        </div>
      </Form>
    </div>
  );
}
