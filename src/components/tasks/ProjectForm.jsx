import React, { useState } from "react";
import {
  MDBInput,
  MDBBtn
} from 'mdb-react-ui-kit';
import { createProject } from "../../apis/tasks/tasksApi";
import { useNavigate } from "react-router-dom";


export default function TaskForm({ initialData = {}, onSubmit, onCancel }) {
  const [name, setName] = useState(initialData.name ?? "");
  const [description, setDescription] = useState(initialData.description ?? "");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim()) return alert("Name required");

    const payload = {
      ...(initialData.id ? { id: initialData.id } : {}),
      name: name.trim(),
      description: description.trim(),
    };

    try {
      setLoading(true);
      const created = await createProject(payload); 
      if (onSubmit) onSubmit(created);
      // reset only when creating new item (no id)
      if (!initialData.id) {
        setName("");
        setDescription("");
        navigate("/tasklist");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to submit form");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
      <div className="w-100" style={{ maxWidth: 520 }}>
        <h3 className="mb-4">Create Project</h3>
        <form onSubmit={handleSubmit} className="w-100">
          <MDBInput className='mb-4' type='text' id='name' label='Name' value={name} onChange={(e)=>setName(e.target.value)} />
          <MDBInput className='mb-4' type='text' id='description' label='Description' value={description} onChange={(e)=>setDescription(e.target.value)} />
          <div className="d-flex gap-2">
            <MDBBtn type='submit' disabled={loading}>
              {loading ? "Submitting..." : "Submit"}
            </MDBBtn>
            {onCancel && (
              <MDBBtn type='button' color='secondary' onClick={(e)=>{ e.preventDefault(); onCancel(); }}>
                Cancel
              </MDBBtn>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}