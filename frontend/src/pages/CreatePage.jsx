import React, { useState } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";
import { Link } from "react-router";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router";
import axiosInstance from "../lib/axios";
function CreatePage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    content: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.content) {
      toast.error("Please fill in all fields.");
      return;
    }

    try {
      setLoading(true);
      await axiosInstance.post("notes", formData);
      toast.success("Note created successfully!");
      navigate("/");
    } catch (error) {
      if (error.response?.status === 429) {
        toast.error("You are being rate limited. Please wait and try again.");
      } else {
        toast.error("An error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Link to="/" className="block p-6 max-w-7xl mx-auto">
        Back to Home
      </Link>

      <div className="max-w-3xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold tracking-tight">Create Note</h1>

          <p className="text-zinc-400 mt-2">
            Write down your thoughts, ideas, and reminders.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Note Title
              </label>

              <input
                type="text"
                name="title"
                placeholder="Enter note title..."
                value={formData.title}
                onChange={handleChange}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-4 py-4 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
              />
            </div>

            {/* Content */}
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Note Content
              </label>

              <textarea
                name="content"
                rows="8"
                placeholder="Write your note here..."
                value={formData.content}
                onChange={handleChange}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-4 py-4 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition resize-none"
              ></textarea>
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-end gap-4 pt-4">
              <button
                type="button"
                onClick={() => navigate("/")}
                className="px-6 py-3 rounded-2xl border border-zinc-700 text-zinc-300 hover:bg-zinc-800 transition"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-semibold transition flex items-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <div className="h-4 w-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                    Saving...
                  </>
                ) : (
                  "Create Note"
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Bottom Decoration */}
        <div className="mt-8 text-center text-sm text-zinc-500">
          Your notes are stored securely.
        </div>
      </div>
    </div>
  );
}

export default CreatePage;
