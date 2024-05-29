import { useEffect, useState } from "react";
import { Card, Button, Container, Row, Col, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

export const ProductCategory = () => {
  const [productCategory, setProductCategory] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    getproductCategory();
  }, []);

  const navigateToProductsScreen = (categoryId, categoryName) => {
    navigate("product", { state: { categoryId, categoryName } });
  };

  const getproductCategory = async () => {
    try {
      const result = await fetch(`http://localhost:5000/api/category/`);
      if (!result.ok) {
        throw new Error("Failed to fetch");
      }
      const data = await result.json();
      setProductCategory(data);
    } catch (error) {
      setError(error);
    }
  };

  return (
    <Container>
      {error && <Alert variant="danger">Error: {error.message}</Alert>}
      <Row>
        {productCategory.map((item, index) => (
          <Col key={index} sm={12} md={6} lg={4} className="mb-4">
            <Card className="h-100">
              <div className="card-image-wrapper">
                <Card.Img variant="top" src={item.image} alt="Card Image" className="card-img-top" />
              </div>
              <Card.Body className="d-flex flex-column">
                <Card.Title>{item.name}</Card.Title>
                <Card.Text className="flex-grow-1">{item.description}</Card.Text>
                <Button variant="primary" onClick={() => navigateToProductsScreen(item._id, item.name)}>
                  See Products
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};
