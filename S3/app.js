const apiBaseUrl = 'https://np2o86h0ee.execute-api.us-east-1.amazonaws.com/test/items'; 

const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');
const status = document.getElementById('status');

async function fetchTodos() {
  todoList.innerHTML = '';
  status.textContent = 'Loading...';
  try {
    const res = await fetch(apiBaseUrl);
    const todos = await res.json();
    todos.forEach(todo => addTodoToDOM(todo));
    status.textContent = '';
  } catch (err) {
    status.textContent = 'Failed to load tasks.';
    console.error(err);
  }
}


todoForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = todoInput.value.trim();
  if (!name) return;

  try {
    await fetch(apiBaseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name })
    });
    todoInput.value = '';
    fetchTodos();
  } catch (err) {
    alert('Error adding task.');
    console.error(err);
  }
});


async function deleteTodo(id) {
  try {
    await fetch(`${apiBaseUrl}/${id}`, { method: 'DELETE' });
    fetchTodos();
  } catch (err) {
    alert('Error deleting task.');
    console.error(err);
  }
}


async function updateTodo(id, newName) {
  newName = newName.trim();
  if (!newName) return;

  try {
    const res = await fetch(`${apiBaseUrl}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newName })
    });

    if (!res.ok) throw new Error('Failed to update');
    console.log(`Todo ${id} updated`);
  } catch (err) {
    alert('Error updating task.');
    console.error(err);
  }
}


function addTodoToDOM(todo) {
  const li = document.createElement('li');
  li.className = 'flex justify-between items-center bg-indigo-100 p-3 rounded-lg mb-2';

  li.innerHTML = `
    <span contenteditable="true" onblur="updateTodo('${todo.id}', this.innerText)" class="editable">${todo.name}</span>
    <button onclick="deleteTodo('${todo.id}')" class="text-red-600 hover:underline ml-4">Delete</button>
  `;

  todoList.appendChild(li);
}

// Initial fetch
fetchTodos();
