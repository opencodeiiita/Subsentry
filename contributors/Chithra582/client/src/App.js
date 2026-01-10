import React, { useState } from "react";
import SubscriptionForm from "./SubscriptionForm";

function App() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [editingSub, setEditingSub] = useState(null);
  const [deletingSub, setDeletingSub] = useState(null);

  const addSubscription = (sub) => {
    setSubscriptions([...subscriptions, sub]);
  };

  const saveEdit = () => {
    setSubscriptions((prev) =>
      prev.map((sub) =>
        sub.id === editingSub.id ? editingSub : sub
      )
    );
    setEditingSub(null);
  };

  const confirmDelete = () => {
    setSubscriptions((prev) =>
      prev.filter((sub) => sub.id !== deletingSub.id)
    );
    setDeletingSub(null);
  };

  return (
    <div className="container">
      <h1>SubSentry</h1>

      <SubscriptionForm addSubscription={addSubscription} />

      <h2>Your Subscriptions</h2>

      {subscriptions.map((sub) => (
        <div key={sub.id} className="card">
          <h3>{sub.name}</h3>
          <p>₹{sub.price}</p>

          <button onClick={() => setEditingSub(sub)}> Edit</button>
          <button onClick={() => setDeletingSub(sub)}> Delete</button>
        </div>
      ))}

      {/* EDIT MODAL */}
      {editingSub && (
        <div className="modal">
          <h3>Edit Subscription</h3>

          <input
            value={editingSub.name}
            onChange={(e) =>
              setEditingSub({ ...editingSub, name: e.target.value })
            }
          />

          <input
            value={editingSub.price}
            onChange={(e) =>
              setEditingSub({ ...editingSub, price: e.target.value })
            }
          />

          <button onClick={saveEdit}>Save</button>
          <button onClick={() => setEditingSub(null)}>Cancel</button>
        </div>
      )}

      {/* DELETE CONFIRMATION */}
      {deletingSub && (
        <div className="modal">
          <p>
            Are you sure you want to delete <b>{deletingSub.name}</b>?
          </p>

          <button onClick={confirmDelete}>Yes, Delete</button>
          <button onClick={() => setDeletingSub(null)}>Cancel</button>
        </div>
      )}
    </div>
  );
}

export default App;
