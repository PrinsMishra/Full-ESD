import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";
import api from "../api/axios";

interface Offer {
    offer_id: number;
    organisation: string;
    domains: string[];
    specialisations: string[];
    minGrade: number | null;
    maxIntake: number | null;
}

function ViewCareers() {
    const navigate = useNavigate();
    const [offers, setOffers] = useState<Offer[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchOffers = async () => {
            try {
                const response = await api.get("/offers/get");
                setOffers(response.data);
            } catch (err) {
                console.error("Error fetching offers:", err);
                setError("Failed to load job offers.");
            } finally {
                setLoading(false);
            }
        };

        fetchOffers();
    }, []);

    return (
        <div className="app-main-layout">
            <button
                onClick={() => navigate("/add-offer")}
                style={{
                    position: "absolute",
                    top: "20px",
                    left: "20px",
                    padding: "8px 14px",
                    background: "#646cff",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontWeight: "bold",
                    zIndex: 1000
                }}
            >
                Back
            </button>

            <div className="careers-container">
                <header className="careers-header">
                    <h1>Career Opportunities</h1>
                    <p className="tagline">Explore available job offers.</p>
                </header>

                {loading ? (
                    <p style={{ textAlign: "center" }}>Loading offers...</p>
                ) : error ? (
                    <p className="error-message">{error}</p>
                ) : offers.length === 0 ? (
                    <div className="no-offers">
                        <p>No job offers available at the moment.</p>
                    </div>
                ) : (
                    <div className="careers-grid">
                        {offers.map((offer) => (
                            <div key={offer.offer_id} className="career-card">
                                <h3>{offer.organisation}</h3>

                                <div className="career-info-row">
                                    <strong>Domains:</strong>
                                    <div className="tags-container">
                                        {offer.domains && offer.domains.length > 0 ? (
                                            offer.domains.map((d, i) => (
                                                <span key={i} className="tag-badge tag-domain">{d}</span>
                                            ))
                                        ) : (
                                            <span className="text-muted">N/A</span>
                                        )}
                                    </div>
                                </div>

                                <div className="career-info-row">
                                    <strong>Specialisations:</strong>
                                    <div className="tags-container">
                                        {offer.specialisations && offer.specialisations.length > 0 ? (
                                            offer.specialisations.map((s, i) => (
                                                <span key={i} className="tag-badge tag-specialisation">{s}</span>
                                            ))
                                        ) : (
                                            <span className="text-muted">N/A</span>
                                        )}
                                    </div>
                                </div>

                                {(offer.minGrade || offer.maxIntake) && (
                                    <div className="stat-row">
                                        {offer.minGrade && (
                                            <div className="stat-item">
                                                <span className="stat-label">Min Grade</span>
                                                <span className="stat-value">{offer.minGrade}</span>
                                            </div>
                                        )}
                                        {offer.maxIntake && (
                                            <div className="stat-item">
                                                <span className="stat-label">Max Intake</span>
                                                <span className="stat-value">{offer.maxIntake}</span>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default ViewCareers;
