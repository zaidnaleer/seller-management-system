import { useState, useEffect } from 'react';

export default function SellerFormModal({ seller, onSave, onCancel, saving }) {
  const [businessName, setBusinessName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [gstNumber, setGstNumber] = useState('');
  const [error, setError] = useState('');

  const isEditMode = !!seller;

  useEffect(() => {
    if (seller) {
      setBusinessName(seller.businessName || '');
      setEmail(seller.email || '');
      setPhoneNumber(seller.phoneNumber || '');
      setGstNumber(seller.gstNumber || '');
    }
  }, [seller]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!businessName.trim()) { setError('Business name is required.'); return; }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) { setError('Please enter a valid email address.'); return; }
    try {
      await onSave({ businessName, email, phoneNumber, gstNumber });
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong. Please try again.');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <h3>{isEditMode ? 'Edit Seller' : 'New Ledger Entry'}</h3>
        {error && <div className="auth-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Business Name</label>
            <input value={businessName} onChange={(e) => setBusinessName(e.target.value)} required />
          </div>
          <div className="field">
            <label>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="field">
            <label>Phone Number</label>
            <input value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
          </div>
          <div className="field">
            <label>GST Number</label>
            <input value={gstNumber} onChange={(e) => setGstNumber(e.target.value)} />
          </div>
          <div className="modal-buttons">
            <button type="button" onClick={onCancel} disabled={saving} className="btn-cancel">Cancel</button>
            <button type="submit" disabled={saving} className="btn-save">
              {saving ? 'Saving…' : isEditMode ? 'Save Changes' : 'Add Seller'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}