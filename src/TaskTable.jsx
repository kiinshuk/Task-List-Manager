import React, { useEffect, useState } from "react";
import { ReactTabulator } from "react-tabulator";
import "react-tabulator/lib/styles.css"; // Tabulator core CSS
import "react-tabulator/css/tabulator.min.css"; // Tabulator theme CSS

const AddTaskForm = ({ addTask }) => {
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    status: "To Do",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    addTask(newTask);
    setNewTask({ title: "", description: "", status: "To Do" });
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
      <input
        type="text"
        placeholder="Title"
        value={newTask.title}
        onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
        required
        style={{ marginRight: "10px" }}
      />
      <input
        type="text"
        placeholder="Description"
        value={newTask.description}
        onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
        required
        style={{ marginRight: "10px" }}
      />
      <select
        value={newTask.status}
        onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
        style={{ marginRight: "10px" }}
      >
        <option value="To Do">To Do</option>
        <option value="In Progress">In Progress</option>
        <option value="Done">Done</option>
      </select>
      <button type="submit">Add Task</button>
    </form>
  );
};

const TaskTable = () => {
  const [tasks, setTasks] = useState([]);
  const [filterStatus, setFilterStatus] = useState("All");

  useEffect(() => {
    const fetchTasks = async () => {
      const response = await fetch("https://jsonplaceholder.typicode.com/todos");
      const data = await response.json();
      const processedData = data.slice(0, 20).map((task) => ({
        id: task.id,
        title: task.title,
        description: task.title,
        status: task.completed ? "Done" : "To Do",
      }));
      setTasks(processedData);
    };

    fetchTasks();
  }, []);

  const addTask = (newTask) => {
    const taskWithId = { id: tasks.length + 1, ...newTask };
    setTasks((prev) => [...prev, taskWithId]);
  };

  const deleteTask = (taskId) => {
    setTasks((prev) => prev.filter((task) => task.id !== taskId));
  };

  const filteredTasks =
    filterStatus === "All"
      ? tasks
      : tasks.filter((task) => task.status === filterStatus);

  const columns = [
    { title: "Task ID", field: "id", width: 100 },
    { title: "Title", field: "title", editor: "input" },
    { title: "Description", field: "description", editor: "input" },
    {
      title: "Status",
      field: "status",
      editor: "select",
      editorParams: { values: ["To Do", "In Progress", "Done"] },
    },
    {
      title: "Delete",
      formatter: () => '<button>Delete</button>',
      cellClick: (e, cell) => {
        deleteTask(cell.getRow().getData().id);
      },
    },
  ];

  return (
    <div>
      <h1>Task List Manager</h1>

      {/* Add Task Form */}
      <AddTaskForm addTask={addTask} />

      {/* Task Filtering */}
      <div style={{ marginBottom: "20px" }}>
        <label>Filter by Status: </label>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="All">All</option>
          <option value="To Do">To Do</option>
          <option value="In Progress">In Progress</option>
          <option value="Done">Done</option>
        </select>
      </div>

      {/* Task Table */}
      <ReactTabulator
        data={filteredTasks}
        columns={columns}
        layout="fitColumns"
        options={{ movableColumns: true }}
      />
    </div>
  );
};

export default TaskTable;
