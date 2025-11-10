import React, { useState } from "react";
import {
  MDBInput,
  MDBBtn
} from 'mdb-react-ui-kit';
import { createTask } from "../../apis/tasks/tasksApi";
import { useNavigate } from "react-router-dom";


export default function TaskForm({ initialData = {}, onSubmit, onCancel }) {
  const [title, setTitle] = useState(initialData.title ?? "");
  const [description, setDescription] = useState(initialData.description ?? "");
  const [status, setStatus] = useState(initialData.status ?? "pending");
  const [priority, setPriority] = useState(initialData.priority ?? "medium");
  const [dueDate, setDueDate] = useState(initialData.due_date ?? "");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim()) return alert("Title required");

    const payload = {
      ...(initialData.id ? { id: initialData.id } : {}),
      title: title.trim(),
      description: description.trim(),
      status,
      priority,
      due_date: dueDate
    };

    try {
      setLoading(true);
      const created = await createTask(payload); // calls booksApi.createBook
      if (onSubmit) onSubmit(created);
      // reset only when creating new item (no id)
      if (!initialData.id) {
        setTitle("");
        setDescription("");
        setStatus("pending");
        setPriority("medium");
        setDueDate("");
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
        <h3 className="mb-4">Create Task</h3>
        <form onSubmit={handleSubmit} className="w-100">
          <MDBInput className='mb-4' type='text' id='title' label='Title' value={title} onChange={(e)=>setTitle(e.target.value)} />
          <MDBInput className='mb-4' type='text' id='description' label='Description' value={description} onChange={(e)=>setDescription(e.target.value)} />

          <div className='mb-4'>
            <label htmlFor='status' className='form-label'>Status</label>
            <select id='status' className='form-select' value={status} onChange={(e)=>setStatus(e.target.value)}>
              <option value='pending'>Pending</option>
              <option value='in_progress'>In Progress</option>
              <option value='completed'>Completed</option>
            </select>
          </div>

          <div className='mb-4'>
            <label htmlFor='priority' className='form-label'>Priority</label>
            <select id='priority' className='form-select' value={priority} onChange={(e)=>setPriority(e.target.value)}>
              <option value='low'>Low</option>
              <option value='medium'>Medium</option>
              <option value='high'>High</option>
            </select>
          </div>

          <MDBInput className='mb-4' type='date' id='due_date' label='Due Date' value={dueDate} onChange={(e)=>setDueDate(e.target.value)} />

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