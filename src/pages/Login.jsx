import { useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import styles from "../css/login.module.css";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State for toggling password visibility

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your account creation logic here
    console.log("Email:", email, "Password:", password);
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
          <button type="submit" className={styles.button}>
            Entrar
          </button>
        </form>
        <Link to="/">Voltar ao início</Link>
      </div>
    </div>
  );
}