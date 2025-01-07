import "./App.css";
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Signup from './components/Signup';
import Login from './components/Login';
import Home from './components/Home';
import PasswordChange from './components/PasswordChange';
import Profile from './components/Profile';
import Browse from './components/Browse';
import CreateAuction from "./components/CreateAuction";
import SpecificAuctionPage from "./components/SpecificAuctionPage";
// import Navbar from './components/Navbar';
// import TestComponent from './components/test';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Signup />} />
        {/* <Route path="/" element={<TestComponent />} /> */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/pass" element={<PasswordChange />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/browse" element={<Browse />} />
        <Route path="/createauction" element={<CreateAuction />} />
        <Route path="/auction/:auctionID" element={<SpecificAuctionPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;