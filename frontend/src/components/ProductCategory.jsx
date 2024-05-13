import { useEffect, useState } from "react";
import "./ProductCategory.css";

export const ProductCategory = () => {
  const [productCategory, setProductCategory] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    getproductCategory();
  }, []);

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

  console.log("ProductCategory", productCategory);

  return (
    <div className="card-container">
      {error && <div>Error: {error.message}</div>}
      {productCategory.map((item, index) => (
        <div key={index} className="card">
          <img src={item.image} alt="Card Image" className="card-img" />
          <h1 className="card-name">{item.name}</h1>
          <p className="card-description">{item.description}</p>
          <a className="card-button" href={`/product/${item.id}`}>
            More Product
          </a>
        </div>
      ))}
    </div>
  );
};
