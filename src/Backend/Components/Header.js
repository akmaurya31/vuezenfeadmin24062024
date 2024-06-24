import React, { useContext, useEffect, useRef, useState } from "react";
import Sidebar from "./Sidebar";
import logo from "../../Images/logo.webp";
import { userContext } from "../../context/userContext";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { environmentVariables } from "../../config/env.config";
// import io, { socketIOClient } from "socket.io-client";
import { countryContext } from "../../context/countryContext.js";
import "../Pages/Updatedcss/HeaderUpdatedStyle.css";
import Swal from "sweetalert2";
// const socket = io.connect(`${environmentVariables?.apiUrl}`);
function Header() {
  const navigate = useNavigate();
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const { allCountries, setAllCountries, activeCountry, setActiveCountry } =
    useContext(countryContext);
  const [isNewNotifications, setIsNewNotifications] = useState(false);
  const handleToggleSidebar = () => {};
  const [isNotificationPopUp, setIsNotificationPopUp] = useState(false);
  const [businessName, setBusinessName] = useState("");
  const [notificationsData, setNotificationsData] = useState([]);
  const [selectedTheme, setSelectedTheme] = useState("");
  const [selectThemeColor, setSelectThemeColor] = useState("");
  const [isBusiness, setIsBusiness] = useState(false);
  const [isStatus, setIsStatus] = useState(false);
  const [planName, setPlanName] = useState("");
  const [dynamicCurrencyName, setDynamicCurrencyName] = useState("");
  const [userPermission, setUserPermission] = useState([]);
  const { userData, setUserData, setIsUserLogin } = useContext(userContext);
  const handleLogout = () => {
    Swal.fire({
      title: "Logout Confirmation",
      text: "Are you sure you want to logout?",
      icon: "warning",
      showCancelButton: true,
      cancelButtonColor: "#d33",
      confirmButtonColor: "#3085d6",
      confirmButtonText: "Logout",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        let config = {
          method: "get",
          url: `${environmentVariables?.apiUrl}api/admin/user_logout`,
          withCredentials: true,
        };

        axios
          .request(config)
          .then((response) => {
            setUserData(null);
            setIsUserLogin(false);
            navigate("/");
          })
          .catch((error) => {
            toast.error(error?.response?.data?.message || error?.message);
          });
      }
    });
  };
  return (
    <>
      <header className="app-header">
        <Link
          to="/"
          className="app-header__logo HeaderlogoClass"
          href="index.html"
        >
          <img src={logo} />
        </Link>
        <div
          className="app-sidebar__toggle"
          data-toggle="sidebar"
          aria-label="Hide Sidebar"
        ></div>
        <ul className="app-nav" id="MobileBaarview">
          {/* <li className="notificationbell">
            <div className="notificationbellcontainer">
              <i class="fa fa-light fa-bell"></i>

              {isNewNotifications == true ? (
                <div className="notification-red-dot"></div>
              ) : (
                <></>
              )}
              {isNotificationPopUp ? (
                <div className="all-notifications-container">
                  {notificationsData &&
                    notificationsData?.length > 0 &&
                    notificationsData
                      .sort((a, b) => {
                        // Assuming both created_at and updated_at are in ISO format, you can use Date.parse
                        const timeA = Date.parse(a.updated_at || a.created_at);
                        const timeB = Date.parse(b.updated_at || b.created_at);

                        // Sort in descending order
                        return timeB - timeA;
                      })
                      .map((val) => (
                        <div
                          className="notifications-content"
                          style={
                            val?.is_new == "1"
                              ? {
                                  background: "white",
                                }
                              : {}
                          }
                          onClick={() => {
                            if (val?.notification_type == "appointment") {
                              navigate("/appoinments");
                            } else if (val?.notification_type == "contact") {
                              navigate("/contact");
                            }
                            setIsNotificationPopUp(false);
                          }}
                        >
                          <div>
                            {val?.notification_text?.replace("and", "an")}
                          </div>
                          <div className="notification-time">
                            {convertNotificationTime(val?.created_at)}
                          </div>
                        </div>
                      ))}
                </div>
              ) : (
                <></>
              )}
            </div>
          </li> */}

          <div className="Header_menubarstyle" onClick={handleToggleSidebar}>
            <i class="fa fa-bars" aria-hidden="true"></i>
          </div>
          <li
            style={{ display: "flex", gap: "10px" }}
            className="dropdown"
            id="dropdown_midmenu_mobile_view"
          >
            <div className="app-nav__item btnhead profilenmae">
              <select
                style={{border:"0 !important"}}
                value={activeCountry}
                onChange={(e) => setActiveCountry(e.target.value)}
              >
                {allCountries &&
                  allCountries.map((val) => (
                    <option value={val?.country_code}>{val?.country}</option>
                  ))}
              </select>
            </div>
            <div
              className="app-nav__item btnhead profilenmae"
              data-bs-toggle="dropdown"
              aria-label="Open Profile Menu"
            >
              <i className="bi bi-person-fill fs-4 d-none"></i>Hi,
              <span>{userData?.name}</span>
            </div>
            <ul className="dropdown-menu settings-menu dropdown-menu-right">
              <li>
                <Link to="/profile" className="dropdown-item">
                  <i className="bi bi-person-fill me-2 fs-5"></i> Profile
                </Link>
              </li>
              <li>
                <Link onClick={handleLogout} className="dropdown-item">
                  <i className="bi bi-box-arrow-right me-2 fs-5"></i> Logout
                </Link>
              </li>
            </ul>
          </li>
        </ul>

        <Sidebar
          isSidebarVisible={isSidebarVisible}
          handleToggleSidebar={handleToggleSidebar}
        />
      </header>

      <ToastContainer />
    </>
  );
}
export default Header;
//1212
