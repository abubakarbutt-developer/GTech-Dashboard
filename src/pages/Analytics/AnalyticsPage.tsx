import React from 'react';
import { Zap, Droplets, Briefcase, Wifi, UserCheck, UserX, Timer, Clock } from 'lucide-react';
import StatCard from '../../components/StatCard/StatCard';
import ChartCard from '../../components/ChartCard/ChartCard';
import BudgetChart from '../../components/BudgetChart/BudgetChart';
import ActivityFeed from '../../components/ActivityFeed/ActivityFeed';
import DepartmentsSection from '../Departments/DepartmentsSection';
import dashboardData from '../../api/dashboardData.json';
import initialAttendance from '../../api/attendance.json';

const { expenseData, monthlyBudgetData, activities: rawActivities } = dashboardData;
const iconMap: Record<string, any> = { Zap, Wifi, Droplets, Briefcase, Clock };
const activities = rawActivities.map(a => ({
    ...a,
    icon: iconMap[a.icon as keyof typeof iconMap] || Timer
}));

interface AnalyticsPageProps {
    handleNavigate: (page: string) => void;
}

const AnalyticsPage: React.FC<AnalyticsPageProps> = ({ handleNavigate }) => {
    return (
        <>
            <section className="stats-grid">
                <StatCard
                    title="Electricity Bills"
                    value="Rs. 24,500"
                    change={8.5}
                    icon={Zap}
                    gradient="linear-gradient(135deg, #f6d365 0%, #fda085 100%)"
                />
                <StatCard
                    title="Water Bills"
                    value="Rs. 4,200"
                    change={-12.2}
                    icon={Droplets}
                    gradient="linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
                />
                <StatCard
                    title="Office Expenses"
                    value="Rs. 18,750"
                    change={5.3}
                    icon={Briefcase}
                    gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                />
                <StatCard
                    title="Internet Bills"
                    value="Rs. 6,800"
                    change={0}
                    icon={Wifi}
                    gradient="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
                />
            </section>

            <h3 className="section-title">Attendance <span className="gradient-text">Overview</span></h3>
            <section className="stats-grid">
                <StatCard
                    title="Today Active Employees"
                    value={(() => {
                        const attendance = JSON.parse(localStorage.getItem('attendance-data') || JSON.stringify(initialAttendance));
                        return attendance.filter((a: any) => a.date === '2026-01-06' && (a.status === 'present' || a.status === 'late')).length;
                    })()}
                    change={5}
                    icon={UserCheck}
                    gradient="linear-gradient(135deg, #10b981 0%, #059669 100%)"
                />
                <StatCard
                    title="Today Leave"
                    value={(() => {
                        const attendance = JSON.parse(localStorage.getItem('attendance-data') || JSON.stringify(initialAttendance));
                        return attendance.filter((a: any) => a.date === '2026-01-06' && a.status === 'absent').length;
                    })()}
                    change={-2}
                    icon={UserX}
                    gradient="linear-gradient(135deg, #ef4444 0%, #dc2626 100%)"
                />
                <StatCard
                    title="Today Short Leave"
                    value={(() => {
                        const attendance = JSON.parse(localStorage.getItem('attendance-data') || JSON.stringify(initialAttendance));
                        return attendance.filter((a: any) => a.date === '2026-01-06' && a.status === 'half-day').length;
                    })()}
                    change={1}
                    icon={Timer}
                    gradient="linear-gradient(135deg, #f59e0b 0%, #d97706 100%)"
                />
            </section>

            <section className="charts-grid">
                <div className="chart-wrapper">
                    <ChartCard
                        title="Monthly Expenses"
                        data={expenseData}
                        dataKey="value"
                        gradient={['#f6d365', '#fda085']}
                    />
                </div>
                <div className="chart-wrapper">
                    <BudgetChart
                        title="Monthly Budget Utilization"
                        data={monthlyBudgetData}
                    />
                </div>
            </section>

            <DepartmentsSection onNavigate={handleNavigate} />

            <section className="activity-section">
                <ActivityFeed activities={activities} />
            </section>
        </>
    );
};

export default AnalyticsPage;
