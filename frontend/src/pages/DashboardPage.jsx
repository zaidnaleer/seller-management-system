import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getAllSellers, createSeller, updateSeller, deleteSeller } from '../api/sellerApi';
import SellerFormModal from '../components/SellerFormModal';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

function StatusStamp({ status }) {
  const cls =
    status === 'ACTIVE' ? 'stamp stamp-active' :
    status === 'SUSPENDED' ? 'stamp stamp-suspended' :
    'stamp stamp-pending';
  return <span className={cls}>{status.replace('_', ' ')}</span>;
}

const AVATAR_PALETTE = ['#c08a3e', '#4f9d69', '#b24c3d', '#5b7fa6', '#9a7bb0'];

function avatarColorFor(name) {
  const sum = name.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return AVATAR_PALETTE[sum % AVATAR_PALETTE.length];
}

function SellerAvatar({ name }) {
  const initial = name?.trim()?.[0]?.toUpperCase() || '?';
  return (
    <div className="seller-avatar" style={{ background: avatarColorFor(name || '?') }}>
      {initial}
    </div>
  );
}

export default function DashboardPage() {
  const { email, logout } = useAuth();
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSeller, setEditingSeller] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [exporting, setExporting] = useState(false);
  const PAGE_SIZE = 10;

  useEffect(() => { loadSellers(0); }, []);

  const loadSellers = async (pageToLoad = 0) => {
    setLoading(true);
    setLoadError('');
    try {
      const result = await getAllSellers(pageToLoad, PAGE_SIZE);
      setSellers(result.data);
      setPage(pageToLoad);
      setHasMore(result.data.length === PAGE_SIZE);
    } catch (err) {
      setLoadError('Failed to load sellers. Please refresh.');
    } finally {
      setLoading(false);
    }
  };

  const filteredSellers = sellers.filter((s) => {
    const term = searchTerm.toLowerCase();
    return s.businessName.toLowerCase().includes(term) || s.email.toLowerCase().includes(term);
  });

  const openAddModal = () => { setEditingSeller(null); setModalOpen(true); };
  const openEditModal = (seller) => { setEditingSeller(seller); setModalOpen(true); };
  const closeModal = () => { setModalOpen(false); setEditingSeller(null); };

  const handleSave = async (formData) => {
    setSaving(true);
    try {
      if (editingSeller) {
        const optimisticSeller = { ...editingSeller, ...formData };
        setSellers((prev) => prev.map((s) => (s.id === editingSeller.id ? optimisticSeller : s)));
        const updated = await updateSeller(editingSeller.id, formData);
        setSellers((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
      } else {
        const created = await createSeller(formData);
        setSellers((prev) => [created, ...prev]);
      }
      closeModal();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this seller? This cannot be undone.')) return;
    setDeletingId(id);
    const previousSellers = sellers;
    setSellers((prev) => prev.filter((s) => s.id !== id));
    try {
      await deleteSeller(id);
    } catch (err) {
      setSellers(previousSellers);
      alert('Failed to delete seller. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  const handleExportPdf = async () => {
  setExporting(true);
  try {
    // Pull the full list for export, not just the current page
    const result = await getAllSellers(0, 1000);

    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Seller Ledger', 14, 18);
    doc.setFontSize(10);
    doc.setTextColor(120);
    doc.text(`Exported ${new Date().toLocaleString()}`, 14, 25);

    autoTable(doc, {
      startY: 32,
      head: [['Business', 'Email', 'Phone', 'GST Number', 'Status']],
      body: result.data.map((s) => [
        s.businessName,
        s.email,
        s.phoneNumber || '—',
        s.gstNumber || '—',
        s.status,
      ]),
      styles: { font: 'helvetica', fontSize: 9, cellPadding: 5 },
      headStyles: { fillColor: [18, 22, 28], textColor: [236, 231, 220] },
      alternateRowStyles: { fillColor: [245, 242, 235] },
    });

    doc.save(`seller-ledger-${new Date().toISOString().slice(0, 10)}.pdf`);
  } catch (err) {
    alert('Failed to export PDF. Please try again.');
  } finally {
    setExporting(false);
  }
};

  return (
    <div className="dash-container">
      <header className="dash-header">
        <div>
          <div className="dash-eyebrow">Registry Control</div>
          <h2>Seller Ledger</h2>
        </div>
        <div className="dash-user">
          <span className="dash-user-email">{email}</span>
          <button onClick={logout} className="btn-ghost">Log Out</button>
        </div>
      </header>

      <div className="dash-toolbar">
        <input
          type="text"
          placeholder="Search by business name or email…"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="dash-search"
        />
         <button onClick={handleExportPdf} disabled={exporting} className="btn-export">
    {exporting ? 'Exporting…' : '⬇ Export PDF'}
  </button>
  <button onClick={openAddModal} className="btn-add">+ Add Seller</button>
      </div>

      {loading && <p className="dash-empty">Loading sellers…</p>}
      {loadError && <p className="dash-empty">{loadError}</p>}

      {!loading && !loadError && filteredSellers.length === 0 && (
        <p className="dash-empty">
          {searchTerm ? 'No sellers match your search.' : 'No sellers yet. Click "Add Seller" to open your first entry.'}
        </p>
      )}

      {!loading && filteredSellers.length > 0 && (
        <table className="ledger-table">
          <thead>
            <tr>
              <th>Business</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredSellers.map((seller) => (
              <tr key={seller.id}>
                <td className="cell-business">
  <div className="cell-business-wrap">
    <SellerAvatar name={seller.businessName} />
    {seller.businessName}
  </div>
</td>
                <td className="cell-mono">{seller.email}</td>
                <td className="cell-mono">{seller.phoneNumber || '—'}</td>
                <td><StatusStamp status={seller.status} /></td>
                <td>
                  <div className="row-actions">
                    <button onClick={() => openEditModal(seller)} className="btn-edit">Edit</button>
                    <button
                      onClick={() => handleDelete(seller.id)}
                      disabled={deletingId === seller.id}
                      className="btn-delete"
                    >
                      {deletingId === seller.id ? 'Deleting…' : 'Delete'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {!loading && sellers.length > 0 && (
        <div className="dash-pagination">
          <button onClick={() => loadSellers(page - 1)} disabled={page === 0} className="page-btn">← Previous</button>
          <span className="page-label">Page {page + 1}</span>
          <button onClick={() => loadSellers(page + 1)} disabled={!hasMore} className="page-btn">Next →</button>
        </div>
      )}

      {modalOpen && (
        <SellerFormModal seller={editingSeller} onSave={handleSave} onCancel={closeModal} saving={saving} />
      )}
    </div>
  );
}