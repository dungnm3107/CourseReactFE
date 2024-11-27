import  { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../assets/css/paymentFailed.css";

export default function PaymentFailed() {
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            navigate("/"); 
        }, 3000);

        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <div className="payment-failed">
            <div className="crossmark-circle">
                <span className="crossmark">✘</span>
            </div>
            <h1>Thanh Toán Thất Bại</h1>
            <p>Đơn hàng của bạn thanh toán không thành công </p><br/>
            <p>Bạn sẽ được chuyển hướng đến trang chủ trong giây lát...</p>
        </div>
    );
}





