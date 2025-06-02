import React, { useState } from "react";
import StoryEditor from "./story-editor/Editor";

// Sample story data
const initialStory = {
  scenes: {
    start: {
      text: "You arrive at the party. Who do you want to talk to?",
      choices: [
        { text: "Talk to Alex", nextScene: "alex" },
        { text: "Talk to Sam", nextScene: "sam" }
      ]
    },
    alex: {
      text: "Alex smiles at you. How do you respond?",
      choices: [
        { text: "Smile back", nextScene: "happyEnding" },
        { text: "Ignore", nextScene: "sadEnding" }
      ]
    },
    sam: {
      text: "Sam looks busy. What do you do?",
      choices: [
        { text: "Say hello", nextScene: "happyEnding" },
        { text: "Walk away", nextScene: "sadEnding" }
      ]
    },
    happyEnding: {
      text: "You had a great time at the party! The End.",
      choices: []
    },
    sadEnding: {
      text: "You missed a chance to make a connection. The End.",
      choices: []
    }
  }
};

const skinColors = ["#fcd7b6", "#b56a42", "#4a2c18"];
const hairstyles = ["Short", "Long", "Curly"];

function Character({ skinColor, hairstyle }) {
  const hairStyleColors = {
    Short: "black",
    Long: "brown",
    Curly: "darkred"
  };

  return (
    <div className="character">
      <div
        className="character-skin"
        style={{ backgroundColor: skinColor }}
      >
        <div
          className="character-hair"
          style={{
            height:
              hairstyle === "Short" ? 20 : hairstyle === "Long" ? 40 : 30,
            backgroundColor: hairStyleColors[hairstyle],
            borderRadius: hairstyle === "Curly" ? "50%" : "10px"
          }}
        />
      </div>
      <div>{hairstyle} Hair</div>
    </div>
  );
}

export default function App() {
  const [story, setStory] = useState(initialStory);
  const [currentSceneKey, setCurrentSceneKey] = useState("start");
  const [editorMode, setEditorMode] = useState(false);
  const [skinColor, setSkinColor] = useState(skinColors[0]);
  const [hairstyle, setHairstyle] = useState(hairstyles[0]);

  const scene = story.scenes[currentSceneKey];

  return (
    <div className="container">
      <h1>Interactive Story</h1>
      <button
        className="mode-button"
        onClick={() => setEditorMode(!editorMode)}
      >
        {editorMode ? "View Story" : "Edit Story"}
      </button>

      {editorMode ? (
        <StoryEditor story={story} setStory={setStory} />
      ) : (
        <>
          {/* Character Customization */}
          <div className="customization">
            <h2>Customize Character</h2>
            <Character skinColor={skinColor} hairstyle={hairstyle} />
            <div className="form-group">
              <label>Skin Color:</label>
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
            </div>

            <div className="form-group">
              <label>Hairstyle:</label>
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
            </div>
          </div>

          {/* Story Display */}
          <div className="story-box">
            <p className="story-text">{scene.text}</p>
            <div className="choices">
              {scene.choices.length > 0 ? (
                scene.choices.map((choice, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSceneKey(choice.nextScene)}
                    className="choice-button"
                  >
                    {choice.text}
                  </button>
                ))
              ) : (
                <button
                  onClick={() => setCurrentSceneKey("start")}
                  className="choice-button"
                >
                  Restart
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
