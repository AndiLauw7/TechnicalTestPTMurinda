/* eslint-disable no-unused-vars */
import { API } from "../config/api";
import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import Table from "react-bootstrap/Table";
import { useNavigate } from "react-router-dom";

export default function DataCurency() {
  const [mataUang, setMataUang] = useState([]);
  const [idDelete, setDeleteId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1); // State untuk halaman saat ini
  const [itemsPerPage] = useState(5); // Jumlah item per halaman

  const navigate = useNavigate();

  // Fungsi untuk mengambil data mata uang
  const getDataMataUang = async () => {
    try {
      const response = await API.get("/get-mata-uang");
      setMataUang(response.data.data);
      console.log(response.data.data);
    } catch (error) {
      console.log("get mata uang gagal", error);
    }
  };

  const handleDelete = async (id) => {
    setDeleteId(id);
  };

  const deleteId = async (id) => {
    try {
      const response = await API.delete(`/delete-mata-uang/${id}`);
      getDataMataUang();
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdate = (item) => {
    navigate(`/updateccy/${item.id}`, {
      state: { ccyData: item },
    });
  };

  useEffect(() => {
    getDataMataUang();
    if (idDelete) {
      deleteId(idDelete);
    }
  }, [idDelete]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = mataUang.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(mataUang.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="d-flex justify-content-center mt-5">
      <div className="">
        <h3 className="d-flex justify-content-center">Data Currency</h3>
        <Button className="mt-3 mb-3" onClick={() => navigate("/add-currency")}>
          Add Currency
        </Button>
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
                {currentItems.map((item, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{item.ccy}</td>
                    <td>{item.currencyName}</td>
                    <td>{item.rate}</td>
                    <td>{item.std}</td>
                    <td>
                      <div className="d-flex">
                        <Button
                          className="mx-2"
                          variant="success"
                          onClick={() => handleUpdate(item)}
                        >
                          Update
                        </Button>
                        <Button
                          className=""
                          variant="danger"
                          onClick={() => handleDelete(item.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>

            {/* Pagination Controls */}
            <div className="d-flex justify-content-center mt-3 mb-3">
              <Button
                variant="light"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Prev
              </Button>
              {[...Array(totalPages)].map((_, index) => (
                <Button
                  key={index}
                  variant="light"
                  onClick={() => paginate(index + 1)}
                  active={currentPage === index + 1}
                >
                  {index + 1}
                </Button>
              ))}
              <Button
                variant="light"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
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
