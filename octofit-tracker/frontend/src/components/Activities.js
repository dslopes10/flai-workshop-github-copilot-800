import React, { useState, useEffect } from 'react';

function Activities() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const codespace = process.env.REACT_APP_CODESPACE_NAME;
        const apiUrl = codespace 
          ? `https://${codespace}-8000.app.github.dev/api/activities/`
          : 'http://localhost:8000/api/activities/';
        
        console.log('Fetching activities from:', apiUrl);
        
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Activities API response:', data);
        
        // Handle both paginated (.results) and plain array responses
        const activitiesData = data.results || data;
        console.log('Activities data:', activitiesData);
        
        setActivities(activitiesData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching activities:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  if (loading) return <div className="container mt-5"><h2>Loading activities...</h2></div>;
  if (error) return <div className="container mt-5"><div className="alert alert-danger">Error: {error}</div></div>;

  return (
    <div className="container mt-5">
      <h1 className="mb-4">OctoFit Activities</h1>
      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead className="table-dark">
            <tr>
              <th>User ID</th>
              <th>Type</th>
              <th>Duration (min)</th>
              <th>Distance (km)</th>
              <th>Points</th>
              <th>Date</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            {activities.map((activity) => (
              <tr key={activity._id}>
                <td>{activity.user_id}</td>
                <td>
                  <span className="badge bg-info">{activity.type}</span>
                </td>
                <td>{activity.duration_minutes}</td>
                <td>{activity.distance_km || 'N/A'}</td>
                <td><strong>{activity.points}</strong></td>
                <td>{new Date(activity.date).toLocaleDateString()}</td>
                <td><small>{activity.notes || '-'}</small></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-muted">Total activities: {activities.length}</p>
    </div>
  );
}

export default Activities;
