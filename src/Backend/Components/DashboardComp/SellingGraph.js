import React, { useContext, useEffect, useState } from "react";
import ordersIcon from "../../../Images/orders.png";
import outStockIcon from "../../../Images/outstock.png";
import shippedIcon from "../../../Images/shipped.png";
import { environmentVariables } from "../../../config/env.config.js";
import "./Dashboard.scss";
import axios from "axios";
import Chart from "react-apexcharts";
import { countryContext } from "../../../context/countryContext.js";
import Profit from "./Profit.js";
import LiveUser from "./LiveUser.js";

const SellingGraph = () => {
  const [countData, setCountData] = useState(null);
  const { activeCountry } = useContext(countryContext);
  const [filterParams, setFilterParams] = useState("");
  const [xAxisData, setXAxisData] = useState([]);
  const [yAxisData, setYAxisData] = useState([]);

  const getRevenueGraphData = () => {
    let url;
    if (filterParams == "all") {
      url = `${environmentVariables?.apiUrl}api/admin/order/get_graph_data_subtotal?country_code=${activeCountry}`;
    } else {
      url = `${environmentVariables?.apiUrl}api/admin/order/get_graph_data_subtotal?country_code=${activeCountry}&${filterParams}=true`;
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
        if (response.data?.data?.length > 0) {
          let xaxis = [];
          let yaxis = [];

          response.data.data.forEach((val) => {
            xaxis.push(val?.order_date.split("T")[0]);
            yaxis.push(val?.revenue);
          });
          setXAxisData(xaxis);
          setYAxisData(yaxis);
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

    axios
      .request(config)
      .then((response) => {
        // console.log(response.data.data);
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
  return (
    <div>
      <div className="sellinggraph-Heading">
        <h1>Ecommerce Dashboard</h1>
        <p>Here’s what’s going on at your business right now</p>
      </div>
      <div className="sellinggraph-stats-all">
        <div className="sellinggraph-stats1-main">
          <img src={ordersIcon} />
          <div className="sellinggraph-stats1">
            <h2>{countData?.new_order_count} new orders</h2>
            <h3>Awating processing</h3>
          </div>
        </div>

        <div className="sellinggraph-stats1-main">
          <img src={outStockIcon} />
          <div className="sellinggraph-stats1">
            <h2>{countData?.cancelled_order_count} orders</h2>
            <h3>Cancelled</h3>
          </div>
        </div>

        <div className="sellinggraph-stats1-main">
          <img src={shippedIcon} />
          <div className="sellinggraph-stats1">
            <h2>{countData?.productOutOfStockCount} products</h2>
            <h3>Out of stock</h3>
          </div>
        </div>
      </div>

      <div className="totalsells-main">
        <div className="totalsells-heading">
          <h2>Total Sales</h2>
          <h3>Payment received across all channels</h3>
        </div>
        <div className="totalsells-filter">
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
      <div>
        <Chart
          options={{
            chart: {
              id: "basic-bar",
            },
            xaxis: {
              categories: xAxisData,
            },
            stroke: {
              width: 1,
            },
          }}
          series={[
            {
              name: "series-1",
              data: yAxisData,
            },
          ]}
        />
      </div>

      <ssctionTwo />
      <Profit />
      <LiveUser />
    </div>
  );
};

export default SellingGraph;
