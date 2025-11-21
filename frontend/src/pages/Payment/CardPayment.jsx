import React, { useContext, useState } from 'react'
import './Payment.css'
import { StoreContext } from '../../Context/StoreContext'
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import PaymentSuccess from './PaymentSuccess';
import BackButton from '../../components/BackButton/BackButton';

const CardPayment = () => {

    const { token, url, setCartItems } = useContext(StoreContext);
    const navigate = useNavigate();
    const location = useLocation();
    const orderData = location.state?.orderData;

    const [cardDetails, setCardDetails] = useState({
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        cardHolderName: ''
    });
    const [showSuccess, setShowSuccess] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCardDetails(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handlePayment = async (e) => {
        e.preventDefault();

        // Basic validation
        if (!cardDetails.cardNumber || !cardDetails.expiryDate || !cardDetails.cvv || !cardDetails.cardHolderName) {
            toast.error("Please fill all card details");
            return;
        }

        try {
            const response = await axios.post(url + "/api/order/placecard", {
                ...orderData,
                cardDetails
            }, { headers: { token } });

            if (response.data.success) {
                setCartItems({});
                setShowSuccess(true);
            } else {
                toast.error("Payment Failed");
            }
        } catch (error) {
            toast.error("Something Went Wrong");
        }
    };

    if (showSuccess) {
        return <PaymentSuccess paymentMethod="card" orderData={orderData} />;
    }

    return (
        <div className='payment-page'>
            <BackButton />
            <h2>Credit / Debit Card Payment</h2>
            <form onSubmit={handlePayment} className='card-payment-form'>
                <div className='card-input-group'>
                    <label>Card Number</label>
                    <input
                        type="text"
                        name="cardNumber"
                        placeholder="1234 5678 9012 3456"
                        value={cardDetails.cardNumber}
                        onChange={handleInputChange}
                        maxLength="19"
                        required
                    />
                </div>
                <div className='card-input-row'>
                    <div className='card-input-group'>
                        <label>Expiry Date</label>
                        <input
                            type="text"
                            name="expiryDate"
                            placeholder="MM/YY"
                            value={cardDetails.expiryDate}
                            onChange={handleInputChange}
                            maxLength="5"
                            required
                        />
                    </div>
                    <div className='card-input-group'>
                        <label>CVV</label>
                        <input
                            type="text"
                            name="cvv"
                            placeholder="123"
                            value={cardDetails.cvv}
                            onChange={handleInputChange}
                            maxLength="4"
                            required
                        />
                    </div>
                </div>
                <div className='card-input-group'>
                    <label>Card Holder Name</label>
                    <input
                        type="text"
                        name="cardHolderName"
                        placeholder="John Doe"
                        value={cardDetails.cardHolderName}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <button type="submit" className='pay-now-btn'>Pay Now</button>
            </form>
        </div>
    )
}

export default CardPayment
