# TODO: Simplify Food Delivery App and Fix Payment Bugs

## Tasks to Complete

### 1. Simplify App.jsx
- Remove routes for /myorders, /profile, /verify, /forgot-password, /reset-password/:token to reduce complexity.

### 2. Simplify Home.jsx
- Remove the live orders section (div with className="live-orders-section") and related state/useEffect for fetching live orders.

### 3. Simplify FoodDisplay.jsx
- Remove searchTerm, sortBy, priceRange, ratingFilter states.
- Remove related UI: search-bar, filter-controls, results-info, no-results.
- Simplify to display all dishes without filters, sorting, or search.

### 4. Fix Payment.jsx
- Modify handlePayment to always succeed: show toast "Order Placed", setCartItems({}), setShowSuccess(true).
- Remove or mock backend API calls for payment methods (GPay, PhonePe, UPI, Card).

### 5. Simplify StoreContext.jsx
- Remove socket.io import and related logic (socket state, useEffect for socket, joinOrderRoom, orderUpdates).
- Set food_list to static_food_list directly, remove fetchFoodList call.

## Followup Steps
- Test the frontend by running `npm run dev` in food-del/frontend.
- Verify images load by checking food_list in assets.js.
- Ensure no console errors and app runs smoothly.
- If backend is needed for other parts, run it (but payments are now mocked).
