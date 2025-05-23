// CreateArea.jsx
import React, { useState } from "react";
import axios from "axios";
import { FaPlus } from "react-icons/fa";

function CreateArea({ onAdd, onUpdateNote, activeUser }) {
  const [isExpanded, setExpanded] = useState(false);
  const [note, setNote] = useState({
    title: "",
    content: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setNote((prevNote) => ({
      ...prevNote,
      [name]: value,
    }));
  };

  const submitNote = (event) => {
    event.preventDefault();

    if (!activeUser || !activeUser.id) {
      console.error("No active user found. Please log in.");
      return;
    }

    // Create a temporary note object with a temporary ID (using Date.now())
    const tempId = Date.now();
    const optimisticNote = {
      id: tempId,
      title: note.title,
      content: note.content,
    };

    // Update the UI immediately by adding the note locally
    onAdd(optimisticNote);
    // Clear the form fields
    setNote({ title: "", content: "" });

    // Prepare note data to send to the backend.
    // IMPORTANT: Use "userId" (camelCase) so that the backend receives all required fields.
    const noteData = {
      userId: activeUser.id,
      title: optimisticNote.title,
      content: optimisticNote.content,
    };

    console.log("Active user:", activeUser);
    console.log("Note being sent:", noteData);

    axios
      .post("http://localhost:5000/api/auth/notes", noteData)
      .then((response) => {
        // Expect the backend to return the saved note, for example:
        // { note: { id: 123, user_id: 14, title: 'Test Note', content: '...', created_at: '...' } }
        const savedNote = response.data.note;
        // Replace the optimistic note in the UI with the saved note from the backend
        onUpdateNote(tempId, savedNote);
      })
      .catch((error) => {
        console.error(
          "Error saving note:",
          error.response?.data || error.message
        );
        // Optionally remove the optimistic note from the UI or mark it as failed.
      });
  };

  const expand = () => {
    setExpanded(true);
  };

  return (
    <div data-testid="create-area-container">
      <form
        className="create-note"
        data-testid="create-area-form"
        onSubmit={submitNote}
      >
        {isExpanded && (
          <input
            name="title"
            onChange={handleChange}
            value={note.title}
            placeholder="Title"
            data-testid="create-area-title"
          />
        )}
        <textarea
          name="content"
          onClick={expand}
          onChange={handleChange}
          value={note.content}
          placeholder="Take a note..."
          rows={isExpanded ? 3 : 1}
          data-testid="create-area-content"
        />
        {isExpanded && (
          <button
            type="submit"
            className="add-button"
            data-testid="create-area-submit"
          >
            <FaPlus />
          </button>
        )}
      </form>
    </div>
  );
}

export default CreateArea;