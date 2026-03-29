import { useEffect, useState } from "react";
import { fetchActiveBookingsReport, fetchBookings } from "../lib/api";

export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [activeReport, setActiveReport] = useState([]);
  const [occupancyReport, setOccupancyReport] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchBookings(), fetchActiveBookingsReport(), fetchOccupancy()])
      .then(([bookingRows, reportRows, occupancyRows]) => {
        setBookings(bookingRows);
        setActiveReport(reportRows || []);
        setOccupancyReport(occupancyRows || []);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main>
      <div className="glass-card" style={{ marginBottom: "32px" }}>
        <h1 style={{ marginBottom: "8px" }}>Management Reports</h1>
        <p style={{ color: "var(--text-dim)" }}>Overview of all bookings and real-time occupancy data from Go & Django services.</p>
      </div>

      {error && (
        <div className="glass-card" style={{ borderColor: 'var(--error)', color: 'var(--error)', marginBottom: '24px', background: 'rgba(239, 68, 68, 0.1)' }}>
          {error}
        </div>
      )}

      <div style={{ display: "grid", gap: "32px" }}>
        <section className="glass-card">
          <h3 style={{ marginBottom: "16px", color: "var(--primary)" }}>Go API: Occupancy Report</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "32px" }}>
            {occupancyReport.map((lot) => (
              <div key={lot.lot_id} className="glass-card" style={{ padding: "16px", border: "1px solid var(--glass-border)" }}>
                <h4 style={{ fontSize: "0.9rem", color: "var(--text-dim)", textTransform: "uppercase" }}>{lot.lot_name}</h4>
                <p style={{ fontSize: "1.5rem", fontWeight: 700, marginTop: "4px" }}>{lot.occupied_slots} Slots occupied</p>
              </div>
            ))}
          </div>

          <h3 style={{ marginBottom: "16px", color: "var(--primary)" }}>Go API: Active Bookings Detail</h3>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ textAlign: "left", color: "var(--text-dim)", fontSize: "0.875rem" }}>
                <th style={{ padding: "12px" }}>Plate #</th>
                <th style={{ padding: "12px" }}>Slot</th>
                <th style={{ padding: "12px" }}>Location</th>
                <th style={{ padding: "12px" }}>Time</th>
              </tr>
            </thead>
            <tbody>
              {activeReport.map((rep, i) => (
                <tr key={i} style={{ borderTop: "1px solid var(--glass-border)" }}>
                  <td style={{ padding: "12px" }}>{rep.number_plate}</td>
                  <td style={{ padding: "12px" }}>#{rep.slot_number}</td>
                  <td style={{ padding: "12px" }}>{rep.lot_name}</td>
                  <td style={{ padding: "12px" }}>{new Date(rep.start_time).toLocaleTimeString()}</td>
                </tr>
              ))}
              {!activeReport.length && !loading && (
                <tr>
                  <td colSpan="4" style={{ padding: "20px", textAlign: "center", color: "var(--text-dim)" }}>No active bookings.</td>
                </tr>
              )}
            </tbody>
          </table>
        </section>

        <section className="glass-card">
          <h3 style={{ marginBottom: "16px", color: "var(--primary)" }}>Django API: All Bookings History</h3>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ textAlign: "left", color: "var(--text-dim)", fontSize: "0.875rem" }}>
                  <th style={{ padding: "12px" }}>ID</th>
                  <th style={{ padding: "12px" }}>Vehicle</th>
                  <th style={{ padding: "12px" }}>Slot</th>
                  <th style={{ padding: "12px" }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b.id} style={{ borderTop: "1px solid var(--glass-border)" }}>
                    <td style={{ padding: "12px" }}>#{b.id}</td>
                    <td style={{ padding: "12px" }}>{b.vehicle?.number_plate}</td>
                    <td style={{ padding: "12px" }}>Slot {b.slot?.number}</td>
                    <td style={{ padding: "12px" }}>
                      <span 
                        style={{ 
                          padding: "4px 8px", 
                          borderRadius: "6px", 
                          fontSize: "0.75rem",
                          background: b.end_time ? "rgba(255,255,255,0.1)" : "rgba(34, 197, 94, 0.2)",
                          color: b.end_time ? "var(--text-dim)" : "var(--success)"
                        }}
                      >
                        {b.end_time ? "Completed" : "Active"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}
