import { useState, useEffect } from "react";
import { Button, FormControl, InputGroup, DropdownButton, Dropdown } from "react-bootstrap";
import Accordion from 'react-bootstrap/Accordion';

const ClaimsTreatmentScreen = () => {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    getAllClaims();
  }, []);

  const getAllClaims = async () => {
    setLoading(true);
    try {
      const result = await fetch(`http://localhost:5000/api/claims/claims`);
      if (!result.ok) {
        throw new Error("Failed to fetch");
      }
      const data = await result.json();
      setClaims(data);
      setLoading(false);
    } catch (error) {
      console.log(error.message);
      setLoading(false);
    }
  };

  const updateClaimStatus = async (claimId, status) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/claims/${claimId}/status`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      const updatedClaim = await response.json();
      // update the status of the claim
      const updatedClaims = claims.map(claim => 
        claim._id === updatedClaim._id ? { ...claim, statuss: updatedClaim.statuss } : claim
      );
      setClaims(updatedClaims);
    } catch (error) {
      console.error(error.message);
    }
  };

  const filteredClaims = claims.filter(claim => 
    (claim._id.toLowerCase().includes(searchTerm.toLowerCase()) || claim.User.name.toLowerCase().includes(searchTerm.toLowerCase())) && 
    (statusFilter === "All" || claim.statuss === statusFilter)
  );

  return (
    <div className="container mt-4">
      <h1>Clients claims</h1>
      <hr />
      <br />
      <InputGroup className="mb-3">
        <FormControl
          placeholder="Search by Claim ID or customer name"
          aria-label="Search by Claim ID"
          aria-describedby="basic-addon2"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
        <DropdownButton
          as={InputGroup.Append}
          variant="outline-secondary"
          title={statusFilter === "All" ? "Filter by Status" : statusFilter}
          id="input-group-dropdown-2"
          alignRight
          onSelect={(status) => setStatusFilter(status)}
        >
          <Dropdown.Item eventKey="All">All</Dropdown.Item>
          <Dropdown.Item eventKey="pending">Pending</Dropdown.Item>
          <Dropdown.Item eventKey="done">Done</Dropdown.Item>
          <Dropdown.Item eventKey="in_repair">In repair</Dropdown.Item>
          <Dropdown.Item eventKey="repair_complete">Repair complete</Dropdown.Item>
          <Dropdown.Item eventKey="rejected">Rejected</Dropdown.Item>
        </DropdownButton>
      </InputGroup>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <Accordion flush>
          {filteredClaims.map((claim, index) => (
            <Accordion.Item eventKey={index.toString()} key={claim._id}>
              <Accordion.Header>
                <div className="w-50 d-flex justify-content-between align-items-center">
                  <div className="d-flex flex-column">
                    <div>Claim <b>#{claim._id}</b></div>
                    <div className="subtitle">{claim.type}</div>
                  </div>
                  <div className="claim-status">
                    {claim.statuss === "pending" ? (
                      <span className="badge bg-warning">Pending</span>
                    ) : claim.statuss === "done" ? (
                      <span className="badge bg-success">Done</span>
                    ) : claim.statuss === "in_repair" ? (
                      <span className="badge bg-info">In repair</span>
                    ) : claim.statuss === "repair_complete" ? (
                      <span className="badge bg-info">Repair complete</span>
                    ) : (
                      <span className="badge bg-danger">Rejected</span>
                    )}
                  </div>
                </div>
              </Accordion.Header>
              <Accordion.Body>
                <div className="row w-100">
                  <div className="col-6">
                    <div className="subtitle">Product details</div>
                    <div><strong>Description:</strong> {claim.description}</div>
                    <div><strong>Product:</strong> {claim.Product.name}</div>
                    <br />
                    <div className="subtitle">User details</div>
                    <div><strong>User Name:</strong> {claim.User.name}</div>
                    <div><strong>User Email:</strong> {claim.User.email}</div>
                  </div>
                  <div className="col-6 d-flex justify-content-center align-items-center gap-3">
                    <Button
                      variant="danger"
                      onClick={() => updateClaimStatus(claim._id, 'rejected')}
                    >
                      Reject
                    </Button>
                    <Button
                      variant="primary"
                      onClick={() => updateClaimStatus(claim._id, 'in_repair')}
                    >
                      Send for repair
                    </Button>
                    <Button
                      variant="success"
                      onClick={() => updateClaimStatus(claim._id, 'done')}
                    >
                      Mark as Done
                    </Button>
                  </div>
                </div>
              </Accordion.Body>
            </Accordion.Item>
          ))}
        </Accordion>
      )}
    </div>
  );
};

export default ClaimsTreatmentScreen;
