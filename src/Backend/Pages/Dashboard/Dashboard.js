import React, { useEffect, useState } from "react";
import TopSection from "../../Components/DashboardComp/TopSection";
import SectionTwo from "../../Components/DashboardComp/SectionTwo";
import { environmentVariables } from "../../../config/env.config";

const Dashboard = () => {
 
  
  return (
    <>
      <TopSection />
      <SectionTwo />
    </>
  );
};

export default Dashboard;
