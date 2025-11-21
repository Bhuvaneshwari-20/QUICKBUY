import express from 'express';
import authMiddleware from '../middleware/auth.js';
import { listOrders, placeOrder,updateStatus,userOrders, verifyOrder, placeOrderCod, placeOrderGpay, placeOrderPhonepe, placeOrderUpi, placeOrderCard, placeOrderQr } from '../controllers/orderController.js';

const orderRouter = express.Router();

orderRouter.get("/list",listOrders);
orderRouter.post("/userorders",authMiddleware,userOrders);
orderRouter.post("/place",authMiddleware,placeOrder);
orderRouter.post("/status",updateStatus);
orderRouter.post("/verify",verifyOrder);
orderRouter.post("/placecod",authMiddleware,placeOrderCod);
orderRouter.post("/placegpay",authMiddleware,placeOrderGpay);
orderRouter.post("/placephonepe",authMiddleware,placeOrderPhonepe);
orderRouter.post("/placeupi",authMiddleware,placeOrderUpi);
orderRouter.post("/placecard",authMiddleware,placeOrderCard);
orderRouter.post("/placeqr",authMiddleware,placeOrderQr);

export default orderRouter;
