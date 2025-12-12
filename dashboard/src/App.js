import { useEffect, useState } from "react";

function App() {
  const [backendMessage, setBackendMessage] = useState("");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  // Connect to backend API running in Kubernetes
  useEffect(() => {
    fetch("http://localhost:30001/")
      .then((res) => res.json())
      .then((data) => setBackendMessage(data.message))
      .catch((err) => console.log("Backend Error:", err));
  }, []);

  // Call AWS SageMaker AI Model through backend
  async function getPrediction() {
    const res = await fetch("http://192.168.59.101:30001/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ value: Number(input) }),
    });

    const data = await res.json();
    setOutput(data.prediction);
  }

  return (
    <div style={{ padding: "40px", fontFamily: "Arial" }}>
      <h1>Multi-Cloud DevOps & AI Platform</h1>

      {/* Backend Status */}
      <p><b>Backend Response:</b> {backendMessage}</p>

      <hr />

      {/* AI Prediction UI */}
      <h2>AI Prediction (SageMaker Model)</h2>

      <input
        type="number"
        placeholder="Enter a number"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        style={{
          padding: "10px",
          width: "200px",
          marginRight: "10px",
          borderRadius: "5px",
        }}
      />

      <button
        onClick={getPrediction}
        style={{
          padding: "10px 20px",
          backgroundColor: "#4CAF50",
          color: "white",
          border: "none",
          cursor: "pointer",
          borderRadius: "5px",
        }}
      >
        Predict
      </button>

      {output !== "" && (
        <p style={{ marginTop: "20px", fontSize: "18px" }}>
          <b>Prediction:</b> {output}
        </p>
      )}

      <hr />

      {/* Buttons for future features */}
      <h2>Platform Actions</h2>
      <button style={{ margin: "5px" }}>Deploy to AWS</button>
      <button style={{ margin: "5px" }}>Deploy to Azure</button>
      <button style={{ margin: "5px" }}>Deploy to GCP</button>
      <button style={{ margin: "5px" }}>View Logs</button>
      <button style={{ margin: "5px" }}>Monitor Cluster</button>
    </div>
  );
}

export default App;
