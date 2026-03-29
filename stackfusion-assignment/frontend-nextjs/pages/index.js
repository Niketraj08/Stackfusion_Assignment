import { useEffect, useState } from "react";
import SlotGrid from "../components/SlotGrid";
import { fetchAvailableSlots, fetchLots } from "../lib/api";

export default function HomePage() {
  const [lots, setLots] = useState([]);
  const [slots, setSlots] = useState([]);
  const [selectedLot, setSelectedLot] = useState("");
  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchLots()
      .then(setLots)
      .catch((err) => setError(err.message));
  }, []);

  async function loadSlots() {
    try {
      if (!selectedLot) return;
      setLoading(true);
      setError("");
      const parsed = await fetchAvailableSlots(selectedLot);
      setSlots(parsed);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main>
      <div className="glass-card" style={{ marginBottom: "32px" }}>
        <h1 style={{ marginBottom: "20px" }}>Book Your Slot</h1>
        
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "20px" }}>
          <div>
            <label htmlFor="lot">Select Parking Lot</label>
            <select id="lot" value={selectedLot} onChange={(e) => setSelectedLot(e.target.value)}>
              <option value="">Choose a location...</option>
              {lots.map((lot) => (
                <option key={lot.id} value={lot.id}>
                  {lot.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="vehicle">Vehicle ID</label>
            <input
              id="vehicle"
              type="number"
              placeholder="Enter ID, e.g. 1"
              value={selectedVehicle}
              onChange={(e) => setSelectedVehicle(e.target.value)}
            />
          </div>
        </div>

        <button className="btn-primary" onClick={loadSlots} disabled={loading}>
          {loading ? "Searching..." : "View Available Slots"}
        </button>
      </div>

      {error && (
        <div className="glass-card" style={{ borderColor: 'var(--error)', color: 'var(--error)', marginBottom: '24px' }}>
          {error}
        </div>
      )}

      <div style={{ padding: "0 8px" }}>
        <h2 style={{ marginBottom: "24px", fontSize: "1.5rem" }}>
          Available Slots {selectedLot && lots.find(l => l.id == selectedLot)?.name && `- ${lots.find(l => l.id == selectedLot).name}`}
        </h2>
        <SlotGrid slots={slots} selectedVehicle={selectedVehicle} fetchSlots={loadSlots} loading={loading} />
      </div>
    </main>
  );
}
