import React from "react";
import { useEffect } from "react";
import axiosInstance from "../lib/axios";
import { useState } from "react";
import { useParams } from "react-router";
function NoteDetailPage() {
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchNoteDetail = async () => {
      try {
        const response = await axiosInstance.get(`notes/${id}`);
        setNote(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching note detail:", error);
      } finally {
        setError(error);
        setLoading(false);
      }
    };

    fetchNoteDetail();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await axiosInstance.put(`notes/${id}`, {
        title: note.title,
        content: note.content,
      });
      alert("Note updated successfully!");
    } catch (error) {
      console.error("Error updating note:", error);
      alert("Failed to update note.");
    } finally {
      setSaving(false);
    }
  };
  console.log("Note detail:", note);
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
      {loading ? (
        <p className="text-gray-500 dark:text-gray-400">Loading...</p>
      ) : note ? (
        <div className="w-full max-w-3xl bg-white dark:bg-gray-800 shadow-2xl rounded-2xl p-8">
          <h1 className="text-4xl font-bold mb-8 text-gray-900 dark:text-white text-center">
            Edit Note
          </h1>

          <form onSubmit={handleUpdate} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Title
              </label>

              <input
                type="text"
                value={note.title}
                onChange={(e) => setNote({ ...note, title: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Content
              </label>

              <textarea
                value={note.content}
                onChange={(e) => setNote({ ...note, content: e.target.value })}
                rows={10}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition"
            >
              Save Changes
            </button>
          </form>
        </div>
      ) : (
        <p className="text-red-500 dark:text-red-400">Note not found.</p>
      )}
    </div>
  );
}

export default NoteDetailPage;
