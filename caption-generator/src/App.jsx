import React, { useState } from 'react';
import './App.css';
import Loader from "./assets/loaderT.gif";
import PictureViewer from "./components/PictureViewer";
import axios from "axios";

function App() {
  const [method, setMethod] = useState(true);
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState(false);
  

  const handleClick = () => {
    setValue("");
    setMethod(prev => !prev);
  };

  const handleChange = (e) => {
    setValue(e.target.value);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setValue(reader.result); // base64 string with prefix
    };
    reader.readAsDataURL(file);
  };

const handleDescribe = async () => {
  setLoading(true);
  setOutput(false);

  try {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    const mimeMatch = value.match(/^data:(image\/\w+);base64,/);
    const mimeType = mimeMatch ? mimeMatch[1] : "image/png";

    const base64Image = value.replace(/^data:image\/\w+;base64,/, '');

    console.log("✅ API Key:", apiKey);
    console.log("✅ Mime Type:", mimeType);
    console.log("✅ Full base64 value:", value.slice(0, 100));
    console.log("✅ Base64 stripped:", base64Image.slice(0, 100));
    console.log("✅ Base64 length:", base64Image.length);

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-vision:generateContent?key=${apiKey}`,

      
      {
        contents: [
          {
            parts: [
              { text: "Describe this image in detail." },
              {
                inline_data: {
                  mime_type: mimeType,
                  data: base64Image
                }
              }
            ]
          }
        ]
      }
    );

    const text = response.data.candidates?.[0]?.content?.parts?.[0]?.text || "No description found.";
    setOutput(text);
  } catch (error) {
  console.error("API Call Failed:");
  console.error("Error Message:", error.message);
  console.error("Error Response Data:", error.response?.data);
  console.error("Full Error Object:", error);
  setOutput("Something went wrong. Please check your API key or image input.");
}

  setLoading(false);
};


  return (
    <div className="main">
      <h1 className="main-header">Image Describer</h1>
      <button className="my-button" onClick={handleClick}>Change input method</button>

      {loading && <img src={Loader} height={50} alt="Loading..." />}
      {output && <div className="output">Output: {output}</div>}

      <PictureViewer imageUrl={value} />

      {method ? (
        <input className="file-upload" type="file" accept="image/*" onChange={handleFileChange} />
      ) : (
        <input
          className="text-input"
          type="text"
          value={value}
          onChange={handleChange}
          placeholder="Enter Base64 Image or URL"
        />
      )}

      {value && (
        <button className="my-button" onClick={handleDescribe}>
          Let's Describe the Scene
        </button>
      )}
    </div>
  );
}

export default App;
