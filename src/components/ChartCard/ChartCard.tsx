
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import './ChartCard.css';

interface ChartCardProps {
    title: string;
    data: any[];
    dataKey: string;
    gradient: [string, string];
}

const ChartCard: React.FC<ChartCardProps> = ({ title, data, dataKey, gradient }) => {
    return (
        <div className="chart-card glass-card fade-in">
            <div className="chart-header">
                <h3 className="chart-title">{title}</h3>
                <div className="chart-legend">
                    <span className="legend-dot" style={{ background: gradient[0] }}></span>
                    <span className="legend-label">This Period</span>
                </div>
            </div>
            <div className="chart-container">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id={`gradient-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={gradient[0]} stopOpacity={0.8} />
                                <stop offset="95%" stopColor={gradient[1]} stopOpacity={0.1} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                        <XAxis
                            dataKey="name"
                            stroke="var(--text-tertiary)"
                            style={{ fontSize: '0.75rem' }}
                        />
                        <YAxis
                            stroke="var(--text-tertiary)"
                            style={{ fontSize: '0.75rem' }}
                        />
                        <Tooltip
                            contentStyle={{
                                background: 'rgba(26, 35, 50, 0.95)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '0.5rem',
                                color: 'var(--text-primary)',
                                backdropFilter: 'blur(10px)'
                            }}
                        />
                        <Area
                            type="monotone"
                            dataKey={dataKey}
                            stroke={gradient[0]}
                            strokeWidth={3}
                            fill={`url(#gradient-${dataKey})`}
                            animationDuration={1000}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default ChartCard;
