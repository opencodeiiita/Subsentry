import React, { useState } from "react";

function SubscriptionForm({ addSubscription }) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    addSubscription({
      id: Date.now(),
      name,
      price,
    });

    setName("");
    setPrice("");
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <input
        placeholder="Subscription Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      <input
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        required
      />

      <button type="submit">Add Subscription</button>
    </form>
  );
}

export default SubscriptionForm;
