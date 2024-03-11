import { useEffect, useRef, useState } from "react";
import { roboflow } from "./js/roboflow";
import "./App.css";
import { drawRect } from "./js/detection";

const App = () => {
  const [range, setRange] = useState("all");
  const [msg, setMsg] = useState(" - - - ");
  const [selectedFile, setSelectedFile] = useState(null);
  const [width, setWidth] = useState(640);
  const [height, setHeight] = useState(480);
  const [model, setModel] = useState();
  const [pause, setPause] = useState(false);
  const [ranges, setRanges] = useState({
    person: {
      near: 25,
      warning: 40,
      danger: 45,
    },
    pile: {
      near: 25,
      warning: 40,
      danger: 45,
    },
    crane: {
      near: 25,
      warning: 40,
      danger: 45,
    },
  });
  const videoRef = useRef();
  const cnvRef = useRef();
  const cnvRef2 = useRef();
  let interval;

  const handleRange = (e) => {
    setRange(e.target.value);
    console.log(e.target.value);
  };

  const handleFile = (e) => {
    const file = e.target.files[0]; // Get the first selected file
    setSelectedFile(file);
    console.log(file);
  };

  const handleRemove = () => {
    setSelectedFile();
  };

  const handlePause = () => {
    if (!pause) {
      clearInterval(interval);
    }
    setPause((s) => !s);
  };

  const handleMetadata = () => {
    const wd = videoRef.current.videoWidth;
    const ht = videoRef.current.videoHeight;
    cnvRef.current.height = ht;
    cnvRef.current.width = wd;
    cnvRef2.current.height = ht;
    cnvRef2.current.width = wd;
    setWidth(wd);
    setHeight(ht);
  };

  useEffect(() => {
    setMsg("... loading model");

    try {
      // eslint-disable-next-line no-undef
      roboflow
        .auth({
          publishable_key: "rf_5w20VzQObTXjJhTjq6kad9ubrm33",
        })
        .load({
          // model: "trees-88tmr",
          model: "rocks-kmf7f",
          version: 2,
        })
        .then(function (mdl) {
          setMsg("... model ready");
          setModel(mdl);
        })
        .catch((e) => {
          setMsg("... error while loading model");
          console.log(e);
        });
    } catch (error) {
      setMsg(`... ${error.message}`);
      console.log(error);
    }
  }, []);

  useEffect(() => {
    if (model && !pause) {
      interval = setInterval(() => {
        try {
          model.detect(videoRef.current).then(function (predictions) {
            const ctx = cnvRef.current.getContext("2d");
            drawRect(predictions, ctx, width, height, range, ranges, cnvRef2);
          });
        } catch (error) {
          console.log(error);
        }
      }, 1000);
    }
    return () => {
      clearInterval(interval);
    };
  }, [model, range, pause]);

  return (
    <>
      {selectedFile && (
        <div style={{ position: "relative" }} id="layer">
          <canvas ref={cnvRef}></canvas>
          <canvas ref={cnvRef2}></canvas>

          <video
            autoPlay
            muted
            controls
            ref={videoRef}
            onLoadedMetadata={handleMetadata}
          >
            <source
              src={URL.createObjectURL(selectedFile)}
              type={selectedFile.type}
            />
            Your browser does not support the video tag.
          </video>
        </div>
      )}

      <br />
      <br />
      {!selectedFile && (
        <>
          <h1>Object detector validator</h1>
          <p id="message">{msg}</p>

          <div style={{ display: "flex", justifyContent: "center" }}>
            <input
              id="file"
              type="file"
              accept="video/mp4,video/mkv, video/x-m4v,video/*"
              onChange={handleFile}
            />
          </div>
        </>
      )}
      <br />

      {selectedFile && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "1em",
          }}
        >
          <select id="distance" onChange={handleRange}>
            <option value="all" defaultValue>
              All
            </option>
            <option value="near">Near</option>
          </select>
          <button onClick={handlePause}>{pause ? "Resume" : "Pause"}</button>
          <button onClick={handleRemove}>Change file</button>
        </div>
      )}
    </>
  );
};

export default App;
