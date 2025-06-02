import React from "react";

export default function StoryEditor({ story, setStory }) {
  const [currentSceneKey, setCurrentSceneKey] = React.useState("start");

  const scene = story.scenes[currentSceneKey];

  // Update scene text
  const updateSceneText = (text) => {
    setStory((prev) => ({
      ...prev,
      scenes: {
        ...prev.scenes,
        [currentSceneKey]: {
          ...prev.scenes[currentSceneKey],
          text,
        },
      },
    }));
  };

  // Update choice text or nextScene
  const updateChoice = (index, field, value) => {
    setStory((prev) => {
      const updatedChoices = [...prev.scenes[currentSceneKey].choices];
      updatedChoices[index] = {
        ...updatedChoices[index],
        [field]: value,
      };
      return {
        ...prev,
        scenes: {
          ...prev.scenes,
          [currentSceneKey]: {
            ...prev.scenes[currentSceneKey],
            choices: updatedChoices,
          },
        },
      };
    });
  };

  // Add a new choice
  const addChoice = () => {
    setStory((prev) => ({
      ...prev,
      scenes: {
        ...prev.scenes,
        [currentSceneKey]: {
          ...prev.scenes[currentSceneKey],
          choices: [...prev.scenes[currentSceneKey].choices, { text: "", nextScene: "" }],
        },
      },
    }));
  };

  // Delete a choice
  const deleteChoice = (index) => {
    setStory((prev) => {
      const updatedChoices = [...prev.scenes[currentSceneKey].choices];
      updatedChoices.splice(index, 1);
      return {
        ...prev,
        scenes: {
          ...prev.scenes,
          [currentSceneKey]: {
            ...prev.scenes[currentSceneKey],
            choices: updatedChoices,
          },
        },
      };
    });
  };

  // Add a new scene
  const addScene = () => {
    const existingKeys = Object.keys(story.scenes);
    let newKeyBase = "scene";
    let i = 1;
    while (existingKeys.includes(newKeyBase + i)) {
      i++;
    }
    const newKey = newKeyBase + i;

    setStory((prev) => ({
      ...prev,
      scenes: {
        ...prev.scenes,
        [newKey]: { text: "New scene text", choices: [] },
      },
    }));

    setCurrentSceneKey(newKey);
  };

  // Delete a scene (cannot delete 'start')
  const deleteScene = (key) => {
    if (key === "start") {
      alert("Cannot delete the start scene.");
      return;
    }

    setStory((prev) => {
      const newScenes = { ...prev.scenes };
      delete newScenes[key];

      // Remove any choices pointing to deleted scene
      Object.keys(newScenes).forEach((sceneKey) => {
        newScenes[sceneKey].choices = newScenes[sceneKey].choices.filter(
          (choice) => choice.nextScene !== key
        );
      });

      return { ...prev, scenes: newScenes };
    });

    if (currentSceneKey === key) {
      setCurrentSceneKey("start");
    }
  };

  // Export story JSON
  const exportJSON = () => {
    const jsonStr = JSON.stringify(story, null, 2);
    navigator.clipboard.writeText(jsonStr);
    alert("Story JSON copied to clipboard!");
  };

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "Arial, sans-serif" }}>
      {/* Sidebar */}
      <div
        style={{
          width: 250,
          borderRight: "2px solid #ccc",
          padding: 20,
          overflowY: "auto",
        }}
      >
        <h2>Scenes</h2>
        <button onClick={addScene} style={{ marginBottom: 15 }}>
          + Add Scene
        </button>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {Object.entries(story.scenes).map(([key]) => (
            <li key={key} style={{ marginBottom: 8, display: "flex", alignItems: "center" }}>
              <button
                onClick={() => setCurrentSceneKey(key)}
                style={{
                  fontWeight: key === currentSceneKey ? "bold" : "normal",
                  cursor: "pointer",
                  width: "100%",
                  textAlign: "left",
                  padding: "6px 10px",
                  border: "none",
                  backgroundColor: key === currentSceneKey ? "#ddd" : "transparent",
                }}
              >
                {key}
              </button>
              {key !== "start" && (
                <button
                  onClick={() => deleteScene(key)}
                  style={{
                    marginLeft: 10,
                    color: "red",
                    cursor: "pointer",
                    border: "none",
                    background: "none",
                    fontWeight: "bold",
                    fontSize: 18,
                    lineHeight: 1,
                  }}
                  title="Delete scene"
                >
                  ×
                </button>
              )}
            </li>
          ))}
        </ul>

        <button onClick={exportJSON} style={{ marginTop: 20 }}>
          Export Story JSON
        </button>
      </div>

      {/* Main editor */}
      <div style={{ flex: 1, padding: 20, overflowY: "auto" }}>
        <h2>Editing Scene: {currentSceneKey}</h2>
        <div>
          <label>
            Scene Text:
            <textarea
              value={scene.text}
              onChange={(e) => updateSceneText(e.target.value)}
              rows={5}
              style={{ width: "100%", marginTop: 5, fontSize: 16 }}
            />
          </label>
        </div>

        <div style={{ marginTop: 20 }}>
          <h3>Choices</h3>
          {scene.choices.length === 0 && <p>No choices yet.</p>}
          {scene.choices.map((choice, i) => (
            <div
              key={i}
              style={{
                marginBottom: 15,
                padding: 10,
                border: "1px solid #ccc",
                borderRadius: 5,
                display: "flex",
                gap: 10,
                alignItems: "center",
              }}
            >
              <input
                type="text"
                placeholder="Choice text"
                value={choice.text}
                onChange={(e) => updateChoice(i, "text", e.target.value)}
                style={{ flex: 2, fontSize: 16 }}
              />
              <input
                type="text"
                placeholder="Next scene key"
                value={choice.nextScene}
                onChange={(e) => updateChoice(i, "nextScene", e.target.value)}
                style={{ flex: 1, fontSize: 16 }}
              />
              <button onClick={() => deleteChoice(i)} style={{ cursor: "pointer" }}>
                Delete
              </button>
            </div>
          ))}

          <button onClick={addChoice}>+ Add Choice</button>
        </div>
      </div>
    </div>
  );
}
