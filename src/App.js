import "./Backend/Pages/Style.css";
import { Routes, Route, useNavigate } from "react-router-dom";
import Login from "./Auth/Login";
import "./App.css";
import DashbordLayout from "./Backend/Components/DashbordLayout";
import { userContext } from "./context/userContext";
import { environmentVariables } from "./config/env.config";
import axios from "axios";
import { countryContext } from "./context/countryContext";
import Roles from "./Backend/Pages/Roles/Roles";
import ApiEndpoint from "./Backend/Pages/ApiEndpoint/ApiEndpoint";
import SubAdmins from "./Backend/Pages/SubAdmins/SubAdmins";
import { useEffect, useState } from "react";
import UISections from "./Backend/Pages/UISections/UISections";
import UIInnerSections from "./Backend/Pages/UIInnerSections/UIInnerSections";
import { Category } from "./Backend/Pages/Categories/Category";
import Dashboard from "./Backend/Pages/Dashboard/Dashboard";
import UIFrameData from "./Backend/Pages/UIFrameData/UIFrameData";
import BestSeller from "./Backend/Pages/Bestseller/BestSeller";
import Product from "./Backend/Pages/Products/Product";
import AllProducts from "./Backend/Pages/Products/AllProducts";
import Coupons from "./Backend/Pages/Coupons/Coupons";
import CountryZipcodes from "./Backend/Pages/CountryZipcodes/CountryZipcodes";
import OrderDeliveryDay from "./Backend/Pages/OrderDeliveryDay/OrderDeliveryDay";
import StudentDeliveryData from "./Backend/Pages/StudentDeliveryData/StudentDeliveryData";
import Setting from "./Backend/Pages/Setting/Setting";
import BeautifulEyewearCollection from "./Backend/Pages/Collection/BeautifulEyewearCollection";
import Orders from "./Backend/Pages/Orders/Orders";
import OrderDetails from "./Backend/Pages/orderDetails/OrderDetails";
import ViewProduct from "./Backend/Pages/Products/ViewProduct";
import ViewVariants from "./Backend/Pages/Products/ViewVariants";
import ForgetPassword from "./Backend/Pages/ForgetPassword/ForgetPassword";
import ResetPassword from "./Backend/Pages/ResetPassword/ResetPassword";
import Profile from "./Backend/Pages/Profile/Profile";
import SeoProducts from "./Backend/Pages/SeoProducts/SeoProducts";
import Subscribeusers from "./Backend/Pages/SubscribeUsers/Subscribeusers";
import Footer from "./Backend/Pages/Footer/Footer";

function App() {
  const [isUserLogin, setIsUserLogin] = useState(false);
  const [allCountries, setAllCountries] = useState([]);
  const [activeCountry, setActiveCountry] = useState("IN");
  const [routesData, setRoutesData] = useState([]);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();
  const getAllCountries = () => {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${environmentVariables?.apiUrl}api/admin/zip_code/get_active`,
      withCredentials: true,
    };

    axios
      .request(config)
      .then((response) => {
        // console.log(response.data.data, "allcountries");
        setAllCountries(response.data?.data);
        setActiveCountry(response.data?.data[0]?.country_code);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  useEffect(() => {
    getAllCountries();
  }, []);
  const isAuth = () => {
    axios.defaults.withCredentials = true;
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${environmentVariables?.apiUrl}api/admin/check_user_logged_in`,
      withCredentials: true,
    };
    axios
      .request(config)
      .then((response) => {
        if (response.data.success == true) {
          setIsUserLogin(true);
          setUserData(response.data.data);
          // console.log(response.data.data);
          if (response?.data?.data?.role === "super_admin") {
            navigate("/dashboard");
          } else {
            navigate(
              response?.data?.data?.roleObj?.permissionObj?.[0]
                ?.frontendEndPoint?.[0]?.name
            );
          }
        } else {
          setIsUserLogin(false);
          setUserData(null);
        }
      })
      .catch((error) => {
        // console.log(error);
        setIsUserLogin(false);
        setUserData(null);
      });
  };
  useEffect(() => {
    isAuth();
  }, [isUserLogin]);

  const getRoutesData = () => {
    let config = {
      method: "get",
      url: `${environmentVariables?.apiUrl}api/admin/api_endpoint/get`,
      withCredentials: true,
    };

    axios
      .request(config)
      .then((response) => {
        setRoutesData(response?.data?.data);
      })
      .catch((error) => {
        setRoutesData([]);
      });
  };
  useEffect(() => {
    getRoutesData();
  }, []);

  return (
    <countryContext.Provider
      value={{ allCountries, setAllCountries, activeCountry, setActiveCountry }}
    >
      <userContext.Provider
        value={{
          isUserLogin,
          setIsUserLogin,
          userData,
          setUserData,
          routesData,
          setRoutesData,
        }}
      >
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/forgot-password" element={<ForgetPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          <Route element={<DashbordLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/addproducts" element={<Product />} />
            <Route path="/allproducts" element={<AllProducts />} />
            <Route path="/ui_landing_page_section" element={<UISections />} />
            <Route path="/ui_inner_sections" element={<UIInnerSections />} />
            <Route path="/view/:id" element={<ViewProduct />} />
            <Route path="/variant/:id" element={<ViewVariants />} />
            <Route path="/addPhysicalCard" element={<UISections />} />
            <Route path="/Currency_admin" element={<UIInnerSections />} />
            <Route path="/category" element={<Category />} />
            <Route path="/uiFrameData" element={<UIFrameData />} />
            <Route path="/bestseller" element={<BestSeller />} />
            <Route path="/Coupons_admin" element={<Coupons />} />
            <Route path="/zipcodes_available" element={<CountryZipcodes />} />
            <Route path="/order_delivery_day" element={<OrderDeliveryDay />} />
            <Route path="/student_delivery_data" element={<StudentDeliveryData />} />
            <Route path="/Setting_admin" element={<Setting />} />
            <Route path="/roles" element={<Roles />} />
            <Route path="/api_endpoint" element={<ApiEndpoint />} />
            <Route path="/subadmins" element={<SubAdmins />} />
            <Route path="orders" element={<Orders />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/seo_products" element={<SeoProducts />} />
            <Route path="orders/:orderid" element={<OrderDetails />} />
            <Route
              path="/eyewear_collection"
              element={<BeautifulEyewearCollection />}
            />
            <Route
              path="/subscribeusers"
              element={<Subscribeusers />}
            />
            <Route
              path="/footer"
              element={<Footer />}
            />
          </Route>
        </Routes>
      </userContext.Provider>
    </countryContext.Provider>
  );
}
export default App;
//612

