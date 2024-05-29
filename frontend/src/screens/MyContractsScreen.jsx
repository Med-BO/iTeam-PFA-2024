/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
// import { Link, useNavigate } from 'react-router-dom';
import Loader from "../components/Loader";
import { useUpdateUserMutation } from "../slices/usersApiSlice";
import { setCredentials } from "../slices/authSlice";
import { toast } from "react-toastify";
import "./MyContractsScreen.css";
import { FaFileAlt } from "react-icons/fa";
import { Button, Modal, Form } from "react-bootstrap";
import Product from "./Product";
import { Tooltip } from "react-tooltip";

const MyContractsScreen = () => {
  const [userId, setUserId] = useState(0);
  const [loading, setLoading] = useState(false);
  const [contracts, setContracts] = useState([]);
  const [show, setShow] = useState(false);
  const [activeProduct, setActiveProduct] = useState({});
  const today = new Date();

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

  const handleClose = () => {
    setShow(false);
  };

  const addClaim = () => {
    setShow(false);
  };

  const openAddClaimModal = (product) => {
    setActiveProduct(product);
    setShow(true);
  };

  return (
    <div className="main-container">
      <h1>
        {" "}
        <FaFileAlt /> My Contracts
      </h1>
      {loading ? (
        <Loader></Loader>
      ) : (
        <div className="claims-container row">
          {contracts.map((item, index) => {
            const endDate = new Date(item.endDate);
            const canAddClaim = endDate > today;
            const tooltipMessage = "Insurance expired. Cannot add claim.";

            return (
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
                    <div
                      style={{
                        maxWidth: "40%",
                        overflowX: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {item.Product._id}
                    </div>
                  </div>
                  <div className="d-flex justify-content-between align-items-center">
                    <strong>Product Name:</strong>
                    <div>{item.Product.name}</div>
                  </div>
                  <br />
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      if (canAddClaim) {
                        openAddClaimModal(item.Product)
                      }
                    }}
                    // disabled={!canAddClaim}
                    data-tooltip-id={canAddClaim ? "" : "my-tooltip"}
                    data-tooltip-content={canAddClaim ? "" : tooltipMessage}
                  >
                    Add Claim
                  </button>
                  {!canAddClaim && <Tooltip id="my-tooltip" />}
                </div>
              </div>
            );
          })}
        </div>
      )}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add a claim for {activeProduct.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="date-picker-wrapper">
          <Form>
            <div className="container my-4 mt-0">
              <div className="row">
                <div className="col">
                  <hr className="border-top border-dark" />
                </div>
                <div className="col-auto">
                  <span className="text-uppercase text-secondary">
                    Issue description
                  </span>
                </div>
                <div className="col">
                  <hr className="border-top border-dark" />
                </div>
              </div>
            </div>
            <div className="form-row row">
              <div className="form-group col-md-6">
                <label htmlFor="inputEmail4">Insurance Type</label>
                <Form.Select name="contract-type">
                  <option value="premium">Premium</option>
                  <option value="smartphone">Smartphone</option>
                  <option value="universal">Universal</option>
                </Form.Select>
              </div>
              <br />
              <div className="form-group col-md-6">
                <label htmlFor="inputPassword4">Price/Day</label>
                <input
                  type="text"
                  className="form-control"
                  id="inputPassword4"
                />
                <br />
              </div>
              <br />
              <div className="form-group">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="gridCheck"
                  />
                  <label className="form-check-label" htmlFor="gridCheck">
                    Steal protection
                  </label>
                </div>
                <div>
                  <div className="row">
                    <div className="container my-4 mb-0">
                      <div className="row">
                        <div className="col">
                          <hr className="border-top border-dark" />
                        </div>
                        <div className="col-auto">
                          <span className="text-uppercase text-secondary">
                            Duration
                          </span>
                        </div>
                        <div className="col">
                          <hr className="border-top border-dark" />
                        </div>
                      </div>
                    </div>
                    <br />
                  </div>
                </div>
              </div>
            </div>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={() => addClaim()}>
            Add
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default MyContractsScreen;
