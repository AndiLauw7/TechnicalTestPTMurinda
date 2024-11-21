/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { API } from "../config/api";
import Table from "react-bootstrap/Table";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
export default function DataCoa() {
  const [dataCoa, setDataCoa] = useState([]);
  const navigate = useNavigate();

  const getDataCoa = async () => {
    try {
      const response = await API.get("/getdatacoa");
      setDataCoa(response.data.data);
      console.log(response.data.data);
    } catch (error) {
      console.log("Get data CoA gagal", error);
    }
  };

  useEffect(() => {
    getDataCoa();
  }, []);

  return (
    <div className="">
      <div className="container mt-5 flex item-end">
        <Button
          className="mt-3 mb-3"
          onClick={() => {
            navigate("/add-coa");
          }}
        >
          Add Coa
        </Button>
        <Button
          variant="warning"
          className="mt-3 mb-3 mx-3"
          onClick={() => {
            navigate("/");
          }}
        >
          Data Mata Uang.
        </Button>
        {dataCoa.length !== 0 ? (
          <div
            style={{
              width: "100%",
              maxHeight: "400px",
              overflowY: "scroll",
              border: "1px solid #dee2e6",
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
                  <th>No</th>
                  <th>Kode Acc</th>
                  <th>Nama Acc</th>
                  <th>Ccy</th>
                  <th>Group Acc</th>
                  <th>Acc Type</th>
                  <th>Level</th>
                  <th>Dept</th>
                  <th>Gain Los</th>
                  <th>Controll Acc</th>
                  <th>Parent Acc</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {dataCoa.map((item, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{item.kodeAcc}</td>
                    <td>{item.namaAcc}</td>
                    <td>{item.tb_mtuang?.ccy || ""}</td>
                    <td>{item.groupAcc}</td>
                    <td>{item.tipeAcc}</td>
                    <td>{item.levelAcc}</td>
                    <td>{Number(item.depart) === 1 ? "Y" : ""}</td>
                    <td>{Number(item.gainloss) === 1 ? "Y" : ""}</td>
                    <td>{item.controlAcc}</td>
                    <td>{item.parentAcc === 0 ? "" : item.parentAcc}</td>
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
