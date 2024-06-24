// import React from "react";

import React, { useEffect, useState } from "react";
import Sidebar from "../../Components/Sidebar.js";
import { Outlet } from "react-router-dom";
import Header from "../../Components/Header.js";
import AddApiEndpoint from "./AddApiEndpoint.js";

const ApiEndpoint = () => {
  return (
    <div>
      <AddApiEndpoint />
    </div>
  );
};

export default ApiEndpoint;
