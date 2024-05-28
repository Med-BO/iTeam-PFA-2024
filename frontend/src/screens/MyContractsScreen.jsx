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
import './MyContractsScreen.css';
import { FaFileAlt } from "react-icons/fa";

const MyContractsScreen = () => {
  const [userId, setUserId] = useState(0);
  const [loading, setLoading] = useState(false);
  const [contracts, setContracts] = useState([]);

  useEffect(() => {
    const userJsonString = localStorage.getItem("userInfo");
    const user = JSON.parse(userJsonString);
    if (user && user._id) {
      setUserId(user._id);
    }
  }, []);

  useEffect(() => {
    if (userId !== 0) {
      getUserContracts();
    }
  }, [userId]);

  const getUserContracts = async () => {
    setLoading(true);
    try {
      console.log("here is the userId", userId);
      const response = await fetch(
        `http://localhost:5000/api/insurance/user/${userId}/contracts`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch contracts");
      }

      const data = await response.json();
      setContracts(data);
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
      <h1> <FaFileAlt /> My Contracts</h1>
      {loading ? (
        <Loader></Loader>
      ) : (
        <div className="claims-container row">
          {contracts.map((item, index) => (
            <div key={index} className="contract-container col-4 card">
                <div className="w-100 d-flex justify-content-between align-items-center">
                <h3>{item.productName}</h3>
                </div>
                <div className="card-body">
                <div className="subtitle">Contract Details</div>
                <div className="d-flex justify-content-between align-items-center">
                  <strong>Contract Type:</strong>
                  <div>{item.contractType}</div>
                </div>
                <div className="d-flex justify-content-between align-items-center">
                  <strong>Insurance Start Date:</strong>
                  <div>{item.beginDate}</div>
                </div>
                <div className="d-flex justify-content-between align-items-center">
                  <strong>Insurance End Date:</strong>
                  <div>{item.endDate}</div>
                </div>
                <br />
                <div className="subtitle">Product Details</div>
                <div className="d-flex justify-content-between align-items-center">
                  <strong>Product Reference:</strong>
                  <div style={{ maxWidth: '40%', overflowX: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {item.Product._id}
                  </div>
                </div>
                <div className="d-flex justify-content-between align-items-center">
                  <strong>Product Name:</strong>
                  <div>{item.Product.name}</div>
                </div>
                <br />
                <button className="btn btn-primary">Add Claim</button>
                </div>
          </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyContractsScreen;
