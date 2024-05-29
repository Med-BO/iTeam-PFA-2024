import { useState, useEffect } from "react";
import { Button, FormControl, InputGroup } from "react-bootstrap";
import Accordion from "react-bootstrap/Accordion";
import "./RepairScreen.css";

const RepairScreen = () => {
  const [repairProcedures, setRepairProcedures] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    getAllRepairProcedures();
  }, []);

  const getAllRepairProcedures = async () => {
    setLoading(true);
    try {
      const result = await fetch(
        `http://localhost:5000/api/repair_procedure/all`
      );
      if (!result.ok) {
        throw new Error("Failed to fetch");
      }
      const data = await result.json();
      setRepairProcedures(data);
      setLoading(false);
    } catch (error) {
      console.log(error.message);
      setLoading(false);
    }
  };

  const updateRepairProcedureStatus = async (repairProcedureId, status) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/repair_procedure/${repairProcedureId}/update_status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update status");
      }

      const updatedRepairProcedure = await response.json();
      // update the statuss of the claim
      repairProcedures.find(
        (procedure) => procedure._id === updatedRepairProcedure._id
      ).statuss = updatedRepairProcedure.statuss;
      setRepairProcedures([...repairProcedures]);
    } catch (error) {
      console.error(error.message);
    }
  };

  const filteredRepairProcedures = repairProcedures.filter((claim) =>
    claim._id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mt-4">
      <h1>Repair requests</h1>
      <hr />
      <br />
      <InputGroup className="mb-3">
        <FormControl
          placeholder="Search by Claim ID"
          aria-label="Search by Claim ID"
          aria-describedby="basic-addon2"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </InputGroup>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="repair-procedures-container row gap-4">
          {filteredRepairProcedures.map((repairProcedure, index) => (
            <div
              className="repair-procedure-container"
              key={repairProcedure._id}
            >
              <div className="repair-procedure-header d-flex justify-content-between align-items-center">
                <div>Reference</div>
                <div>{repairProcedure._id}</div>
              </div>
              <hr />
              <div className="repair-procedure-body">
                <div className="product-image">
                  <img
                    width={90 + "%"}
                    src={repairProcedure.Product.image}
                    alt="Product"
                  />
                </div>
                <div className="defect-description">
                  <div className="repair-procedure-subtitle">
                    Defect description
                  </div>
                  <p>{repairProcedure.ProductClaim.description}</p>
                </div>
              </div>
              <div className="repair-procedure-footer d-flex justify-content-end align-items-center">
                <Button variant="primary" onClick={() => updateRepairProcedureStatus(repairProcedure._id, 'done')}>Mark as repaired</Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RepairScreen;
