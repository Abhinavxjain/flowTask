import { Draggable } from '@hello-pangea/dnd';

const priorityColors = {
  low: '#4caf50',
  medium: '#ff9800',
  high: '#f44336',
};

const TaskCard = ({ task, index, onDelete }) => {
  return (
    <Draggable draggableId={task._id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={{
            border: '1px solid #ddd',
            borderRadius: '6px',
            padding: '12px',
            marginBottom: '10px',
            background: snapshot.isDragging ? '#e3f2fd' : '#fff',
            ...provided.draggableProps.style,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
            <h4 style={{ margin: 0 }}>{task.title}</h4>
            <button
              onClick={() => onDelete(task._id)}
              style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#999' }}
            >
              ✕
            </button>
          </div>

          {task.description && (
            <p style={{ margin: '6px 0', fontSize: '14px', color: '#666' }}>{task.description}</p>
          )}

          <div style={{ display: 'flex', gap: '8px', marginTop: '8px', fontSize: '12px' }}>
            <span
              style={{
                background: priorityColors[task.priority] || '#999',
                color: '#fff',
                padding: '2px 8px',
                borderRadius: '10px',
              }}
            >
              {task.priority}
            </span>
            {task.dueDate && (
              <span style={{ color: '#999' }}>
                Due: {new Date(task.dueDate).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default TaskCard;