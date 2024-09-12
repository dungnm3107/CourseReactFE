import '../../assets/css/course.css'
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Keyboard, Mousewheel, Navigation, Pagination } from "swiper/modules";
import img from "../../assets/images/imgbg.jpg";
export default function Course() {
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
        delay: 10000,
        disableOnInteraction: false,
      }}
      loop={true} // trượt theo vòng tròn
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
