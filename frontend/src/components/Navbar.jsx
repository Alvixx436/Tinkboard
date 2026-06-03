import React from "react";
import { Link } from "react-router";

function Navbar() {
  return (
    <header className="bg-base-100 shadow">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <h1 className="text-xl font-bold">My App</h1>
        <Link to="/create" className="btn btn-primary">
          Create Note
        </Link>
      </div>
    </header>
  );
}

export default Navbar;
