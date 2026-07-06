import { Camera, MapPin, Send } from 'lucide-react';
import { useState } from 'react';
import MapPicker from '../components/MapPicker';

import { api } from '../api/client.js';

export default function ReportIssue() {
  const [form, setForm] = useState({
    title: '',
    description: '',
    latitude: '',
    longitude: '',
    image: null,
  });
  const [preview, setPreview] = useState(null);
  const [created, setCreated] = useState(null);
  const [error, setError] = useState('');

  function useLocation() {
    navigator.geolocation.getCurrentPosition((position) => {
      setForm((current) => ({
        ...current,
        latitude: position.coords.latitude.toFixed(6),
        longitude: position.coords.longitude.toFixed(6),
      }));
    });
  }

  async function submit(event) {
    event.preventDefault();
    setError('');
    setCreated(null);
    const data = new FormData();
    data.append('title', form.title);
    data.append('description', form.description);
    data.append('latitude', form.latitude);
    data.append('longitude', form.longitude);
    if (form.image) {
      data.append('image', form.image);
    }

    try {
      const issue = await api.createIssue(data);
      setCreated(issue);
      setForm({ title: '', description: '', latitude: '', longitude: '', image: null });
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <section className="page-grid two">
      <div>
        <div className="page-heading">
          <h1>Report issue</h1>
          <button className="secondary" type="button" onClick={useLocation}>
            <MapPin size={18} />
            <span>Use location</span>
          </button>
        </div>

        <form className="panel form-panel" onSubmit={submit}>
          <label>
            Title
            <input value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} required />
          </label>
          
            Description
            <textarea
              rows={5}
              value={form.description}
              onChange={(event) => setForm({ ...form, description: event.target.value })}
              required
            />
          <div className="panel">
  <h3>Select Location</h3>

  <MapPicker
    latitude={form.latitude}
    longitude={form.longitude}
    onLocationChange={({ lat, lng }) => {
      setForm((current) => ({
        ...current,
        latitude: lat.toFixed(6),
        longitude: lng.toFixed(6),
      }));
    }}
  />

  <p style={{ marginTop: '10px' }}>
    <strong>Latitude:</strong> {form.latitude || '--'}
    <br />
    <strong>Longitude:</strong> {form.longitude || '--'}
  </p>
</div>
          <label>
            Photo
            <input
  type="file"
  accept="image/*"
  onChange={(event) => {
    const file = event.target.files[0];

    if (!file) return;

    setForm({
      ...form,
      image: file,
    });

    setPreview(URL.createObjectURL(file));
  }}
/>
          {preview && <img className="image-preview" src={preview} alt="Preview" />}
          </label>
          {error && <p className="error">{error}</p>}
          <button className="primary" type="submit">
            <Send size={18} />
            <span>Submit</span>
          </button>
        </form>
      </div>

      <aside className="panel result-panel">
        <Camera size={28} />
        {created ? (
          <>
            <h2>Issue #{created.id}</h2>
            <dl>
              <dt>Category</dt>
              <dd>{created.category}</dd>
              <dt>Priority</dt>
              <dd>{created.priority}</dd>
              <dt>Confidence</dt>
              <dd>{Math.round(created.confidence * 100)}%</dd>
              <dt>Duplicate</dt>
              <dd>{created.duplicate_of_id ? `#${created.duplicate_of_id}` : '-'}</dd>
            </dl>
          </>
        ) : (
          <h2>Ready</h2>
        )}
      </aside>
    </section>
  );
}

