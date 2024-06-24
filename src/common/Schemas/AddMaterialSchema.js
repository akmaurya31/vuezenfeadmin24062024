import * as Yup from "yup";
export const AddMaterialSchema = Yup.object({
  materialValue: Yup.string().required("Material is required").min(3),
  isButtonDisabled: Yup.boolean(),
});
