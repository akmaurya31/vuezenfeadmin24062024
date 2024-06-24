import React, { useEffect, useState } from "react";
import Sidebar from "../../Components/Sidebar";
import { Outlet } from "react-router-dom";
import Header from "../../Components/Header";
import AddCategory from "./AddCategory";

export const Category = () => {
  return (
    <div>
      <AddCategory />
    </div>
  );
};
