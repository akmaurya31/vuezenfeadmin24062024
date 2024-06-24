import * as Yup from "yup";
export const PriceRangeSchema = Yup.object({
  maxPriceValue: Yup.number()
    .typeError("Max Price must be a number")
    .required("Max Price is required")
    .positive("Max Price must be a positive number")
    .test(
      "max-decimal",
      "Max Price must have up to 2 decimal places",
      (value) =>
        value === undefined ||
        value === null ||
        value.toString().match(/^\d+(\.\d{1,2})?$/)
    )
    .test(
      "is-greater-than-min",
      "Max Price must be greater than Min Price",
      function (value) {
        const minPrice = this.resolve(Yup.ref("minPriceValue"));
        return minPrice === undefined || minPrice === null || value > minPrice;
      }
    ),
  minPriceValue: Yup.number()
    .typeError("Min Price must be a number")
    .required("Min Price is required")
    .positive("Min Price must be a positive number")
    .test(
      "min-decimal",
      "Min Price must have up to 2 decimal places",
      (value) =>
        value === undefined ||
        value === null ||
        value.toString().match(/^\d+(\.\d{1,2})?$/)
    ),
  isButtonDisabled: Yup.boolean(),
});
