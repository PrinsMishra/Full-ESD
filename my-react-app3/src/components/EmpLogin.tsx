

import { GoogleLogin } from "@react-oauth/google";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../api/axios"; // your axios instance
// import './App.css'; // Make sure this CSS is linked in your main App file or index file

function EmpLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // const [error, setError] = useState(""); // Removed in favor of toast
  //const [rememberMe, setRememberMe] = useState(false); // Added for the design element

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    // setError("");

    try {
      // 🔥 Call backend API
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      // 🔥 Save JWT token in localStorage
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userEmail", email);
      localStorage.setItem("userPhoto", "https://ui-avatars.com/api/?name=" + email + "&background=random");

      toast.success("Login Successful!");
      // Redirect to dashboard
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      // setError("Invalid email or password");
      toast.error("Invalid email or password");
    }
  };

  return (
    <div className="app-main-layout"> {/* Use a main container class for centering */}
      <div className="login-container">

        {/* Left Side: Login Form (matches login-form-panel in CSS) */}
        <div className="login-form-panel">
          <header>
            <span className="logo">ERP</span>
            <h1>Employee Login Portal</h1>
            <p className="tagline">Hey, welcome  to your Acedemic Portal</p>
            <br />
          </header>

          <form onSubmit={handleLogin} className="login-form">

            {/* Email Input */}
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            {/* Password Input */}
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <br />
            <br />



            {/* Login Button */}
            <button type="submit" className="sign-in-btn">Sign In</button>
            <div style={{ marginTop: "20px" }}>
              <GoogleLogin
                onSuccess={(credentialResponse) => {
                  const googleToken = credentialResponse.credential;
                  const decoded: any = credentialResponse.credential ? JSON.parse(atob(credentialResponse.credential.split('.')[1])) : {};

                  api.post("/auth/google", { token: googleToken })
                    .then((res) => {
                      localStorage.setItem("token", res.data.token);
                      localStorage.setItem("userEmail", decoded.email);
                      localStorage.setItem("userPhoto", decoded.picture);

                      toast.success("Google Login Successful!");
                      navigate("/dashboard");
                    })
                    .catch(() => {
                      toast.error("Google Login Failed or Not Allowed");
                    });
                }}
                onError={() => {
                  toast.error("Google Login Failed");
                }}
              />
            </div>
            {/* Error Message - Removed */}
            {/* {error && <p className="error-message">{error}</p>} */}
          </form>
        </div>

        {/* Right Side: Illustration/Visuals (matches login-illustration-panel in CSS) */}
        <div className="login-illustration-panel">
          {/* The image (erpimage.webp) will be set as a background in App.css */}
        </div>

      </div>
    </div>
  );
}

export default EmpLogin;