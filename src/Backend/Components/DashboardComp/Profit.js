import React, { useContext, useEffect, useState } from "react";
import { environmentVariables } from "../../../config/env.config.js";
import "./Dashboard.scss";
import axios from "axios";
import { countryContext } from "../../../context/countryContext.js";
import { Card } from "react-bootstrap";

const Profit = () => {
  const { activeCountry } = useContext(countryContext);
  const [filterParams, setFilterParams] = useState("");
  const [profitData, setProfitData] = useState([]);

  const getRevenueGraphData = () => {
    let url = `${
      environmentVariables?.apiUrl
    }api/admin/dashboard_data/get_profit?country_code=${activeCountry}&${
      filterParams || "this_week"
    }=true`;
    let config = {
      method: "get",
      url: url,
      maxBodyLength: Infinity,
      withCredentials: true,
    };
    axios
      .request(config)
      .then((response) => {
        if (response.data?.data) {
          setProfitData(response.data?.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  useEffect(() => {
    getRevenueGraphData();
  }, [filterParams, activeCountry]);
  return (
    <div className="profit">
      <div className="profit-top">
        <div className="profit-heading">
          <h2>Total Profit</h2>
          <h3>Profit get across all channels</h3>
        </div>
        <div className="profit-filter">
          <select
            value={filterParams}
            onChange={(e) => setFilterParams(e.target.value)}
          >
            <option value={"this_week"}>7 Days</option>
            <option value={"this_month"}>1 Month</option>
            <option value={"this_year"}>1 Year</option>
          </select>
        </div>
      </div>

      <Card style={{ width: "100%", border: "none", padding: "1rem" }}>
        <div className="profit-stats-all">
          <div className="profit-stats1-main">
            <div className="profit-stats1">
              <h2>
                {activeCountry == "IN"
                  ? "₹"
                  : activeCountry == "AE"
                  ? "د.إ"
                  : activeCountry == "US"
                  ? "$"
                  : "₹"}
                {profitData?.sellingPrice}
              </h2>
              <h3>Selling Amount</h3>
            </div>
          </div>

          <div className="profit-stats1-main">
            <div className="profit-stats1">
              <h2>
                {activeCountry == "IN"
                  ? "₹"
                  : activeCountry == "AE"
                  ? "د.إ"
                  : activeCountry == "US"
                  ? "$"
                  : "₹"}
                {profitData?.costPrice}
              </h2>
              <h3>Total Purchase Cost</h3>
            </div>
          </div>
          <div className="profit-stats1-main">
            <div className="profit-stats1">
              <h2>
                {activeCountry == "IN"
                  ? "₹"
                  : activeCountry == "AE"
                  ? "د.إ"
                  : activeCountry == "US"
                  ? "$"
                  : "₹"}
                {profitData?.profit}
              </h2>
              <h3>Net Profit/Loss</h3>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Profit;
