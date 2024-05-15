// ProductCard.js
import React from "react";

import { useState, useEffect } from "react";

const Product = ({}) => {
  const [product, setProduct] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    getproduct();
  }, []);

  const getproduct = async () => {
    try {
      const result = await fetch(`http://localhost:5000/api/product/`);
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
    <div className="card-container">
      {error && <div>Error: {error.message}</div>}
      {product.map((item, index) => (
        <div key={index} className="card">
          <img src={item.image} alt="Card Image" className="card-img" />
          <h1 className="card-name">{item.name}</h1>
          <p className="card-description">{item.price}</p>
          <p className="card-description">{item.stock_quantity}</p>
          <a className="card-button">Buy</a>
        </div>
      ))}
    </div>
  );
};

export default Product;
