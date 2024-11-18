import { useState, useEffect } from "react";
import axiosInstance from "../config/axios";

const useGetSignedUrl = (fileName: string | null) => {
  const [signedUrl, setSignedUrl] = useState<string | null>(null);

  useEffect(() => {
    if(fileName){
    axiosInstance.get(`/api/v1/video/gcs/get-url?fileName=${encodeURIComponent(fileName)}`)
      .then((response) => {
        setSignedUrl(response.data);
      })
      .catch((error) => {
        console.error("Error getting signed URL:", error);
      });
      }
  }, [fileName]);

  return signedUrl;
};

export default useGetSignedUrl;