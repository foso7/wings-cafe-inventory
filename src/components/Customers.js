import React, { useState, useEffect } from "react";
import axios from "axios";

function Customers() {
  const [customers, setCustomers] = useState([]);
  const [form, setForm] = useState({ 
    name: "", 
    email: "", 
    phone: "", 
    address: "" 
  });
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Load customers from backend
  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/customers");
      setCustomers(res.data);
    } catch (err) {
      console.error("Error fetching customers:", err);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email) {
      alert("Please fill in at least name and email.");
      return;
    }

    try {
      if (isEditing && editingCustomer) {
        // Update existing customer
        await axios.put(`http://localhost:5000/customers/${editingCustomer.id}`, form);
        setIsEditing(false);
        setEditingCustomer(null);
      } else {
        // Add new customer
        await axios.post("http://localhost:5000/customers", form);
      }

      setForm({ name: "", email: "", phone: "", address: "" });
      fetchCustomers(); // Refresh the list
    } catch (err) {
      console.error("Error saving customer:", err);
    }
  };

  const handleEdit = (customer) => {
    setForm({
      name: customer.name,
      email: customer.email,
      phone: customer.phone || "",
      address: customer.address || ""
    });
    setEditingCustomer(customer);
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this customer?")) return;
    
    try {
      await axios.delete(`http://localhost:5000/customers/${id}`);
      fetchCustomers(); // Refresh the list
    } catch (err) {
      console.error("Error deleting customer:", err);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditingCustomer(null);
    setForm({ name: "", email: "", phone: "", address: "" });
  };

  return (
    <div className="main-container">
      <h2 className="page-header">Customer Management</h2>

      {/* Add/Edit Customer Form */}
      <div className="form-container">
        <h3 className="section-header">
          {isEditing ? "Edit Customer" : "Add New Customer"}
        </h3>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Name *</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Full Name"
                required
              />
            </div>

            <div className="form-group">
              <label>Email *</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="email@example.com"
                required
              />
            </div>

            <div className="form-group">
              <label>Phone</label>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Phone Number"
              />
            </div>

            <div className="form-group">
              <label>Address</label>
              <textarea
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Full Address"
                rows="3"
              />
            </div>
          </div>

          <div className="action-buttons">
            <button type="submit" className="btn btn-primary">
              {isEditing ? "Update Customer" : "Add Customer"}
            </button>
            {isEditing && (
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={handleCancelEdit}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Customers List */}
      <div className="table-container">
        <h3 className="section-header">Customer List</h3>
        {customers.length === 0 ? (
          <div className="empty-state">
            <h3>No Customers Found</h3>
            <p>Add your first customer using the form above.</p>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Address</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer.id}>
                  <td>{customer.name}</td>
                  <td>{customer.email}</td>
                  <td>{customer.phone || "-"}</td>
                  <td>{customer.address || "-"}</td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="btn btn-warning btn-sm"
                        onClick={() => handleEdit(customer)}
                      >
                        Edit
                      </button>
                      <button 
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(customer.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Customers;