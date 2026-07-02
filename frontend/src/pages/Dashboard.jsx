import { RefreshCw } from 'lucide-react';
import { useEffect, useState } from 'react';

import { api } from '../api/client.js';
import IssueTable from '../components/IssueTable.jsx';
import StatCard from '../components/StatCard.jsx';

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [issues, setIssues] = useState([]);
  const [error, setError] = useState('');

  async function load() {
    setError('');
    try {
      const [nextSummary, nextIssues] = await Promise.all([api.analyticsSummary(), api.listIssues()]);
      setSummary(nextSummary);
      setIssues(nextIssues);
    } catch (err) {
      setError(err.message);
    }
  }

  async function changeStatus(issueId, status) {
    const updated = await api.updateIssue(issueId, { status });
    setIssues((current) => current.map((issue) => (issue.id === issueId ? updated : issue)));
    load();
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <section>
      <div className="page-heading">
        <h1>Dashboard</h1>
        <button className="secondary" type="button" onClick={load}>
          <RefreshCw size={18} />
          <span>Refresh</span>
        </button>
      </div>

      {error && <p className="error">{error}</p>}

      <div className="stats-grid">
        <StatCard label="Total" value={summary?.total ?? 0} />
        <StatCard label="Open" value={summary?.open ?? 0} tone="warm" />
        <StatCard label="High priority" value={summary?.high_priority ?? 0} tone="urgent" />
        <StatCard label="Duplicates" value={summary?.duplicate_reports ?? 0} tone="cool" />
      </div>

      <IssueTable issues={issues} onStatusChange={changeStatus} />
    </section>
  );
}

