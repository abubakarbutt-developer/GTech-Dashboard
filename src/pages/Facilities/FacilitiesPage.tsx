import {
    Package,
    CheckCircle2,
    AlertCircle,
    ArrowLeft,
    Plus,
    Minus,
    Search,
    Filter,
    Mail,
    Phone,
    Trash2,
    Archive,
    History
} from 'lucide-react';
import { useState } from 'react';
import initialInventoryData from '../../api/inventory.json';
import initialAbandonedData from '../../api/abandoned.json';
import './FacilitiesPage.css';

interface InventoryItem {
    item: string;
    qty: number;
    status: string;
}

interface AbandonedItem {
    id: number;
    item: string;
    date: string;
    reason: string;
}

const initialInventory = initialInventoryData as InventoryItem[];
const initialAbandoned = initialAbandonedData as AbandonedItem[];


interface FacilitiesPageProps {
    onBack: () => void;
}

const FacilitiesPage = ({ onBack }: FacilitiesPageProps) => {
    const [inventory, setInventory] = useState<InventoryItem[]>(initialInventory);
    const [abandonedItems, setAbandonedItems] = useState<AbandonedItem[]>(initialAbandoned);
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddAbandonedOpen, setIsAddAbandonedOpen] = useState(false);
    const [newAbandoned, setNewAbandoned] = useState({ item: '', reason: '' });

    const [isAddAssetOpen, setIsAddAssetOpen] = useState(false);
    const [newAsset, setNewAsset] = useState({ item: '', qty: 0, status: 'Available' });

    const filteredInventory = inventory.filter(item =>
        item.item.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleAddQuantity = (itemName: string) => {
        setInventory(prev => prev.map(item => {
            if (item.item === itemName) {
                const newQty = item.qty + 1;
                const newStatus = item.status === 'Out of Stock' ? 'Available' : item.status;
                return { ...item, qty: newQty, status: newStatus };
            }
            return item;
        }));
    };

    const handleRemoveQuantity = (itemName: string) => {
        setInventory(prev => prev.map(item => {
            if (item.item === itemName) {
                const newQty = Math.max(0, item.qty - 1);
                const newStatus = newQty === 0 ? 'Out of Stock' : item.status;
                return { ...item, qty: newQty, status: newStatus };
            }
            return item;
        }));
    };

    const handleAbandonItem = (itemName: string) => {
        const itemToAbandon = inventory.find(i => i.item === itemName);
        if (itemToAbandon && itemToAbandon.qty > 0) {
            const newItem: AbandonedItem = {
                id: Date.now(),
                item: itemName,
                date: new Date().toISOString().split('T')[0],
                reason: 'Moved from Inventory'
            };
            setAbandonedItems(prev => [newItem, ...prev]);
            handleRemoveQuantity(itemName);
        }
    };

    const handleAddManualAbandoned = (e: React.FormEvent) => {
        e.preventDefault();
        if (newAbandoned.item.trim()) {
            const newItem: AbandonedItem = {
                id: Date.now(),
                item: newAbandoned.item,
                date: new Date().toISOString().split('T')[0],
                reason: newAbandoned.reason || 'Not Specified'
            };
            setAbandonedItems(prev => [newItem, ...prev]);
            setNewAbandoned({ item: '', reason: '' });
            setIsAddAbandonedOpen(false);
        }
    };

    const handleAddNewAsset = (e: React.FormEvent) => {
        e.preventDefault();
        if (newAsset.item.trim()) {
            const newItem: InventoryItem = {
                item: newAsset.item,
                qty: Number(newAsset.qty),
                status: newAsset.qty === 0 ? 'Out of Stock' : newAsset.status
            };
            setInventory(prev => [newItem, ...prev]);
            setNewAsset({ item: '', qty: 0, status: 'Available' });
            setIsAddAssetOpen(false);
        }
    };

    return (
        <div className="facilities-page fade-in">
            <div className="page-header">
                <button className="back-btn glass-card" onClick={onBack}>
                    <ArrowLeft size={20} />
                    <span>Back to Dashboard</span>
                </button>
                <div className="header-icon-box">
                    <Package size={28} />
                </div>
                <div className="header-text">
                    <h1>Facilities & <span className="gradient-text">Inventory</span></h1>
                    <p>Managing office assets, equipment, and workspace facilities</p>
                </div>
                <div className="header-actions">
                    <button className="btn-primary" onClick={() => setIsAddAssetOpen(true)}>
                        <Plus size={18} />
                        Add New Asset
                    </button>
                    <button className="btn-abandoned glass-card" onClick={() => setIsAddAbandonedOpen(true)}>
                        <Archive size={18} />
                        Mark Abandoned
                    </button>
                </div>
            </div>

            <div className="facilities-content-grid">
                {/* Department Info & Stats */}
                <div className="left-column">
                    <div className="lead-section glass-card">
                        <h4 className="detail-subtitle">Department <span className="gradient-text">Lead</span></h4>
                        <div className="lead-card-inner">
                            <div className="lead-avatar">M</div>
                            <div className="lead-info">
                                <span className="lead-name">Mike Ross</span>
                                <span className="lead-designation">Department Head</span>
                                <div className="lead-contact">
                                    <div className="contact-item"><Mail size={14} /> mike.ross@gtech.com</div>
                                    <div className="contact-item"><Phone size={14} /> +92 300 0000000</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="inventory-stats-grid">
                        <div className="inv-stat-card glass-card">
                            <span className="stat-label">Total Assets</span>
                            <span className="stat-value">{inventory.reduce((acc, curr) => acc + curr.qty, 0)}</span>
                        </div>
                        <div className="inv-stat-card glass-card">
                            <span className="stat-label">Abandoned</span>
                            <span className="stat-value">{abandonedItems.length}</span>
                        </div>
                    </div>

                    <div className="quick-info glass-card">
                        <h4 className="detail-subtitle">Workspace <span className="gradient-text">Overview</span></h4>
                        <p className="info-text">Our facility management includes regular maintenance of office infrastructure and equipment lifecycle management.</p>
                        <div className="info-badges">
                            <span className="info-badge">Maintenance: Done</span>
                            <span className="info-badge">Next Audit: 20 Jan</span>
                        </div>
                    </div>
                </div>

                {/* Inventory Table Section */}
                <div className="right-column">
                    <div className="inventory-list-section glass-card">
                        <div className="list-header">
                            <h4 className="detail-subtitle">Inventory <span className="gradient-text">Assets</span></h4>
                            <div className="table-controls">
                                <div className="search-box glass-card">
                                    <Search size={16} />
                                    <input
                                        type="text"
                                        placeholder="Search assets..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                                <button className="filter-btn glass-card">
                                    <Filter size={16} />
                                </button>
                            </div>
                        </div>

                        <div className="table-wrapper">
                            <table className="facilities-table">
                                <thead>
                                    <tr>
                                        <th>Asset Name</th>
                                        <th>Quantity</th>
                                        <th>Status</th>
                                        <th className="actions-col">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredInventory.map((item, idx) => (
                                        <tr key={idx}>
                                            <td>
                                                <div className="asset-cell">
                                                    <div className="asset-icon-bg">
                                                        <Package size={16} className="asset-icon" />
                                                    </div>
                                                    {item.item}
                                                </div>
                                            </td>
                                            <td className="qty-col">{item.qty} units</td>
                                            <td>
                                                <span className={`status-pill ${item.status.toLowerCase().replace(' ', '-')}`}>
                                                    {item.status.includes('Active') || item.status.includes('Available') || item.status.includes('Testing') || item.status.includes('In-Use') ? (
                                                        <CheckCircle2 size={12} />
                                                    ) : (
                                                        <AlertCircle size={12} />
                                                    )}
                                                    {item.status}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="row-actions">
                                                    <button
                                                        className="action-btn abandon-qty glass-card"
                                                        title="Abandon Item"
                                                        onClick={() => handleAbandonItem(item.item)}
                                                        disabled={item.qty === 0}
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                    <button
                                                        className="action-btn remove-qty glass-card"
                                                        title="Remove Quantity"
                                                        onClick={() => handleRemoveQuantity(item.item)}
                                                        disabled={item.qty === 0}
                                                    >
                                                        <Minus size={14} />
                                                    </button>
                                                    <button
                                                        className="action-btn add-qty glass-card"
                                                        title="Add Quantity"
                                                        onClick={() => handleAddQuantity(item.item)}
                                                    >
                                                        <Plus size={14} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Abandoned Section */}
                    <div className="abandoned-section glass-card fade-in">
                        <div className="list-header">
                            <h4 className="detail-subtitle"><Archive size={20} style={{ marginRight: '8px' }} /> Abandoned <span className="gradient-text">Assets</span></h4>
                            <span className="item-count-badge">{abandonedItems.length} Items</span>
                        </div>

                        <div className="table-wrapper">
                            <table className="facilities-table abandoned-table">
                                <thead>
                                    <tr>
                                        <th>Item Name</th>
                                        <th>Date Abandoned</th>
                                        <th>Reason/Notes</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {abandonedItems.length > 0 ? (
                                        abandonedItems.map((item) => (
                                            <tr key={item.id}>
                                                <td>
                                                    <div className="asset-cell">
                                                        <div className="asset-icon-bg abandoned">
                                                            <History size={16} />
                                                        </div>
                                                        {item.item}
                                                    </div>
                                                </td>
                                                <td>{item.date}</td>
                                                <td>
                                                    <span className="reason-text">{item.reason}</span>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={3} className="empty-state">No abandoned items yet.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* Manual Abandoned Modal */}
            {isAddAbandonedOpen && (
                <div className="modal-overlay">
                    <div className="modal-content glass-card slide-in abandoned-modal">
                        <div className="modal-header">
                            <h3>Record <span className="gradient-text">Abandoned Item</span></h3>
                            <button className="close-btn" onClick={() => setIsAddAbandonedOpen(false)}>
                                <Plus size={24} style={{ transform: 'rotate(45deg)' }} />
                            </button>
                        </div>
                        <form onSubmit={handleAddManualAbandoned} className="abandoned-form">
                            <div className="form-group">
                                <label>Item Name</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Enter item name..."
                                    value={newAbandoned.item}
                                    onChange={(e) => setNewAbandoned({ ...newAbandoned, item: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label>Reason for Abandonment</label>
                                <textarea
                                    placeholder="Defective, Structural Damage, Obsolete..."
                                    value={newAbandoned.reason}
                                    onChange={(e) => setNewAbandoned({ ...newAbandoned, reason: e.target.value })}
                                ></textarea>
                            </div>
                            <div className="form-actions">
                                <button type="button" className="btn-secondary glass-card" onClick={() => setIsAddAbandonedOpen(false)}>Cancel</button>
                                <button type="submit" className="btn-primary">Record Asset</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Add New Asset Modal */}
            {isAddAssetOpen && (
                <div className="modal-overlay">
                    <div className="modal-content glass-card slide-in abandoned-modal">
                        <div className="modal-header">
                            <h3>Add New <span className="gradient-text">Inventory Asset</span></h3>
                            <button className="close-btn" onClick={() => setIsAddAssetOpen(false)}>
                                <Plus size={24} style={{ transform: 'rotate(45deg)' }} />
                            </button>
                        </div>
                        <form onSubmit={handleAddNewAsset} className="abandoned-form">
                            <div className="form-group">
                                <label>Asset Name</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. Dell Latitude 5420..."
                                    value={newAsset.item}
                                    onChange={(e) => setNewAsset({ ...newAsset, item: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label>Quantity (Units)</label>
                                <input
                                    type="number"
                                    required
                                    min="0"
                                    placeholder="Enter total units..."
                                    value={newAsset.qty}
                                    onChange={(e) => setNewAsset({ ...newAsset, qty: parseInt(e.target.value) || 0 })}
                                />
                            </div>
                            <div className="form-group">
                                <label>Initial Category/Status</label>
                                <select
                                    value={newAsset.status}
                                    onChange={(e) => setNewAsset({ ...newAsset, status: e.target.value })}
                                    className="glass-card"
                                    style={{ padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '12px' }}
                                >
                                    <option value="Available" style={{ background: '#1a1a2e' }}>Available</option>
                                    <option value="Active" style={{ background: '#1a1a2e' }}>Active</option>
                                    <option value="In-Use" style={{ background: '#1a1a2e' }}>In-Use</option>
                                    <option value="Stock" style={{ background: '#1a1a2e' }}>Stock</option>
                                    <option value="Monthly Stock" style={{ background: '#1a1a2e' }}>Monthly Stock</option>
                                </select>
                            </div>
                            <div className="form-actions">
                                <button type="button" className="btn-secondary glass-card" onClick={() => setIsAddAssetOpen(false)}>Cancel</button>
                                <button type="submit" className="btn-primary">Add to Inventory</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FacilitiesPage;
