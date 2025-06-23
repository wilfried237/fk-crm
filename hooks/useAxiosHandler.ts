import { toast } from "sonner";
import axios from "axios";

const useAxiosErrorHandler = () => {
  const handleError = (error: unknown) => {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        // Try to extract message from known structures
        const data = error.response.data;
        let errorMessage = "An error occurred";

        if (typeof data === "string") {
          errorMessage = data;
        } else if (typeof data?.message === "string") {
          errorMessage = data.message;
        } else if (typeof data?.error === "string") {
          errorMessage = data.error;
        }

        toast.error(errorMessage);

      } else if (error.request) {
        toast.error("No response received from the server.");
      } else {
        toast.error(`Request setup error: ${error.message}`);
      }

    } else {
      toast.error(`Unexpected error: ${String(error)}`);
    }
  };

  return { handleError };
};

export default useAxiosErrorHandler;
