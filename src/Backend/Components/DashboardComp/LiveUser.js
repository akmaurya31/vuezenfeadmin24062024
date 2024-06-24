import React, { useEffect, useState } from "react";
import axios from "axios";
import { environmentVariables } from "../../../config/env.config";

const LiveUser = () => {
  const [resData, setResData] = useState([]);

  const getLiveUsers = () => {
    let config = {
      method: "get",
      url: `${environmentVariables?.apiUrl}api/admin/dashboard_data/fetch_live_insights_clarity`,
      withCredentials: true,
    };

    axios
      .request(config)
      .then((response) => {
        console.log(response.data, "[[");
        const trafficData = response?.data?.data?.filter((item) =>
          item?.metricName?.toLowerCase()?.includes("traf")
        );
        console.log("....", trafficData);
        setResData(trafficData);
      })
      .catch((error) => {
        console.log(error);
        setResData();
      });
  };

  useEffect(() => {
    getLiveUsers();
  }, []);

  console.log(resData, "resData");

  useEffect(() => {
    // for()
  }, [resData]);

  return (
    <div style={{ marginTop: "30px" }}>
      <div>Live Users</div>
      <div>{resData?.[0]?.information?.[0]?.distinctUserCount}</div>
    </div>
  );
};

export default LiveUser;
