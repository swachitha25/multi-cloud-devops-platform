// --------------------------
// BASIC BACKEND SETUP
// --------------------------
const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors());
app.use(express.json());

// --------------------------
// TEST ROUTE
// --------------------------
app.get("/", (req, res) => {
  res.json({ message: "Backend is working!" });
});

// --------------------------
// AWS SAGEMAKER SETUP
// --------------------------
const AWS = require("aws-sdk");

// IMPORTANT: change region if your endpoint is in another region
AWS.config.update({ region: "us-east-1" });

// --------------------------
// PREDICT ROUTE
// --------------------------
app.post("/predict", async (req, res) => {
  const runtime = new AWS.SageMakerRuntime();

  // value sent by frontend/backend
  const payload = JSON.stringify({ value: req.body.value });

  const params = {
    EndpointName: "sagemaker-scikit-learn-2025-12-11-16-53-43-685",
    Body: payload,
    ContentType: "application/json",
  };

  runtime.invokeEndpoint(params, (err, data) => {
    if (err) {
      console.error("Invoke error:", err);
      return res.status(500).json({ error: err });
    }

    const result = JSON.parse(Buffer.from(data.Body).toString());
    res.json(result);
  });
});

// --------------------------
// START SERVER
// --------------------------
app.listen(5000, () => console.log("Server running on port 5000"));
