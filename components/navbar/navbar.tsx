import React from "react";
import Styles from "./navbar.module.css";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Pro from "../images/pro+logo.png";
import MyImage from "../images/imageDiv";
import { NavItem, NavItemBtn } from "../utilityComponents";
import Link from "next/link";

type Navprops = {
  name: string;
};

const TopNavbar = ({ name }: Navprops) => {
  return (
    <div className="container-fluid" style={{ minHeight: "50px" }}>
      <nav className="navbar navbar-expand-lg navbar-light fixed-top backgroundBlueColor">
        <div className="container-fluid">
          <a className="navbar-brand arima fs-2" href="#">
            <span className="whitecolor">{name}</span>
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon">
              <i
                className="fas fa-bars"
                style={{ color: "#fff", fontSize: "28px" }}
              ></i>
            </span>
          </button>
          <div
            className="collapse navbar-collapse"
            id="navbarSupportedContent"
          >
            <div className="d-flex  justify-content-end navbar-nav container">
            <NavItem name="Home" url="#"/>
            <NavItem name="About Us" url="#about"/>
            <NavItem name="Services" url="#service"/>
            <NavItem name="Testimonies" url="#testimonies"/>
            <NavItem name="Contact Us" url="#contact"/>
            <Link href="/signup">
            <button style={{fontFamily:'Arima', backgroundColor: '#FFAC1C', color:'white'}} className=" p-2 btn  border-0 rounded shadow-lg ">
                            Get Started
                        </button>
            </Link>
            
            </div>
            
            
          </div>
        </div>
      </nav>
    </div>
  );
};
export default TopNavbar;
