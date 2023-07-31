import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Wrapper from "./components/Wrapper";

import SessionProvider from "./containers/SessionProvider";

import Homepage from "./containers/Homepage/index";

import AccountSettings from "./containers/Fixtures";

function App() {
  return (
    <SessionProvider>
      <BrowserRouter>
        <Wrapper>
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/fixtures" element={<AccountSettings />} />
          </Routes>
        </Wrapper>
      </BrowserRouter>
    </SessionProvider>
  );
}

export default App;
