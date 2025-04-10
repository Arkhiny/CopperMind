// NotePage.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Note from "../components/Note";
import CreateArea from "../components/CreateArea";

function NotePage({ activeUser }) {
  const [notes, setNotes] = useState([]);

  // Fetch notes for the active user when the component mounts or when activeUser changes
  useEffect(() => {
    if (activeUser && activeUser.id) {
      axios
        .get(`http://localhost:5000/api/auth/notes/user/${activeUser.id}`)
        .then((response) => {
          // Assume the backend returns { notes: [ ... ] }
          setNotes(response.data.notes);
        })
        .catch((error) => {
          console.error("Error fetching notes:", error);
        });
    }
  }, [activeUser]);

  // Called immediately when a note is created locally
  const addNote = (newNote) => {
    setNotes((prevNotes) => [...prevNotes, newNote]);
  };

  // When the backend responds, update the note with the temporary ID with the saved note data
  const updateNoteByTempId = (tempId, savedNote) => {
    setNotes((prevNotes) =>
      prevNotes.map((note) =>
        note.id === tempId ? savedNote : note
      )
    );
  };

  const deleteNote = (id) => {
    axios
      .delete(`http://localhost:5000/api/auth/notes/${id}`)
      .then(() => {
        setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id));
      })
      .catch((error) => {
        console.error("Error deleting note:", error);
      });
  };

  return (
    <div>
      <Header />
      <CreateArea
        onAdd={addNote}
        onUpdateNote={updateNoteByTempId}
        activeUser={activeUser}
      />
      {notes.map((noteItem) => (
        <Note
          key={noteItem.id}
          id={noteItem.id}
          title={noteItem.title}
          content={noteItem.content}
          onDelete={deleteNote}
        />
      ))}
      <Footer />
    </div>
  );
}

export default NotePage;