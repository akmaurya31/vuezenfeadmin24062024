import React, { useState, useEffect } from "react";
import { Outlet, useParams, useLocation } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
function Layout({
  businessId,
  setBusinessId,
  isChangeDynamicBusinessName,
  dynamicBusinessName,
  setDynamicBusinessName,
}) {
  const location = useLocation();
  const currentPath = location?.pathname?.split("/");
  const [loc, setLoc] = useState("");
  const [viewNavbar, setViewNavbar] = useState(false);
  const [params, setParams] = useState();
  useEffect(() => {
    if (currentPath && currentPath.length > 1) {
      setLoc(currentPath[1]);
    }
  }, [currentPath]);

  return (
    <>
      {loc === "ViewCardDownload" ? (
        <>
          <main>
            <Outlet />
          </main>
        </>
      ) : (
        <>
          <Header
            businessId={businessId}
            dynamicBusinessName={dynamicBusinessName}
            setDynamicBusinessName={setDynamicBusinessName}
            setBusinessId={setBusinessId}
            isChangeDynamicBusinessName={isChangeDynamicBusinessName}
          />

          <main>
            <Outlet />
          </main>
          <Footer />
        </>
      )}
    </>
  );
}
export default Layout;
//612
