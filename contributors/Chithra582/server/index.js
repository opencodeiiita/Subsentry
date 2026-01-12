const express = require("express");
const app = express();
const subscriptionRoutes = require("./routes/subscriptions");

app.use(express.json());
app.use("/api/subscriptions", subscriptionRoutes);

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
