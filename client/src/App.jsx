/* eslint-disable no-unused-vars */
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DataCurency from "./pages/DataCurency";
import DataCoa from "./pages/DataCoa";
import AddCoa from "./pages/AddCoa";
import AddCurrency from "./pages/addCurrency";
import UpdateCoa from "./pages/UpdateCoa";
import UpdateCcy from "./pages/UpdateCcy";

function App() {
  return (
    <>
      {/* <HomeMurinda /> */}
      <Routes>
        <Route exact path="/" element={<DataCurency />} />
        <Route exact path="/data-coa" element={<DataCoa />} />
        <Route exact path="/add-coa" element={<AddCoa />} />
        <Route exact path="/add-currency" element={<AddCurrency />} />
        <Route exact path="/update-coa/:id" element={<UpdateCoa />} />
        <Route exact path="/updateccy/:id" element={<UpdateCcy />} />
      </Routes>
    </>
  );
}

export default App;
