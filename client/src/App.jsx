/* eslint-disable no-unused-vars */
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DataCurency from "./pages/DataCurency";
import DataCoa from "./pages/DataCoa";
import AddCoa from "./pages/AddCoa";

function App() {
  return (
    <>
      {/* <HomeMurinda /> */}
      <Routes>
        <Route exact path="/" element={<DataCurency />} />
        <Route exact path="/data-coa" element={<DataCoa />} />
        <Route exact path="/add-coa" element={<AddCoa />} />
      </Routes>
    </>
  );
}

export default App;
