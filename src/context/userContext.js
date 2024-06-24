import { createContext } from "react";

export const userContext = createContext(
  JSON.parse(localStorage.getItem("user"))
);
