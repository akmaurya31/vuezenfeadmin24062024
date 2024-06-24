import * as Yup from "yup";
export const AddGenderSchema = Yup.object({
  genderValue: Yup.string().required("Gender is required").min(3),
  isButtonDisabled: Yup.boolean(),
});
