// NotePage.test.jsx
import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import NotePage from "../pages/NotePage"; // Adjust the path if necessary.
import axios from "axios";
import { BrowserRouter } from "react-router-dom";

// ---------------------------------------------------------------------
// Mock Child Components to focus on NotePage logic
// ---------------------------------------------------------------------
vi.mock("../../components/Header", () => ({
  default: () => <header data-testid="header"><h1><span>🔥</span> CopperMind</h1></header>
}));
vi.mock("../../components/Footer", () => ({
  default: () => <div data-testid="footer">Footer</div>
}));
vi.mock("../../components/CreateArea", () => ({
  default: (props) => <div data-testid="create-area">CreateArea</div>
}));
vi.mock("../../components/Note", () => ({
  default: ({ id, title, content, onDelete }) => (
    <div data-testid="note">
      <div>{title}</div>
      <div>{content}</div>
      <button onClick={() => onDelete(id)}>Delete</button>
    </div>
  ),
}));

// ---------------------------------------------------------------------
// Mock Axios so we don't perform real HTTP requests
// ---------------------------------------------------------------------
vi.mock("axios");

beforeEach(() => {
  vi.clearAllMocks();
});

describe("NotePage Component", () => {
  // Sample active user passed as prop
  const activeUser = { id: 1, name: "Test User", email: "test@example.com" };

  it("should fetch and render notes for the active user", async () => {
    const fakeNotes = [
      { id: 1, title: "Test Note 1", content: "Content 1" },
      { id: 2, title: "Test Note 2", content: "Content 2" }
    ];

    // Simulate a successful API call returning notes
    axios.get.mockResolvedValue({ data: { notes: fakeNotes } });

    render(
      <BrowserRouter>
        <NotePage activeUser={activeUser} />
      </BrowserRouter>
    );

    // Verify the correct API endpoint is called
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith(
        `http://localhost:5000/api/auth/notes/user/${activeUser.id}`
      );
    });

    // Check that the notes are rendered on screen
    expect(screen.getByText("Test Note 1")).toBeInTheDocument();
    expect(screen.getByText("Content 1")).toBeInTheDocument();
    expect(screen.getByText("Test Note 2")).toBeInTheDocument();
    expect(screen.getByText("Content 2")).toBeInTheDocument();

    // Also check that header and footer are rendered
    expect(screen.getByTestId("header")).toBeInTheDocument();
    expect(screen.getByTestId("footer")).toBeInTheDocument();
  });

  it("should delete a note when the delete button is clicked", async () => {
    const fakeNotes = [
      { id: 1, title: "Test Note 1", content: "Content 1" },
      { id: 2, title: "Test Note 2", content: "Content 2" }
    ];
    axios.get.mockResolvedValue({ data: { notes: fakeNotes } });
    axios.delete.mockResolvedValue({});

    render(
      <BrowserRouter>
        <NotePage activeUser={activeUser} />
      </BrowserRouter>
    );

    // Wait for the notes to load
    await waitFor(() => {
      expect(screen.getByText("Test Note 1")).toBeInTheDocument();
      expect(screen.getByText("Test Note 2")).toBeInTheDocument();
    });

    // Simulate clicking the delete button for the first note
    const deleteButtons = screen.getAllByRole("button", { name: /delete/i });
    expect(deleteButtons.length).toBeGreaterThan(0);
    fireEvent.click(deleteButtons[0]);

    // Ensure axios.delete was called with the correct endpoint
    await waitFor(() => {
      expect(axios.delete).toHaveBeenCalledWith(
        `http://localhost:5000/api/auth/notes/${fakeNotes[0].id}`
      );
    });

    // The first note should be removed from the UI
    await waitFor(() => {
      expect(screen.queryByText("Test Note 1")).not.toBeInTheDocument();
    });
    // The second note should still be visible
    expect(screen.getByText("Test Note 2")).toBeInTheDocument();
  });
});