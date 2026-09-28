import { useEffect, useState } from "react";

function App() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tag, setTag] = useState("");
  const [color, setColor] = useState("white");

  const [notes, setNotes] = useState([]);
  const [editId, setEditId] = useState(null);

  const [search, setSearch] = useState("");
  const [filterTag, setFilterTag] = useState("all");

  // Load notes from localStorage
  useEffect(() => {
    const savedNotes = localStorage.getItem("notes");

    if (savedNotes) {
      setNotes(JSON.parse(savedNotes));
    }
  }, []);

  // Save notes to localStorage
  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

  // Get note background color
  function getColor(color) {
    if (color === "yellow") return "bg-yellow-100";
    if (color === "green") return "bg-green-100";
    if (color === "blue") return "bg-blue-100";

    return "bg-white";
  }

  // Add or update note
  function addNote() {
    // Content validation
    if (content.trim() === "") {
      alert("Content is required");
      return;
    }

    // Title validation
    if (title.length > 100) {
      alert("Title cannot exceed 100 characters");
      return;
    }

    // Update existing note
    if (editId !== null) {
      setNotes(
        notes.map((note) => {
          if (note.id === editId) {
            return {
              ...note,
              title: title,
              content: content,
              tag: tag,
              color: color,
              updatedAt: new Date().toLocaleString(),
            };
          }

          return note;
        })
      );

      clearForm();
      return;
    }

    // Create new note
    const newNote = {
      id: Date.now(),
      title: title,
      content: content,
      tag: tag,
      color: color,
      createdAt: new Date().toLocaleString(),
    };

    setNotes([...notes, newNote]);

    clearForm();
  }

  // Clear form
  function clearForm() {
    setTitle("");
    setContent("");
    setTag("");
    setColor("white");
    setEditId(null);
  }

  // Delete note
  function deleteNote(id) {
    setNotes(
      notes.filter((note) => note.id !== id)
    );
  }

  // Edit note
  function editNote(id) {
    const note = notes.find((note) => note.id === id);

    if (!note) return;

    setTitle(note.title);
    setContent(note.content);
    setTag(note.tag || "");
    setColor(note.color || "white");
    setEditId(id);
  }

  // Search + tag filter
  const filteredNotes = notes
    .filter((note) =>
      note.title
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      note.content
        .toLowerCase()
        .includes(search.toLowerCase())
    )
    .filter((note) =>
      filterTag === "all" ||
      note.tag === filterTag
    );

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      {/* Heading */}
      <h1 className="text-4xl font-bold text-center mb-8">
        Keep Notes
      </h1>

      {/* Form */}
      <div className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow">

        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border p-3 rounded mb-3"
        />

        <p className="text-sm text-gray-500 mb-2">
          {title.length}/100
        </p>

        <textarea
          placeholder="Write a note..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full border p-3 rounded mb-3 h-32"
        />

        <input
          type="text"
          placeholder="Tag"
          value={tag}
          onChange={(e) => setTag(e.target.value)}
          className="w-full border p-3 rounded mb-3"
        />

        <select
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="w-full border p-3 rounded mb-4"
        >
          <option value="white">White</option>
          <option value="yellow">Yellow</option>
          <option value="green">Green</option>
          <option value="blue">Blue</option>
        </select>

        <div className="flex gap-2">

          <button
            onClick={addNote}
            className="bg-blue-500 text-white px-5 py-2 rounded hover:bg-blue-600"
          >
            {editId !== null ? "Update Note" : "Add Note"}
          </button>

          {editId !== null && (
            <button
              onClick={clearForm}
              className="bg-gray-500 text-white px-5 py-2 rounded"
            >
              Cancel
            </button>
          )}

        </div>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search notes..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full max-w-xl mx-auto block border p-3 rounded mt-8"
      />

      {/* Tag Filter */}
      <select
        value={filterTag}
        onChange={(e) => setFilterTag(e.target.value)}
        className="w-full max-w-xl mx-auto block border p-3 rounded mt-3"
      >
        <option value="all">All Tags</option>
        <option value="work">Work</option>
        <option value="study">Study</option>
        <option value="personal">Personal</option>
      </select>

      {/* Notes */}
      <div className="max-w-6xl mx-auto mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

        {filteredNotes.map((note) => (

          <div
            key={note.id}
            className={`${getColor(note.color)} p-5 rounded-lg shadow`}
          >

            <h2 className="font-bold text-xl">
              {note.title || "Untitled"}
            </h2>

            <p className="mt-2">
              {note.content}
            </p>

            <p className="text-sm text-gray-600 mt-3">
              Tag: {note.tag || "No tag"}
            </p>

            <p className="text-xs text-gray-500 mt-2">
              Created: {note.createdAt}
            </p>

            {note.updatedAt && (
              <p className="text-xs text-gray-500 mt-1">
                Updated: {note.updatedAt}
              </p>
            )}

            <div className="flex gap-2 mt-4">

              <button
                onClick={() => editNote(note.id)}
                className="bg-yellow-500 text-white px-3 py-1 rounded"
              >
                Edit
              </button>

              <button
                onClick={() => deleteNote(note.id)}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Delete
              </button>

            </div>

          </div>

        ))}

      </div>

      {/* Empty state */}
      {filteredNotes.length === 0 && (
        <p className="text-center text-gray-500 mt-10">
          No notes found.
        </p>
      )}

    </div>
  );
}

export default App;