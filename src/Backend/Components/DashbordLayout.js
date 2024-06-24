import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";

function DashbordLayout() {
  const [viewNavbar, setViewNavbar] = useState(false);

  useEffect(() => {
    const params = window.location.pathname;
    if (params == "/") {
      setViewNavbar(false);
    } else {
      setViewNavbar(true);
    }
  }, []);
  return (
    <div>
      {viewNavbar && <Header />}
      <Sidebar />
      <main className="app-content">
        <Outlet />
      </main>
    </div>
  );
}

export default DashbordLayout;
