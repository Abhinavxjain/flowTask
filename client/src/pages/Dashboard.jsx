import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getProjects, createProject } from '../services/projectService';

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [creating, setCreating] = useState(false);

  const navigate = useNavigate();

  const fetchProjects = async () => {
    try {
      const data = await getProjects();
      setProjects(data);
    } catch (err) {
      setError('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;

    setCreating(true);
    try {
      await createProject({ name: newProjectName });
      setNewProjectName('');
      setShowForm(false);
      fetchProjects(); // refresh the list after creating
    } catch (err) {
      setError('Failed to create project');
    } finally {
      setCreating(false);
    }
  };

  if (loading) return <p style={{ textAlign: 'center', marginTop: '40px' }}>Loading projects...</p>;

  return (
    <div>
      <Navbar />
      <div style={{ maxWidth: '700px', margin: '40px auto', padding: '0 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>Your Projects</h2>
          <button onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : '+ New Project'}
          </button>
        </div>

        {error && <p style={{ color: 'red' }}>{error}</p>}

        {showForm && (
          <form onSubmit={handleCreateProject} style={{ margin: '16px 0' }}>
            <input
              type="text"
              placeholder="Project name"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              style={{ padding: '8px', width: '70%' }}
            />
            <button type="submit" disabled={creating} style={{ marginLeft: '8px', padding: '8px 16px' }}>
              {creating ? 'Creating...' : 'Create'}
            </button>
          </form>
        )}

        {projects.length === 0 ? (
          <p>No projects yet. Create your first one!</p>
        ) : (
          <div style={{ display: 'grid', gap: '12px', marginTop: '16px' }}>
            {projects.map((project) => (
              <div
                key={project._id}
                onClick={() => navigate(`/projects/${project._id}`)}
                style={{
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  padding: '16px',
                  cursor: 'pointer',
                }}
              >
                <h3 style={{ margin: 0 }}>{project.name}</h3>
                <p style={{ margin: '4px 0 0', color: '#666' }}>{project.description || 'No description'}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;