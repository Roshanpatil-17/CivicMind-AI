import { MapPin, Send } from "lucide-react";
import { useState } from "react";

import MapPicker from "../components/MapPicker";
import { api } from "../api/client";

export default function ReportIssue() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    latitude: "",
    longitude: "",
    image: null,
  });

  const [preview, setPreview] = useState(null);
  const [created, setCreated] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function useLocation() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setForm((current) => ({
          ...current,
          latitude: position.coords.latitude.toFixed(6),
          longitude: position.coords.longitude.toFixed(6),
        }));
      },
      () => {
        alert("Unable to get your location.");
      },
      {
        enableHighAccuracy: true,
      }
    );
  }

  function handleImage(event) {
    const file = event.target.files[0];

    if (!file) return;

    setForm((current) => ({
      ...current,
      image: file,
    }));

    setPreview(URL.createObjectURL(file));
  }

  async function submit(event) {
    event.preventDefault();

    setLoading(true);
    setCreated(null);
    setError("");

    const data = new FormData();

    data.append("title", form.title);
    data.append("description", form.description);
    data.append("latitude", form.latitude);
    data.append("longitude", form.longitude);

    if (form.image) {
      data.append("image", form.image);
    }

    try {
      const issue = await api.createIssue(data);

      setCreated(issue);

      setForm({
        title: "",
        description: "",
        latitude: "",
        longitude: "",
        image: null,
      });

      setPreview(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="report-page">

      <div className="report-left">

        <h1>Report New Issue</h1>

        <p className="subtitle">
          Help improve your city by reporting civic problems.
        </p>

        <form className="report-form" onSubmit={submit}>

          <label>
            Title
            <input
              type="text"
              placeholder="Example: Large pothole near bus stand"
              value={form.title}
              onChange={(e) =>
                setForm({
                  ...form,
                  title: e.target.value,
                })
              }
              required
            />
          </label>

          <label>
            Description
            <textarea
              rows={5}
              placeholder="Describe the issue..."
              value={form.description}
              onChange={(e) =>
                setForm({
                  ...form,
                  description: e.target.value,
                })
              }
              required
            />
          </label>

          <div className="location-card">

            <div className="location-header">

              <h3>
                <MapPin size={18} />
                Select Location
              </h3>

              <button
                type="button"
                className="secondary"
                onClick={useLocation}
              >
                Use My Location
              </button>

            </div>

            <MapPicker
              latitude={form.latitude}
              longitude={form.longitude}
              onLocationChange={({ lat, lng }) =>
                setForm((current) => ({
                  ...current,
                  latitude: lat.toFixed(6),
                  longitude: lng.toFixed(6),
                }))
              }
            />

          </div>

          <label>

            Upload Image

            <input
              type="file"
              accept="image/*"
              onChange={handleImage}
            />

          </label>

          {error && (
            <div className="error-box">
              {error}
            </div>
          )}

          <button
            className="primary submit-btn"
            disabled={loading}
          >

            <Send size={18} />

            {loading ? "Analyzing Issue..." : "Submit Report"}

          </button>

        </form>

      </div>

      <div className="report-right">

        <div className="preview-card">

          <h2>Image Preview</h2>

          {preview ? (
            <img
              src={preview}
              alt="Preview"
              className="image-preview"
            />
          ) : (
            <div className="empty-preview">
              📷
              <p>No image selected</p>
            </div>
          )}

        </div>

        <div className="analysis-card">

          <h2>🤖 AI Analysis</h2>

          <div className="ai-status">
  {created ? (
    created.confidence >= 0.9 ? (
      <span className="status verified">🟢 AI Verified</span>
    ) : created.confidence >= 0.7 ? (
      <span className="status review">🟡 Manual Review</span>
    ) : (
      <span className="status low">🔴 Low Confidence</span>
    )
  ) : (
    <span className="status waiting">⚪ Waiting for Analysis</span>
  )}
</div>
          <div className="analysis-item">
            <span>📌 Category</span>
            <strong>{created?.category ?? "--"}</strong>
          </div>

          <div className="analysis-item">
            <span>📊 Confidence</span>

            <div className="confidence-box">

              <div className="confidence-bar">
                <div
                  className="confidence-fill"
                  style={{
                    width: created
                      ? `${Math.round(created.confidence * 100)}%`
                      : "0%",
                  }}
                />
              </div>

              <strong>
                {created
                  ? `${Math.round(created.confidence * 100)}%`
                  : "--"}
              </strong>

            </div>

          </div>

          <div className="analysis-item">
            <span>🚨 Priority</span>
            <strong>{created?.priority ?? "--"}</strong>
          </div>

          <div className="analysis-item">
            <span>🏢 Department</span>
            <strong>Road Maintenance</strong>
          </div>

          <div className="analysis-item">
            <span>🤖 AI Model</span>
            <strong>YOLO Pothole v1</strong>
          </div>

          <div className="analysis-item">
            <span>🆔 Issue ID</span>
            <strong>{created ? `#${created.id}` : "--"}</strong>
          </div>

          <div className="analysis-item">
            <span>🔁 Duplicate</span>
            <strong>
              {created?.duplicate_of_id
                ? `#${created.duplicate_of_id}`
                : "No"}
            </strong>
          </div>

        </div>

      </div>

    </section>
  );
}