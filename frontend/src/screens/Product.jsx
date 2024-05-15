// ProductCard.js
import React from "react";
import { useLocation } from "react-router-dom";
import { useRef } from "react";

import { useState, useEffect } from "react";

const Product = ({}) => {
  const [product, setProduct] = useState([]);
  const [error, setError] = useState(null);

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
      const result = await fetch(`http://localhost:5000/api/product/category/${categoryIdRef.current}`);
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
            <p className="card-description">{item.price}</p>
            <p className="card-description">{item.stock_quantity}</p>
            <a className="card-button">Buy</a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Product;
