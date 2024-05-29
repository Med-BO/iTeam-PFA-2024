/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
// import { Link, useNavigate } from 'react-router-dom';
import Loader from "../components/Loader";
import { useUpdateUserMutation } from "../slices/usersApiSlice";
import { setCredentials } from "../slices/authSlice";
import { toast } from "react-toastify";
import "./MyContractsScreen.css";
import { FaFileAlt } from "react-icons/fa";
import {
  Button,
  Modal,
  Form,
  ButtonGroup,
  ToggleButton,
} from "react-bootstrap";
import { Tooltip } from "react-tooltip";

const MyContractsScreen = () => {
  const [userId, setUserId] = useState(0);
  const [loading, setLoading] = useState(false);
  const [contracts, setContracts] = useState([]);
  const [show, setShow] = useState(false);
  const [activeProduct, setActiveProduct] = useState({});
  const [radioValue, setRadioValue] = useState("1");
  const today = new Date();

  const radios = [
    { name: "Stolen", value: "stolen" },
    { name: "Broken", value: "broken" },
  ];

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
                      if (!canAddClaim) {
                        openAddClaimModal(item.Product);
                      }
                    }}
                    // disabled={!canAddClaim}
                    data-tooltip-id={!canAddClaim ? "" : "my-tooltip"}
                    data-tooltip-content={!canAddClaim ? "" : tooltipMessage}
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
              <div className="form-group d-flex justify-content-between align-items-center">
                <label htmlFor="inputEmail4">Issue Type</label>
                <ButtonGroup>
                  {radios.map((radio, idx) => (
                    <ToggleButton
                      key={idx}
                      id={`radio-${idx}`}
                      type="radio"
                      variant="outline-primary"
                      name="radio"
                      value={radio.value}
                      checked={radioValue === radio.value}
                      onChange={(e) => setRadioValue(e.currentTarget.value)}
                    >
                      {radio.name}
                    </ToggleButton>
                  ))}
                </ButtonGroup>
              </div>
              <br/>
              <div className="container my-4 mt-3 mb-2">
              <div>

  
                <div className="col">
                  <hr className="border-top border-dark" />
                </div>
              </div>
            </div>
              <div class="form-group">
                <label for="exampleFormControlTextarea1">
                  Description
                </label>
                <textarea
                  class="form-control"
                  id="exampleFormControlTextarea1"
                  rows="3"
                ></textarea>
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
