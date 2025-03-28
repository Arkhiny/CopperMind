import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import axios from "axios"; // Import Axios for HTTP requests
import styles from "../css/login.module.css";

export default function CreateAccountPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const [loading, setLoading] = useState(false); // State for form submission
  const navigate = useNavigate(); // React Router hook for navigation

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[\W_]/.test(password)) strength++;
    if (password.length >= 12) strength++;
    return strength;
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setPasswordStrength(calculatePasswordStrength(newPassword));
  };

  const getProgressBarColor = () => {
    switch (passwordStrength) {
      case 1:
        return "red";
      case 2:
        return "orange";
      case 3:
        return "green";
      case 4:
      case 5:
        return "#00C853"; // Vibrant green
      default:
        return "transparent";
    }
  };

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev); // Toggle password visibility
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload
    setLoading(true); // Start loading state

    try {
      await axios.post("http://localhost:5000/api/auth/register", {
        name,
        email,
        password,
      });

      setLoading(false); // Stop loading state
      navigate("/note"); // Redirect to login page
    } catch (error) {
      console.log("Sending data:", { name, email, password });
      console.error("Registration Error:", error.response?.data || error.message);
      alert("Registration failed! Please try again.");
      setLoading(false); // Stop loading state
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <h1>Criar conta</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className={styles.input}
          />
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
              type={showPassword ? "text" : "password"} // Toggle type
              placeholder="Senha"
              value={password}
              onChange={handlePasswordChange}
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
          <div className={styles.progressBar}>
            <div
              className={styles.progress}
              style={{
                width: `${passwordStrength * 20}%`,
                backgroundColor: getProgressBarColor(),
              }}
            ></div>
          </div>
          <button type="submit" className={styles.button} disabled={loading}>
            {loading ? "Processing..." : "Criar"}
          </button>
        </form>
        <Link to="/">Voltar ao início</Link>
      </div>
    </div>
  );
}