import * as Yup from "yup";
export const AddCountryInVariantSchema = Yup.object({
  stock: Yup.number().integer().required("Stock is required"),
  price: Yup.number()
    .integer()
    .required("Price is required")
    .positive("Price must be a positive number")
    .test(
      "is-more-than-purchaseprice",
      "Sale Price must be more than Purchase Price",
      function (value) {
        const { purchaseprice } = this.parent;
        return value > purchaseprice;
      }
    ),
  purchaseprice: Yup.number()
    .integer()
    .required("Purchase Price is required")
    .positive("Purchase Price must be a positive number")
    .test(
      "is-less-than-price",
      "Purchase Price must be less than Sale Price",
      function (value) {
        const { price } = this.parent;
        return value < price;
      }
    ),
  discount: Yup.number()
    .integer()
    .required("Disount is required")
    .max(90, "Discount cannot be more than 90%"),
});
