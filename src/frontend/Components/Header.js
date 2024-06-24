import React, { useState,useContext } from "react";
import { Link } from "react-router-dom";
import logoDark from "../../Images/logo-dark.png";
import { userContext } from "../../context/userContext";
import "./../../Backend/Pages/Updatedcss/HeaderUpdatedStyle.css";




function Header({isChangeDynamicBusinessName}) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // const { userData } = useContext(userContext);
  const { userData, setUserData } = useContext(userContext);


  const handleLogout = () => {
    localStorage.clear();
    setUserData(null);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container">
        <Link to="/" className="navbar-brand">
          <img src={logoDark} className="img-fluid imagelogo"/>
        </Link>
        {/* <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button> */}
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
          {userData?.token ? (
            <>
          <li className="nav-item dropdown">
          <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
         
       
          <i className="bi bi-person-fill fs-4"></i> Hi,{" "}
              <span>{userData?.name}</span>


          </a>
          <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
            <li><Link className="dropdown-item" to="/dashboard" > <i className="fa fa-tachometer me-2 fs-5"></i> Dashboard</Link></li>
            <li><Link className="dropdown-item" to="/profile" ><i className="bi bi-person-fill me-2 fs-5"></i> Profile</Link></li>
            <li><Link className="dropdown-item" to="/" onClick={handleLogout}  > <i className="bi bi-box-arrow-right me-2 fs-5"></i> Logout</Link></li>
          </ul>
        </li>
        </>
        ) : (
        <>
        
            <li className="nav-item reg btn-login">
              <Link to="/register" className="nav-link RegisterButtonmainbar">
                Register
              </Link>
            </li>
            <li className="nav-item login btn-login">
              <Link to="/login" className="nav-link LoginButtonmainbar">
                Login
              </Link>
            </li>
            
    </>
  )}
          
          </ul>
        </div>
      </div>
    </nav>
  );
}
export default Header;
