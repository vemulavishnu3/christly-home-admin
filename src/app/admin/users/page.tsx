import Link from 'next/link';

export default function UsersPage() {
  const users = [
    { id: 1, name: 'Alice Smith', email: 'alice@example.com', role: 'USER', status: 'ACTIVE' },
    { id: 2, name: 'Bob Johnson', email: 'bob@example.com', role: 'CHURCH_ADMIN', status: 'ACTIVE' },
    { id: 3, name: 'Charlie Brown', email: 'charlie@example.com', role: 'USER', status: 'SUSPENDED' },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 600 }}>Users Management</h1>
        <button style={{ padding: '8px 16px', background: 'var(--color-primary)', color: 'white', borderRadius: 8, border: 'none' }}>Add User</button>
      </div>
      
      <div style={{ background: 'white', borderRadius: 16, padding: 24, boxShadow: 'var(--shadow-card)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
              <th style={{ padding: 12 }}>Name</th>
              <th style={{ padding: 12 }}>Email</th>
              <th style={{ padding: 12 }}>Role</th>
              <th style={{ padding: 12 }}>Status</th>
              <th style={{ padding: 12 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                <td style={{ padding: 12 }}>{u.name}</td>
                <td style={{ padding: 12 }}>{u.email}</td>
                <td style={{ padding: 12 }}>{u.role}</td>
                <td style={{ padding: 12 }}>
                  <span style={{ padding: '4px 8px', borderRadius: 12, fontSize: 12, fontWeight: 600, background: u.status === 'ACTIVE' ? 'var(--color-muted-green)' : '#FEE2E2', color: u.status === 'ACTIVE' ? '#166534' : '#991B1B' }}>
                    {u.status}
                  </span>
                </td>
                <td style={{ padding: 12 }}>
                  <button style={{ background: 'none', border: 'none', color: 'var(--color-primary)' }}>Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
