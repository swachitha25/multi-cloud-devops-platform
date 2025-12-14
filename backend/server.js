// ---------------------------------------------
// 1. IMPORT MODULES
// ---------------------------------------------
const express = require("express");
const cors = require("cors");
const AWS = require("aws-sdk");

// ---------------------------------------------
// 2. CREATE EXPRESS APP
// ---------------------------------------------
const app = express();
app.use(cors());
app.use(express.json());

// ---------------------------------------------
// 3. AWS CONFIGURATION (for SageMaker)
// ---------------------------------------------
// IMPORTANT: Replace with your AWS region
AWS.config.update({ region: "us-east-1" });

// SageMaker runtime client
const runtime = new AWS.SageMakerRuntime();

// ---------------------------------------------
// 4. TEST ROUTE (check if backend works)
// ---------------------------------------------
app.get("/", (req, res) => {
  res.json({ message: "Backend is working!" });
});

// ---------------------------------------------
// 5. AI PREDICTION ROUTE (THIS IS STEP 6)
// ---------------------------------------------
// Replace "YOUR-ENDPOINT-NAME" with your real SageMaker endpoint
app.post("/predict", (req, res) => {
  const { value } = req.body;

  // Build payload for SageMaker
  const payload = JSON.stringify({ value: Number(value) });

  const params = {
    EndpointName: "sagemaker-scikit-learn-2025-12-11-16-53-43-685",  
    Body: payload,
    ContentType: "application/json",
  };

  // Call SageMaker endpoint
  runtime.invokeEndpoint(params, (err, data) => {
    if (err) {
      console.error("SageMaker Error:", err);
      return res.status(500).json({ error: err.message });
    }

    // Convert model response to JSON
    const result = JSON.parse(Buffer.from(data.Body).toString());
    res.json(result);
  });
});

// ---------------------------------------------
// 6. START SERVER
// ---------------------------------------------
app.listen(5000, () => {
  console.log("Backend running on port 5000");
});
