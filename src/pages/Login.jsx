import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import axios from "axios"; // Import Axios for HTTP requests
import styles from "../css/login.module.css";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State for toggling password visibility
  const [loading, setLoading] = useState(false); // State for form submission
  const navigate = useNavigate(); // React Router hook for navigation

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload
    setLoading(true); // Start loading state

    try {
      // Sending login request to backend
      const response = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      // Assuming the response contains a token (adjust based on your API)
      const { token } = response.data;  // Example: { token: "your-jwt-token" }

      // Check if the token is available
      if (token) {
        // Store the token in localStorage (or sessionStorage)
        localStorage.setItem("authToken", token);

        setLoading(false); // Stop loading state
        navigate("/note"); // Redirect to /note
      } else {
        throw new Error("Token not found in response.");
      }
    } catch (error) {
      console.error("Login Error:", error.response?.data || error.message);
      alert("Login failed! Please check your credentials.");
      setLoading(false); // Stop loading state
    }
  };

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev); // Toggle password visibility
  };

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <h1>Entrar</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={styles.input}
          />
          <div className={styles.passwordField}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={styles.input}
            />
            <span
              className={styles.eyeIcon}
              onClick={handleTogglePassword}
              role="button"
            >
              <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
            </span>
          </div>
          <button type="submit" className={styles.button} disabled={loading}>
            {loading ? "Processing..." : "Entrar"}
          </button>
        </form>
        <Link to="/">Voltar ao início</Link>
      </div>
    </div>
  );
}
