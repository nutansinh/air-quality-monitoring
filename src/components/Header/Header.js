import React from "react";
import "./Header.scss";

const Header = () => {
  return (
    <header className="aqi-header">
      <div className="aqi-header__logo">
        <span class="material-icons-outlined">air</span> <h2>AQM</h2>
      </div>
    </header>
  );
};

export default Header;
