import * as Yup from "yup";
export const AddPermissionSchema = Yup.object({
  permissionName: Yup.string().required("Name is required").min(3),
  backendRoute: Yup.array().min(1, "Select at least one Backend Route "),
  frontendRoute: Yup.array().min(1, "Select at least one Frontend Route"),
});
