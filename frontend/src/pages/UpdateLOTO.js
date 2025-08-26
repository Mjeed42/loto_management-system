import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import Icon from "../components/Icon";

const UpdateLOTO = () => {
  const [formData, setFormData] = useState({
    expectedDuration: "",
    reason: "",
    ptwNumber: "N/A",
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchLOTO();
  }, [id]);

  const fetchLOTO = async () => {
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const res = await axios.get(
        `http://localhost:5000/api/loto/${id}`,
        config
      );

      setFormData({
        expectedDuration: res.data.data.expectedDuration,
        reason: res.data.data.reason,
        ptwNumber: res.data.data.ptwNumber,
      });

      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || "Error fetching LOTO");
      setLoading(false);
    }
  };

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      await axios.put(`http://localhost:5000/api/loto/${id}`, formData, config);

      alert("LOTO updated successfully!");
      navigate("/loto-list");
    } catch (err) {
      setError(err.response?.data?.message || "Error updating LOTO");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Loading LOTO details...</p>
      </div>
    );
  }

  const { expectedDuration, reason, ptwNumber } = formData;

  return (
    <div className="row justify-content-center">
      <div className="col-md-8">
        <div className="card">
          <div className="card-header d-flex justify-content-between align-items-center">
            <h2 className="mb-0">
              <Icon name="edit" /> Update LOTO
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

              <div className="form-group mb-3">
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

              <div className="form-group mb-4">
                <label className="form-label">Expected Duration (hours)</label>
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

              <div className="d-flex gap-2">
                <Button type="submit" variant="primary" disabled={submitting}>
                  {submitting ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Updating...
                    </>
                  ) : (
                    <>
                      <Icon name="save" /> Update LOTO
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

export default UpdateLOTO;
