import React, { useState } from "react";
import { MDBInput, MDBBtn, MDBCard, MDBCardBody } from "mdb-react-ui-kit";
import { useNavigate } from "react-router-dom";
import { handleRegister } from "../../apis/auth/auth";

export default function Signup({ onSignup }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [dateJoined, setDateJoined] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const validate = () => {
    if (!firstName.trim() || !lastName.trim()) {
      setError("First and last name are required.");
      return false;
    }
    if (!email.trim()) {
      setError("Email is required.");
      return false;
    }
    if (!password) {
      setError("Password is required.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!validate()) return;

    const payload = {
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      email: email.trim(),
      password,
      date_joined: dateJoined || undefined
    };

    setLoading(true);
    try {
      const result = await handleRegister(payload);
      if (result?.error) {
        setError(typeof result.error === "string" ? result.error : JSON.stringify(result.error));
      } else {
        if (typeof onSignup === "function") onSignup(result);
        navigate("/");
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to sign up");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
      <MDBCard style={{ maxWidth: 540 }} className="w-100">
        <MDBCardBody>
          <h3 className="mb-4">Sign Up</h3>

          {error && <div className="alert alert-danger">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <MDBInput
                  id="first_name"
                  label="First name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div className="col-md-6 mb-3">
                <MDBInput
                  id="last_name"
                  label="Last name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </div>

            <MDBInput
              className="mb-3"
              id="email"
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <MDBInput
              className="mb-3"
              id="password"
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <div className="mb-3">
              <label htmlFor="date_joined" className="form-label">Date joined</label>
              <input
                id="date_joined"
                className="form-control"
                type="date"
                value={dateJoined}
                onChange={(e) => setDateJoined(e.target.value)}
              />
            </div>

            <div className="d-flex gap-2">
              <MDBBtn type="submit" disabled={loading}>
                {loading ? "Signing up..." : "Sign Up"}
              </MDBBtn>

              <MDBBtn type="button" color="link" onClick={() => navigate("/")}>
                Already have an account?
              </MDBBtn>
            </div>
          </form>
        </MDBCardBody>
      </MDBCard>
    </div>
  );
}
