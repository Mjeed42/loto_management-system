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
    isolatedPart: "", // NEW FIELD
    supervisor: "", // NEW FIELD - Supervisor assignment
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [loto, setLoto] = useState(null);
  const [supervisors, setSupervisors] = useState([]); // NEW STATE FOR SUPERVISORS
  const [fetchingSupervisors, setFetchingSupervisors] = useState(true); // NEW LOADING STATE
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchLOTO();
    fetchSupervisors(); // NEW: Fetch supervisors
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
        `https://loto-backend-643788243736.europe-west1.run.app/api/loto/${id}`,
        config
      );

      setLoto(res.data.data);

      // Prefill form with current LOTO data
      setFormData({
        expectedDuration: res.data.data.expectedDuration,
        reason: res.data.data.reason,
        ptwNumber: res.data.data.ptwNumber,
        isolatedPart: res.data.data.isolatedPart,
        supervisor: res.data.data.supervisor?._id || "", // NEW: Prefill supervisor
      });

      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || "Error fetching LOTO");
      setLoading(false);
    }
  };

  // NEW: Fetch all supervisors and supervisors
  const fetchSupervisors = async () => {
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const res = await axios.get(
        "https://loto-backend-643788243736.europe-west1.run.app/api/users/supervisors",
        config
      );

      // Handle different possible response formats
      let supervisorsData = [];
      if (res.data.supervisors) {
        supervisorsData = res.data.supervisors;
      } else if (res.data.data && res.data.data.supervisors) {
        supervisorsData = res.data.data.supervisors;
      } else if (Array.isArray(res.data.data)) {
        supervisorsData = res.data.data;
      }

      // Ensure it's always an array
      supervisorsData = Array.isArray(supervisorsData) ? supervisorsData : [];

      setSupervisors(supervisorsData);
      setFetchingSupervisors(false);
    } catch (err) {
      console.log("Error fetching supervisors:", err);
      setError(err.response?.data?.message || "Error fetching supervisors");
      setSupervisors([]);
      setFetchingSupervisors(false);
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

      const res = await axios.put(
        `https://loto-backend-643788243736.europe-west1.run.app/api/loto/${id}`,
        formData,
        config
      );

      alert("LOTO updated successfully!");
      navigate(`/loto/${id}`);
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

  if (error) {
    return (
      <div className="alert alert-danger">
        <Icon name="warning" className="me-2" /> {error}
      </div>
    );
  }

  if (!loto) {
    return (
      <div className="text-center py-5">
        <h2>LOTO not found</h2>
      </div>
    );
  }

  const { expectedDuration, reason, ptwNumber, isolatedPart, supervisor } =
    formData;

  return (
    <div className="cf-dashboard">
      <main className="cf-main">
        <div className="cf-card">
          <div className="cf-card-header cf-flex cf-justify-between cf-items-center">
            <h1 className="cf-card-title cf-flex cf-items-center">
              <Icon name="edit" className="cf-mr-2" /> Update LOTO
            </h1>
            <div className="cf-flex cf-gap-2">
              <Button
                variant="outline-secondary"
                onClick={() => navigate(`/loto/${id}`)}
              >
                <Icon name="back" className="cf-mr-2" /> Back to Detail
              </Button>
              <Button
                variant="outline-primary"
                onClick={() => navigate("/dashboard")}
              >
                <Icon name="dashboard" className="cf-mr-2" /> Dashboard
              </Button>
            </div>
          </div>

          <div className="cf-card-body">
            {error && (
              <div className="cf-alert cf-alert-danger cf-mb-4">
                <Icon name="warning" className="cf-mr-2" /> {error}
              </div>
            )}

            <form onSubmit={onSubmit}>
              <div className="cf-grid cf-grid-cols-1 md:cf-grid-cols-2 cf-gap-6">
                <div>
                  <div className="cf-form-group cf-mb-3">
                    <label className="cf-form-label">
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
                      className="cf-form-control"
                      required
                    />
                  </div>
                </div>

                <div>
                  <div className="cf-form-group cf-mb-3">
                    <label className="cf-form-label">PTW Number</label>
                    <input
                      type="text"
                      name="ptwNumber"
                      value={ptwNumber}
                      onChange={onChange}
                      placeholder="Enter PTW number or N/A"
                      className="cf-form-control"
                    />
                  </div>
                </div>
              </div>

              <div className="cf-form-group cf-mb-3">
                <label className="cf-form-label">Isolated Part</label>
                <input
                  type="text"
                  name="isolatedPart"
                  value={isolatedPart}
                  onChange={onChange}
                  placeholder="Enter part description"
                  className="cf-form-control"
                  required
                />
              </div>

              <div className="cf-form-group cf-mb-3">
                <label className="cf-form-label">Reason</label>
                <input
                  type="text"
                  name="reason"
                  value={reason}
                  onChange={onChange}
                  placeholder="Enter reason"
                  className="cf-form-control"
                  required
                />
              </div>

              {/* NEW: Supervisor Assignment Section */}
              <div className="cf-form-group cf-mb-4">
                <label className="cf-form-label">
                  Assign Supervisor for Verification (Optional)
                </label>
                {fetchingSupervisors ? (
                  <div className="cf-flex cf-items-center">
                    <span
                      className="cf-spinner cf-spinner-sm cf-mr-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    <span>Loading supervisors...</span>
                  </div>
                ) : (
                  <select
                    name="supervisor"
                    value={supervisor}
                    onChange={onChange}
                    className="cf-form-control"
                  >
                    <option value="">
                      None - Any supervisor/admin can verify
                    </option>
                    {supervisors.map((sup) => (
                      <option key={sup._id} value={sup._id}>
                        {sup.firstName} {sup.lastName} ({sup.username}) -{" "}
                        {sup.role === "admin" ? "Admin" : "Supervisor"}
                      </option>
                    ))}
                  </select>
                )}
                <div className="cf-form-help">
                  Select a specific supervisor or admin who will verify this
                  LOTO request. If none selected, any supervisor or admin can
                  verify.
                </div>
              </div>

              <div className="cf-flex cf-gap-2">
                <Button type="submit" variant="primary" disabled={submitting}>
                  {submitting ? (
                    <>
                      <span
                        className="cf-spinner cf-spinner-sm cf-mr-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Updating...
                    </>
                  ) : (
                    <>
                      <Icon name="save" className="cf-mr-2" /> Update LOTO
                    </>
                  )}
                </Button>

                <Button
                  variant="secondary"
                  onClick={() => navigate(`/loto/${id}`)}
                >
                  <Icon name="cancel" className="cf-mr-2" /> Cancel
                </Button>

                <Button
                  variant="outline-primary"
                  onClick={() => navigate("/dashboard")}
                >
                  <Icon name="dashboard" className="cf-mr-2" /> Dashboard
                </Button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UpdateLOTO;
