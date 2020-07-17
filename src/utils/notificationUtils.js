import { ToastProgrammatic as Toast } from "buefy";

const toastMessage = (message, type = "is-dark", error = null) => {
  error && console.error(error);
  Toast.open({ message, type });
};

export const infoMessage = (message) => toastMessage(message, "is-dark");
export const successMessage = (message) => toastMessage(message, "is-success");
export const warningMessage = (message, error = null) => toastMessage(message, "is-warning", error);
export const errorMessage = (message, error = null) => toastMessage(message, "is-danger", error);

export const notifyException = (error) => {
  console.error(error);
  if (error.message) {
    errorMessage(error.message);
  } else if (error.errors) {
    error.errors.map((subError) => errorMessage(subError.message));
  }
}