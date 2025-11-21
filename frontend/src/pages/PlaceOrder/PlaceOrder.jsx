import React, { useContext, useEffect, useState } from 'react'
import './PlaceOrder.css'
import { StoreContext } from '../../Context/StoreContext'
import { assets } from '../../assets/assets';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import Payment from '../Payment/Payment';
import BackButton from '../../components/BackButton/BackButton';

const PlaceOrder = () => {

    const [payment, setPayment] = useState("cod");
    const [showPayment, setShowPayment] = useState(false);
    const [orderData, setOrderData] = useState(null);

    const { getTotalCartAmount, token, food_list, cartItems, url, setCartItems, currency } = useContext(StoreContext);

    const navigate = useNavigate();

    const placeOrder = async (e) => {
        e.preventDefault();

        let orderItems = [];
        food_list.map((item) => {
            if (cartItems[item._id] > 0) {
                let itemInfo = { ...item };
                itemInfo["quantity"] = cartItems[item._id];
                orderItems.push(itemInfo);
            }
        });

        let orderData = {
            items: orderItems,
            amount: getTotalCartAmount(),
        };

        // ⭐ COD PAYMENT
        if (payment === "cod") {
            try {
                let response = await axios.post(url + "/api/order/placecod", orderData, {
                    headers: { token }
                });

                if (response.data.success) {
                    toast.success(response.data.message);
                    setCartItems({});
                    navigate("/myorders");
                } 
            } catch (error) {
                toast.error("Order failed");
            }
            return;
        }
        else {
            // ⭐ ONLINE PAYMENT — open payment page
            setOrderData(orderData);
            setShowPayment(true);
        }
    };

    useEffect(() => {
        if (!token) {
            toast.error("Please sign in to place an order");
            navigate('/cart');
        }
        else if (getTotalCartAmount() === 0) {
            navigate('/cart');
        }
    }, [token]);

    return (
        showPayment ? (
            <Payment paymentMethod={payment} orderData={orderData} />
        ) : (
            <form className='place-order' onSubmit={placeOrder}>
                <BackButton />

                <div className="place-order-right">
                    <div className="cart-total">
                        <h2>Cart Totals</h2>
                        <div>
                            <div className="cart-total-details">
                                <p>Subtotal</p>
                                <p>{currency}{getTotalCartAmount()}</p>
                            </div>
                            <hr />

                            <div className="cart-total-details">
                                <b>Total</b>
                                <b>{currency}{getTotalCartAmount()}</b>
                            </div>
                        </div>
                    </div>

                    <div className="payment">
                        <h2>Payment Method</h2>

                        <div onClick={() => setPayment("cod")} className="payment-option">
                            <img src={payment === "cod" ? assets.checked : assets.un_checked} alt="" />
                            <p>COD (Cash on Delivery)</p>
                        </div>

                        <div onClick={() => setPayment("card")} className="payment-option">
                            <img src={payment === "card" ? assets.checked : assets.un_checked} alt="" />
                            <p>Credit / Debit Card</p>
                        </div>

                        <div onClick={() => setPayment("gpay")} className="payment-option">
                            <img src={payment === "gpay" ? assets.checked : assets.un_checked} alt="" />
                            <p>Google Pay</p>
                        </div>

                        <div onClick={() => setPayment("phonepe")} className="payment-option">
                            <img src={payment === "phonepe" ? assets.checked : assets.un_checked} alt="" />
                            <p>PhonePe</p>
                        </div>

                        <div onClick={() => setPayment("upi")} className="payment-option">
                            <img src={payment === "upi" ? assets.checked : assets.un_checked} alt="" />
                            <p>UPI</p>
                        </div>
                    </div>

                    <button className='place-order-submit' type='submit'>
                        {payment === "cod" ? "Place Order" : "Proceed To Payment"}
                    </button>
                </div>
            </form>
        )
    );
}

export default PlaceOrder;
