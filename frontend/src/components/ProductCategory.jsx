 import React, { useEffect, useState } from 'react'
import "./ProductCategory.css"
 

   export  const ProductCategory = () => {
    const [productCategory, setProductCategory] = useState([]);

    useEffect(() => {
        getproductCategory();
        
    }, [])

      const getproductCategory = async()=>{
            let result = await fetch(`http://localhost:5000/api/category/`, {
            mode: 'no-cors'
    });
            result = await result.json();
            setProductCategory(result);
            
        }
        console.warn("ProductCategory", productCategory)

   return (
    
    
   
    <div className='card-container'>
    {productCategory.map((item, index) => (
      <div key={index} className='card'>
        <img src={item.image} alt='Card Image' className='card-img'/>
        <h1 className='card-name'>{item.name}</h1>
        <p className='card-description'>{item.description}</p>
        <a className='card-button' href='product details'>More Product</a>
      </div>
    ))}
  </div>
   )
   
 }


 