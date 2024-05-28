import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { Button, Modal, Form } from "react-bootstrap";
import DatePicker from "react-datepicker";
import { toast } from "react-toastify";
import "react-datepicker/dist/react-datepicker.css";

const Product = () => {
  const [product, setProduct] = useState([]);
  const [error, setError] = useState(null);
  const [show, setShow] = useState(false);
  const [showProductModal, setshowProductModal] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [userId, setUserId] = useState(0);
  const [productIdToBuy, setProductIdToBuy] = useState(0);
  const [contractType, setContractType] = useState("premium");
  const [ppd, setPpd] = useState(10);
  const [stealProtection, setStealProtection] = useState(true);
  const [insurancePrice, setInsurancePrice] = useState(0);
  const [productToBuyName, setProductToBuyName] = useState("");
  const [productToBuyPrice, setProductToBuyPrice] = useState(0);

  const handleClose = () => {
    setShow(false);
    setshowProductModal(false);
  }
  const handleShow = (productId) => {
    setShow(true);
    setProductIdToBuy(productId);
  };

  const handleShowProductModal = () => {
    setShow(false);
    setInsurancePrice(ppd * (endDate - startDate) / (1000 * 60 * 60 * 24));
    setProductToBuyName(product.find(p => p._id === productIdToBuy).name);
    setProductToBuyPrice(product.find(p => p._id === productIdToBuy).price);
    setshowProductModal(true);
  };

  // here we receive the sent value from the precedent screen
  const { state } = useLocation();
  const categoryIdRef = useRef("");
  const categoryNameRef = useRef("");

  useEffect(() => {
    // here we update the value after it's received from the previous screen
    categoryIdRef.current = state?.categoryId || "";
    categoryNameRef.current = state?.categoryName || "";
    const userJsonString = localStorage.getItem("userInfo");
    setUserId(JSON.parse(userJsonString)._id);
    getProduct();
  }, [state]);

  const formatDateToDDMMYYYY = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = d.getFullYear();
  
    return `${day}/${month}/${year}`;
  };

  const getProduct = async () => {
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
  };

  const buyProduct = async () => {
    try {
      const requestBody = {
        Product: productIdToBuy,
        User: userId,
        contractType: contractType,
        ppd: ppd,
        stealProtection: stealProtection,
        beginDate: formatDateToDDMMYYYY(startDate),
        endDate: formatDateToDDMMYYYY(endDate),
      };
      const response = await fetch('http://localhost:5000/api/buy/buy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        toast.error('Could not buy product');
        throw new Error('Could not buy product');
      }

      toast.success('Product was successfully bought');
      // setLoading(false)
      // navigate to my_claims route
    } catch (error) {
      console.error('Error while authenticating:', error.message);
      // setLoading(false)
    }
  };

  const handleBuy = () => {
    buyProduct();
    handleClose();
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
            <p className="card-description">price: {item.price}</p>
            <div>
              stock quantity:{" "}
              {item ? (
                <span
                  className={`card-description-stock ${
                    item.stock_quantity > 0 ? "green" : "red"
                  }`}
                >
                  {item.stock_quantity > 0 ? item.stock_quantity : "Out of stock"}
                </span>
              ) : (
                <span className="card-description-stock red">Out of stock</span>
              )}
            </div>
            <br />
            <Button
              className="card-button"
              variant="primary"
              onClick={() => handleShow(item._id)}
            >
              Buy
            </Button>
          </div>
        ))}
      </div>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Insurance</Modal.Title>
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
                    Insurance information
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
                <Form.Select name="contract-type" onChange={(e) => setContractType(e.target.value)}>
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
                  value={ppd}
                  onChange={(e) => setPpd(e.target.value)}
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
                    checked={stealProtection}
                    onChange={(e) => setStealProtection(e.target.checked)}
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
                    <div className="col-md-6">
                      <label>Start Date</label>{" "}
                      <DatePicker
                        className="form-control"
                        selected={startDate}
                        onChange={(date) => setStartDate(date)}
                      />
                    </div>
                    <br />
                    <div className="col-md-6">
                      <label>End Date</label>{" "}
                      <DatePicker
                        className="form-control"
                        selected={endDate}
                        onChange={(date) => setEndDate(date)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Skip
          </Button>
          <Button variant="primary" onClick={() => handleShowProductModal()}>
            Next
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={showProductModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Buy</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="">
            <div className="d-flex w-100 justify-content-between align-items-center">
              <div>
                Product
              </div>
              <div>
                {productToBuyName} - <b>{ productToBuyPrice } TND</b>
              </div>
            </div>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                Insurance
              </div>
              <div>
                { insurancePrice } TND
              </div>
            </div>
            <hr />
            <div className="d-flex justify-content-between align-items-center">
              <div>
                Total
              </div>
              <div>
                { productToBuyPrice + insurancePrice } TND
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleBuy}>
            Buy
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Product;
