import React, { useContext, useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import bestSellImg from "../../../Images/banner1.jpg";
import { countryContext } from "../../../context/countryContext";
import { environmentVariables } from "../../../config/env.config";
import axios from "axios";
import styled from "styled-components";

const StarsProgress = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  h2 {
    font-size: 14px;
    color: #4d4d4d;
    text-wrap: nowrap;
    margin: 0;
    padding: 0;
  }
`;
const BarMain = styled.div`
  background-color: #f5f6f8;
  border: 1px solid #eaebec;
  height: 25px;
  width: 100%;
  margin: 0 10px;
  position: relative;
`;
const BarOverlay = styled.div`
  position: absolute;
  background-color: #ffad33;
  // width: 0%;
  width: ${(props) => (props.percentage ? `${props.percentage}%` : "0%")};
  height: 25px;
  top: 0;
  z-index: 9;
  border: ${(props) => (props.percentage ? "1px solid #ffad33" : "none")};
`;

const BestSellingProducts = () => {
  const { activeCountry } = useContext(countryContext);
  const [bestSellingData, setBestSellingData] = useState(null);
  const [filterKey, setFilterKey] = useState("all");
  const getProduct = (id) => {
    if (bestSellingData?.tempArr && bestSellingData?.tempArr.length > 0) {
      return bestSellingData.tempArr.filter((val) => val.productObj.id == id);
    } else {
      return [];
    }
  };

  const getBestSellingData = () => {
    let url;
    if (filterKey == "all") {
      url = `${environmentVariables?.apiUrl}api/admin/dashboard_data/get_best_seller_product?country_code=${activeCountry}&limit=5`;
    } else {
      url = `${environmentVariables?.apiUrl}api/admin/dashboard_data/get_best_seller_product?country_code=${activeCountry}&limit=5&${filterKey}=true`;
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
        setBestSellingData(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  useEffect(() => {
    getBestSellingData();
  }, [filterKey, activeCountry]);
  // console.log(bestSellingData?.productOrderWithQuantity);
  return (
    <>
      <div className="totalsells-main">
        <div className="totalsells-heading">
          <h2>Total sales</h2>
          <h3>Products Sales across all channels</h3>
        </div>
        <div className="totalsells-filter">
          <select onChange={(e) => setFilterKey(e.target.value)}>
            <option value="this_week">7 Days</option>
            <option value="this_month">1 Month</option>
            <option value="this_year">1 Year</option>
            <option value="all">All</option>
          </select>
        </div>
      </div>

      <div className="bestselling-main">
        <Table hover className="processing-time-table-main">
          <tbody className="tablet-tbody">
            <tr className="tablet-tbody-row">
              <td>Best Selling Products</td>
              <td>Quantity</td>
              <td>Quantity(%)</td>
            </tr>
            {bestSellingData &&
              bestSellingData?.productOrderWithQuantity.length > 0 &&
              bestSellingData?.productOrderWithQuantity.map((val) => {
                console.log("aaaaa", val);
                return (
                  <tr className="tablet-tbody-row">
                    <td className="best-sell-img-details">
                      <div className="best-sell-img">
                        <img
                          src={`${environmentVariables?.cdnUrl}uploads/${
                            getProduct(val?.product_id)[0]?.productObj
                              ?.thumbnail_img
                          }`}
                        />
                      </div>
                      <div className="best-sell-detais">
                        <h2>
                          {getProduct(val?.product_id)[0]?.productObj?.title}
                        </h2>
                        <p>
                          SKU:{" "}
                          <span>
                            {`  
                        ${getProduct(val?.product_id)[0]?.productObj?.sku}`}
                          </span>
                        </p>
                      </div>
                    </td>
                    <td>{val?.quantity}</td>
                    <td>
                      {/* {val?.quantity} */}
                      <StarsProgress>
                        <BarMain>
                          <BarOverlay percentage={val?.quantity}></BarOverlay>
                        </BarMain>
                        <h2>{val?.quantity} %</h2>
                      </StarsProgress>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </Table>
      </div>
    </>
  );
};

export default BestSellingProducts;
