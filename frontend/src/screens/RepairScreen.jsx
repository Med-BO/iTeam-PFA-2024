import { useState, useEffect } from "react";
import {
  Button,
  FormControl,
  InputGroup,
  DropdownButton,
  Dropdown,
  Spinner,
} from "react-bootstrap";
import "./RepairScreen.css";

const RepairScreen = () => {
  const [repairProcedures, setRepairProcedures] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

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
      const updatedProcedures = repairProcedures.map((procedure) =>
        procedure._id === updatedRepairProcedure.repair._id
          ? { ...procedure, statuss: updatedRepairProcedure.repair.statuss }
          : procedure
      );
      setRepairProcedures(updatedProcedures);
    } catch (error) {
      console.error(error.message);
    }
  };

  const filteredRepairProcedures = repairProcedures.filter((procedure) => {
    return (
      procedure._id.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (statusFilter === "all" || procedure.statuss === statusFilter)
    );
  });

  return (
    <div className="container mt-4">
      <h1>Repair Requests</h1>
      <hr />
      <InputGroup className="mb-3">
        <FormControl
          placeholder="Search by Claim ID"
          aria-label="Search by Claim ID"
          aria-describedby="basic-addon2"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <DropdownButton
          as={InputGroup.Append}
          variant="outline-secondary"
          title={statusFilter === "all" ? "Filter by Status" : statusFilter}
          id="input-group-dropdown-2"
          onSelect={(e) => setStatusFilter(e)}
        >
          <Dropdown.Item eventKey="all">All</Dropdown.Item>
          <Dropdown.Item eventKey="in repair">In Repair</Dropdown.Item>
          <Dropdown.Item eventKey="done">Done</Dropdown.Item>
        </DropdownButton>
      </InputGroup>

      {loading ? (
        <div className="text-center my-4">
          <Spinner animation="border" role="status">
            <span className="sr-only">Loading...</span>
          </Spinner>
        </div>
      ) : (
        <div className="repair-procedures-container row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {filteredRepairProcedures.map((repairProcedure) => (
            <div className="col" key={repairProcedure._id}>
              <div className="card h-100">
                <div className="card-header d-flex justify-content-around">
                  <span>Reference: {repairProcedure._id}</span>
                  <span className="badge">
                    {repairProcedure.statuss === "done" ? (
                      <span className="badge bg-success">Done</span>
                    ) : (
                      <span className="badge bg-warning">In repair</span>
                    )}
                  </span>
                </div>
                <div className="card-body p-2">
                  <img
                    className="card-img-top mb-3"
                    src={repairProcedure.Product.image}
                    alt="Product"
                    style={{ objectFit: "contain", height: "150px" }}
                  />
                  <h5 className="card-title">Defect Description</h5>
                  <p className="card-text">{repairProcedure.ProductClaim.description}</p>
                </div>
                <div className="card-footer text-end">
                  <Button
                    variant="primary"
                    disabled={repairProcedure.statuss === "done"}
                    onClick={() =>
                      updateRepairProcedureStatus(repairProcedure._id, "done")
                    }
                  >
                    Mark as Repaired
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RepairScreen;
