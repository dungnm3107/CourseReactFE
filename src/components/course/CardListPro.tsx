import React from "react";
import CardItem from "./CardItem";

export default function CardListPro() {
  return (
    <>
      <div style={{height:"44px"}}>
        <h6 className="pt-3"> <span style={{fontSize:"28px" , color:"black" , fontWeight:'bold'}}>Khóa học Pro</span> <span className="badge  mb-3" style={{backgroundColor:"orange"}}>New</span></h6>
      </div>
      <div className="row">
        {/* <h1>Khóa Học Pro </h1> */}
        <div className="col-sm-6 col-md-4 col-lg-3 mt-3">
          <CardItem />
        </div>
        <div className="col-sm-6 col-md-4 col-lg-3 mt-3">
          <CardItem />
        </div>
        <div className="col-sm-6 col-md-4 col-lg-3 mt-3">
          <CardItem />
        </div>
        <div className="col-sm-6 col-md-4 col-lg-3 mt-3">
          <CardItem />
        </div>
      </div>
    </>
  );
}
