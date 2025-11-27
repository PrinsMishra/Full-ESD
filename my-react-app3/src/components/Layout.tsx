import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import "../App.css";

function Layout() {
    return (
        <div className="app-layout">
            <Sidebar />
            <div className="main-content">
                <Outlet />
            </div>
        </div>
    );
}

export default Layout;
