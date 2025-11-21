import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { food_list as static_food_list, menu_list } from "../assets/assets";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const url = "http://localhost:4000";
  const [food_list, setFoodList] = useState(static_food_list);
  const [cartItems, setCartItems] = useState({});
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  const currency = "₹";
  const deliveryCharge = 50;

  // ✅ Add to Cart
  const addToCart = async (itemId) => {
    if (!token || token.trim() === "") {
      alert("Please log in to add items to your cart!");
      return;
    }

    setCartItems((prev) => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1,
    }));

    try {
      await axios.post(`${url}/api/cart/add`, { itemId }, { headers: { token } });
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  // ✅ Remove from Cart
  const removeFromCart = async (itemId) => {
    setCartItems((prev) => ({
      ...prev,
      [itemId]: Math.max((prev[itemId] || 0) - 1, 0),
    }));

    try {
      if (token) {
        await axios.post(`${url}/api/cart/remove`, { itemId }, { headers: { token } });
      }
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  // ✅ Calculate Total
  const getTotalCartAmount = () => {
    let total = 0;
    for (const item in cartItems) {
      const product = food_list.find((p) => p._id === item);
      if (product) {
        total += product.price * cartItems[item];
      }
    }
    return total;
  };

  // ✅ Fetch Food List
  const fetchFoodList = async () => {
    try {
      const response = await axios.get(`${url}/api/food/list`);
      if (response.data.success) {
        setFoodList(response.data.data);
      } else {
        setFoodList(static_food_list);
      }
    } catch (error) {
      console.error("Error fetching food list:", error);
      setFoodList(static_food_list);
    }
  };

  // ✅ Load Cart Data
  const loadCartData = async (tokenValue) => {
    try {
      const response = await axios.post(`${url}/api/cart/get`, {}, { headers: { token: tokenValue } });
      setCartItems(response.data.cartData || {});
    } catch (error) {
      console.error("Error loading cart data:", error);
    }
  };

  useEffect(() => {
    async function loadData() {
      await fetchFoodList();
      const savedToken = localStorage.getItem("token");
      if (savedToken) {
        setToken(savedToken);
        await loadCartData(savedToken);
      }
    }
    loadData();
  }, []);

  const contextValue = {
    url,
    food_list,
    menu_list,
    cartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    token,
    setToken,
    loadCartData,
    setCartItems,
    currency,
    deliveryCharge,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
