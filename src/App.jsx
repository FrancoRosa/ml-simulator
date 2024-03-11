import { useState } from "react";
import "./App.css";

const App = () => {
  const [range, setRange] = useState("all");
  const [selectedFile, setSelectedFile] = useState(null);

  const handleRange = (e) => {
    setRange(e.target.value);
  };

  const handleFile = (e) => {
    const file = e.target.files[0]; // Get the first selected file
    setSelectedFile(file);
    console.log(file);
  };

  return (
    <>
      {selectedFile && (
        <div style={{ position: "relative" }} id="layer">
          <canvas id="canvas1"></canvas>
          <canvas id="canvas2"></canvas>

          <video autoPlay muted controls>
            <source
              src={URL.createObjectURL(selectedFile)}
              type={selectedFile.type}
            />
            Your browser does not support the video tag.
          </video>
        </div>
      )}
      <p id="message">---</p>
      <select id="distance" onChange={handleRange}>
        <option value="all" defaultValue>
          All
        </option>
        <option value="near">Near</option>
      </select>
      <div style={{ display: "flex" }}>
        {/* <select id="source"> */}
        {/* <option value="webcam">Webcam</option> */}
        {/* <option value="file">File</option> */}
        {/* </select> */}
        <input
          id="file"
          type="file"
          accept="video/mp4,video/mkv, video/x-m4v,video/*"
          onChange={handleFile}
        />
      </div>
    </>
  );
};

export default App;
