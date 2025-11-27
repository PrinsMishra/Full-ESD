import { NavLink, useNavigate } from "react-router-dom";
import { FaBriefcase, FaPlusCircle, FaSignOutAlt, FaThLarge } from "react-icons/fa";
import { toast } from "react-toastify";
import "../App.css";

function Sidebar() {
    const navigate = useNavigate();

    const userEmail = localStorage.getItem("userEmail") || "Employee";
    const userPhoto = localStorage.getItem("userPhoto") || "https://ui-avatars.com/api/?name=Employee&background=random";

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userEmail");
        localStorage.removeItem("userPhoto");
        toast.info("Logged out successfully");
        navigate("/");
    };

    return (
        <div className="sidebar">
            <div className="sidebar-header">
                <h2>ERP Portal</h2>
            </div>

            {/* Profile Section */}
            <div className="sidebar-profile">
                <img src={userPhoto} alt="Profile" className="profile-pic" />
                <div className="profile-info">
                    <span className="profile-email" title={userEmail}>{userEmail}</span>
                    <span className="profile-role">Administrator</span>
                </div>
            </div>

            <nav className="sidebar-nav">
                <NavLink
                    to="/dashboard"
                    className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
                    end
                >
                    <FaThLarge className="nav-icon" />
                    <span>Dashboard</span>
                </NavLink>

                <NavLink
                    to="/add-offer"
                    className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
                >
                    <FaPlusCircle className="nav-icon" />
                    <span>Add Job Offer</span>
                </NavLink>

                <NavLink
                    to="/careers"
                    className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
                >
                    <FaBriefcase className="nav-icon" />
                    <span>View Careers</span>
                </NavLink>
            </nav>

            <div className="sidebar-footer">
                <button className="logout-btn" onClick={handleLogout}>
                    <FaSignOutAlt className="nav-icon" />
                    <span>Logout</span>
                </button>
            </div>
        </div>
    );
}

export default Sidebar;
