import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import TaskCard from '../components/TaskCard';
import { getTasks, createTask, deleteTask } from '../services/taskService';

const columns = [
  { key: 'todo', label: 'To Do' },
  { key: 'in-progress', label: 'In Progress' },
  { key: 'done', label: 'Done' },
];

const ProjectDetail = () => {
  const { id } = useParams(); // project ID from the URL
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const fetchTasks = async () => {
    try {
      const data = await getTasks(id);
      setTasks(data);
    } catch (err) {
      console.error('Failed to load tasks', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [id]); // re-fetch if the project ID changes

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const newTask = await createTask({ title: newTaskTitle, project: id });
    setTasks((prev) => [...prev, newTask]); // direct state update (Day 9 optimization we discussed)
    setNewTaskTitle('');
    setShowForm(false);
  };

  const handleDeleteTask = async (taskId) => {
    await deleteTask(taskId);
    setTasks((prev) => prev.filter((t) => t._id !== taskId)); // remove it from local state
  };

  if (loading) return <p style={{ textAlign: 'center', marginTop: '40px' }}>Loading tasks...</p>;

  return (
    <div>
      <Navbar />
      <div style={{ maxWidth: '1000px', margin: '30px auto', padding: '0 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>Task Board</h2>
          <button onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : '+ New Task'}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleCreateTask} style={{ margin: '16px 0' }}>
            <input
              type="text"
              placeholder="Task title"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              style={{ padding: '8px', width: '60%' }}
            />
            <button type="submit" style={{ marginLeft: '8px', padding: '8px 16px' }}>
              Add
            </button>
          </form>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginTop: '20px' }}>
          {columns.map((col) => (
            <div key={col.key} style={{ background: '#f5f5f5', borderRadius: '8px', padding: '12px' }}>
              <h3 style={{ marginTop: 0 }}>
                {col.label} ({tasks.filter((t) => t.status === col.key).length})
              </h3>

              {tasks
                .filter((t) => t.status === col.key) // this is the "grouping" logic we discussed
                .map((task) => (
                  <TaskCard key={task._id} task={task} onDelete={handleDeleteTask} />
                ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;