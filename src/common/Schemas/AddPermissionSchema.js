import * as Yup from "yup";
export const AddPermissionSchema = Yup.object({
  name: Yup.string()
    .required("Name is required")
    .min(3),
  // selectedImage: Yup.mixed().required("Image is required"),
  // genderInCategory: Yup.array()
  //   .required("At least one gender must be selected")
  //   .min(1, "At least one gender must be selected"),
  // isButtonDisabled: Yup.boolean(),
});
