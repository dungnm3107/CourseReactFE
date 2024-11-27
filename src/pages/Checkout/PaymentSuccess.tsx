import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../assets/css/paymentSuccess.css";

export default function PaymentSuccess() {
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            navigate("/"); 
        }, 4000);

        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <div className="payment-success">
            <div className="checkmark-circle-nmd">
                <span className="checkmark">✔</span>
            </div>
            <h1>Thanh toán thành công</h1>
            <p>Cảm ơn bạn đã thanh toán. Bạn sẽ được chuyển hướng đến trang chủ trong giây lát...</p>
        </div>
    );
}
