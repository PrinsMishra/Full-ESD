import { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
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
    const [offers, setOffers] = useState<Offer[]>([]);
    const [filteredOffers, setFilteredOffers] = useState<Offer[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Search & Filter State
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedDomain, setSelectedDomain] = useState("All");

    useEffect(() => {
        const fetchOffers = async () => {
            try {
                const response = await api.get("/offers/get");
                setOffers(response.data);
                setFilteredOffers(response.data);
            } catch (err) {
                console.error("Error fetching offers:", err);
                setError("Failed to load job offers.");
            } finally {
                setLoading(false);
            }
        };

        fetchOffers();
    }, []);

    // Filter Logic
    useEffect(() => {
        let result = offers;

        // 1. Filter by Search Term (Organisation)
        if (searchTerm) {
            result = result.filter(offer =>
                offer.organisation.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // 2. Filter by Domain
        if (selectedDomain !== "All") {
            result = result.filter(offer =>
                offer.domains && offer.domains.includes(selectedDomain)
            );
        }

        setFilteredOffers(result);
    }, [searchTerm, selectedDomain, offers]);

    // Unique Domains for Filter Chips
    const allDomains = ["All", ...Array.from(new Set(offers.flatMap(o => o.domains || [])))];

    return (
        <div className="careers-container">
            <header className="careers-header">
                <h1>Career Opportunities</h1>
                <p className="tagline">Explore available job offers.</p>
            </header>

            {/* Search & Filter Section */}
            <div className="search-filter-container">
                <div className="search-bar-wrapper">
                    <FaSearch className="search-icon" />
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Search by organisation..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="filter-chips-wrapper">
                    {allDomains.map(domain => (
                        <button
                            key={domain}
                            className={`filter-chip ${selectedDomain === domain ? 'active' : ''}`}
                            onClick={() => setSelectedDomain(domain)}
                        >
                            {domain}
                        </button>
                    ))}
                </div>
            </div>

            {loading ? (
                <p style={{ textAlign: "center" }}>Loading offers...</p>
            ) : error ? (
                <p className="error-message">{error}</p>
            ) : filteredOffers.length === 0 ? (
                <div className="no-offers">
                    <p>No job offers found matching your criteria.</p>
                </div>
            ) : (
                <div className="careers-grid">
                    {filteredOffers.map((offer) => (
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
    );
}

export default ViewCareers;
