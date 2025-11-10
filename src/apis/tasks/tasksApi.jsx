const API_URL = "http://127.0.0.1:8000/api/tasks"; // adjust if needed
const access_token = localStorage.getItem('access_token');
const getAuthHeaders = () => {
  const token = localStorage.getItem('access_token'); // read fresh token each call
  return {
    "Content-Type": "application/json",
    ...(token ? { "Authorization": `Bearer ${token}` } : {}),
  };
};

export async function getTasks() {
  const res = await fetch(API_URL,{
    headers: getAuthHeaders(),
  });
  console.log(res)
  if (!res.ok) throw new Error("Failed to fetch books");
  return res.json();
}

export async function createTask(book) {
  console.log("Creating task with data:", access_token);
  const res = await fetch(API_URL + "/create/", {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(book),
  });
  if (!res.ok) throw new Error("Failed to create book");
  return res.json();
}

export async function updateTask(id, book) {
  const res = await fetch(`${API_URL}/${id}/`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(book),
  });
  if (!res.ok) throw new Error("Failed to update book");
  return res.json();
}

export async function deleteTask(id) {
  const res = await fetch(`${API_URL}/${id}/`, { 
    method: "DELETE",
    headers: getAuthHeaders(), 
  });
  if (!res.ok) throw new Error("Failed to delete task");
}
