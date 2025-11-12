import React, { useEffect, useState } from "react";
import {
  MDBCard,
  MDBCardBody,
  MDBCardTitle,
  MDBCardText,
  MDBBtn,
  MDBSpinner,
  MDBRow,
  MDBCol,
  MDBDropdown,
  MDBDropdownToggle,
  MDBDropdownMenu,
  MDBDropdownItem,
  MDBIcon,
  MDBBadge
} from "mdb-react-ui-kit";
import { deleteTask, getTasks } from "../../apis/tasks/tasksApi";
import { useNavigate } from "react-router-dom";


export default function TaskList({ onEdit, onCreate, onLogout }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchTasks();
  }, []);

  async function fetchTasks() {
    setLoading(true);
    setError("");
    try {
      const data = await getTasks();
      if (Array.isArray(data)) setTasks(data);
      else if (data?.results) setTasks(data.results);
      else setTasks(Array.isArray(data?.items) ? data.items : []);
    } catch (err) {
      console.error(err);
      setError("Failed to load items");
      setTasks([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this item?")) return;
    setLoading(true);
    try {
      await deleteTask(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete item");
    } finally {
      setLoading(false);
    }
  }

  const handleCreateClick = () => {
    if (onCreate) onCreate();
    navigate("/tasklist-create");
  };

  const handleProjectCreateClick = () => {
    if (onCreate) onCreate();
    navigate("/project-create");
  }

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    if (typeof onLogout === "function") onLogout();
    navigate("/");
  };

  const handleUpdateProfile = () => {
    navigate("/profile");
  };

  const filteredTasks = tasks.filter((t) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (t.title || "").toLowerCase().includes(q) || (t.description || "").toLowerCase().includes(q);
  });

  // show up to 12 tasks (4 rows × 3 cards)
  const visibleTasks = filteredTasks.slice(0, 12);

  if (loading && tasks.length === 0) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: 200 }}>
        <MDBSpinner role="status" />
      </div>
    );
  }

  return (
    <div>
      {/* Header with Create button, Search box and user dropdown */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="d-flex align-items-center gap-2">
          <h3 className="m-0">Tasks</h3>

          <MDBBtn size="sm" color="success" onClick={handleCreateClick}>
            <MDBIcon fas icon="plus" className="me-2" />Create Task
          </MDBBtn>

          <MDBBtn size="sm" color="success" onClick={handleProjectCreateClick}>
            <MDBIcon fas icon="plus" className="me-2" />Create Project
          </MDBBtn>

          <MDBBtn size="sm" color="secondary" onClick={fetchTasks} disabled={loading}>
            <MDBIcon fas icon="sync" className="me-2" />{loading ? "Refreshing..." : "Refresh"}
          </MDBBtn>
        </div>

        <div className="d-flex align-items-center" style={{ gap: 12, maxWidth: 520, width: "100%" }}>
          <div style={{ flex: 1 }}>
            <div className="input-group">
              <input
                type="search"
                className="form-control"
                placeholder="Search by title or description..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <button
                className="btn btn-outline-secondary"
                type="button"
                onClick={() => setQuery("")}
                title="Clear"
              >
                Clear
              </button>
            </div>
          </div>

          {/* User dropdown - replaced MDBAvatar with a simple rounded icon */}
          <MDBDropdown>
            <MDBDropdownToggle color="light" className="d-flex align-items-center" caret>
              <div
                className="rounded-circle bg-light d-flex justify-content-center align-items-center me-2"
                style={{ width: 36, height: 36, border: "1px solid rgba(0,0,0,0.06)" }}
                aria-hidden="true"
              >
                <MDBIcon fas icon="user" />
              </div>
              <span className="me-2">Account</span>
              <MDBBadge color="primary">Pro</MDBBadge>
            </MDBDropdownToggle>
            <MDBDropdownMenu end>
              <MDBDropdownItem link onClick={handleUpdateProfile}>
                <MDBIcon far icon="user-circle" className="me-2" /> Update Profile
              </MDBDropdownItem>
              <MDBDropdownItem link onClick={handleLogout}>
                <MDBIcon fas icon="sign-out-alt" className="me-2" /> Logout
              </MDBDropdownItem>
            </MDBDropdownMenu>
          </MDBDropdown>
        </div>
      </div>

      {error && <p className="text-danger">{error}</p>}

      {/* Card hover styles */}
      <style>
        {`.task-card{ transition: box-shadow .18s ease, transform .18s ease; }
           .task-card:hover{ box-shadow: 0 12px 30px rgba(0,0,0,0.12); transform: translateY(-6px); }`}
      </style>

      {visibleTasks.length === 0 ? (
        <p>No items found.</p>
      ) : (
        <>
          <MDBRow className="g-4">
            {visibleTasks.map((task) => (
              <MDBCol size="12" md="4" key={task.id}>
                <MDBCard className="h-100 task-card">
                  <MDBCardBody>
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <MDBCardTitle className="mb-0">{task.title}</MDBCardTitle>
                      <small className="text-muted text-capitalize">{task.priority}</small>
                    </div>
                    <MDBCardText style={{ maxHeight: 60, overflow: "hidden", textOverflow: "ellipsis" }}>
                      {task.description}
                    </MDBCardText>

                    <div className="d-flex justify-content-between align-items-center mt-3">
                      <small className="text-muted text-capitalize">
                        {task.status} • {task.due_date ?? "-"} <b>{task.project?.name}</b>
                      </small>
                      <div>
                        <MDBBtn size="sm" color="primary" onClick={() => onEdit?.(task)} style={{ marginRight: 8 }}>
                          Edit
                        </MDBBtn>
                        <MDBBtn size="sm" color="danger" onClick={() => handleDelete(task.id)}>
                          Delete
                        </MDBBtn>
                      </div>
                    </div>
                  </MDBCardBody>
                </MDBCard>
              </MDBCol>
            ))}
          </MDBRow>

          {filteredTasks.length > visibleTasks.length && (
            <p className="mt-3 text-muted">Showing {visibleTasks.length} of {filteredTasks.length} tasks</p>
          )}
        </>
      )}
    </div>
  );
}