/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
// import { Link, useNavigate } from 'react-router-dom';
import { Form, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import FormContainer from "../components/FormContainer";
import Loader from "../components/Loader";
import { useUpdateUserMutation } from "../slices/usersApiSlice";
import { setCredentials } from "../slices/authSlice";
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const AutoReclaimScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userId, setUserId] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const userJsonString = localStorage.getItem("userInfo");
    setUserId(JSON.parse(userJsonString)._id);
  }, []);

  const submitHandler = (e) => {
    setLoading(true)
    authenticateInsurance({ email, password, userId })
  }

  const authenticateInsurance = async (authenticationPayload) => {
    try {
      console.log('here is the payload', authenticationPayload)
      const response = await fetch('http://localhost:5000/api/insurance/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(authenticationPayload),
      });
  
      if (!response.ok) {
        throw new Error('Wrong credentials');
      }
  
      const data = await response.json();
      console.log('Product added:', data);
      toast.success('Authentication successful');
      setLoading(false)
      // navigate to my_claims route
      navigate('/my_claims')
    } catch (error) {
      console.error('Error while authenticating:', error.message);
      setLoading(false)
    }
  };

  return (
    <div>
      <h1>Authenticate</h1>
      <p>Enter your insurance credentials to access and manage your claims, you receive your insurance credentials when you buy a product from our store.</p>
      <div className="row">
        <Form className="col-6">
          <Form.Group controlId="email">
            <Form.Label>Email Address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <br />
          <Form.Group controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <br />
          {!loading ? (
            <Button type="submit" variant="primary" onClick={submitHandler}>
            Authenticate
            </Button>
          ) : (
            <Loader />
          )}
          
        </Form>
        <div className="col-6">
          <img src="src/assets/images/insurance_bg.png" alt="" />
        </div>
      </div>
    </div>
  );
};

export default AutoReclaimScreen;
