import React, { useContext, useState } from 'react'
import './Payment.css'
import { StoreContext } from '../../Context/StoreContext'
import { assets } from '../../assets/assets';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from "axios";
import PaymentSuccess from './PaymentSuccess';
import BackButton from '../../components/BackButton/BackButton';

const Payment = ({ paymentMethod, orderData }) => {

    const { token, url, setCartItems } = useContext(StoreContext);
    const navigate = useNavigate();

    const [upiId, setUpiId] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);

    const handlePayment = async () => {
        let endpoint = "";

        if (paymentMethod === "gpay") endpoint = "/placegpay";
        if (paymentMethod === "phonepe") endpoint = "/placephonepe";
        if (paymentMethod === "upi") endpoint = "/placeupi";
        if (paymentMethod === "card") endpoint = "/placecard";
        if (paymentMethod === "qr") endpoint = "/placeqr";

        let payload = {
            ...orderData,
            upiId: upiId,
        };

        try {
            await axios.post(url + "/api/order" + endpoint, payload, {
                headers: { token }
            });

            toast.success("Order Placed");
            setCartItems({});
            setShowSuccess(true);

        } catch (err) {
            toast.error("Payment Failed");
        }
    };

    if (showSuccess) {
        return <PaymentSuccess paymentMethod={paymentMethod} orderData={orderData} />;
    }

    return (
        <div className='payment-page'>
            <BackButton />
            <h2>Complete Payment</h2>

            {paymentMethod === 'gpay' && (
                <div className='payment-method'>
                    <div className='qr-code'>
                        <img src={assets.qr} alt="GPay QR Code" />
                        <p>Scan QR Code or Pay with Google Pay</p>
                    </div>
                    <button onClick={handlePayment}>Pay Now</button>
                </div>
            )}

            {paymentMethod === 'phonepe' && (
                <div className='payment-method'>
                    <div className='qr-code'>
                        <img src={assets.qr} alt="PhonePe QR Code" />
                        <p>Scan QR Code or Pay with PhonePe</p>
                    </div>
                    <button onClick={handlePayment}>Pay Now</button>
                </div>
            )}

            {paymentMethod === 'upi' && (
                <div className='payment-method'>
                    <div className='qr-code'>
                        <img src={assets.upi} alt="UPI QR Code" />
                        <p>Scan QR Code or Enter UPI ID</p>
                    </div>
                    <input
                        type="text"
                        placeholder="Enter UPI ID"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                    />
                    <button onClick={handlePayment}>Pay Now</button>
                </div>
            )}

        </div>
    );
};

export default Payment;
