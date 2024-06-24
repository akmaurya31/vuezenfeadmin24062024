import React, { useContext, useEffect, useState } from "react";
import { environmentVariables } from "../../../config/env.config.js";
import "./Dashboard.scss";
import axios from "axios";
import { countryContext } from "../../../context/countryContext.js";
import { Card } from "react-bootstrap";

const Profit = () => {
<<<<<<< HEAD
    const { activeCountry } = useContext(countryContext);
    const [filterParams, setFilterParams] = useState("");
    const [profitData, setProfitData] = useState([]);
=======
  const [countData, setCountData] = useState(null);
  const { activeCountry } = useContext(countryContext);
  const [filterParams, setFilterParams] = useState("");
  const [profitData, setProfitData] = useState([]);
>>>>>>> d869a821fc7ff8190db5da6063085773444051db

  const getRevenueGraphData = () => {
    let url;
    if (filterParams == "all") {
      url = `${environmentVariables?.apiUrl}api/admin/dashboard_data/get_profit?country_code=${activeCountry}`;
    } else {
      url = `${environmentVariables?.apiUrl}api/admin/dashboard_data/get_profit?country_code=${activeCountry}&${filterParams}=true`;
    }
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
  const getCountData = () => {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${environmentVariables?.apiUrl}api/admin/dashboard_data/get_data?country_code=${activeCountry}`,
      withCredentials: true,
    };
<<<<<<< HEAD
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
                        <option selected={true} value={"all"}>
                            All
                        </option>
                    </select>
                </div>
            </div>

            <Card style={{ width: '100%', border: 'none', padding: '1rem' }}>
                <div className="profit-stats-all">
                    <div className="profit-stats1-main">
                        <div className="profit-stats1">
                            <h2>₹{profitData?.sellingPrice}</h2>
                            <h3>Selling Price</h3>
                        </div>
                    </div>

                    <div className="profit-stats1-main">
                        <div className="profit-stats1">
                            <h2>₹{profitData?.costPrice}</h2>
                            <h3>Cost Price</h3>
                        </div>
                    </div>
                    <div className="profit-stats1-main">
                        <div className="profit-stats1">
                            <h2>₹{profitData?.profit}</h2>
                            <h3>Profit</h3>
                        </div>
                    </div>
                </div>
            </Card>
=======

    axios
      .request(config)
      .then((response) => {
        console.log(response.data.data);
        setCountData(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  useEffect(() => {
    getCountData();
  }, [activeCountry]);
  useEffect(() => {
    getRevenueGraphData();
  }, [filterParams, activeCountry]);
  console.log("activeCountry", activeCountry);
  return (
    <div>
      <div className="profit">
        <div className="profit-heading">
          <h2>Total Profit</h2>
          <h3>Profit get across all channels</h3>
>>>>>>> d869a821fc7ff8190db5da6063085773444051db
        </div>
        <div className="profit-filter">
          <select
            value={filterParams}
            onChange={(e) => setFilterParams(e.target.value)}
          >
            <option value={"this_week"}>7 Days</option>
            <option value={"this_month"}>1 Month</option>
            <option value={"this_year"}>1 Year</option>
            <option selected={true} value={"all"}>
              All
            </option>
          </select>
        </div>
      </div>

      <Card style={{ width: "100%", border: "none", padding: "1rem" }}>
        <ListGroup variant="flush">
          <ListGroup.Item>
            Selling Price:{" "}
            {activeCountry == "IN"
              ? "₹"
              : activeCountry == "AE"
              ? "د.إ"
              : activeCountry == "US"
              ? "$"
              : "₹"}
            {profitData?.sellingPrice}
          </ListGroup.Item>
          <ListGroup.Item>
            Cost Price:{" "}
            {activeCountry == "IN"
              ? "₹"
              : activeCountry == "AE"
              ? "د.إ"
              : activeCountry == "US"
              ? "$"
              : "₹"}
            {profitData?.costPrice}
          </ListGroup.Item>
          <ListGroup.Item>
            Profit:{" "}
            {activeCountry == "IN"
              ? "₹"
              : activeCountry == "AE"
              ? "د.إ"
              : activeCountry == "US"
              ? "$"
              : "₹"}
            {profitData?.profit}
          </ListGroup.Item>
        </ListGroup>
      </Card>
    </div>
  );
};

export default Profit;
