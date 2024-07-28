import React, { useRef, useState, useEffect, useContext } from "react";
import axios from "axios";
import { useQuery } from "react-query";
import { environmentVariables } from "../../../config/env.config";
import { useParams, useNavigate } from "react-router-dom";
import MultiSelect from "react-multiple-select-dropdown-lite";
import "react-multiple-select-dropdown-lite/dist/index.css";
import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";
import "react-data-table-component-extensions/dist/index.css";
import { toast } from "react-toastify";
import AddVariantPopup from "./AddVariantPopup";
import { userContext } from "../../../context/userContext";
import ButtonLoader from "../../Components/ButtonLoader/ButtonLoader";
import Editor from "../../../common/Editor/Editor";

const ViewProduct = () => {
  const { id } = useParams();
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  const [productTitle, setProductTitle] = useState();
  const [modelNumber, setModelNumber] = useState();
  const [frameType, setFrameType] = useState();
  const [size, setSize] = useState();
  const [material, setMaterial] = useState();
  const [shape, setShape] = useState();
  const [sku, setSku] = useState();
  const [description, setDescription] = useState();
  const [summary, setSummary] = useState();
  const { userData } = useContext(userContext);

  const [status, setStatus] = useState();
  const [categoryName, setCategoryName] = useState();
  const [isSubmit, setIsSubmit] = useState(false);

  // const [productCategory, setProductCategory] = useState();
  // const [productMaterial, setProductMaterial] = useState();
  // const [productShape, setProductShape] = useState();
  const [thumbnail, setThumbNail] = useState();
  const [genderArr, setGenderArr] = useState();
  const [frameWidth, setFrameWidth] = useState();
  const [lensWidth, setLensWidth] = useState();
  const [lensHeight, setLensHeight] = useState();
  const [bridgeWidth, setBridgeWidth] = useState();
  const [templeLength, setTempleLength] = useState();
  const [addPopup, setAddPopup] = useState(false);
  const [updatedState, setUpdatedState] = useState(false);

  //   const fetchProductById = async () => {
  //     const response = await axios.get(
  //       `${environmentVariables?.apiUrl}api/admin/product/fetch_product_by_id?id=${id}`,
  //       {
  //         withCredentials: true,
  //       }
  //     );

  //     return response?.data?.data;
  //   };

  //   const { data, isLoading, error, refetch } = useQuery(
  //     "productbyid",
  //     fetchProductById
  //   );
  const fetchCategoriesData = async () => {
    const response = await axios.get(
      `${environmentVariables?.apiUrl}api/admin/add_fiter_data/get_category_for_admin`,
      {
        withCredentials: true,
      }
    );

    return response?.data?.data;
  };

  const getProductById = () => {
    setLoading(true);
    let config = {
      method: "get",
      url: `${environmentVariables?.apiUrl}api/admin/product/fetch_product_by_id?id=${id}`,
      withCredentials: true,
    };

    axios
      .request(config)
      .then((response) => {
        setData(response.data.data);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        setData();
      });
  };

  const {
    data: categoryData,
    // isLoading,
    // error,
    // refetch,
  } = useQuery("categoryinproductbyid", fetchCategoriesData);

  const handleOnchangeGender = (selectedOptions) => {
    const selectedValues = selectedOptions.split(",");
    setGenderArr(selectedValues);
  };

  const options = categoryData?.gender.map((gender) => ({
    label: gender.value,
    value: gender.id?.toString(),
  }));
  // const options = [
  //   { label: "Men", value: "1" },
  //   { label: "Women", value: "2" },
  //   { label: "Kids", value: "3" },
  // ];
  const updateProduct = () => {
    setIsSubmit(true);
    let formdata = new FormData();
    formdata.append("summary", summary);
    formdata.append("description", description);
    formdata.append("product_id", id);
    formdata.append("title", productTitle);
    formdata.append("model_number", modelNumber);
    formdata.append("frame_type_id", frameType);
    formdata.append("size_id", size);
    formdata.append("material_id", material);
    formdata.append("shape_id", shape);
    formdata.append("sku", sku);
    // formdata.append("cat_id", productCategory);
    // formdata.append("material_id", productMaterial);
    // formdata.append("shape_id", productShape);
    formdata.append("thumbnail_img", thumbnail);
    formdata.append("status", status);
    for (let i = 0; i < genderArr.length; i++) {
      formdata.append(`gender[${i}]`, genderArr[i]);
    }
    formdata.append("frame_width", frameWidth);
    formdata.append("lens_width", lensWidth);
    formdata.append("lens_height", lensHeight);
    formdata.append("bridge_width", bridgeWidth);
    formdata.append("temple_length", templeLength);
    let config = {
      method: "post",
      url: `${environmentVariables?.apiUrl}api/admin/product/edit_product`,
      withCredentials: true,
      data: formdata,
    };

    axios
      .request(config)
      .then((response) => {
        getProductById();
        toast.success("Product Updated Successfully");
        setIsSubmit(false);
      })
      .catch((error) => {
        toast.error(error?.response?.data?.message || error?.message);
        setIsSubmit(false);
      });
  };
  const tableExtensions = {
    export: false,
    print: false,
    filter: false,
  };
  const columns = [
    {
      name: "Color",
      selector: "colorName",

      cell: (d, index) => {
        return (
          <div
            style={{
              backgroundColor: `${d?.colorName}`,
              height: "10px",
              width: "10px",
            }}
          ></div>
        );
      },
    },
    {
      name: "View",
      selector: "view",
      cell: (d, index) => (
        <button onClick={(e) => navigate(`/variant/${d?.variant_id}`)}>
          View
        </button>
      ),
    },
  ];
  const selectedItems = data?.variantData;
  useEffect(() => {
    getProductById();
  }, [id, updatedState]);

  useEffect(() => {
    if (data) {
      setProductTitle(data.title);
      setModelNumber(data.model_number);
      setFrameType(data.frame_type_id);
      setMaterial(data.material_id);
      setSize(data.size_id);
      setShape(data.shape_id);
      setSku(data.sku);
      setDescription(data?.description);
      setSummary(data?.summary);
      setStatus(data?.status);
      setCategoryName(data?.categoryName);
      // setProductCategory(data?.cat_id);
      // setProductMaterial(data?.material_id);
      // setProductShape(data?.shape_id);
      setThumbNail(data?.thumbnail_img);
      setGenderArr(data?.gender);
      setFrameWidth(data?.frame_width);
      setLensWidth(data?.lens_width);
      setLensHeight(data?.lens_height);
      setBridgeWidth(data?.bridge_width);
      setTempleLength(data?.temple_length);
    }
  }, [data]);
  if (loading) return <h1>Loading</h1>;
  //   if (error) return <h1>Error</h1>;
  const handleSkuChange = (event) => {
    const { value } = event.target;
    const alphanumericValue = value.replace(/[^a-zA-Z0-9]/g, "");
    setSku(alphanumericValue);
  };
  return (
    <div>
      <h4 style={{ paddingBottom: "30px" }}>Product Details</h4>
      <div>
        {data && (
          <div className="all-inputs-main">
            <div>
              <div className="text-input-main">
                <h5>Product Title</h5>
                <input
                  type="text"
                  placeholder="Product Title"
                  value={productTitle}
                  onChange={(e) => setProductTitle(e.target.value)}
                />
              </div>
              <div className="text-input-main">
                <h5>Sku</h5>
                <input
                  type="text"
                  placeholder="Sku"
                  value={sku}
                  onChange={handleSkuChange}
                />
              </div>

              <div className="text-input-main">
                <h5>Model Number</h5>
                <input
                  type="text"
                  placeholder="Model Number"
                  value={modelNumber}
                  onChange={(e) => setModelNumber(e.target.value)}
                />
              </div>

              {/* <div className="text-input-main frame-type-main">
                <h5>Frame Type</h5>
                <select
                  placeholder="Select Frame Type"
                  value={frameType}
                  onChange={(e) => setFrameType(e.target.value)}
                >
                  <option value="" disabled>
                    Select Frame Type
                  </option>
                  {categoryData?.frame_type?.map((option, index) => (
                    <option key={index} value={option?.id}>
                      <div>{option?.value}</div>
                    </option>
                  ))}
                </select>
              </div> */}

              <div className="text-input-main">
                <h5>Category (can't be edited here) </h5>
                <input
                  type="text"
                  placeholder="Category"
                  value={categoryName}
                  readOnly
                  onChange={(e) => setCategoryName(e.target.value)}
                />
              </div>
            </div>
            <div>
              <div className="text-input-main">
                <h5>Summary</h5>
                <textarea
                  rows={4}
                  // cols={50}
                  placeholder="Summary"
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                />
              </div>

              {/* <div className="text-input-main frame-type-main">
                <h5>Shape</h5>
                <select
                  placeholder="Select Shape"
                  value={shape}
                  onChange={(e) => setShape(e.target.value)}
                >
                  <option value="" disabled>
                    Select Shape
                  </option>

                  {categoryData?.shape?.map((item, index) => {
                    return (
                      <option value={item?.id} key={index}>
                        {item?.value}
                      </option>
                    );
                  })}
                </select>
              </div> */}

              <div className="text-input-main frame-type-main">
                <h5>Material</h5>
                <select
                  placeholder="Select Frame Type"
                  value={material}
                  onChange={(e) => setMaterial(e.target.value)}
                >
                  <option value="" disabled>
                    Select Material
                  </option>
                  {categoryData?.material?.map((item, index) => {
                    return (
                      <option value={item?.id} key={index}>
                        {item?.value}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div className="text-input-main frame-type-main">
                <h5>Size</h5>
                <select
                  placeholder="Select Frame Type"
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                >
                  <option value="" disabled>
                    Select Size
                  </option>
                  {categoryData?.size?.map((option, index) => (
                    <option key={index} value={option?.id}>
                      <div>{option?.value}</div>
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              {/* <div className="text-input-main">
                <h5>Frame Width</h5>
                <input
                  type="number"
                  placeholder="Frame Width"
                  value={frameWidth}
                  onChange={(e) => setFrameWidth(e.target.value)}
                />
              </div> */}
              {/* <div className="text-input-main">
                <h5>Lens Width</h5>
                <input
                  type="number"
                  placeholder="Lens Width"
                  value={lensWidth}
                  onChange={(e) => setLensWidth(e.target.value)}
                />
              </div> */}
              {/* <div className="text-input-main">
                <h5>Lens Height</h5>
                <input
                  type="number"
                  placeholder="Lens Height"
                  value={lensHeight}
                  onChange={(e) => setLensHeight(e.target.value)}
                />
              </div> */}
              {/* <div className="text-input-main">
                <h5>Bridge Width</h5>
                <input
                  type="number"
                  placeholder="Bridge Width"
                  value={bridgeWidth}
                  onChange={(e) => setBridgeWidth(e.target.value)}
                />
              </div> */}
              {/* <div className="text-input-main">
                <h5>Temple Length</h5>
                <input
                  type="number"
                  placeholder="Temple Length"
                  value={templeLength}
                  onChange={(e) => setTempleLength(e.target.value)}
                />
              </div> */}
            </div>

            <div>
              <div className="text-input-main">
                <h5>upload image</h5>
                <div className="upload-image-fixed">
                  <img
                    src={`${environmentVariables?.cdnUrl}uploads/${thumbnail}`}
                  />
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setThumbNail(e.target.files[0])}
                  ref={fileInputRef}
                />
              </div>

              <div className="text-input-main">
                <h5>Select Subcategory</h5>
                <MultiSelect
                  className="multi-select"
                  onChange={handleOnchangeGender}
                  options={options}
                  defaultValue={genderArr}
                  style={{ width: "100%" }}
                />
              </div>
            </div>

            <div
              className="text-input-main"
              style={{ display: "flex", flexDirection: "row" }}
            >
              <h5>Product Enable/Disable</h5>
              <input
                style={{ marginLeft: "20px" }}
                type="checkbox"
                id="custom-switch"
                label="Enable/Disable"
                checked={status === "active"}
                onChange={(e) =>
                  setStatus(e.target.checked ? "active" : "inactive")
                }
              />
            </div>
          </div>
        )}
        <div className="text-input-main">
          <h5>Description</h5>
          {/* <textarea
                  rows={4}
                  // cols={50}
                  placeholder="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                /> */}
          <Editor
            name="description"
            value={description}
            // onChange={
            onChange={(data) => {
              setDescription(data);
            }}
            // } // Directly bind to Formik's handleChange
            editorLoaded={true}
          />
        </div>
        {userData?.role != "super_admin" ? (
          userData?.backendArr?.some(
            (item) => item?.name === "/api/admin/product/add_product"
          ) && (
            <button
              className="update-button"
              onClick={() => updateProduct()}
              disabled={isSubmit}
            >
              {isSubmit ? <ButtonLoader size={30} /> : "Update Product"}
            </button>
          )
        ) : (
          <button
            className="update-button"
            onClick={() => updateProduct()}
            disabled={isSubmit}
          >
            {isSubmit ? <ButtonLoader size={30} /> : "Update Product"}
          </button>
        )}
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: "50px",
        }}
      >
        <h4>Product Variants</h4>
      </div>
      <div>
        <DataTableExtensions
          columns={columns}
          data={selectedItems}
          {...tableExtensions}
        >
          <DataTable
            noHeader
            defaultSortField="id"
            defaultSortAsc={false}
            highlightOnHover
          />
        </DataTableExtensions>
      </div>
      {userData?.role != "super_admin" ? (
        userData?.backendArr?.some(
          (item) => item?.name === "/api/admin/product/add_product"
        ) && (
          <div className="add-new-varient" onClick={() => setAddPopup(true)}>
            Add New Variant
          </div>
        )
      ) : (
        <div className="add-new-varient" onClick={() => setAddPopup(true)}>
          Add New Variant
        </div>
      )}
      {addPopup && (
        <AddVariantPopup
          open={addPopup}
          setOpen={setAddPopup}
          categoryData={categoryData}
          productId={id}
          updatedState={updatedState}
          setUpdatedState={setUpdatedState}
        />
      )}
    </div>
  );
};

export default ViewProduct;
