import React, { useState, useEffect } from 'react';

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const codespace = process.env.REACT_APP_CODESPACE_NAME;
        const apiUrl = codespace 
          ? `https://${codespace}-8000.app.github.dev/api/users/`
          : 'http://localhost:8000/api/users/';
        
        console.log('Fetching users from:', apiUrl);
        
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Users API response:', data);
        
        // Handle both paginated (.results) and plain array responses
        const usersData = data.results || data;
        console.log('Users data:', usersData);
        
        setUsers(usersData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) return <div className="container mt-5"><h2>Loading users...</h2></div>;
  if (error) return <div className="container mt-5"><div className="alert alert-danger">Error: {error}</div></div>;

  return (
    <div className="container mt-5">
      <h1 className="mb-4">OctoFit Users</h1>
      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead className="table-dark">
            <tr>
              <th>Username</th>
              <th>Full Name</th>
              <th>Email</th>
              <th>Team</th>
              <th>Points</th>
              <th>Activities</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user.username}</td>
                <td>{user.full_name}</td>
                <td>{user.email}</td>
                <td>
                  <span className="badge bg-primary">{user.team_id}</span>
                </td>
                <td>{user.stats?.total_points || 0}</td>
                <td>{user.stats?.activities_completed || 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-muted">Total users: {users.length}</p>
    </div>
  );
}

export default Users;
