
import type { LucideIcon } from 'lucide-react';
import './StatCard.css';

interface StatCardProps {
    title: string;
    value: string | number;
    change: number;
    icon: LucideIcon;
    gradient: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, icon: Icon, gradient }) => {
    const isPositive = change >= 0;

    return (
        <div className="stat-card glass-card fade-in">
            <div className="stat-card-header">
                <div className="stat-icon" style={{ background: gradient }}>
                    <Icon size={24} strokeWidth={2.5} />
                </div>
                <div className={`stat-change ${isPositive ? 'positive' : 'negative'}`}>
                    {isPositive ? '+' : ''}{change}%
                </div>
            </div>
            <div className="stat-content">
                <h3 className="stat-title">{title}</h3>
                <div className="stat-value">{value}</div>
            </div>
            <div className="stat-sparkle"></div>
        </div>
    );
};

export default StatCard;
