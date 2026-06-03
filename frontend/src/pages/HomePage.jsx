import React from "react";
import Navbar from "../components/Navbar";
import { useState, useEffect } from "react";
import RateLimitedUI from "../components/RateLimitedUI";
import axios from "axios";
import AIChatUI from "../components/AIChatUI";
import axiosInstance from "../lib/axios";
import { toast } from "react-hot-toast";
function HomePage() {
  const [isRatelimited, setRatelimited] = useState(false);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await axiosInstance.get("notes");
        if (response.status === 429) {
          setRatelimited(true);
        }
        const data = response.data;
        setNotes(data.notes);
      } catch (error) {
        console.error("Error fetching notes:", error);

        if (error.response?.status === 429) {
          setRatelimited(true);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, []);
  const handleDelete = async (e, id) => {
    e.preventDefault();
    if (!window.confirm("Are you sure you want to delete this note?")) return;

    try {
      await axiosInstance.delete(`notes/${id}`);
      setNotes((prev) => prev.filter((note) => note._id !== id));
      toast.success("Note deleted successfully!");
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };
  return (
    <>
      <div className="min-h-screen bg-zinc-950 text-white">
        <Navbar />

        {isRatelimited && (
          <div className="max-w-7xl mx-auto px-6 pt-6">
            <RateLimitedUI />
          </div>
        )}

        <div className="max-w-7xl mx-auto px-6 py-12">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">
            <div>
              <h1 className="text-4xl font-bold tracking-tight">My Notes</h1>
              <p className="text-zinc-400 mt-2">
                Organize and manage your notes easily.
              </p>
            </div>
          </div>

          {/* Loading */}
          {loading ? (
            <div className="flex items-center justify-center py-32">
              <div className="h-12 w-12 rounded-full border-4 border-zinc-700 border-t-emerald-500 animate-spin"></div>
            </div>
          ) : notes.length === 0 ? (
            /* Empty State */
            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-12 text-center">
              <h2 className="text-2xl font-semibold mb-2">No notes yet</h2>
              <p className="text-zinc-400">
                Create your first note to get started.
              </p>
            </div>
          ) : (
            /* Notes Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {notes.map((note) => (
                <div
                  key={note._id}
                  className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 hover:border-emerald-500/40 transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 text-xl">
                      📝
                    </div>

                    <span className="text-xs bg-zinc-800 px-3 py-1 rounded-full text-zinc-400">
                      Note
                    </span>
                  </div>

                  <h2 className="text-xl font-semibold mb-3 line-clamp-1">
                    {note.title}
                  </h2>

                  <p className="text-zinc-400 leading-relaxed line-clamp-4">
                    {note.content}
                  </p>

                  <div className="flex items-center justify-between mt-6 pt-4 border-t border-zinc-800">
                    <a
                      href={`/note/${note._id}`}
                      className="text-sm text-emerald-400 hover:text-emerald-300 transition"
                    >
                      View Details
                    </a>

                    <button
                      onClick={(e) => handleDelete(e, note._id)}
                      className="text-sm text-red-400 hover:text-red-300 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <AIChatUI />
    </>
  );
}

export default HomePage;
