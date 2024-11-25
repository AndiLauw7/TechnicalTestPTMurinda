/* eslint-disable no-unused-vars */
import { API } from "../config/api";
import React, { useState, useEffect } from "react";
import { Button, Form } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";

export default function UpdateCcy() {
  const navigate = useNavigate();
  const location = useLocation();

  // Mendapatkan data mata uang yang dikirimkan dari DataCurency
  const { ccyData } = location.state || {};

  // State untuk menyimpan form data
  const [formData, setFormData] = useState({
    ccy: "",
    currencyName: "",
    rate: "",
    std: "",
  });

  // Mengisi form dengan data yang ada pada saat halaman pertama kali dimuat
  useEffect(() => {
    if (ccyData) {
      setFormData({
        ccy: ccyData.ccy,
        currencyName: ccyData.currencyName,
        rate: ccyData.rate,
        std: ccyData.std,
      });
    }
  }, [ccyData]);

  // Fungsi untuk menangani perubahan nilai input form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Fungsi untuk mengirim data form ke API
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await API.patch(`/updateccy/${ccyData.id}`, formData);
      console.log("Currency updated successfully", response);
      navigate("/"); // Navigasi kembali ke halaman Data Currency setelah update
    } catch (error) {
      console.log("Update currency failed", error);
    }
  };

  return (
    <div className="container">
      <Form className="px-4 py-4 mx-auto my-5 col-6" onSubmit={handleSubmit}>
        <h1 className="text-center mb-3">Update Mata Uang</h1>
        <div className="mb-3 d-flex">
          <Button onClick={() => navigate("/")}>Back to Data Currency</Button>
        </div>

        <Form.Group className="mb-3" controlId="ccy">
          <Form.Label>Currency</Form.Label>
          <Form.Control
            type="text"
            name="ccy"
            value={formData.ccy}
            onChange={handleChange}
            placeholder="Enter currency code"
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="currencyName">
          <Form.Label>Currency Name</Form.Label>
          <Form.Control
            type="text"
            name="currencyName"
            value={formData.currencyName}
            onChange={handleChange}
            placeholder="Enter currency name"
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="rate">
          <Form.Label>Rate</Form.Label>
          <Form.Control
            type="number"
            name="rate"
            value={formData.rate}
            onChange={handleChange}
            placeholder="Enter rate"
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="std">
          <Form.Label>Std</Form.Label>
          <Form.Control
            type="text"
            name="std"
            value={formData.std}
            onChange={handleChange}
            placeholder="Enter standard"
          />
        </Form.Group>

        <div className="flex row mt-3">
          <Button variant="primary" className="col-3" type="submit">
            Save
          </Button>
          <Button
            variant="danger"
            className="col-3 mx-3"
            onClick={() => navigate("/")}
          >
            Cancel
          </Button>
        </div>
      </Form>
    </div>
  );
}
