// ProductCard.js
import React from "react";
import { useLocation } from "react-router-dom";
import { useRef } from "react";
import { Button, Modal } from "react-bootstrap";
import { useState, useEffect } from "react";
import { Form } from 'react-bootstrap';

const Product = ({}) => {
  const [product, setProduct] = useState([]);
  const [error, setError] = useState(null);
  const [show, setShow] = useState(false);

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
              <Modal.Body>
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
                      <div class="form-group col-md-6">
                        <label for="inputPassword4">Password</label>
                        <input
                          type="password"
                          class="form-control"
                          id="inputPassword4"
                          placeholder="Password"
                        />
                      </div>
                    </div>
                    <div class="form-group">
                      <label for="inputAddress">Address</label>
                      <input
                        type="text"
                        class="form-control"
                        id="inputAddress"
                        placeholder="1234 Main St"
                      />
                    </div>
                    <div class="form-group">
                      <label for="inputAddress2">Address 2</label>
                      <input
                        type="text"
                        class="form-control"
                        id="inputAddress2"
                        placeholder="Apartment, studio, or floor"
                      />
                    </div>
                    <div class="form-row">
                      <div class="form-group col-md-6">
                        <label for="inputCity">City</label>
                        <input
                          type="text"
                          class="form-control"
                          id="inputCity"
                        />
                      </div>
                      <div class="form-group col-md-4">
                        <label for="inputState">State</label>
                        <select id="inputState" class="form-control">
                          <option selected>Choose...</option>
                          <option>...</option>
                        </select>
                      </div>
                      <div class="form-group col-md-2">
                        <label for="inputZip">Zip</label>
                        <input type="text" class="form-control" id="inputZip" />
                      </div>
                    </div>
                    <div class="form-group">
                      <div class="form-check">
                        <input
                          class="form-check-input"
                          type="checkbox"
                          id="gridCheck"
                        />
                        <label class="form-check-label" for="gridCheck">
                          Check me out
                        </label>
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
