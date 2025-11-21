import React, { useState,useEffect } from "react";
import { Route, Routes} from "react-router-dom";
import Home from "./pages/Home/Home";
import Footer from "./components/Footer/Footer";
import Navbar from "./components/Navbar/Navbar";
import Cart from "./pages/Cart/Cart";
import LoginPopup from "./components/LoginPopup/LoginPopup";
import PlaceOrder from "./pages/PlaceOrder/PlaceOrder";
import Payment from "./pages/Payment/Payment";
import PaymentSuccess from "./pages/Payment/PaymentSuccess";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MyOrders from "../src/pages/MyOrders/MyOrders";

const App = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [role, setRole] = useState(localStorage.getItem("role"));
   

  // refresh role when token or role changes
   useEffect(() => {
    const storedRole = localStorage.getItem("role");
    setRole(storedRole);


  // ✅ If admin logs in, redirect to admin dashboard (separate app)
  if (storedRole === "fr") {
      window.location.href = "http://localhost:5174";
    }
  }, []);
  return (
    <>
      <ToastContainer />
      {showLogin && <LoginPopup setShowLogin={setShowLogin} />}
      <div className="app">
        <Navbar setShowLogin={setShowLogin} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/order" element={<PlaceOrder />} />
          {/* The payment component is now rendered from PlaceOrder, so this route can be simplified */}
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/myorders" element={<MyOrders />} />
        </Routes>
      </div>
      <Footer />
    </>
  );
};

export default App;
