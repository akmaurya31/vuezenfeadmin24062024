import * as Yup from "yup";
export const WeightGroupSchema = Yup.object({
  weightValue: Yup.string().required("Weight is required").min(1),
  isButtonDisabled: Yup.boolean(),
});
