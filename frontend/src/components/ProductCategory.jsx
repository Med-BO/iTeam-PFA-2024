import { useEffect, useState } from "react";
import { Container, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./ProductCategory.css";

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
      <h1>Categories</h1>
      <hr />
      <div className="row equal-height-cards">
        {productCategory.map((item, index) => (
          <div key={index} className="col-sm-12 col-md-6 col-lg-4 mb-4">
            <div className="category-container">
              <div className="card custom-card">
                <div className="card-image-wrapper">
                  <img
                    src={item.image}
                    alt="Card Image"
                    className="card-img-top custom-card-img"
                  />
                </div>
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{item.name}</h5>
                  <p className="card-text flex-grow-1">{item.description}</p>
                  <button
                    className="btn btn-primary"
                    onClick={() =>
                      navigateToProductsScreen(item._id, item.name)
                    }
                  >
                    See Products
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Container>
  );
};
