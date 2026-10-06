import { toast } from "react-toastify";

//success message
export const successMessage = (data: string) => {
  successMessage(data);
};

//error message
export const errorMessage = (data: string) => {
  errorMessage(data, {
    style: {
      fontSize: "12px",
      fontWeight: "bold",
    },
  });
};

//info message
export const infoMessage = (data: string) => {
  toast.info(data);
};
