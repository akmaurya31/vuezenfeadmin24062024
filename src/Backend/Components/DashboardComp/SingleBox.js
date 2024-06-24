import React, { useContext, useEffect, useState } from "react";
import "../../../App.scss";
import "./Dashboard.scss";
import { environmentVariables } from "../../../config/env.config";
import { countryContext } from "../../../context/countryContext";
import axios from "axios";
import Chart from "react-apexcharts";
const SingleBox = () => {
  const [orderGraphData, setOrderGraphData] = useState(null);
  const { activeCountry } = useContext(countryContext);
  const [filterKey, setFilterKey] = useState("all");
  const [xAxisData, setXAxisData] = useState([]);
  const [yAxisData, setYAxisData] = useState([]);
  const getOrderGraphData = () => {
    let url;
    if (filterKey == "all") {
      url = `${environmentVariables?.apiUrl}api/admin/order/get_graph_data_order?country_code=${activeCountry}`;
    } else {
      url = `${environmentVariables?.apiUrl}api/admin/order/get_graph_data_order?${filterKey}=true&country_code=${activeCountry}`;
    }
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: url,
      withCredentials: true,
    };

    axios
      .request(config)
      .then((response) => {
        setOrderGraphData(response.data);
        if (response.data?.data.length > 0) {
          let xaxis = [];
          let yaxis = [];
          response.data.data.forEach((val) => {
            xaxis.push(val?.order_date);
            yaxis.push(val?.orders);
          });
          setXAxisData(xaxis);
          setYAxisData(yaxis);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  useEffect(() => {
    getOrderGraphData();
  }, [activeCountry, filterKey]);
  return (
    <>
      <div className="singlebox-main">
        <div className="singlebox-header">
          <div className="singlebox-header-left">
            <h2>Total Orders</h2>
          </div>
          <h4>{orderGraphData?.totalOrders}</h4>
        </div>

        <div className="totalsells-filter">
          <select
            onChange={(e) => setFilterKey(e.target.value)}
            value={filterKey}
          >
            <option value="this_week">7 Days</option>
            <option value="this_month">1 Month</option>
            <option value="this_year">1 Year</option>
            <option selected={true} value="all">
              All
            </option>
          </select>
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
            }}
            series={[
              {
                name: "series-1",
                data: yAxisData,
              },
            ]}
            type="bar"
          />
        </div>

        <div className="singlebox-footer">
          <div className="completed">
            <div className="flex-aligncenter">
              <div className="bullet"></div>
              <h2>Completed</h2>
            </div>
            <h3>
              {(
                (orderGraphData?.deliveredOrders /
                  orderGraphData?.totalOrders) *
                100
              ).toFixed(2)}
              %
            </h3>
          </div>
          <div className="completed">
            <div className="flex-aligncenter">
              <div className="lightbullet"></div>
              <h2>Pending payment</h2>
            </div>
            <h3>
            {(
                100 - (orderGraphData?.deliveredOrders /
                  orderGraphData?.totalOrders) *
                100
              ).toFixed(2)}%
            </h3>
          </div>
        </div>
      </div>
    </>
  );
};

export default SingleBox;
