import React, { useEffect, useState } from "react";
import {
  MDBInput,
  MDBBtn
} from 'mdb-react-ui-kit';
import { createTask, getProjects } from "../../apis/tasks/tasksApi";
import { useNavigate } from "react-router-dom";


export default function TaskForm({ initialData = {}, onSubmit, onCancel, projects = []}) {
  const [title, setTitle] = useState(initialData.title ?? "");
  const [description, setDescription] = useState(initialData.description ?? "");
  const [status, setStatus] = useState(initialData.status ?? "pending");
  const [priority, setPriority] = useState(initialData.priority ?? "medium");
  const [dueDate, setDueDate] = useState(initialData.due_date ?? "");
  const [projectId, setProjectId] = useState(
    initialData.project_id ?? (initialData.project?.id ?? "")
  );
  const [loading, setLoading] = useState(false);
  const [projectsLoading, setProjectsLoading] = useState(false);
  const [projectList, setProjectList] = useState(Array.isArray(projects) ? projects : []);
  const navigate = useNavigate();

  // Load projects if none were passed via props
  useEffect(() => {
    let mounted = true;
    async function load() {
      if (projectList && projectList.length > 0) return;
      setProjectsLoading(true);
      try {
        const res = await getProjects();
        // normalize response shapes: array or { results: [...] }
        const list = Array.isArray(res) ? res : (res?.results ?? res?.items ?? []);
        if (mounted) setProjectList(list);
      } catch (err) {
        console.error("Failed to load projects", err);
        if (mounted) setProjectList([]);
      } finally {
        if (mounted) setProjectsLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, []); // run once on mount

  async function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim()) return alert("Title required");

    const payload = {
      ...(initialData.id ? { id: initialData.id } : {}),
      title: title.trim(),
      description: description.trim(),
      status,
      priority,
      due_date: dueDate,
      ...(projectId ? { project_id: projectId } : {})
    };
console.log(payload)
    try {
      setLoading(true);
      const created = await createTask(payload); // calls tasksApi.createTask
      if (onSubmit) onSubmit(created);
      // reset only when creating new item (no id)
      if (!initialData.id) {
        setTitle("");
        setDescription("");
        setStatus("pending");
        setPriority("medium");
        setDueDate("");
        setProjectId("");
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
            <label htmlFor='project' className='form-label'>Project</label>
            <select
              id='project'
              className='form-select'
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
            >
              <option value=''>
                {projectsLoading ? "Loading projects..." : (projectList.length ? "Select a project..." : "No projects available")}
              </option>
              {projectList.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name ?? p.title ?? `Project ${p.id}`}
                </option>
              ))}
            </select>
          </div>

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