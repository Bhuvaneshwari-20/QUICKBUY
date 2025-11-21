import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Config
const currency = "inr";
const frontend_URL = 'http://localhost:5173';

// ------------------------------------------------------------
// PLACE ORDER (STRIPE)
// ------------------------------------------------------------
const placeOrder = async (req, res) => {
    try {
        const newOrder = new orderModel({
            userId: req.body.userId,
            items: req.body.items,
            amount: req.body.amount,
        });

        await newOrder.save();
        await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

        const line_items = req.body.items.map((item) => ({
            price_data: {
                currency: currency,
                product_data: { name: item.name },
                unit_amount: item.price * 100
            },
            quantity: item.quantity
        }));

        // ❌ Removed delivery charge item
        // ❌ Removed address

        const session = await stripe.checkout.sessions.create({
            success_url: `${frontend_URL}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${frontend_URL}/verify?success=false&orderId=${newOrder._id}`,
            line_items: line_items,
            mode: "payment",
        });

        res.json({ success: true, session_url: session.url });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

// ------------------------------------------------------------
// PLACE ORDER (COD)
// ------------------------------------------------------------
const placeOrderCod = async (req, res) => {
    try {
        const newOrder = new orderModel({
            userId: req.body.userId,
            items: req.body.items,
            amount: req.body.amount,
            payment: true,
        });

        await newOrder.save();
        await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

        res.json({ success: true, message: "Order Placed" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

// ------------------------------------------------------------
// LIST ORDERS (ADMIN)
// ------------------------------------------------------------
const listOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({});
        res.json({ success: true, data: orders });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

// ------------------------------------------------------------
// USER ORDERS
// ------------------------------------------------------------
const userOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({ userId: req.body.userId });
        res.json({ success: true, data: orders });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

// ------------------------------------------------------------
// UPDATE ORDER STATUS (ADMIN)
// ------------------------------------------------------------
const updateStatus = async (req, res) => {
    console.log(req.body);

    try {
        const order = await orderModel.findById(req.body.orderId);
        if (!order) {
            return res.json({ success: false, message: "Order not found" });
        }

        const newStatus = req.body.status;

        // Update the status
        await orderModel.findByIdAndUpdate(req.body.orderId, {
            status: newStatus,
            $push: {
                trackingUpdates: {
                    status: newStatus,
                    message: req.body.message || `Order status updated to ${newStatus}`,
                    timestamp: new Date()
                }
            }
        });

        // Emit socket event
        const io = req.app.get("io");
        if (io) {
            io.to(`order-${req.body.orderId}`).emit("order-status-update", {
                orderId: req.body.orderId,
                status: newStatus,
                message: req.body.message || `Order status updated to ${newStatus}`,
                timestamp: new Date()
            });
        }

        res.json({ success: true, message: "Status Updated" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

// ------------------------------------------------------------
// VERIFY ORDER PAYMENT
// ------------------------------------------------------------
const verifyOrder = async (req, res) => {
    const { orderId, success } = req.body;

    try {
        if (success === "true") {
            await orderModel.findByIdAndUpdate(orderId, { payment: true });
            res.json({ success: true, message: "Paid" });
        } else {
            await orderModel.findByIdAndDelete(orderId);
            res.json({ success: false, message: "Not Paid" });
        }

    } catch (error) {
        res.json({ success: false, message: "Not Verified" });
    }
};

// ------------------------------------------------------------
// DIRECT PAYMENT METHODS (GPay, PhonePe, UPI, Card, QR)
// ------------------------------------------------------------
const placeOrderGpay = async (req, res) => {
    try {
        const newOrder = new orderModel({
            userId: req.body.userId,
            items: req.body.items,
            amount: req.body.amount,
            payment: true,
        });

        await newOrder.save();
        await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

        res.json({ success: true, message: "Order Placed with Google Pay" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

const placeOrderPhonepe = async (req, res) => {
    try {
        const newOrder = new orderModel({
            userId: req.body.userId,
            items: req.body.items,
            amount: req.body.amount,
            payment: true,
        });

        await newOrder.save();
        await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

        res.json({ success: true, message: "Order Placed with PhonePe" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

const placeOrderUpi = async (req, res) => {
    try {
        const newOrder = new orderModel({
            userId: req.body.userId,
            items: req.body.items,
            amount: req.body.amount,
            upiId: req.body.upiId,
            payment: true,
        });

        await newOrder.save();
        await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

        res.json({ success: true, message: "Order Placed with UPI" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

const placeOrderCard = async (req, res) => {
    try {
        const newOrder = new orderModel({
            userId: req.body.userId,
            items: req.body.items,
            amount: req.body.amount,
            cardDetails: req.body.cardDetails,
            payment: true,
        });

        await newOrder.save();
        await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

        res.json({ success: true, message: "Order Placed with Card" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

const placeOrderQr = async (req, res) => {
    try {
        const newOrder = new orderModel({
            userId: req.body.userId,
            items: req.body.items,
            amount: req.body.amount,
            payment: true,
        });

        await newOrder.save();
        await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

        res.json({ success: true, message: "Order Placed with QR Payment" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

export {
    placeOrder,
    listOrders,
    userOrders,
    updateStatus,
    verifyOrder,
    placeOrderCod,
    placeOrderGpay,
    placeOrderPhonepe,
    placeOrderUpi,
    placeOrderCard,
    placeOrderQr
};
