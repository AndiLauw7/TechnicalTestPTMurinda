/* eslint-disable no-unused-vars */
import { API } from "../config/api";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Button } from "react-bootstrap";
import Table from "react-bootstrap/Table";
import { useNavigate } from "react-router-dom";
export default function DataCurency() {
  const [mataUang, setMataUang] = useState([]);
  const getDataMataUang = async () => {
    try {
      const response = await API.get("/get-mata-uang");
      setMataUang(response.data.data);
      console.log(response.data.data);
    } catch (error) {
      console.log("get mata uang gagal", error);
    }
  };

  useEffect(() => {
    getDataMataUang();
  }, []);
  const navigate = useNavigate();
  return (
    <div className="d-flex justify-content-center mt-5">
      <div className="">
        <h3 className="d-flex justify-content-center">Data Currency</h3>
        <Button className="mt-3 mb-3">Add Currency</Button>
        <Button
          className="mt-3 mb-3 mx-3"
          variant="warning"
          onClick={() => navigate("/data-coa")}
        >
          Data COA
        </Button>
        {mataUang.length !== 0 ? (
          <div
            style={{
              width: "100%",
              maxHeight: "400px", // Membatasi tinggi tabel
              overflowY: "scroll", // Menambahkan scroll vertikal
              border: "1px solid #dee2e6", // Border untuk memberikan grid
              borderRadius: "8px",
            }}
          >
            <Table striped bordered hover responsive="sm">
              <thead
                style={{
                  position: "sticky",
                  top: 0,
                  backgroundColor: "#f8f9fa",
                  zIndex: 1,
                }}
              >
                <tr className="text-center">
                  <th>#</th>
                  <th>CCY</th>
                  <th>Currency Name</th>
                  <th>Rate</th>
                  <th>STD</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {mataUang.map((item, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{item.ccy}</td>
                    <td>{item.currencyName}</td>
                    <td>{item.rate}</td>
                    <td>{item.std}</td>
                    <td>
                      <div className="d-flex">
                        <Button className="mx-2" variant="success">
                          Update
                        </Button>
                        <Button className="" variant="danger">
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        ) : (
          <div className="text-center pt-5">
            <div className="mt-3 fw-bold">No data</div>
          </div>
        )}
      </div>
    </div>
  );
}
