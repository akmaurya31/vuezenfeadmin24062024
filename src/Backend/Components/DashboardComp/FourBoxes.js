import React from "react";
import SingleBox from "./SingleBox";
import SingleBoxUser from "./SingleBoxUser";

const FourBoxes = () => {
  return (
    <>
      <div className="fourboxes-main">
        <SingleBox />
        <SingleBoxUser />
      </div>
    </>
  );
};

export default FourBoxes;
