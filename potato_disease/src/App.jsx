import { useState } from "react";
import axios from "axios";

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);

  // Handle file selection
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file)); // Create a preview URL
    }
  };

  // Handle file upload
  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a file first!");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await axios.post("http://localhost:8000/predict", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setPrediction(response.data);
      setError(null);
    } catch (err) {
      console.error("Upload failed:", err);
      setError("Upload failed. Please try again.");
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2>Potato Disease Classification</h2>
      
      {/* File Input */}
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <button onClick={handleUpload} style={{ marginLeft: "10px" }}>Upload</button>

      {/* Image Preview */}
      {imagePreview && (
        <div style={{ marginTop: "20px" }}>
          <h3>Selected Image:</h3>
          <img src={imagePreview} alt="Selected" style={{ width: "300px", borderRadius: "10px", boxShadow: "0 0 10px rgba(0,0,0,0.2)" }} />
        </div>
      )}

      {/* Prediction Result */}
      {prediction && (
        <div style={{ marginTop: "20px", color: "green" }}>
          <h3>Prediction Result:</h3>
          <p><strong>Class:</strong> {prediction.class}</p>
          <p><strong>Confidence:</strong> {(prediction.confidence * 100).toFixed(2)}%</p>
        </div>
      )}

      {/* Error Message */}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default App;

