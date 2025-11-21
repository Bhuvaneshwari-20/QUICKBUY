import React, { useState, useContext } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { StoreContext } from "../../Context/StoreContext";
import BackButton from "../../components/BackButton/BackButton";

const ResetPassword = () => {
  const { url } = useContext(StoreContext);
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await axios.post(`${url}/api/user/reset-password`, { token, password });
    res.data.success ? (toast.success(res.data.message), navigate("/")) : toast.error(res.data.message);
  };

  return (
    <div className="reset-container">
      <BackButton />
      <h2>Reset Password</h2>
      <form onSubmit={handleSubmit}>
        <input type="password" placeholder="Enter new password" onChange={(e) => setPassword(e.target.value)} />
        <button type="submit">Reset Password</button>
      </form>
    </div>
  );
};

export default ResetPassword;
