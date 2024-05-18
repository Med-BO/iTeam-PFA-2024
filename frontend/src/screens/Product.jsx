// ProductCard.js
import React from "react";
import { useLocation } from "react-router-dom";
import { useRef } from "react";
import { Button, Modal } from "react-bootstrap";
import { useState, useEffect } from "react";
import { Form } from "react-bootstrap";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";

const Product = ({}) => {
  const [product, setProduct] = useState([]);
  const [error, setError] = useState(null);
  const [show, setShow] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // here we receive the sent value from the precedent screen
  const { state } = useLocation();
  const categoryIdRef = useRef("");
  const categoryNameRef = useRef("");

  useEffect(() => {
    // here we udpate the value after its received from teh precedent screen
    categoryIdRef.current = state?.categoryId || "";
    categoryNameRef.current = state?.categoryName || "";

    getproduct();
  }, []);

  const getproduct = async () => {
    try {
      const result = await fetch(
        `http://localhost:5000/api/product/category/${categoryIdRef.current}`
      );
      if (!result.ok) {
        throw new Error("Failed to fetch");
      }
      const data = await result.json();
      setProduct(data);
    } catch (error) {
      setError(error);
    }

    console.log("Product", product);
  };
  return (
    <div className="main-container">
      <h2>{categoryNameRef.current}</h2>
      <div className="card-container">
        {error && <div>Error: {error.message}</div>}
        {product.map((item, index) => (
          <div key={index} className="card">
            <img src={item.image} alt="Card Image" className="card-img" />
            <h1 className="card-name">{item.name}</h1>
            <p className="card-description"> price :{item.price}</p>
            <div>
              stock quantity:{" "}
              {item ? (
                <span
                  className={`card-description-stock ${
                    item.stock_quantity > 0 ? "green" : "red"
                  }`}
                >
                  {item.stock_quantity > 0 ? item.stock_quantity : "Hors stock"}
                </span>
              ) : (
                <span className="card-description-stock red">hors stock</span>
              )}
            </div>

            <Button
              className="card-button"
              variant="primary"
              onClick={handleShow}
            >
              Buy
            </Button>
            <Modal show={show} onHide={handleClose}>
              <Modal.Header closeButton>
                <Modal.Title>Insurance</Modal.Title>
              </Modal.Header>
              <Modal.Body className="date-picker-wrapper">
                <div>
                  <form>
                    <div class="form-row">
                      <div class="form-group col-md-6">
                        <label for="inputEmail4">insurance Type</label>
                        <Form.Select name="contract-type">
                          <option value="premium">Premium</option>
                          <option value="smartphone">Smartphone</option>
                          <option value="universel">Universel</option>
                        </Form.Select>
                      </div>
                      <br></br>

                      <div class="form-group col-md-6">
                        <label for="inputPassword4">Price/Day</label>
                        <input
                          type="text"
                          class="form-control"
                          id="inputPassword4"
                          placeholder="Price per day"
                        />
                      </div>
                      <br></br>

                      <div class="form-group">
                        <div class="form-check">
                          <label class="form-check-label" for="gridCheck">
                            Steal protection
                          </label>
                          <input
                            class="form-check-input"
                            type="checkbox"
                            id="gridCheck"
                          />
                        </div>
                        <br></br>

                        <div class="form-group">
                          <label for="inputAddress">term of contract</label>
                          <textarea
                            type="text"
                            class="form-control"
                            id="inputAddress"
                          />
                        </div>
                        <br></br>

                        <div>
                          <div class="row">
                            <div class="col-md-6">
                              <div class="form-group row">
                                <label
                                  for="inputLastName"
                                  class="col-sm-4 col-form-label"
                                >
                                  LastName 
                                </label>
                                <div class="col-sm-8">
                                  <input
                                    type="text"
                                    class="form-control"
                                    id="inputLastName"
                                  />
                                </div>
                              </div>
                            </div>

                            <div class="col-md-6">
                              <div class="form-group row">
                                <label
                                  for="inputFirstName"
                                  class="col-sm-4 col-form-label"
                                >
                                  FirstName 
                                </label>
                                <div class="col-sm-8">
                                  <input
                                    type="text"
                                    class="form-control"
                                    id="inputFirstName"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                            <br/>
                          <div class="row">
                            <div class="col-md-6">
                              <div class="form-group row">
                                <label
                                  for="inputEmail"
                                  class="col-sm-4 col-form-label"
                                >
                                  Email 
                                </label>
                                <div class="col-sm-8">
                                  <input
                                    type="text"
                                    class="form-control"
                                    id="inputEmail"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                          <br />
                          <div>
                            <label>Start Date </label>{" "}
                            <DatePicker
                              className="form-control"
                              selected={startDate}
                              onChange={(date) => setStartDate(date)}
                            />
                          </div>
                          <br />
                          <div>
                            <label>End Date </label>{" "}
                            <DatePicker
                              className="form-control"
                              selected={endDate}
                              onChange={(date) => setEndDate(date)}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                  Close
                </Button>
                <Button variant="primary" onClick={handleClose}>
                  Next
                </Button>
              </Modal.Footer>
            </Modal>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Product;
