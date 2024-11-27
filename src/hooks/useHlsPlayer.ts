import Hls from "hls.js";
import { useEffect } from "react";

const useHlsPlayer = (signedUrl: string | null, videoRef: React.RefObject<HTMLVideoElement>) => {
  useEffect(() => {
    if (signedUrl && videoRef.current) {
      const hls = new Hls({
        xhrSetup: function (xhr) {
          xhr.withCredentials = false; // Cấu hình không dùng credentials, tùy theo yêu cầu
        },
      });

      hls.on(Hls.Events.MANIFEST_PARSED, function () {
        console.log("Manifest loaded");
      });

      hls.on(Hls.Events.ERROR, function (_, data) {
        console.error("HLS.js error:", data);
      });

      if (Hls.isSupported()) {
        hls.loadSource(signedUrl); // Đường dẫn đến playlist .m3u8
        hls.attachMedia(videoRef.current);

        // Cleanup on unmount
        return () => {
          hls.destroy();
        };
      } else if (videoRef.current.canPlayType("application/vnd.apple.mpegurl")) {
        // Nếu trình duyệt hỗ trợ HLS natively (ví dụ: Safari)
        videoRef.current.src = signedUrl;
      }
    }
  }, [signedUrl, videoRef]);
};

export default useHlsPlayer;
