import React, { useState } from "react";
import StoryEditor from "./story-editor/Editor";

// Simple character customization options
const skinColors = ["#fcd7b6", "#b56a42", "#4a2c18"];
const hairstyles = ["Short", "Long", "Curly"];

function Character({ skinColor, hairstyle }) {
  const hairStyleColors = {
    Short: "black",
    Long: "brown",
    Curly: "darkred",
  };

  return (
    <div style={{ textAlign: "center", marginBottom: 20 }}>
      <div
        style={{
          width: 100,
          height: 100,
          borderRadius: "50%",
          backgroundColor: skinColor,
          margin: "0 auto",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 10,
            left: 10,
            right: 10,
            height:
              hairstyle === "Short" ? 20 : hairstyle === "Long" ? 40 : 30,
            backgroundColor: hairStyleColors[hairstyle],
            borderRadius: hairstyle === "Curly" ? "50%" : "10px",
          }}
        />
      </div>
      <div>{hairstyle} Hair</div>
    </div>
  );
}

export default function InteractiveStory() {
  const [storyData, setStoryData] = useState({
    scenes: {
      start: {
        text: "You arrive at the party. Who do you want to talk to?",
        choices: [
          { text: "Talk to Alex", nextScene: "alex" },
          { text: "Talk to Sam", nextScene: "sam" },
        ],
      },
      alex: {
        text: "Alex smiles at you. How do you respond?",
        choices: [
          { text: "Smile back", nextScene: "happyEnding" },
          { text: "Ignore", nextScene: "sadEnding" },
        ],
      },
      sam: {
        text: "Sam looks busy. What do you do?",
        choices: [
          { text: "Say hello", nextScene: "happyEnding" },
          { text: "Walk away", nextScene: "sadEnding" },
        ],
      },
      happyEnding: {
        text: "You had a great time at the party! The End.",
        choices: [],
      },
      sadEnding: {
        text: "You missed a chance to make a connection. The End.",
        choices: [],
      },
    },
  });

  const [currentSceneKey, setCurrentSceneKey] = useState("start");
  const [editorMode, setEditorMode] = useState(false);

  // Character customization state
  const [skinColor, setSkinColor] = useState(skinColors[0]);
  const [hairstyle, setHairstyle] = useState(hairstyles[0]);

  const scene = storyData.scenes[currentSceneKey];

  return (
    <div style={{ maxWidth: 600, margin: "auto", fontFamily: "Arial, sans-serif" }}>
      <h1>Interactive Story Prototype</h1>
      <button
        onClick={() => setEditorMode(!editorMode)}
        style={{
          marginBottom: 20,
          padding: "10px 15px",
          cursor: "pointer",
          backgroundColor: "#007bff",
          color: "#fff",
          border: "none",
          borderRadius: 5,
        }}
      >
        {editorMode ? "View Story" : "Edit Story"}
      </button>
      {editorMode ? (
        <StoryEditor story={storyData} setStory={setStoryData} />
      ) : (
        <>
          {/* Character Customization */}
          <div style={{ marginBottom: 40 }}>
            <h2>Customize your character</h2>
            <Character skinColor={skinColor} hairstyle={hairstyle} />

            <div>
              <label>
                Skin Color:{" "}
                <select
                  value={skinColor}
                  onChange={(e) => setSkinColor(e.target.value)}
                >
                  {skinColors.map((color) => (
                    <option key={color} value={color}>
                      {color}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div style={{ marginTop: 10 }}>
              <label>
                Hairstyle:{" "}
                <select
                  value={hairstyle}
                  onChange={(e) => setHairstyle(e.target.value)}
                >
                  {hairstyles.map((style) => (
                    <option key={style} value={style}>
                      {style}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          {/* Story Display */}
          <div
            style={{
              border: "2px solid #ccc",
              borderRadius: 10,
              padding: 20,
              backgroundColor: "#fafafa",
            }}
          >
            <p style={{ fontSize: 18 }}>{scene.text}</p>

            <div>
              {scene.choices.length > 0 ? (
                scene.choices.map((choice, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentSceneKey(choice.nextScene)}
                    style={{
                      margin: "10px 10px 0 0",
                      padding: "10px 15px",
                      cursor: "pointer",
                    }}
                  >
                    {choice.text}
                  </button>
                ))
              ) : (
                <button onClick={() => setCurrentSceneKey("start")}>Restart</button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
