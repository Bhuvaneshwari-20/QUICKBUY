import React, { useState, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { StoreContext } from "../../Context/StoreContext";
import BackButton from "../../components/BackButton/BackButton";
import "./ForgotPassword.css";

const ForgotPassword = () => {
  const { url } = useContext(StoreContext);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${url}/api/user/forgot-password`, { email });
      if (res.data.success) toast.success("Reset link sent to your email!");
      else toast.error(res.data.message);
    } catch (error) {
      toast.error("Failed to send reset link");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-page">
      <BackButton />
      <div className="forgot-box">
        <h1>Forgot Password</h1>
        <p>Enter your registered email to receive a password reset link.</p>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
          />
          <button type="submit" disabled={loading}>
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
      </div>
    </div>
  );
};
export default ForgotPassword;
