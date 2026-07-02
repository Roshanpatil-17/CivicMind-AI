const statusLabels = {
  open: 'Open',
  in_progress: 'In progress',
  resolved: 'Resolved',
  rejected: 'Rejected',
};

export default function IssueTable({ issues, onStatusChange }) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Issue</th>
            <th>Category</th>
            <th>Priority</th>
            <th>Status</th>
            <th>Duplicate</th>
          </tr>
        </thead>
        <tbody>
          {issues.map((issue) => (
            <tr key={issue.id}>
              <td>
                <strong>{issue.title}</strong>
                <small>{issue.description}</small>
              </td>
              <td>{issue.category}</td>
              <td>
                <span className={`pill ${issue.priority}`}>{issue.priority}</span>
              </td>
              <td>
                {onStatusChange ? (
                  <select value={issue.status} onChange={(event) => onStatusChange(issue.id, event.target.value)}>
                    {Object.entries(statusLabels).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                ) : (
                  statusLabels[issue.status] ?? issue.status
                )}
              </td>
              <td>{issue.duplicate_of_id ? `#${issue.duplicate_of_id}` : '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

