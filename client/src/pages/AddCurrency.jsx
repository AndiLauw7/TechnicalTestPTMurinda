/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-unused-vars */
import React from "react";
import { API } from "../config/api";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button, Form } from "react-bootstrap";

export default function AddCurrency() {
  const [formData, setFormData] = useState({
    ccy: "",
    currencyName: "",
    rate: "",
    std: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.post("/add-mata-uang", formData);
      alert("Simpadn data Succes");
      navigate("/");
    } catch (error) {
      console.log("Error failed server eror", error);
      const serverMessage = error.response?.message || "error from server";
      alert(`Server error: ${serverMessage}`);
    }
  };

  return (
    <div className="container">
      <Form className="px-4 py-4 mx-auto my-5 col-6" onSubmit={handleSubmit}>
        <h1 className="text-center mb-3">Add Mata Uang</h1>
        <div className="mb-3">
          <Button onClick={() => navigate("/")}>Back Currency</Button>
        </div>
        <Form.Group className="mb-3" controlId="ccy">
          <Form.Label>Currency</Form.Label>
          <Form.Control
            type="text"
            name="ccy"
            value={formData.ccy}
            onChange={handleChange}
            placeholder="Enter account code"
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
            placeholder="Enter account name"
            required
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="rate">
          <Form.Label>Rate</Form.Label>
          <Form.Control
            type="text"
            name="rate"
            value={formData.rate}
            onChange={handleChange}
            placeholder="Enter account name"
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
            placeholder="Enter account name"
            // required
          />
        </Form.Group>

        <div className="flex row mt-3">
          <Button variant="primary" className="col-3 " type="submit">
            Simpan
          </Button>
          <Button
            variant="danger"
            className="col-3 mx-3"
            type="submit"
            onClick={() => navigate("/")}
          >
            Batal
          </Button>
        </div>
      </Form>
    </div>
  );
}
