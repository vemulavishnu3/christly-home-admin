export default function DonationsPage() {
  const donations = [
    { id: 'TXN-101', date: '2026-10-07', donor: 'John Doe', church: 'Grace Fellowship', amount: '₹5,000', status: 'COMPLETED' },
    { id: 'TXN-102', date: '2026-10-06', donor: 'Anonymous', church: 'St. John Cathedral', amount: '₹12,000', status: 'COMPLETED' },
    { id: 'TXN-103', date: '2026-10-06', donor: 'Jane Smith', church: 'New Hope Ministry', amount: '₹1,500', status: 'PENDING' },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 600 }}>Donations & Finance</h1>
        <button style={{ padding: '8px 16px', background: 'var(--color-primary)', color: 'white', borderRadius: 8, border: 'none' }}>Export CSV</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24, marginBottom: 32 }}>
        {[
          { label: 'Total Volume', value: '₹18,42,500' },
          { label: 'Today', value: '₹18,500' },
          { label: 'This Month', value: '₹4,12,000' },
          { label: 'Pending Refunds', value: '₹3,000' },
        ].map(stat => (
          <div key={stat.label} style={{ background: 'white', padding: 20, borderRadius: 12, boxShadow: 'var(--shadow-card)' }}>
            <p style={{ color: 'var(--color-warm-gray)', fontSize: 14 }}>{stat.label}</p>
            <h3 style={{ fontSize: 24, fontWeight: 600 }}>{stat.value}</h3>
          </div>
        ))}
      </div>

      <div style={{ background: 'white', borderRadius: 16, padding: 24, boxShadow: 'var(--shadow-card)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
              <th style={{ padding: 12 }}>ID</th>
              <th style={{ padding: 12 }}>Date</th>
              <th style={{ padding: 12 }}>Donor</th>
              <th style={{ padding: 12 }}>Church</th>
              <th style={{ padding: 12 }}>Amount</th>
              <th style={{ padding: 12 }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {donations.map(d => (
              <tr key={d.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                <td style={{ padding: 12, color: 'var(--color-warm-gray)' }}>{d.id}</td>
                <td style={{ padding: 12 }}>{d.date}</td>
                <td style={{ padding: 12 }}>{d.donor}</td>
                <td style={{ padding: 12 }}>{d.church}</td>
                <td style={{ padding: 12, fontWeight: 600 }}>{d.amount}</td>
                <td style={{ padding: 12 }}>
                  <span style={{ padding: '4px 8px', borderRadius: 12, fontSize: 12, fontWeight: 600, background: d.status === 'COMPLETED' ? 'var(--color-muted-green)' : '#FEF3C7', color: d.status === 'COMPLETED' ? '#166534' : '#92400E' }}>
                    {d.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
