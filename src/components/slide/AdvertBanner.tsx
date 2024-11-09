import "../../assets/css/course.css";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  Autoplay,
  Keyboard,
  Mousewheel,
  Navigation,
  Pagination,
} from "swiper/modules";
import img from "../../assets/images/imgbg.png";
import img2 from "../../assets/images/banner2.png";
import img3 from "../../assets/images/banner-copy.jpg";

export function AdvertBanner() {
  return (
    <>
      <div
        className="container-fluid mt-2 mb-2 nav"
        style={{ height: "350px", margin: "0px", padding: "0px" }}
      >
        <Swiper
          cssMode={true}
          navigation={true}
          pagination={true}
          mousewheel={true}
          keyboard={true}
          autoplay={{
            delay: 10000,
            disableOnInteraction: false,
          }}
          loop={true}
          modules={[Autoplay, Navigation, Pagination, Mousewheel, Keyboard]}
          className="mySwiper"
          style={{ height: "100%" }}
        >
          <SwiperSlide style={{ height: "100%" }}>
            <img
              src={img}
              alt=""
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </SwiperSlide>
          <SwiperSlide style={{ height: "100%" }}>
            <img
              src={img2}
              alt=""
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </SwiperSlide>
          <SwiperSlide style={{ height: "100%" }}>
            <img
              src={img3}
              alt=""
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </SwiperSlide>
        </Swiper>
      </div>
    </>
  );
}
