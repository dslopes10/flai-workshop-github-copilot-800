import React, { useState, useEffect } from 'react';

function Workouts() {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const codespace = process.env.REACT_APP_CODESPACE_NAME;
        const apiUrl = codespace 
          ? `https://${codespace}-8000.app.github.dev/api/workouts/`
          : 'http://localhost:8000/api/workouts/';
        
        console.log('Fetching workouts from:', apiUrl);
        
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Workouts API response:', data);
        
        // Handle both paginated (.results) and plain array responses
        const workoutsData = data.results || data;
        console.log('Workouts data:', workoutsData);
        
        setWorkouts(workoutsData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching workouts:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchWorkouts();
  }, []);

  const getDifficultyColor = (difficulty) => {
    const colors = {
      'easy': { bg: 'rgba(34, 197, 94, 0.2)', border: '#22c55e', glow: 'rgba(34, 197, 94, 0.4)' },
      'medium': { bg: 'rgba(234, 179, 8, 0.2)', border: '#eab308', glow: 'rgba(234, 179, 8, 0.4)' },
      'hard': { bg: 'rgba(239, 68, 68, 0.2)', border: '#ef4444', glow: 'rgba(239, 68, 68, 0.4)' }
    };
    return colors[difficulty?.toLowerCase()] || colors['medium'];
  };

  const getTypeColor = (type) => {
    const colors = {
      'strength': { bg: 'rgba(99, 102, 241, 0.2)', border: '#6366f1', glow: 'rgba(99, 102, 241, 0.4)' },
      'cardio': { bg: 'rgba(236, 72, 153, 0.2)', border: '#ec4899', glow: 'rgba(236, 72, 153, 0.4)' },
      'flexibility': { bg: 'rgba(139, 92, 246, 0.2)', border: '#8b5cf6', glow: 'rgba(139, 92, 246, 0.4)' }
    };
    return colors[type?.toLowerCase()] || colors['strength'];
  };

  if (loading) return <div className="container mt-5"><h2>Loading workouts...</h2></div>;
  if (error) return <div className="container mt-5"><div className="alert alert-danger">Error: {error}</div></div>;

  return (
    <div className="container mt-5">
      <h1 className="mb-4">OctoFit Workouts</h1>
      <div className="row">
        {workouts.map((workout) => {
          const difficultyColor = getDifficultyColor(workout.difficulty);
          const typeColor = getTypeColor(workout.type);
          
          return (
            <div key={workout._id} className="col-md-6 col-lg-4 mb-4">
              <div className="workout-card h-100">
                <div className="workout-card-header">
                  <h4 className="workout-title">{workout.name}</h4>
                  <div className="workout-badges">
                    <span 
                      className="workout-badge difficulty-badge"
                      style={{
                        background: difficultyColor.bg,
                        borderColor: difficultyColor.border,
                        color: difficultyColor.border,
                        boxShadow: `0 0 10px ${difficultyColor.glow}`
                      }}
                    >
                      {workout.difficulty?.toUpperCase()}
                    </span>
                    <span 
                      className="workout-badge type-badge"
                      style={{
                        background: typeColor.bg,
                        borderColor: typeColor.border,
                        color: typeColor.border,
                        boxShadow: `0 0 10px ${typeColor.glow}`
                      }}
                    >
                      {workout.type?.toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className="workout-card-body">
                  <div className="workout-duration">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/>
                      <polyline points="12 6 12 12 16 14"/>
                    </svg>
                    <span>{workout.duration_minutes} minutes</span>
                  </div>
                  <p className="workout-description">{workout.description}</p>
                  <div className="workout-exercises">
                    <h6 className="exercises-title">Exercises:</h6>
                    <div className="exercises-list">
                      {workout.exercises && workout.exercises.map((exercise, index) => (
                        <div key={index} className="exercise-item">
                          <span className="exercise-number">{index + 1}</span>
                          <span className="exercise-name">{exercise}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <p className="workout-count">Total workouts: {workouts.length}</p>
    </div>
  );
}

export default Workouts;
