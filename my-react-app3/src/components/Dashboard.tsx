import { useState, useEffect } from "react";
import { FaBuilding, FaUsers, FaBriefcase, FaHandshake } from "react-icons/fa";
import "../App.css";
import api from "../api/axios";

function Dashboard() {
    const [stats, setStats] = useState({
        departments: 0,
        employees: 0,
        offers: 0,
        organisations: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [deptRes, empRes, offerRes] = await Promise.all([
                    api.get("/departments/get"),
                    api.get("/employees/get"),
                    api.get("/offers/get")
                ]);

                const offers = offerRes.data;
                const uniqueOrgs = new Set(offers.map((o: any) => o.organisation)).size;

                setStats({
                    departments: deptRes.data.length,
                    employees: empRes.data.length,
                    offers: offers.length,
                    organisations: uniqueOrgs
                });
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const StatCard = ({ title, value, icon, color }: any) => (
        <div className="stat-card" style={{ borderTopColor: color }}>
            <div className="stat-icon-wrapper" style={{ backgroundColor: `${color}20`, color: color }}>
                {icon}
            </div>
            <div className="stat-content">
                <h3>{value}</h3>
                <p>{title}</p>
            </div>
        </div>
    );

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <h1>Dashboard Overview</h1>
                <p className="tagline">Welcome back! Here's what's happening today.</p>
            </header>

            {loading ? (
                <p>Loading statistics...</p>
            ) : (
                <div className="stats-grid">
                    <StatCard
                        title="Total Departments"
                        value={stats.departments}
                        icon={<FaBuilding />}
                        color="#6a4ff5"
                    />
                    <StatCard
                        title="Total Employees"
                        value={stats.employees}
                        icon={<FaUsers />}
                        color="#00bcd4"
                    />
                    <StatCard
                        title="Active Job Offers"
                        value={stats.offers}
                        icon={<FaBriefcase />}
                        color="#ff9800"
                    />
                    <StatCard
                        title="Partner Organisations"
                        value={stats.organisations}
                        icon={<FaHandshake />}
                        color="#4caf50"
                    />
                </div>
            )}
        </div>
    );
}

export default Dashboard;
