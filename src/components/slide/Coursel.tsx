import React from "react";
import '../../assets/css/coursel.css'
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Keyboard, Mousewheel, Navigation, Pagination } from "swiper/modules";
import img from "../../assets/imgbg.jpg";
export default function Coursel() {
  return (
    <>
    <div className="container-fluid mt-2 mb-2 nav">
    <Swiper
      cssMode={true}
      navigation={true}
      pagination={true}
      mousewheel={true}
      keyboard={true}
      autoplay={{
        delay: 2500,
        disableOnInteraction: false,
      }}
      modules={[Autoplay,Navigation, Pagination, Mousewheel, Keyboard]}
      className="mySwiper"
    >
      <SwiperSlide style={{maxHeight:"400px"}}><img src={img} alt="" /></SwiperSlide>
      <SwiperSlide style={{maxHeight:"400px"}}><img src={img} alt="" /></SwiperSlide>
      <SwiperSlide style={{maxHeight:"400px"}}><img src={img} alt="" /></SwiperSlide>
    </Swiper>
    </div>
  </>
  );
}
