import React, { useState, useEffect, useRef } from 'react';
import {
    Plus,
    Calendar,
    Trash2,
    Edit2,
    Image as ImageIcon,
    X,
    Upload,
    PartyPopper
} from 'lucide-react';
import initialEventsData from '../../api/events.json';
import './EventsPage.css';

interface EventMemories {
    id: string;
    name: string;
    date: string;
    description: string;
    media: string[]; // Base64 strings for local storage simulation
}

const EventsPage: React.FC = () => {
    const [events, setEvents] = useState<EventMemories[]>(() => {
        const saved = localStorage.getItem('gtech-events');
        return saved ? JSON.parse(saved) : initialEventsData;
    });


    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingEvent, setEditingEvent] = useState<EventMemories | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        date: '',
        description: '',
        media: [] as string[]
    });

    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        localStorage.setItem('gtech-events', JSON.stringify(events));
    }, [events]);

    const handleOpenModal = (event?: EventMemories) => {
        if (event) {
            setEditingEvent(event);
            setFormData({
                name: event.name,
                date: event.date,
                description: event.description,
                media: event.media
            });
        } else {
            setEditingEvent(null);
            setFormData({
                name: '',
                date: '',
                description: '',
                media: []
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingEvent(null);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            Array.from(files).forEach(file => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setFormData(prev => ({
                        ...prev,
                        media: [...prev.media, reader.result as string]
                    }));
                };
                reader.readAsDataURL(file);
            });
        }
    };

    const removeMedia = (index: number) => {
        setFormData(prev => ({
            ...prev,
            media: prev.media.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingEvent) {
            setEvents(prev => prev.map(ev =>
                ev.id === editingEvent.id ? { ...formData, id: ev.id } : ev
            ));
        } else {
            const newEvent: EventMemories = {
                ...formData,
                id: Date.now().toString()
            };
            setEvents(prev => [newEvent, ...prev]);
        }
        handleCloseModal();
    };

    const handleDeleteEvent = (id: string) => {
        if (window.confirm('Are you sure you want to delete this event?')) {
            setEvents(prev => prev.filter(ev => ev.id !== id));
        }
    };

    return (
        <div className="events-page fade-in">
            <div className="page-header">
                <div className="header-icon-box">
                    <PartyPopper size={28} />
                </div>
                <div className="header-text">
                    <h1>Event <span className="gradient-text">History</span></h1>
                    <p>Memories & History Track</p>
                </div>
                <button className="btn-primary" onClick={() => handleOpenModal()}>
                    <Plus size={18} /> Add Event
                </button>
            </div>

            <div className="events-grid">
                {events.map(event => (
                    <div key={event.id} className="event-card glass-card">
                        <div className="event-media-container">
                            {event.media.length > 0 ? (
                                <img src={event.media[0]} alt={event.name} />
                            ) : (
                                <div className="no-media-placeholder">
                                    <ImageIcon size={48} />
                                    <span>No Media</span>
                                </div>
                            )}
                            {event.media.length > 1 && (
                                <div className="media-count-badge" style={{ position: 'absolute', bottom: '10px', right: '10px', background: 'rgba(0,0,0,0.6)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.8rem' }}>
                                    +{event.media.length - 1} Memories
                                </div>
                            )}
                        </div>

                        <div className="event-details">
                            <div className="event-card-header">
                                <span className="event-tag">{new Date(event.date) > new Date() ? 'Upcoming' : 'Past'}</span>
                                <div className="event-actions">
                                    <button className="btn-icon" onClick={() => handleOpenModal(event)} title="Update Event">
                                        <Edit2 size={16} />
                                    </button>
                                    <button className="btn-icon delete" onClick={() => handleDeleteEvent(event.id)} title="Remove Event">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>

                            <h3 className="event-title">{event.name}</h3>
                            <div className="event-date">
                                <Calendar size={14} />
                                {new Date(event.date).toLocaleDateString('en-US', {
                                    year: 'numeric', month: 'long', day: 'numeric'
                                })}
                            </div>
                            <p className="event-description">{event.description}</p>
                        </div>
                    </div>
                ))}
            </div>

            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content glass-card fade-in">
                        <div className="modal-header">
                            <h3>{editingEvent ? 'Update Event' : 'Add Event'}</h3>
                            <button className="close-btn" onClick={handleCloseModal}><X size={24} /></button>
                        </div>

                        <form className="event-form" onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Event Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    className="form-input"
                                    required
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    placeholder="e.g. Independence Day Celebration"
                                />
                            </div>

                            <div className="form-group">
                                <label>Event Date</label>
                                <input
                                    type="date"
                                    name="date"
                                    className="form-input"
                                    required
                                    value={formData.date}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div className="form-group">
                                <label>Event Description</label>
                                <textarea
                                    name="description"
                                    className="form-textarea"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    placeholder="Tell us about the event..."
                                ></textarea>
                            </div>

                            <div className="form-group">
                                <label>Upload Media</label>
                                <div className="media-upload-area" onClick={() => fileInputRef.current?.click()}>
                                    <Upload size={32} style={{ marginBottom: '10px', opacity: 0.5 }} />
                                    <p>Click or drag to upload memories (Images)</p>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        hidden
                                        multiple
                                        accept="image/*"
                                        onChange={handleFileUpload}
                                    />
                                </div>

                                {formData.media.length > 0 && (
                                    <div className="media-preview">
                                        {formData.media.map((src, idx) => (
                                            <div key={idx} className="preview-item">
                                                <img src={src} alt="preview" />
                                                <button type="button" className="remove-media-btn" onClick={() => removeMedia(idx)}>
                                                    <X size={12} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
                                {editingEvent ? 'Update Event' : 'Add Event'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EventsPage;
