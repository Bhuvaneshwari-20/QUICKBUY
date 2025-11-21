import React, { useContext, useState } from "react";
import "./LoginPopup.css";
import { assets } from "../../assets/assets";
import { StoreContext } from "../../Context/StoreContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const LoginPopup = ({ setShowLogin }) => {
  const { setToken, url } = useContext(StoreContext);
  const [currState, setCurrState] = useState("Login");
  const [otpSent, setOtpSent] = useState(false);
  const [userId, setUserId] = useState(null);
  const [otp, setOtp] = useState("");
  const [role, setRole] = useState("student");
  const [data, setData] = useState({
    name: "",
    email: "",
    phoneno: "",
    password: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  // --- REGISTER ---
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${url}/api/user/register`, { ...data, role });
      if (res.data.success) {
        toast.success("OTP sent to your phone");
        if (res.data.otp) toast.info(`Dev OTP: ${res.data.otp}`);
        setOtpSent(true);
        setUserId(res.data.userId);
      } else toast.error(res.data.message);
    } catch {
      toast.error("Error sending OTP");
    }
  };

  // --- VERIFY OTP ---
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${url}/api/user/verify-otp`, { userId, otp });
      if (res.data.success) {
        setToken(res.data.token);
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("role", res.data.role); // ✅ added
        toast.success("Account verified!");
        setShowLogin(false);
        if (res.data.role === "admin") {
          window.location.href = "http://localhost:5173//admin";
        } else {
          navigate("/");
        }
      } else toast.error(res.data.message);
    } catch {
      toast.error("Invalid OTP");
    }
  };

  // --- LOGIN ---
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${url}/api/user/login`, {
        phoneno: data.phoneno,
        password: data.password,
        role,
      });

      if (res.data.success) {
        setToken(res.data.token);
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("role", res.data.role);
        alert(localStorage.getItem("role"));
        toast.success("Login successful");
        setShowLogin(false);

        if (res.data.role === "admin") {
        // wait a bit to ensure localStorage write completes
        const token = encodeURIComponent(res.data.token);
        const role  = encodeURIComponent(res.data.role);
        setTimeout(() => {
        window.location.href = `http://localhost:5174/?token=${token}&role=${role}`;
          }, 300);
        } else {
          navigate("/");
        }
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      console.error(err);
      toast.error("Login failed");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (currState === "Login") handleLogin(e);
    else if (otpSent) handleVerifyOtp(e);
    else handleRegister(e);
  };

  return (
    <div className="login-popup">
      <form onSubmit={handleSubmit} className="login-popup-container fade-in">
        <div className="login-popup-title">
          <h2>{otpSent ? "Verify OTP" : currState}</h2>
          <img onClick={() => setShowLogin(false)} src={assets.cross_icon} alt="close" />
        </div>

        {!otpSent && (
          <div className="role-toggle">
            {["student", "staff", "admin"].map((r) => (
              <button
                key={r}
                type="button"
                className={role === r ? "active" : ""}
                onClick={() => setRole(r)}
              >
                {r.charAt(0).toUpperCase() + r.slice(1)}
              </button>
            ))}
          </div>
        )}

        <div className="login-popup-inputs">
          {currState === "Sign Up" && !otpSent && (
            <>
              <input name="name" value={data.name} onChange={onChangeHandler} placeholder="Name" required />
              <input name="email" value={data.email} onChange={onChangeHandler} placeholder="Email" required />
            </>
          )}
          {!otpSent && (
            <>
              <input name="phoneno" value={data.phoneno} onChange={onChangeHandler} placeholder="Phone" required />
              <input name="password" value={data.password} onChange={onChangeHandler} placeholder="Password" type="password" required />
            </>
          )}
          {!otpSent && currState === "Sign Up" && (
            <input name="confirmPassword" value={data.confirmPassword} onChange={onChangeHandler} placeholder="Confirm Password" type="password" required />
          )}
          {otpSent && (
            <input name="otp" value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="Enter OTP" />
          )}
        </div>

        <button type="submit">
          {otpSent ? "Verify OTP" : currState === "Login" ? "Login" : "Send OTP"}
        </button>

        {!otpSent && (
          <>
            <span
              className="forgot-password"
              onClick={() => {
                setShowLogin(false);
                navigate("/forgot-password");
              }}
            >
              Forgot Password?
            </span>
            <p>
              {currState === "Login" ? (
                <>Don’t have an account? <span onClick={() => setCurrState("Sign Up")}>Sign Up</span></>
              ) : (
                <>Already registered? <span onClick={() => setCurrState("Login")}>Login</span></>
              )}
            </p>
          </>
        )}
      </form>
    </div>
  );
};

export default LoginPopup;
