/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
// import { Link, useNavigate } from 'react-router-dom';
import { Form, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import FormContainer from "../components/FormContainer";
import Loader from "../components/Loader";
import { useUpdateUserMutation } from "../slices/usersApiSlice";
import { setCredentials } from "../slices/authSlice";
import { toast } from "react-toastify";
import './MyClaimsScreen.css';

const MyclaimsScreen = () => {
  const [userId, setUserId] = useState(0);
  const [loading, setLoading] = useState(false);
  const [claims, setClaims] = useState([]);

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
      console.log("here is the userId", userId);
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

  return (
    <div className="main-container">
      <h1>My Claims</h1>
      {loading ? (
        <Loader></Loader>
      ) : (
        <div className="claims-container row">
          {claims.map((item, index) => (
            <div key={index} className="claim-container col-4">
              <div className="w-100 d-flex justify-content-between align-items-center">
                <h3>{item.Product.name}</h3>
                <div className="claim-status">
                  {item.statuss === "pending" ? (
                    <span className="badge bg-warning">Pending</span>
                  ) : item.statuss === "approved" ? (
                    <span className="badge bg-success">Approved</span>
                  ) : (
                    <span className="badge bg-danger">Rejected</span>
                  )}
                </div>
              </div>
              <div className="card-body">
                <div className="subtitle">Overview</div>
                <p>{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyclaimsScreen;