/* 
<planContext.Provider value={{ planData, setPlanData }}>
      <businessObjContext.Provider
        value={{ businessObjData, setBusinessObjData }}
      >
        <currencyArrayContext.Provider
          value={{ currencyArrayData, setCurrencyArrayData }}
        >
          <currencyContext.Provider
            value={{ currencyObjData, setCurrencyObjData }}
          >
            <businessContext.Provider value={{ businessData, setBusinessData }}>
              <isBusinesCreatedContext.Provider
                value={{ isBusinessCreated, setIsBusinessCreated }}
              >
                <businessNameContext.Provider
                  value={{ businessNameData, setBusinessNameData }}
                >
                  <userContext.Provider value={{ userData, setUserData }}>
                    <div className="App">
                      <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="*" element={<Dashboard />} />
                        <Route
                          path="/forgot-password"
                          element={<ForgotPassword />}
                        />
                        <Route path="/register" element={<Register />} />
                        <Route
                          path="/checkingtheme"
                          element={getComponenent()}
                        />
                        <Route
                          path="/change-password"
                          element={<ChangePassword />}
                        />
                        <Route path="/verify-email" element={<VerifyEmail />} />
                        <Route
                          path={`/:${currentPath[2]}`}
                          element={<Template2 Slug={currentPath[2]} />}
                        />
                        <Route path="/template-main" element={<Template1 />} />
                        <Route index element={<Dashboard />} />
                        <Route
                          element={
                            <Layout
                              isChangeDynamicBusinessName={
                                isChangeDynamicBusinessName
                              }
                              setDynamicBusinessName={setDynamicBusinessName}
                              dynamicBusinessName={dynamicBusinessName}
                              setBusinessId={setBusinessId}
                              businessId={businessId}
                            />
                          }
                        >
                          <Route path="/home" element={<LandingPage />} />
                          <Route path="/adminlogin" element={<AdminLogin />} />
                          <Route path="/privacy" element={<Privacy />} />
                          <Route path="/term-conditions" element={<Term />} />
                          <Route path="/faqs" element={<Faqs />} />
                          <Route path="/shipping" element={<Shipping />} />
                          <Route path="/refund" element={<Refund />} />
                          <Route path="/about" element={<Aboutus />} />
                          <Route
                            path="/ViewCardDownload/:id"
                            element={<ViewCardDownload />}
                          />
                        </Route>
                        {isAuth() && (
                          <Route
                            element={
                              <DashbordLayout
                                isChangeDynamicBusinessName={
                                  isChangeDynamicBusinessName
                                }
                                setDynamicBusinessName={setDynamicBusinessName}
                                dynamicBusinessName={dynamicBusinessName}
                                setBusinessId={setBusinessId}
                                businessId={businessId}
                              />
                            }
                          >
                            <Route
                              path="/StripeSubscription"
                              element={<StripeSubscription />}
                            />
                            <Route
                              path="/StripeSubscriptionPaymentSuccess"
                              element={<StripeSubscriptionPaymentSuccess />}
                            />
                            <Route
                              path="/StripeSubscriptionPaymentCancel"
                              element={<StripeSubscriptionPaymentCancel />}
                            />
                            <Route path="/ordernow" element={<OrderNow />} />
                            <Route path="/" element={<Dashbord />} />
                            <Route path="/user" element={<User />} />
                            <Route
                              path="/userUploadList"
                              element={<UserUploadList />}
                            />
                            <Route path="/roles" element={<Roles />} />
                            <Route path="/plans" element={<Plans />} />
                            <Route path="/contact" element={<Contacts />} />
                            <Route
                              path="/appoinments"
                              element={<Appoinments />}
                            />
                            <Route
                              path="/appoinments_slots"
                              element={<Appoinments_slots />}
                            />
                            <Route
                              path="/requestCard"
                              element={<RequestCard />}
                            />
                            <Route
                              path="/requestnewcard"
                              element={<Requestnewcard />}
                            />
                            <Route
                              path="/business/:id"
                              element={
                                <Business
                                  themeNumber={themeNumber}
                                  setThemeNumber={setThemeNumber}
                                />
                              }
                            />
                            <Route
                              path="/business"
                              element={
                                <Business
                                  themeNumber={themeNumber}
                                  setThemeNumber={setThemeNumber}
                                />
                              }
                            />
                            <Route
                              path="/businesslist"
                              element={
                                <Businesslist
                                  isChangeDynamicBusinessName={
                                    isChangeDynamicBusinessName
                                  }
                                  setDynamicBusinessName={
                                    setDynamicBusinessName
                                  }
                                  setIsChangeDynamicBusinessName={
                                    setIsChangeDynamicBusinessName
                                  }
                                />
                              }
                            />
                            <Route path="/profile" element={<Profile />} />
                            <Route
                              path="/addphysicalCard"
                              element={<AddPhysicalCard />}
                            />
                            <Route path="/profile" element={<Profile />} />
                            <Route path="/paystripe" element={<Paystripe />} />
                            <Route
                              path="/create-card"
                              element={<CreateCard />}
                            />
                            <Route path="/payment" element={<Payment />} />
                            <Route
                              path="/businessNew"
                              element={<BusinessNew />}
                            />
                            <Route
                              path="/payment-plan-list"
                              element={<PaymentPlanList />}
                            />
                            <Route
                              path="/payment-plan"
                              element={<PaymentPlan />}
                            />
                          </Route>
                        )}

                        {isAdminAuth() && (
                          <Route
                            element={
                              <DashbordLayout
                                isChangeDynamicBusinessName={
                                  isChangeDynamicBusinessName
                                }
                                setBusinessId={setBusinessId}
                                businessId={businessId}
                              />
                            }
                          >
                            <Route
                              path="/super_dashboard"
                              element={
                                <SuperDashboard
                                  setDynamicBusinessName={
                                    setDynamicBusinessName
                                  }
                                  dynamicBusinessName={dynamicBusinessName}
                                  isChangeDynamicBusinessName={
                                    isChangeDynamicBusinessName
                                  }
                                />
                              }
                            />
                            <Route path="/AllUser" element={<AllUser />} />
                            <Route
                              path="/Setting_admin"
                              element={<Setting_admin />}
                            />
                            <Route
                              path="/bulk_upload"
                              element={<BulkUpload />}
                            />
                            <Route
                              path="/Email_template_admin"
                              element={<Email_template_admin />}
                            />
                            <Route
                              path="/Order_admin"
                              element={<Order_admin />}
                            />
                            <Route
                              path="/Coupons_admin"
                              element={<Coupons_admin />}
                            />
                            <Route
                              path="/Currency_admin"
                              element={<Currency_admin />}
                            />
                            <Route
                              path="/requestcard_admin"
                              element={<Requestcard_admin />}
                            />
                            <Route
                              path="/Planrequest_admin"
                              element={<Planrequest_admin />}
                            />
                            <Route
                              path="/PlansSuperAdmin"
                              element={<PlansSuperAdmin />}
                            />
                            <Route
                              path="/CustomizedPlansSuperAdmin"
                              element={<CustomizedPlansSuperAdmin />}
                            />
                            <Route
                              path="/create_business_theme"
                              element={<ThemeSelect />}
                            />
                            <Route
                              path="/DisplayCardList_admin"
                              element={<DisplayCardList_admin />}
                            />
                          </Route>
                        )}
                      </Routes>
                    </div>
                  </userContext.Provider>
                </businessNameContext.Provider>
              </isBusinesCreatedContext.Provider>
            </businessContext.Provider>
          </currencyContext.Provider>
        </currencyArrayContext.Provider>
      </businessObjContext.Provider>
    </planContext.Provider>
*/
