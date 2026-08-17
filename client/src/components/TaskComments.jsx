import { useState, useEffect } from 'react';
import { getComments, addComment, deleteComment } from '../services/commentService';
import { useAuth } from '../context/AuthContext';

const TaskComments = ({ taskId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchComments = async () => {
    try {
      const data = await getComments(taskId);
      setComments(data);
    } catch (err) {
      console.error('Failed to load comments', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [taskId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const comment = await addComment(taskId, newComment);
    setComments((prev) => [...prev, comment]);
    setNewComment('');
  };

  const handleDelete = async (commentId) => {
    await deleteComment(commentId);
    setComments((prev) => prev.filter((c) => c._id !== commentId));
  };

  if (loading) return <p>Loading comments...</p>;

  return (
    <div style={{ marginTop: '16px', borderTop: '1px solid #eee', paddingTop: '12px' }}>
      <h4>Comments ({comments.length})</h4>

      <div style={{ maxHeight: '200px', overflowY: 'auto', marginBottom: '10px' }}>
        {comments.map((comment) => (
          <div key={comment._id} style={{ marginBottom: '8px', fontSize: '14px' }}>
            <strong>{comment.author?.name || 'Unknown'}</strong>: {comment.text}
            {comment.author?._id === user?.id && (
              <button
                onClick={() => handleDelete(comment._id)}
                style={{ marginLeft: '8px', border: 'none', background: 'none', color: '#999', cursor: 'pointer' }}
              >
                delete
              </button>
            )}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '8px' }}>
        <input
          type="text"
          placeholder="Add a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          style={{ flex: 1, padding: '6px' }}
        />
        <button type="submit">Post</button>
      </form>
    </div>
  );
};

export default TaskComments;