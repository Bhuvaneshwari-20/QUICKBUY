import React from 'react'
import  './Sidebar.css'
import { assets } from '../../assets/assets'
import { NavLink,useNavigate} from 'react-router-dom'

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.location.href = "http://localhost:5173";
  };
  
  return (
    <div className='sidebar'>
      <div className="sidebar-options">
        <NavLink to='/add' className="sidebar-option">
            <img src={assets.add_icon} alt="" />
            <p>Add Items</p>
        </NavLink>
        <NavLink to='/list' className="sidebar-option">
            <img src={assets.order_icon} alt="" />
            <p>List Items</p>
        </NavLink>
        <NavLink to='/orders' className="sidebar-option">
            <img src={assets.order_icon} alt="" />
            <p>Orders</p>
        </NavLink>
                <button className="logout-btn" onClick={handleLogout}>🚪 Logout</button>

      </div>
    </div>
  )
}

export default Sidebar
