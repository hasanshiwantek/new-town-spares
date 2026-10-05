import { toast } from "react-toastify";

//success message
export const successMessage = (data: string) => {
    toast.success(data);
};

//error message
export const errorMessage = (data: string) => {
    toast.error(data, {
        style: {
            fontSize: "12px",
            fontWeight: "bold",
        },
    });
};

//info message
export const infoMessage = (data: string) => {
    toast.info(data)
};