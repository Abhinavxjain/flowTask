import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import Navbar from '../components/Navbar';
import TaskCard from '../components/TaskCard';
import { getTasks, createTask, deleteTask, updateTask } from '../services/taskService';

const columns = [
  { key: 'todo', label: 'To Do' },
  { key: 'in-progress', label: 'In Progress' },
  { key: 'done', label: 'Done' },
];

const ProjectDetail = () => {
  const { id } = useParams();
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
  }, [id]);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const newTask = await createTask({ title: newTaskTitle, project: id });
    setTasks((prev) => [...prev, newTask]);
    setNewTaskTitle('');
    setShowForm(false);
  };

  const handleDeleteTask = async (taskId) => {
    await deleteTask(taskId);
    setTasks((prev) => prev.filter((t) => t._id !== taskId));
  };

  // Called when a drag gesture ends — whether dropped somewhere valid or not
  const handleDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    // Dropped outside any valid column — do nothing
    if (!destination) return;

    // Dropped back in the same column, same position — no change needed
    if (destination.droppableId === source.droppableId) return;

    const newStatus = destination.droppableId; // the column key it was dropped into

    // Optimistic UI update — change status locally FIRST, before backend confirms
    setTasks((prev) =>
      prev.map((task) =>
        task._id === draggableId ? { ...task, status: newStatus } : task
      )
    );

    // Then sync with backend
    try {
      await updateTask(draggableId, { status: newStatus });
    } catch (err) {
      console.error('Failed to update task status', err);
      fetchTasks(); // rollback — refetch true state from backend if the update failed
    }
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

        <DragDropContext onDragEnd={handleDragEnd}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginTop: '20px' }}>
            {columns.map((col) => (
              <Droppable droppableId={col.key} key={col.key}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    style={{ background: '#f5f5f5', borderRadius: '8px', padding: '12px', minHeight: '200px' }}
                  >
                    <h3 style={{ marginTop: 0 }}>
                      {col.label} ({tasks.filter((t) => t.status === col.key).length})
                    </h3>

                    {tasks
                      .filter((t) => t.status === col.key)
                      .map((task, index) => (
                        <TaskCard key={task._id} task={task} index={index} onDelete={handleDeleteTask} />
                      ))}

                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            ))}
          </div>
        </DragDropContext>
      </div>
    </div>
  );
};

export default ProjectDetail;