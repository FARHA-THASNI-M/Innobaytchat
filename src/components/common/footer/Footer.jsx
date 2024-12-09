import React from "react";
import './Footer.css';
import { COMPANY } from "../../../constants";

const Footer = () => {
  return (
    <footer className="footer">
      {COMPANY.NAME} © {new Date().getFullYear()} . All rights reserved.
    </footer>
  );
};

export default Footer;
