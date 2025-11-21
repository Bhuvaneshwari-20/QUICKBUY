import React, { useEffect, useState } from 'react'
import './Orders.css'
import { toast } from 'react-toastify';
import axios from 'axios';
import { assets, url, currency } from '../../assets/assets';

const Order = () => {

  const [orders, setOrders] = useState([]);

  const fetchAllOrders = async () => {
    const response = await axios.get(`${url}/api/order/list`)
    if (response.data.success) {
      setOrders(response.data.data.reverse());
    }
    else {
      toast.error("Error")
    }
  }

  const statusHandler = async (event, orderId) => {
    const response = await axios.post(`${url}/api/order/status`, {
      orderId,
      status: event.target.value
    })
    if (response.data.success) {
      await fetchAllOrders();
    }
  }

  useEffect(() => {
    fetchAllOrders();
  }, [])

  return (
    <div className='order add'>
      <h3>Orders</h3>

      <div className="order-list">
        {orders.map((order, index) => (
          <div key={index} className='order-item'>
            <img src={assets.parcel_icon} alt="" />

            <div>
              <p className='order-item-food'>
                {order.items.map((item, i) => {
                  if (i === order.items.length - 1) {
                    return item.name + " x " + item.quantity
                  } else {
                    return item.name + " x " + item.quantity + ", "
                  }
                })}
              </p>

              {/* No address in canteen system */}
              <p className='order-item-name'>Order ID: {order._id}</p>
              <p>User ID: {order.userId}</p>
              <p>Total Amount: ₹{order.amount}</p>
            </div>

            <p>Items: {order.items.length}</p>

            <select onChange={(e) => statusHandler(e, order._id)} value={order.status}>
              <option value="Pending">Pending</option>
              <option value="Cooking">Cooking</option>
              <option value="Ready">Ready</option>
              <option value="Completed">Completed</option>
            </select>

          </div>
        ))}
      </div>
    </div>
  )
}

export default Order
