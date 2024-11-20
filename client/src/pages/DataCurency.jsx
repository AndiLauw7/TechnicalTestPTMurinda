/* eslint-disable no-unused-vars */
import { API } from "../config/api";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import Table from "react-bootstrap/Table";
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
  return (
    <div>
      <p>INI MATA UANG</p>
      {mataUang.length !== 0 ? (
        <div
          style={{
            width: "500px",
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
              <tr>
                <th>#</th>
                <th>CCY</th>
                <th>Currency Name</th>
                <th>Rate</th>
                <th>STD</th>
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
  );
}
