import React from "react";
import { FaLightbulb } from "react-icons/fa";

function Header() {
  return (
    <header className="header" data-testid="header">
      <h1>
        <FaLightbulb /> 
        CopperMind
      </h1>
    </header>
  );
}

export default Header;