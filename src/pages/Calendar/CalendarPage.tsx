import React, { useState, useEffect } from 'react';
import {
    ChevronLeft,
    ChevronRight,
    Plus,
    Clock,
    Bell,
    Coffee
} from 'lucide-react';
import './CalendarPage.css';

interface CalendarEvent {
    id: string;
    date: string; // ISO string YYYY-MM-DD
    title: string;
    type: 'holiday' | 'meeting' | 'event';
    description?: string;
}

const CalendarPage: React.FC = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [events, setEvents] = useState<CalendarEvent[]>(() => {
        const saved = localStorage.getItem('calendar-events');
        return saved ? JSON.parse(saved) : [
            { id: '1', date: '2026-01-01', title: 'Holiday', type: 'holiday' },
            { id: '2', date: '2026-01-26', title: 'Holiday', type: 'holiday' },
            { id: '3', date: '2026-01-10', title: 'Meeting', type: 'meeting' },
        ];
    });

    const [newEventTitle, setNewEventTitle] = useState('');
    const [newEventType, setNewEventType] = useState<'holiday' | 'meeting' | 'event'>('event');

    useEffect(() => {
        localStorage.setItem('calendar-events', JSON.stringify(events));
    }, [events]);

    const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

    const prevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const isToday = (date: number) => {
        const today = new Date();
        return date === today.getDate() &&
            currentDate.getMonth() === today.getMonth() &&
            currentDate.getFullYear() === today.getFullYear();
    };

    const isWeekend = (year: number, month: number, day: number) => {
        const date = new Date(year, month, day);
        const dayOfWeek = date.getDay();
        return dayOfWeek === 0 || dayOfWeek === 6; // 0 is Sunday, 6 is Saturday
    };

    const formatDate = (date: Date) => {
        return date.toISOString().split('T')[0];
    };

    const handleAddEvent = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newEventTitle) return;

        const newEvent: CalendarEvent = {
            id: Date.now().toString(),
            date: formatDate(selectedDate),
            title: newEventTitle,
            type: newEventType,
        };

        setEvents([...events, newEvent]);
        setNewEventTitle('');
    };

    const getEventsForDate = (dateStr: string) => {
        return events.filter(e => e.date === dateStr);
    };

    const renderCalendar = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const numDays = daysInMonth(year, month);
        const startDay = firstDayOfMonth(year, month);

        const days = [];

        const prevMonthDays = daysInMonth(year, month - 1);
        for (let i = startDay - 1; i >= 0; i--) {
            days.push({ day: prevMonthDays - i, currentMonth: false, monthOffset: -1 });
        }

        for (let i = 1; i <= numDays; i++) {
            days.push({ day: i, currentMonth: true, monthOffset: 0 });
        }

        const totalSlots = 42;
        const remainingSlots = totalSlots - days.length;
        for (let i = 1; i <= remainingSlots; i++) {
            days.push({ day: i, currentMonth: false, monthOffset: 1 });
        }

        return days.map((dayObj, index) => {
            const dayDate = new Date(year, month + dayObj.monthOffset, dayObj.day);
            const dayStr = formatDate(dayDate);
            const isDayWeekend = isWeekend(year, month + dayObj.monthOffset, dayObj.day);
            const dayEvents = getEventsForDate(dayStr);
            const isSelected = formatDate(selectedDate) === dayStr;

            return (
                <div
                    key={index}
                    className={`calendar-day ${!dayObj.currentMonth ? 'other-month' : ''} ${isDayWeekend ? 'weekend' : ''} ${isToday(dayObj.day) && dayObj.currentMonth ? 'today' : ''} ${isSelected ? 'selected' : ''}`}
                    onClick={() => setSelectedDate(dayDate)}
                >
                    <div className="day-number">{dayObj.day}</div>
                    <div className="day-events">
                        {dayEvents.map(event => (
                            <div key={event.id} className={`event-dot event-${event.type}`}>
                                {event.title}
                            </div>
                        ))}
                        {isDayWeekend && <div className="off-day-label">Off Day</div>}
                    </div>
                </div>
            );
        });
    };

    const shifts = [
        { name: '1st Shift', time: '12:00 PM - 09:00 PM' },
        { name: '2nd Shift', time: '10:00 PM - 06:00 AM' }
    ];

    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
        <div className="calendar-page fade-in">
            <div className="calendar-container">
                <div className="calendar-main glass-card">
                    <div className="calendar-header">
                        <h2 className="current-month">{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</h2>
                        <div className="calendar-controls">
                            <button className="control-btn" onClick={prevMonth}><ChevronLeft size={20} /></button>
                            <button className="control-btn" onClick={() => setCurrentDate(new Date())}>Today</button>
                            <button className="control-btn" onClick={nextMonth}><ChevronRight size={20} /></button>
                        </div>
                    </div>

                    <div className="calendar-grid">
                        {weekDays.map(day => (
                            <div key={day} className="weekday-header">{day}</div>
                        ))}
                        {renderCalendar()}
                    </div>
                </div>

                <div className="calendar-sidebar glass-card">
                    <div className="details-header">
                        <h3>Date Details</h3>
                        <p className="selected-date-display">{selectedDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </div>

                    <div className="shift-section">
                        <h4 className="section-title">
                            <Clock size={18} style={{ marginRight: '8px' }} />
                            Active Shifts
                        </h4>
                        <div className="shift-info-card">
                            {shifts.map((shift, idx) => (
                                <div key={idx} className="shift-item">
                                    <div className="shift-name">{shift.name}</div>
                                    <div className="shift-time">{shift.time}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="events-section">
                        <h4 className="section-title">
                            <Bell size={18} style={{ marginRight: '8px' }} />
                            Day Reminders
                        </h4>
                        <div className="events-list">
                            {getEventsForDate(formatDate(selectedDate)).length > 0 ? (
                                getEventsForDate(formatDate(selectedDate)).map(event => (
                                    <div key={event.id} className="event-item">
                                        <div className={`event-type-icon event-${event.type}`}></div>
                                        <div className="event-info">
                                            <div className="event-title">{event.title}</div>
                                            <div className="event-type-label" style={{ fontSize: '0.7rem', opacity: 0.6 }}>{event.type}</div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p style={{ opacity: 0.5, fontSize: '0.9rem' }}>No meetings or events scheduled.</p>
                            )}
                        </div>

                        <form className="add-event-form" onSubmit={handleAddEvent}>
                            <h5 style={{ marginTop: '1rem', marginBottom: '0.5rem' }}>Add Reminder</h5>
                            <input
                                type="text"
                                className="form-input"
                                placeholder="Reminder title..."
                                value={newEventTitle}
                                onChange={(e) => setNewEventTitle(e.target.value)}
                            />
                            <select
                                className="form-select"
                                value={newEventType}
                                onChange={(e) => setNewEventType(e.target.value as any)}
                            >
                                <option value="event">General Event</option>
                                <option value="holiday">Holiday</option>
                                <option value="meeting">Meeting</option>
                            </select>
                            <button type="submit" className="btn-primary" style={{ marginTop: '0.5rem' }}>
                                <Plus size={18} /> Add Reminder
                            </button>
                        </form>
                    </div>

                    <div className="holiday-notice" style={{ marginTop: 'auto', padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ef4444', marginBottom: '4px' }}>
                            <Coffee size={16} />
                            <span style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>Weekend Policy</span>
                        </div>
                        <p style={{ fontSize: '0.8rem', opacity: 0.8 }}>Saturdays and Sundays are always marked as OFF days for Gtech Sources staff.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CalendarPage;
