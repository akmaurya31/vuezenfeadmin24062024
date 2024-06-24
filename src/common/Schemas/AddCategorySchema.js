import * as Yup from "yup";
export const AddCategorySchema = Yup.object({
  categoryValue: Yup.string().required("Category is required").min(3),
  // selectedImage: Yup.mixed().required("Image is required"),
  genderInCategory: Yup.array()
    .required("At least one gender must be selected")
    .min(1, "At least one gender must be selected"),
  isButtonDisabled: Yup.boolean(),
});
