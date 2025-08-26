import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import Icon from "../components/Icon";

const CreateLOTO = () => {
  const [formData, setFormData] = useState({
    shift: "A",
    isolatedPart: "",
    reason: "",
    ptwNumber: "N/A",
    expectedDuration: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const { shift, isolatedPart, reason, ptwNumber, expectedDuration } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const res = await axios.post(
        "http://localhost:5000/api/loto",
        formData,
        config
      );

      alert(
        `LOTO created successfully!\nSerial Number: ${res.data.data.serialNumber}`
      );
      navigate("/loto-list");
    } catch (err) {
      setError(err.response?.data?.message || "Error creating LOTO");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-8">
        <div className="card">
          <div className="card-header d-flex justify-content-between align-items-center">
            <h2 className="mb-0">
              <Icon name="add" /> Create New LOTO
            </h2>
            <div className="d-flex gap-2">
              <Button
                variant="outline-secondary"
                onClick={() => navigate("/loto-list")}
              >
                <Icon name="back" /> Back to List
              </Button>
              <Button
                variant="outline-primary"
                onClick={() => navigate("/dashboard")}
              >
                <Icon name="dashboard" /> Dashboard
              </Button>
            </div>
          </div>
          <div className="card-body">
            {error && (
              <div className="alert alert-danger">
                <Icon name="warning" /> {error}
              </div>
            )}

            <form onSubmit={onSubmit}>
              <div className="row">
                <div className="col-md-6">
                  <div className="form-group mb-3">
                    <label className="form-label">Shift</label>
                    <select
                      name="shift"
                      value={shift}
                      onChange={onChange}
                      className="form-control"
                    >
                      <option value="A">A</option>
                      <option value="B">B</option>
                      <option value="C">C</option>
                      <option value="D">D</option>
                      <option value="E">E</option>
                    </select>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="form-group mb-3">
                    <label className="form-label">
                      Expected Duration (hours)
                    </label>
                    <input
                      type="number"
                      name="expectedDuration"
                      value={expectedDuration}
                      onChange={onChange}
                      placeholder="Enter duration in hours"
                      step="0.5"
                      min="0.5"
                      className="form-control"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="form-group mb-3">
                <label className="form-label">Isolated Part</label>
                <input
                  type="text"
                  name="isolatedPart"
                  value={isolatedPart}
                  onChange={onChange}
                  placeholder="Enter part description"
                  className="form-control"
                  required
                />
              </div>

              <div className="form-group mb-3">
                <label className="form-label">Reason</label>
                <input
                  type="text"
                  name="reason"
                  value={reason}
                  onChange={onChange}
                  placeholder="Enter reason"
                  className="form-control"
                  required
                />
              </div>

              <div className="form-group mb-4">
                <label className="form-label">PTW Number</label>
                <input
                  type="text"
                  name="ptwNumber"
                  value={ptwNumber}
                  onChange={onChange}
                  placeholder="Enter PTW number or N/A"
                  className="form-control"
                />
              </div>

              <div className="d-flex gap-2">
                <Button type="submit" variant="primary" disabled={loading}>
                  {loading ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Creating...
                    </>
                  ) : (
                    <>
                      <Icon name="save" /> Create LOTO
                    </>
                  )}
                </Button>

                <Button
                  variant="secondary"
                  onClick={() => navigate("/loto-list")}
                >
                  <Icon name="cancel" /> Cancel
                </Button>

                <Button
                  variant="outline-primary"
                  onClick={() => navigate("/dashboard")}
                >
                  <Icon name="dashboard" /> Dashboard
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateLOTO;
