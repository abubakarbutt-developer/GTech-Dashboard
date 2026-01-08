
import type { LucideIcon } from 'lucide-react';
import './ActivityFeed.css';

interface Activity {
    id: number;
    title: string;
    description: string;
    time: string;
    icon: LucideIcon;
    color: string;
}

interface ActivityFeedProps {
    activities: Activity[];
}

const ActivityFeed: React.FC<ActivityFeedProps> = ({ activities }) => {
    return (
        <div className="activity-feed glass-card fade-in">
            <h3 className="activity-title">Recent Activity</h3>
            <div className="activity-list">
                {activities.map((activity, index) => {
                    const Icon = activity.icon;
                    return (
                        <div
                            key={activity.id}
                            className="activity-item"
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            <div className="activity-icon-wrapper">
                                <div
                                    className="activity-icon"
                                    style={{ background: activity.color }}
                                >
                                    <Icon size={18} strokeWidth={2.5} />
                                </div>
                                {index < activities.length - 1 && <div className="activity-line"></div>}
                            </div>
                            <div className="activity-content">
                                <h4 className="activity-item-title">{activity.title}</h4>
                                <p className="activity-description">{activity.description}</p>
                                <span className="activity-time">{activity.time}</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ActivityFeed;
