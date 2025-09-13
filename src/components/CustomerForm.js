import React, { useState, useEffect } from 'react';

function CustomerForm({ customer, onSave, onCancel }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    if (customer) {
      setName(customer.name);
      setEmail(customer.email);
      setPhone(customer.phone);
    }
  }, [customer]);

  const handleSubmit = e => {
    e.preventDefault();
    onSave({ name, email, phone });
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: '10px' }}>
      <div>
        <label>Name:</label>
        <input value={name} onChange={e => setName(e.target.value)} required />
      </div>
      <div>
        <label>Email:</label>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
      </div>
      <div>
        <label>Phone:</label>
        <input value={phone} onChange={e => setPhone(e.target.value)} required />
      </div>
      <button type="submit">Save</button>
      <button type="button" onClick={onCancel} style={{ marginLeft: '10px' }}>Cancel</button>
    </form>
  );
}

export default CustomerForm;
