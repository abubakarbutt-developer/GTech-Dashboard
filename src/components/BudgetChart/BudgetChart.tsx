
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import '../ChartCard/ChartCard.css';

interface BudgetChartProps {
    title: string;
    data: any[];
}

const BudgetChart: React.FC<BudgetChartProps> = ({ title, data }) => {
    return (
        <div className="chart-card glass-card fade-in">
            <div className="chart-header">
                <h3 className="chart-title">{title}</h3>
                <div className="chart-legend">
                    <span className="legend-dot" style={{ background: 'var(--accent-primary)' }}></span>
                    <span className="legend-label">Utilization (%)</span>
                </div>
            </div>
            <div className="chart-container">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                        <XAxis
                            dataKey="name"
                            stroke="var(--text-tertiary)"
                            style={{ fontSize: '0.75rem' }}
                        />
                        <YAxis
                            stroke="var(--text-tertiary)"
                            style={{ fontSize: '0.75rem' }}
                            unit="%"
                        />
                        <Tooltip
                            cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                            contentStyle={{
                                background: 'rgba(26, 35, 50, 0.95)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '0.5rem',
                                color: 'var(--text-primary)',
                                backdropFilter: 'blur(10px)'
                            }}
                            formatter={(value: any) => [`${value}%`, 'Utilization']}
                        />
                        <Bar
                            dataKey="value"
                            radius={[6, 6, 0, 0]}
                            animationDuration={1500}
                        >
                            {data.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={entry.value > 90 ? 'var(--accent-danger)' : entry.value > 70 ? 'var(--accent-warning)' : 'var(--accent-primary)'}
                                />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default BudgetChart;
