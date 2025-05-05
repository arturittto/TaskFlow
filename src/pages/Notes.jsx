// src/pages/Notes.jsx
import { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
  where
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function Notes() {
  const [notes, setNotes] = useState([]);
  const [noteInput, setNoteInput] = useState("");
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (!currentUser) {
        navigate("/login");
      } else {
        setUser(currentUser);
      }
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "notes"),
      where("uid", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      setNotes(notesData);
    });

    return unsubscribe;
  }, [user]);

  const addNote = async () => {
    if (noteInput.trim() === "") return;

    await addDoc(collection(db, "notes"), {
      uid: user.uid,
      text: noteInput,
      createdAt: new Date()
    });

    setNoteInput("");
  };

  const deleteNote = async (id) => {
    await deleteDoc(doc(db, "notes", id));
  };

  return (
    <div className="min-h-screen p-6 bg-white dark:bg-gray-900 text-black dark:text-white transition">
      <h1 className="text-2xl font-bold mb-4">Your Notes</h1>

      <div className="flex gap-2 mb-4">
        <input
          className="border p-2 flex-1 rounded dark:bg-gray-800"
          placeholder="Write a note..."
          value={noteInput}
          onChange={(e) => setNoteInput(e.target.value)}
        />
        <button
          onClick={addNote}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add
        </button>
      </div>

      <ul className="space-y-3">
        {notes.map((note) => (
          <li
            key={note.id}
            className="p-3 bg-gray-100 dark:bg-gray-800 rounded flex justify-between"
          >
            <span>{note.text}</span>
            <button
              onClick={() => deleteNote(note.id)}
              className="text-red-500 text-sm"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}