import Hls from "hls.js";
import { useEffect } from "react";

const useHlsPlayer = (signedUrl: string | null, videoRef: React.RefObject<HTMLVideoElement>) => {
  useEffect(() => {
    if (signedUrl && videoRef.current) {
      const hls = new Hls({
        xhrSetup: function (xhr, _url) {
          xhr.withCredentials = false; // Cấu hình không dùng credentials
        },
      });

      hls.on(Hls.Events.MANIFEST_PARSED, function () {
        console.log("Manifest loaded");
      });

      hls.on(Hls.Events.ERROR, function (_event, data) {
        console.error("HLS.js error:", data);
      });

      if (Hls.isSupported()) {
        hls.loadSource(signedUrl); // Đường dẫn đến playlist .m3u8
        hls.attachMedia(videoRef.current);

        return () => {
          hls.destroy();
        };
      } else if (videoRef.current.canPlayType("application/vnd.apple.mpegurl")) {
        videoRef.current.src = signedUrl;
      }
    }
  }, [signedUrl]);
};

export default useHlsPlayer;