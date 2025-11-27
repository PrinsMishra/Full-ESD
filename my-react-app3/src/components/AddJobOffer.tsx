import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../App.css";
import api from "../api/axios";

function AddJobOffer() {
  const navigate = useNavigate();

  const [organisation, setOrganisation] = useState("");
  const [domains, setDomains] = useState<string[]>([]);
  const [specialisations, setSpecialisations] = useState<string[]>([]);
  const [minGrade, setMinGrade] = useState("");
  const [maxIntake, setMaxIntake] = useState("");
  // const [isSubmitted, setIsSubmitted] = useState(false); // Removed in favor of toast

  // 🔥 LOGOUT BUTTON HANDLER
  const handleLogout = () => {
    localStorage.removeItem("token");   // delete JWT
    toast.info("Logged out successfully");
    navigate("/");                      // redirect to login page
  };

  const handleCheck = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    if (e.target.checked) {
      setter((prev) => [...prev, e.target.value]);
    } else {
      setter((prev) => prev.filter((item) => item !== e.target.value));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const jobOffer = {
      organisation,
      domains,
      specialisations,
      minGrade: minGrade ? Number(minGrade) : null,
      maxIntake: maxIntake ? Number(maxIntake) : null,
    };

    try {
      const response = await api.post("/offers/add", jobOffer);
      console.log("Offer saved:", response.data);

      // setIsSubmitted(true);
      toast.success("🎉 Offer Successfully Added!");

      setOrganisation("");
      setDomains([]);
      setSpecialisations([]);
      setMinGrade("");
      setMaxIntake("");

      document.querySelectorAll("input[type=checkbox]").forEach((el: any) => {
        el.checked = false;
      });

      // setTimeout(() => setIsSubmitted(false), 3000);
    } catch (error) {
      console.error("Error adding offer:", error);
      // alert("Failed to add offer. Check your token or backend.");
      toast.error("Failed to add offer. Check your token or backend.");
    }
  };

  return (
    <div className="app-main-layout">
      {/* Top Navigation Bar */}
      <nav className="top-nav-bar">
        <button className="nav-btn btn-secondary" onClick={() => navigate("/careers")}>
          View Careers
        </button>
        <button className="nav-btn btn-danger" onClick={handleLogout}>
          Logout
        </button>
      </nav>

      <div className="full-width-card" style={{ width: "700px" }}> {/* Increased width */}
        <div className="single-panel-form add-job-offer-panel">
          <header style={{ marginBottom: "30px", textAlign: "center" }}>
            <h1>Create Job Offer</h1>
            <p className="tagline">Define requirements for the next recruitment drive.</p>
          </header>

          <form onSubmit={handleSubmit} className="job-offer-form">

            {/* Section 1: Basic Info */}
            <div className="form-section">
              <h3 className="section-title">Basic Information</h3>
              <input
                type="text"
                value={organisation}
                onChange={(e) => setOrganisation(e.target.value)}
                placeholder="Organisation Name (e.g., Google)"
                required
              />
            </div>

            {/* Section 2: Requirements */}
            <div className="form-section">
              <h3 className="section-title">Eligibility Criteria</h3>

              {/* DOMAINS */}
              <div className="form-group-container">
                <p className="group-title">Domains</p>
                <div className="chip-group">
                  {["MTech CSE", "iMTech ECE"].map((domain) => (
                    <label key={domain} className="chip-label">
                      <input
                        type="checkbox"
                        value={domain}
                        onChange={(e) => handleCheck(e, setDomains)}
                      />
                      <span className="chip-text">{domain}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* SPECIALISATIONS */}
              <div className="form-group-container">
                <p className="group-title">Specialisations</p>
                <div className="chip-group">
                  {["Theory & Systems", "Data Science"].map((spec) => (
                    <label key={spec} className="chip-label">
                      <input
                        type="checkbox"
                        value={spec}
                        onChange={(e) => handleCheck(e, setSpecialisations)}
                      />
                      <span className="chip-text">{spec}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Section 3: Details */}
            <div className="form-section">
              <h3 className="section-title">Additional Details</h3>
              <div style={{ display: "flex", gap: "20px" }}>
                <input
                  type="number"
                  value={minGrade}
                  onChange={(e) => setMinGrade(e.target.value)}
                  placeholder="Min Grade"
                  style={{ flex: 1 }}
                />
                <input
                  type="number"
                  value={maxIntake}
                  onChange={(e) => setMaxIntake(e.target.value)}
                  placeholder="Max Intake"
                  style={{ flex: 1 }}
                />
              </div>
            </div>

            <button type="submit" className="sign-in-btn">
              Submit Job Offer
            </button>
          </form>

          {/* {isSubmitted && (
            <div className="success-message" style={{ marginTop: "20px" }}>
              🎉 Offer Successfully Added!
            </div>
          )} */}
        </div>
      </div>
    </div>
  );
}

export default AddJobOffer;
