import { useEffect, useState } from "react";
import "./ProductCategory.css";
import { useNavigate } from "react-router-dom";

export const ProductCategory = () => {
  const [productCategory, setProductCategory] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    getproductCategory();
  }, []);

  const navigateToProductsScreen = (categoryId, categoryName) => {
    navigate("product", { state: {
      categoryId: categoryId,
      categoryName: categoryName
    } });
  }

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
    <div className="card-container">
      {error && <div>Error: {error.message}</div>}
      {productCategory.map((item, index) => (
        <div key={index} className="card">
          <img src={item.image} alt="Card Image" className="card-img" />
          <h1 className="card-name">{item.name}</h1>
          <p className="card-description">{item.description}</p>
          <button className="card-button" onClick={() => navigateToProductsScreen(item._id, item.name)}>
            See Products
          </button>
        </div>
      ))}
    </div>
  );
};
