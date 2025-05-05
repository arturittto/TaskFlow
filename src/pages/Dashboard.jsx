import { ListFilter } from "lucide-react"; // добавь вместе с другими иконками
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  query,
  onSnapshot,
  orderBy,
  deleteDoc,
  doc,
  updateDoc
} from "firebase/firestore";
import { Moon, Sun } from "lucide-react"; // npm install lucide-react

export default function Dashboard() {
  const navigate = useNavigate();
  const [sharedWithInput, setSharedWithInput] = useState(""); // для ввода email-ов
  const [user, setUser] = useState(null);
  const [taskInput, setTaskInput] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  // apply theme class to root element
  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (!currentUser) {
        navigate("/login");
      } else {
        setUser(currentUser);
      }
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!user) return;
  
    const q = query(collection(db, "tasks"), orderBy("createdAt"));
  
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const taskList = snapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        .filter((task) => {
          return (
            task.owner === user.email || // текущий пользователь — владелец
            (Array.isArray(task.sharedWith) &&
              task.sharedWith.includes(user.email?.toLowerCase())) // или доступ по sharedWith
          );
        });
  
      setTasks(taskList);
    });
  
    return unsubscribe;
  }, [user]);  

  useEffect(() => {
    const overdueTasks = tasks.filter((task) => {
      return task.dueDate && !task.completed && new Date(task.dueDate) < new Date();
    });
  
    if (overdueTasks.length > 0) {
      alert(`You have ${overdueTasks.length} overdue task(s)!`);
    }
  }, [tasks]);

  useEffect(() => {
    if (!user) return;
  
    const q = query(collection(db, "tasks"), orderBy("createdAt"));
  
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const taskList = snapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data()
        }))
        .filter((task) => {
          const isOwner = task.uid === user.uid;
          const isShared =
            Array.isArray(task.sharedWith) &&
            task.sharedWith.includes(user.email?.toLowerCase());
          return isOwner || isShared;
        });
  
      setTasks(taskList);
    });
  
    return unsubscribe;
  }, [user]);
  

  const addTask = async () => {
    if (taskInput.trim() === "") return;
  
    await addDoc(collection(db, "tasks"), {
        uid: user.uid,
        owner: user.email,
        text: taskInput,
        completed: false,
        createdAt: new Date(),
        dueDate: dueDate || null,
        sharedWith: sharedWithInput
          .split(",")
          .map((email) => email.trim().toLowerCase())
          .filter((email) => email)
      });      
  
    setTaskInput("");
    setDueDate("");
    setSharedWithInput("");
  };

  const deleteTask = async (id) => {
    await deleteDoc(doc(db, "tasks", id));
  };

  const toggleComplete = async (task) => {
    await updateDoc(doc(db, "tasks", task.id), {
      completed: !task.completed
    });
  };

  const startEditing = (task) => {
    setEditingTaskId(task.id);
    setEditingText(task.text);
  };

  const saveEditing = async (id) => {
    if (editingText.trim() === "") return;
    await updateDoc(doc(db, "tasks", id), {
      text: editingText
    });
    setEditingTaskId(null);
    setEditingText("");
  };

  const filteredTasks = tasks
  .filter((task) => {
    if (filter === "all") return true;
    if (filter === "active") return !task.completed;
    if (filter === "completed") return task.completed;
  })
  .sort((a, b) => {
    if (sortBy === "newest") {
      return new Date(b.createdAt?.seconds * 1000) - new Date(a.createdAt?.seconds * 1000);
    } else if (sortBy === "oldest") {
      return new Date(a.createdAt?.seconds * 1000) - new Date(b.createdAt?.seconds * 1000);
    } else if (sortBy === "due") {
      return (a.dueDate || "").localeCompare(b.dueDate || "");
    }
  });

  const handleLogout = () => {
    auth.signOut();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-white text-black dark:bg-gray-900 dark:text-white transition">
      <div className="flex justify-between items-center px-6 pt-6">
        <h1 className="text-2xl font-bold">
          Welcome, {user?.email || "User"}!
        </h1>
        <button onClick={() => setDarkMode(!darkMode)} title="Toggle Theme">
          {darkMode ? (
            <Sun className="w-6 h-6 text-yellow-400" />
          ) : (
            <Moon className="w-6 h-6 text-gray-700" />
          )}
        </button>
      </div>

      <div className="flex flex-col items-center p-6">
        {/* Task form */}
        <div className="flex flex-col sm:flex-row gap-2 mb-4">
          <input
            className="border p-2 rounded dark:bg-gray-800"
            placeholder="New task"
            value={taskInput}
            onChange={(e) => setTaskInput(e.target.value)}
          />
          <input
            type="date"
            className="border p-2 rounded dark:bg-gray-800"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
          <input
            className="border p-2 rounded dark:bg-gray-800"
            placeholder="Share with (comma-separated emails)"
            value={sharedWithInput}
            onChange={(e) => setSharedWithInput(e.target.value)}
        />

          <button
            onClick={addTask}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Add
          </button>
        </div>

        {/* Filter buttons */}
        <div className="flex gap-3 mb-4">
          {["all", "active", "completed"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded ${
                filter === f ? "bg-blue-600 text-white" : "bg-gray-200 dark:bg-gray-700"
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

{/* Sort dropdown */}
<div className="mb-4 flex items-center gap-2">
  <ListFilter className="w-5 h-5 text-gray-600 dark:text-gray-300" />
  <label className="font-medium">Sort:</label>
  <select
    value={sortBy}
    onChange={(e) => setSortBy(e.target.value)}
    className="border rounded px-2 py-1 dark:bg-gray-800"
  >
    <option value="newest">Newest First</option>
    <option value="oldest">Oldest First</option>
    <option value="due">By Due Date</option>
  </select>
</div>

        {/* Task list */}
        <ul className="w-full max-w-md text-left">
          {filteredTasks.map((task) => (
            <li
              key={task.id}
              className="flex justify-between items-start bg-gray-100 dark:bg-gray-800 p-3 mb-2 rounded"
            >
              <div className="flex-1">
                {editingTaskId === task.id ? (
                  <input
                    className="border p-1 w-full dark:bg-gray-700"
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                    onBlur={() => saveEditing(task.id)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") saveEditing(task.id);
                    }}
                    autoFocus
                  />
                ) : (
                  <div
                    className={`cursor-pointer ${
                      task.completed ? "line-through text-gray-500" : ""
                    }`}
                    onClick={() => toggleComplete(task)}
                  >
                    <div className="flex flex-col">
  <div className="flex items-center gap-2">
    <span>{task.text}</span>
    {task.uid !== user.uid && (
      <span className="text-xs bg-blue-200 text-blue-800 px-2 py-0.5 rounded-full">
        Shared
      </span>
    )}
  </div>
  {task.uid !== user.uid && (
    <div className="text-xs text-gray-500 dark:text-gray-400">
      by {task.owner}
    </div>
  )}
</div>

                    {task.dueDate && (
  <div
    className={`text-sm ${
      new Date(task.dueDate) < new Date() && !task.completed
        ? "text-red-500 font-semibold"
        : "text-gray-500 dark:text-gray-400"
    }`}
  >
    Due: {task.dueDate}
    {new Date(task.dueDate) < new Date() && !task.completed && " (Overdue)"}
  </div>
)}

                  </div>
                )}
              </div>
              <div className="flex flex-col items-end ml-3">
                <button
                  onClick={() => startEditing(task)}
                  className="text-blue-500 text-sm mb-1"
                >
                  ✏ Edit
                </button>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="text-red-500 text-sm"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>

        <button
          onClick={handleLogout}
          className="mt-8 text-sm text-red-500 underline"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
