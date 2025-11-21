import React, { useContext, useEffect, useState } from 'react';
import './Profile.css';
import { StoreContext } from '../../Context/StoreContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import BackButton from '../../components/BackButton/BackButton';

const Profile = () => {
  const { url, token } = useContext(StoreContext);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressForm, setAddressForm] = useState({
    type: 'home',
    street: '',
    city: '',
    state: '',
    zipcode: '',
    country: '',
    phone: '',
    isDefault: false
  });

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await axios.post(`${url}/api/user/profile`, {}, {
        headers: { token }
      });

      if (response.data.success) {
        setUserData(response.data.data);
        setFormData(response.data.data);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePreferenceChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [name]: type === 'checkbox' ? checked : value
      }
    }));
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${url}/api/user/update-profile`, formData, {
        headers: { token }
      });

      if (response.data.success) {
        setUserData(response.data.data);
        setEditing(false);
        toast.success('Profile updated successfully');
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${url}/api/user/add-address`, addressForm, {
        headers: { token }
      });

      if (response.data.success) {
        setUserData(response.data.data);
        setShowAddressForm(false);
        setAddressForm({
          type: 'home',
          street: '',
          city: '',
          state: '',
          zipcode: '',
          country: '',
          phone: '',
          isDefault: false
        });
        toast.success('Address added successfully');
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error('Error adding address:', error);
      toast.error('Failed to add address');
    }
  };

  const handleDeleteAddress = async (addressId) => {
    if (!window.confirm('Are you sure you want to delete this address?')) return;

    try {
      const response = await axios.post(`${url}/api/user/delete-address`, { addressId }, {
        headers: { token }
      });

      if (response.data.success) {
        setUserData(response.data.data);
        toast.success('Address deleted successfully');
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error('Error deleting address:', error);
      toast.error('Failed to delete address');
    }
  };

  if (loading) {
    return (
      <div className="profile-loading">
        <div className="spinner"></div>
        <p>Loading profile...</p>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="profile-error">
        <p>Failed to load profile data</p>
        <button onClick={fetchUserProfile}>Retry</button>
      </div>
    );
  }

  return (
    <div className="profile">
      <div className="profile-container">
        <BackButton />
        <div className="profile-header">
          <h2>My Profile</h2>
          {!editing && (
            <button
              className="edit-btn"
              onClick={() => setEditing(true)}
            >
              Edit Profile
            </button>
          )}
        </div>

        <div className="profile-content">
          {/* Basic Information */}
          <div className="profile-section">
            <h3>Basic Information</h3>
            {editing ? (
              <form onSubmit={handleUpdateProfile} className="profile-form">
                <div className="form-group">
                  <label>Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name || ''}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email || ''}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input
                    type="tel"
                    name="phoneno"
                    value={formData.phoneno || ''}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Date of Birth</label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth ? new Date(formData.dateOfBirth).toISOString().split('T')[0] : ''}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>Gender</label>
                  <select
                    name="gender"
                    value={formData.gender || ''}
                    onChange={handleInputChange}
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="prefer-not-to-say">Prefer not to say</option>
                  </select>
                </div>
                <div className="form-actions">
                  <button type="submit" className="save-btn">Save Changes</button>
                  <button type="button" className="cancel-btn" onClick={() => {
                    setEditing(false);
                    setFormData(userData);
                  }}>Cancel</button>
                </div>
              </form>
            ) : (
              <div className="profile-info">
                <div className="info-item">
                  <span className="label">Name:</span>
                  <span className="value">{userData.name}</span>
                </div>
                <div className="info-item">
                  <span className="label">Email:</span>
                  <span className="value">{userData.email}</span>
                </div>
                <div className="info-item">
                  <span className="label">Phone:</span>
                  <span className="value">{userData.phoneno}</span>
                </div>
                <div className="info-item">
                  <span className="label">Date of Birth:</span>
                  <span className="value">
                    {userData.dateOfBirth ? new Date(userData.dateOfBirth).toLocaleDateString() : 'Not set'}
                  </span>
                </div>
                <div className="info-item">
                  <span className="label">Gender:</span>
                  <span className="value">{userData.gender || 'Not set'}</span>
                </div>
              </div>
            )}
          </div>

          {/* Addresses */}
          <div className="profile-section">
            <div className="section-header">
              <h3>Addresses</h3>
              <button
                className="add-btn"
                onClick={() => setShowAddressForm(true)}
              >
                Add Address
              </button>
            </div>

            {showAddressForm && (
              <form onSubmit={handleAddAddress} className="address-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Address Type</label>
                    <select
                      value={addressForm.type}
                      onChange={(e) => setAddressForm(prev => ({ ...prev, type: e.target.value }))}
                      required
                    >
                      <option value="home">Home</option>
                      <option value="work">Work</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Phone</label>
                    <input
                      type="tel"
                      value={addressForm.phone}
                      onChange={(e) => setAddressForm(prev => ({ ...prev, phone: e.target.value }))}
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Street Address</label>
                  <input
                    type="text"
                    value={addressForm.street}
                    onChange={(e) => setAddressForm(prev => ({ ...prev, street: e.target.value }))}
                    required
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>City</label>
                    <input
                      type="text"
                      value={addressForm.city}
                      onChange={(e) => setAddressForm(prev => ({ ...prev, city: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>State</label>
                    <input
                      type="text"
                      value={addressForm.state}
                      onChange={(e) => setAddressForm(prev => ({ ...prev, state: e.target.value }))}
                      required
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Zipcode</label>
                    <input
                      type="text"
                      value={addressForm.zipcode}
                      onChange={(e) => setAddressForm(prev => ({ ...prev, zipcode: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Country</label>
                    <input
                      type="text"
                      value={addressForm.country}
                      onChange={(e) => setAddressForm(prev => ({ ...prev, country: e.target.value }))}
                      required
                    />
                  </div>
                </div>
                <div className="form-group checkbox-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={addressForm.isDefault}
                      onChange={(e) => setAddressForm(prev => ({ ...prev, isDefault: e.target.checked }))}
                    />
                    Set as default address
                  </label>
                </div>
                <div className="form-actions">
                  <button type="submit" className="save-btn">Add Address</button>
                  <button type="button" className="cancel-btn" onClick={() => {
                    setShowAddressForm(false);
                    setAddressForm({
                      type: 'home',
                      street: '',
                      city: '',
                      state: '',
                      zipcode: '',
                      country: '',
                      phone: '',
                      isDefault: false
                    });
                  }}>Cancel</button>
                </div>
              </form>
            )}

            <div className="addresses-list">
              {userData.addresses && userData.addresses.length > 0 ? (
                userData.addresses.map((address, index) => (
                  <div key={index} className={`address-card ${address.isDefault ? 'default' : ''}`}>
                    <div className="address-header">
                      <span className="address-type">{address.type}</span>
                      {address.isDefault && <span className="default-badge">Default</span>}
                      <button
                        className="delete-btn"
                        onClick={() => handleDeleteAddress(address._id)}
                      >
                        Delete
                      </button>
                    </div>
                    <div className="address-details">
                      <p>{address.street}</p>
                      <p>{address.city}, {address.state}, {address.zipcode}</p>
                      <p>{address.country}</p>
                      <p>Phone: {address.phone}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="no-addresses">No addresses added yet</p>
              )}
            </div>
          </div>

          {/* Preferences */}
          <div className="profile-section">
            <h3>Preferences</h3>
            {editing ? (
              <div className="preferences-form">
                <div className="form-group">
                  <label>Dietary Restrictions</label>
                  <input
                    type="text"
                    name="dietaryRestrictions"
                    value={formData.preferences?.dietaryRestrictions?.join(', ') || ''}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      preferences: {
                        ...prev.preferences,
                        dietaryRestrictions: e.target.value.split(',').map(item => item.trim()).filter(item => item)
                      }
                    }))}
                    placeholder="e.g., vegetarian, gluten-free"
                  />
                </div>
                <div className="form-group">
                  <label>Favorite Cuisines</label>
                  <input
                    type="text"
                    name="favoriteCuisines"
                    value={formData.preferences?.favoriteCuisines?.join(', ') || ''}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      preferences: {
                        ...prev.preferences,
                        favoriteCuisines: e.target.value.split(',').map(item => item.trim()).filter(item => item)
                      }
                    }))}
                    placeholder="e.g., Italian, Chinese, Mexican"
                  />
                </div>
                <div className="notification-preferences">
                  <h4>Notification Preferences</h4>
                  <div className="checkbox-group">
                    <label>
                      <input
                        type="checkbox"
                        name="orderUpdates"
                        checked={formData.preferences?.notifications?.orderUpdates || false}
                        onChange={handlePreferenceChange}
                      />
                      Order Updates
                    </label>
                  </div>
                  <div className="checkbox-group">
                    <label>
                      <input
                        type="checkbox"
                        name="promotions"
                        checked={formData.preferences?.notifications?.promotions || false}
                        onChange={handlePreferenceChange}
                      />
                      Promotional Offers
                    </label>
                  </div>
                  <div className="checkbox-group">
                    <label>
                      <input
                        type="checkbox"
                        name="emailUpdates"
                        checked={formData.preferences?.notifications?.emailUpdates || false}
                        onChange={handlePreferenceChange}
                      />
                      Email Updates
                    </label>
                  </div>
                </div>
              </div>
            ) : (
              <div className="preferences-info">
                <div className="info-item">
                  <span className="label">Dietary Restrictions:</span>
                  <span className="value">
                    {userData.preferences?.dietaryRestrictions?.length > 0
                      ? userData.preferences.dietaryRestrictions.join(', ')
                      : 'None specified'
                    }
                  </span>
                </div>
                <div className="info-item">
                  <span className="label">Favorite Cuisines:</span>
                  <span className="value">
                    {userData.preferences?.favoriteCuisines?.length > 0
                      ? userData.preferences.favoriteCuisines.join(', ')
                      : 'None specified'
                    }
                  </span>
                </div>
                <div className="info-item">
                  <span className="label">Notifications:</span>
                  <div className="notification-settings">
                    <span>Order Updates: {userData.preferences?.notifications?.orderUpdates ? 'On' : 'Off'}</span>
                    <span>Promotions: {userData.preferences?.notifications?.promotions ? 'On' : 'Off'}</span>
                    <span>Email Updates: {userData.preferences?.notifications?.emailUpdates ? 'On' : 'Off'}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
