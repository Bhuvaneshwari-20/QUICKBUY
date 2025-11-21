import React, { useEffect, useState } from 'react'
import './PaymentSuccess.css'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import BackButton from '../../components/BackButton/BackButton';

const PaymentSuccess = ({ paymentMethod, orderData }) => {
    const navigate = useNavigate();
    const [countdown, setCountdown] = useState(5);

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    navigate("/myorders");
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [navigate]);

    const estimatedTime = Math.floor(Math.random() * 30) + 15; // Random time between 15-45 minutes

    return (
        <div className='payment-success'>
            <BackButton />
            <div className='success-content'>
                <div className='success-icon'>✓</div>
                <h2>Payment Successful!</h2>
                <p>Your order has been placed successfully using {paymentMethod}.</p>
                <div className='order-details'>
                    <p><strong>Order Amount:</strong> ₹{orderData.amount}</p>
                    <p><strong>Estimated Delivery Time:</strong> {estimatedTime} minutes</p>
                </div>
                <p className='redirect-message'>Redirecting to My Orders in {countdown} seconds...</p>
                <button onClick={() => navigate("/myorders")} className='view-orders-btn'>View My Orders</button>
            </div>
        </div>
    )
}

export default PaymentSuccess
