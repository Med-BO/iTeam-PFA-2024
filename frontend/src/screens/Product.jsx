import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { Button, Modal, Form, Container, Row, Col, Card } from "react-bootstrap";
import DatePicker from "react-datepicker";
import { toast } from "react-toastify";
import "react-datepicker/dist/react-datepicker.css";
import "react-toastify/dist/ReactToastify.css";
import "./Product.css"; // Assuming you have a CSS file for custom styles

const Product = () => {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(tomorrow);

  const [product, setProduct] = useState([]);
  const [error, setError] = useState(null);
  const [show, setShow] = useState(false);
  const [showProductModal, setshowProductModal] = useState(false);
  const [userId, setUserId] = useState(0);
  const [productIdToBuy, setProductIdToBuy] = useState(0);
  const [contractType, setContractType] = useState("none");
  const [ppd, setPpd] = useState(10);
  const [stealProtection, setStealProtection] = useState(true);
  const [insurancePrice, setInsurancePrice] = useState(0);
  const [productToBuyName, setProductToBuyName] = useState("");
  const [productToBuyPrice, setProductToBuyPrice] = useState(0);
  const [insuranceAccount, setInsuranceAccount] = useState({});
  const [showInsuranceAccountModal, setShowInsuranceAccountModal] = useState(false);

  const handleClose = () => {
    setShow(false);
    setshowProductModal(false);
    setShowInsuranceAccountModal(false);
  };

  const handleShow = (productId) => {
    setShow(true);
    setProductIdToBuy(productId);
  };

  const handleShowProductModal = () => {
    setShow(false);
    setInsurancePrice(ppd * (endDate - startDate) / (1000 * 60 * 60 * 24));
    const selectedProduct = product.find(p => p._id === productIdToBuy);
    setProductToBuyName(selectedProduct.name);
    setProductToBuyPrice(selectedProduct.price);
    setshowProductModal(true);
  };

  const { state } = useLocation();
  const categoryIdRef = useRef("");
  const categoryNameRef = useRef("");

  useEffect(() => {
    categoryIdRef.current = state?.categoryId || "";
    categoryNameRef.current = state?.categoryName || "";
    const userJsonString = localStorage.getItem("userInfo");
    setUserId(JSON.parse(userJsonString)._id);
    getProduct();
  }, [state]);

  const formatDateToDDMMYYYY = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();

    return `${day}/${month}/${year}`;
  };

  const getProduct = async () => {
    try {
      const result = await fetch(`http://localhost:5000/api/product/category/${categoryIdRef.current}`);
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
      const updatedProduct = product.find(p => p._id === productIdToBuy);
      updatedProduct.stock_quantity -= 1;
      setProduct([...product.filter(p => p._id !== productIdToBuy), updatedProduct]);

      const data = await response.json();
      if (data.insuranceAccount) {
        toast.success(`Insurance account created`);
        setInsuranceAccount(data.insuranceAccount);
        setShowInsuranceAccountModal(true);
      }
    } catch (error) {
      console.error('Error while authenticating:', error.message);
    }
  };

  const handleBuy = () => {
    buyProduct();
    handleClose();
  };

  const skipToProductBuy = () => {
    setShow(false);
    setInsurancePrice(0);
    setContractType("none");
    const selectedProduct = product.find(p => p._id === productIdToBuy);
    setProductToBuyName(selectedProduct.name);
    setProductToBuyPrice(selectedProduct.price);
    setshowProductModal(true);
  };

  return (
    <Container className="main-container">
      <h2 className="text-center my-4">{categoryNameRef.current}</h2>
      <Row className="card-container">
        {error && <div className="alert alert-danger">Error: {error.message}</div>}
        {product.map((item, index) => (
          <Col key={index} xs={12} sm={6} md={4} lg={3} className="mb-4">
            <Card className="h-100">
              <Card.Img variant="top" src={item.image} alt="Card Image" className="card-img-top" />
              <Card.Body>
                <Card.Title className="card-name">{item.name}</Card.Title>
                <Card.Text className="card-description">Price: {item.price}</Card.Text>
                <Card.Text>
                  Stock Quantity:{" "}
                  <span className={`card-description-stock ${item.stock_quantity > 0 ? "text-success" : "text-danger"}`}>
                    {item.stock_quantity > 0 ? item.stock_quantity : "Out of stock"}
                  </span>
                </Card.Text>
                <Button className="card-button" variant="primary" onClick={() => handleShow(item._id)}>
                  Buy
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
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
                    Insurance Information
                  </span>
                </div>
                <div className="col">
                  <hr className="border-top border-dark" />
                </div>
              </div>
            </div>
            <Row className="form-row">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Insurance Type</Form.Label>
                  <Form.Select name="contract-type" onChange={(e) => setContractType(e.target.value)}>
                    <option value="none">Select a type</option>
                    <option value="premium">Premium</option>
                    <option value="smartphone">Smartphone</option>
                    <option value="universal">Universal</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Price/Day</Form.Label>
                  <Form.Control
                    type="text"
                    value={ppd}
                    onChange={(e) => setPpd(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group className="form-check">
                  <Form.Check
                    type="checkbox"
                    label="Steal protection"
                    checked={stealProtection}
                    onChange={(e) => setStealProtection(e.target.checked)}
                  />
                </Form.Group>
              </Col>
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
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Start Date</Form.Label>
                  <DatePicker
                    className="form-control"
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>End Date</Form.Label>
                  <DatePicker
                    className="form-control"
                    selected={endDate}
                    onChange={(date) => setEndDate(date)}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={skipToProductBuy}>
            Skip
          </Button>
          <Button variant="primary" onClick={handleShowProductModal}>
            Next
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={showProductModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Buy</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <div className="d-flex justify-content-between align-items-center">
              <div>Product</div>
              <div>
                {productToBuyName} - <b>{productToBuyPrice} TND</b>
              </div>
            </div>
            <div className="d-flex justify-content-between align-items-center">
              <div>Insurance</div>
              <div>{insurancePrice} TND</div>
            </div>
            <hr />
            <div className="d-flex justify-content-between align-items-center">
              <div>Total</div>
              <div>{productToBuyPrice + insurancePrice} TND</div>
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
      <Modal show={showInsuranceAccountModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Insurance Account</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <div className="subtitle">Your account credentials</div>
            <div className="d-flex justify-content-between align-items-center">
              <div>Email:</div>
              <div>{insuranceAccount.email}</div>
            </div>
            <div className="d-flex justify-content-between align-items-center">
              <div>Password:</div>
              <div>{insuranceAccount.password}</div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Ok
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Product;
