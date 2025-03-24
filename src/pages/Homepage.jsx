import React from 'react';
import { useParams } from 'react-router-dom';
import '../css/styles.css'; // Import the CSS file for styling

const Homepage = () => {
    useParams();
    const navigateToLogin = () => {
        window.location.href = '/login'; // Redirect to the login page
    };

    const navigateToCreateAccount = () => {
        window.location.href = '/create-account'; // Redirect to the create account page
    };

    return (
        <div className="homepage-container">
            <h1>Bem vindo ao CopperMind</h1>
            <div className="button-container">
                <button className="button" onClick={navigateToLogin}>Entrar</button>
                <button className="button" onClick={navigateToCreateAccount}>Criar conta</button>
            </div>
        </div>
    );
};

export default Homepage;