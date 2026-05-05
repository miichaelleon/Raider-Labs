const BASE_URL = "http://localhost:8000";

export async function loginUser(email, password) {
  const response = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();
  console.log("response status:", response.status);
  console.log("response data:", data);

  if (!response.ok) {
    throw new Error(data.detail || "Login failed");
  }

  return data;
}

export async function registerUser(data) {
  const response = await fetch(`${BASE_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail);
  }

  return response.json();
}

export async function saveProgress(token, lessonId, score) {
  const response = await fetch(`${BASE_URL}/progress`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({ lesson_id: lessonId, score, completed: true }),
  });
  return response.json();
}

export async function getProgress(token) {
  const response = await fetch(`${BASE_URL}/progress`, {
    headers: { "Authorization": `Bearer ${token}` }
  });
  return response.json();
}

export async function sendAIMessage(token, message, lessonId, lessonTitle, lessonContext, history) {
  const response = await fetch(`${BASE_URL}/ai/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({
      message,
      lesson_id: lessonId,
      lesson_title: lessonTitle,
      lesson_context: lessonContext,
      history
    }),
  });
  return response.json();
}

export async function getAllUsers(token) {
  const response = await fetch(`${BASE_URL}/admin/users`, {
    headers: { "Authorization": `Bearer ${token}` }
  });
  return response.json();
}

export async function getUserProgress(token, userId) {
  const response = await fetch(`${BASE_URL}/admin/users/${userId}/progress`, {
    headers: { "Authorization": `Bearer ${token}` }
  });
  return response.json();
}

export async function deleteUser(token, userId, adminPassword) {
  const response = await fetch(`${BASE_URL}/admin/users/${userId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({ admin_password: adminPassword })
  });

  const text = await response.text();
  let data = {};
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = {};
  }

  if (!response.ok) {
    throw new Error(data.detail || `Error ${response.status}: Failed to delete user`);
  }

  return data;
}

export async function getLessons(token) {
  const response = await fetch(`${BASE_URL}/lessons`, {
    headers: { "Authorization": `Bearer ${token}` }
  });
  if (!response.ok) throw new Error("Failed to fetch lessons");
  return response.json();
}

export async function getLesson(token, lessonId) {
  const response = await fetch(`${BASE_URL}/lessons/${lessonId}`, {
    headers: { "Authorization": `Bearer ${token}` }
  });
  if (!response.ok) throw new Error(`Lesson '${lessonId}' not found`);
  return response.json();
}
export async function uploadLesson(token, file) {
  const formData = new FormData();
  formData.append("file", file);
  const response = await fetch(`${BASE_URL}/admin/lessons`, {
    method: "POST",
    headers: { "Authorization": `Bearer ${token}` },
    body: formData,
  });
  const text = await response.text();
  let data = {};
  try { data = text ? JSON.parse(text) : {}; } catch { data = {}; }
  if (!response.ok) throw new Error(data.detail || `Upload failed (${response.status})`);
  return data;
}