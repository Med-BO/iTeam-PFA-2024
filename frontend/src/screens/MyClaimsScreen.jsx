/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import Loader from "../components/Loader";
import { toast } from "react-toastify";
import './MyClaimsScreen.css';
import { useNavigate } from 'react-router-dom';

const MyclaimsScreen = () => {
  const [userId, setUserId] = useState(0);
  const [loading, setLoading] = useState(false);
  const [claims, setClaims] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const userJsonString = localStorage.getItem("userInfo");
    const user = JSON.parse(userJsonString);
    if (user && user._id) {
      setUserId(user._id);
    }
  }, []);

  useEffect(() => {
    if (userId !== 0) {
      getUserClaims();
    }
  }, [userId]);

  const getUserClaims = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:5000/api/claims/user/${userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch claims");
      }

      const data = await response.json();
      setClaims(data);
      toast.success("Claims retrieved successfully");
      setLoading(false);
    } catch (error) {
      console.error("Error while fetching claims:", error.message);
      toast.error("Error while fetching claims");
      setLoading(false);
    }
  };

  const navigateToMyContracts = () => {
    navigate('/my_contracts');
  }

  return (
    <div className="main-container">
      <div className="header">
        <h1>My Claims</h1>
        <button className="btn btn-primary" onClick={navigateToMyContracts}>
          My Contracts
        </button>
      </div>
      {loading ? (
        <Loader />
      ) : (
        claims.length === 0 ? (
          <div className="d-flex justify-content-center">
            <div className="no-found">No claims found.</div>
          </div>
        ) : (
          <div className="claims-grid">
            {claims.map((item, index) => (
              <div key={index} className="claim-card">
                <div className="claim-header">
                  <h3>{item.Product.name}</h3>
                  <div className="claim-status">
                    {item.statuss === "pending" ? (
                      <span className="badge bg-warning">Pending</span>
                    ) : item.statuss === "done" ? (
                      <span className="badge bg-success">Done</span>
                    ) : item.statuss === "in_repair" ? (
                      <span className="badge bg-info">In repair</span>
                    ) : item.statuss === "repair_complete" ? (
                      <span className="badge bg-info">Repair complete</span>
                    ) : (
                      <span className="badge bg-danger">Rejected</span>
                    )}
                  </div>
                </div>
                <div className="card-body">
                  <div className="subtitle">Type</div>
                  <p>{item.type}</p>
                  <div className="subtitle">Overview</div>
                  <p>{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
};

export default MyclaimsScreen;
