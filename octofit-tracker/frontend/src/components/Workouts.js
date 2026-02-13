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

  const getDifficultyBadge = (difficulty) => {
    const badges = {
      'beginner': 'success',
      'intermediate': 'warning',
      'advanced': 'danger'
    };
    return badges[difficulty?.toLowerCase()] || 'secondary';
  };

  if (loading) return <div className="container mt-5"><h2>Loading workouts...</h2></div>;
  if (error) return <div className="container mt-5"><div className="alert alert-danger">Error: {error}</div></div>;

  return (
    <div className="container mt-5">
      <h1 className="mb-4">OctoFit Workouts</h1>
      <div className="row">
        {workouts.map((workout) => (
          <div key={workout._id} className="col-md-6 col-lg-4 mb-4">
            <div className="card h-100 shadow">
              <div className="card-header bg-dark text-white">
                <h4 className="mb-0">{workout.name}</h4>
              </div>
              <div className="card-body">
                <div className="mb-3">
                  <span className={`badge bg-${getDifficultyBadge(workout.difficulty)} me-2`}>
                    {workout.difficulty}
                  </span>
                  <span className="badge bg-info">{workout.type}</span>
                </div>
                <h6 className="card-subtitle mb-3 text-muted">
                  Duration: {workout.duration_minutes} minutes
                </h6>
                <p className="card-text">{workout.description}</p>
                <h6 className="mt-3">Exercises:</h6>
                <ul className="list-group list-group-flush">
                  {workout.exercises && workout.exercises.map((exercise, index) => (
                    <li key={index} className="list-group-item">
                      {exercise}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
      <p className="text-muted">Total workouts: {workouts.length}</p>
    </div>
  );
}

export default Workouts;
