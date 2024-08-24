import React from 'react'

export default function CardItem() {
    return (
        <>
          <div
            className="card"
            style={{ borderRadius: "16px" }}
            onMouseEnter={(e) => e.currentTarget.classList.add('hovered')}
            onMouseLeave={(e) => e.currentTarget.classList.remove('hovered')}
          >
            <div className="card-body">
              <img
                style={{ height: "200px" , borderRadius:"16px" }}
                src="https://via.placeholder.com/150"
                className="card-img-top"
                alt="..."
              />
              <h5 className="card-title mt-2">Card title</h5>
              <p className="card-text">
                <del>100.000đ</del> <span style={{color:"orange"}}>50.000đ</span>
              </p>
              <button style={{backgroundColor:"black" , color:"white"}} className="btn  buy-now-button hovered:opacity-100">
                Tham gia ngay
              </button>
            </div>
          </div>
        </>
      );
}
