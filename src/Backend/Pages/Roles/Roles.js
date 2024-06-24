// import React from "react";

import React, { useEffect, useState } from "react";
import Sidebar from "../../Components/Sidebar";
import { Outlet } from "react-router-dom";
import Header from "../../Components/Header";
import AddPermission from "./AddPermission.js";

const Roles = () => {
  return (
    <div>
      <AddPermission />
    </div>
  );
};

export default Roles;
