import { createBooking } from "../lib/api";

export default function SlotGrid({ slots, selectedVehicle, fetchSlots, loading }) {
  async function handleBook(slotId) {
    if (!selectedVehicle) {
      alert("Select a vehicle first");
      return;
    }

    try {
      await createBooking({
        vehicle: Number(selectedVehicle),
        slot: slotId
      });
      alert("Booking created");
      fetchSlots();
    } catch (err) {
      alert(err.message);
    }
  }

  if (loading) return <p style={{ color: "var(--text-dim)" }}>Loading slots...</p>;
  if (!slots.length) {
    return (
      <div className="glass-card" style={{ textAlign: "center", fontStyle: "italic", color: "var(--text-dim)" }}>
        No available slots found in this lot.
      </div>
    );
  }

  return (
    <div style={{ display: "grid", gap: "16px", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))" }}>
      {slots.map((slot) => (
        <div 
          key={slot.id} 
          className="glass-card" 
          style={{ 
            display: "flex", 
            flexDirection: "column", 
            gap: "12px", 
            opacity: slot.is_occupied ? 0.5 : 1,
            borderColor: slot.is_occupied ? "var(--glass-border)" : "var(--primary)" 
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontWeight: 600, fontSize: "1.1rem" }}>Slot {slot.number}</span>
            <div 
              style={{ 
                width: 12, 
                height: 12, 
                borderRadius: "50%", 
                background: slot.is_occupied ? "var(--error)" : "var(--success)" 
              }} 
            />
          </div>
          <button 
            disabled={slot.is_occupied}
            className="btn-primary" 
            style={{ 
              fontSize: "0.875rem", 
              background: slot.is_occupied ? "var(--text-dim)" : "var(--primary)" 
            }}
            onClick={() => handleBook(slot.id)}
          >
            {slot.is_occupied ? "Occupied" : "Book Now"}
          </button>
        </div>
      ))}
    </div>
  );
}
