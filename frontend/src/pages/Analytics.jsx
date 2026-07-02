import { useEffect, useState } from 'react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import { api } from '../api/client.js';

export default function Analytics() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    api.categoryCounts().then(setCategories).catch(() => setCategories([]));
  }, []);

  return (
    <section>
      <div className="page-heading">
        <h1>Analytics</h1>
      </div>

      <div className="panel chart-panel">
        <ResponsiveContainer width="100%" height={360}>
          <BarChart data={categories}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="count" fill="#2f8f83" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

