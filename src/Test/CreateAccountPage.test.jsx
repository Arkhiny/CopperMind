// LoginPage.test.jsx
// import React from 'react';
// import { describe, it, expect, vi, bef
// // CreateAccountPage.test.jsx
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CreateAccountPage from '../pages/CreateAccount.jsx'; // Adjust the relative path as needed.
import axios from 'axios';
import { BrowserRouter } from 'react-router-dom';

// -------------------------
// Mocking Axios
// -------------------------
vi.mock('axios');

// -------------------------
// Mocking useNavigate from react-router-dom for navigation tracking
// -------------------------
const mockedUsedNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockedUsedNavigate,
  };
});

// Clear mocks before each test
beforeEach(() => {
  vi.clearAllMocks();
});

describe('CreateAccountPage Component', () => {
  // Test: Input field updates for name, email, and password.
  it('should update name, email, and password inputs correctly', () => {
    render(
      <BrowserRouter>
        <CreateAccountPage />
      </BrowserRouter>
    );

    // Locate the input fields by their placeholder texts.
    const nameInput = screen.getByPlaceholderText(/nome/i);
    const emailInput = screen.getByPlaceholderText(/email/i);
    const passwordInput = screen.getByPlaceholderText(/senha/i);

    // Simulate user typing valid data.
    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'StrongPass1!' } });

    // Assert that the inputs display the provided values.
    expect(nameInput.value).toBe('John Doe');
    expect(emailInput.value).toBe('john@example.com');
    expect(passwordInput.value).toBe('StrongPass1!');
  });

  // Test: Toggling password visibility.
  it('should toggle password visibility when clicking the eye icon', () => {
    // Render the component and capture the container to query non-accessible elements.
    const { container } = render(
      <BrowserRouter>
        <CreateAccountPage />
      </BrowserRouter>
    );

    const passwordInput = screen.getByPlaceholderText(/senha/i);
    // Initially, the password should be hidden.
    expect(passwordInput).toHaveAttribute('type', 'password');

    // Find the toggle button using its role attribute.
    const toggleButton = container.querySelector('span[role="button"]');
    expect(toggleButton).toBeDefined();

    // Click to show the password, then verify that the input type switches.
    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'text');

    // Click again to hide the password.
    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  // Test: Successful registration submission.
  it('should submit registration data and navigate to "/note" on successful registration', async () => {
    // Prepare Axios to resolve the registration.
    axios.post.mockResolvedValue({});

    render(
      <BrowserRouter>
        <CreateAccountPage />
      </BrowserRouter>
    );

    // Find inputs and the submission button.
    const nameInput = screen.getByPlaceholderText(/nome/i);
    const emailInput = screen.getByPlaceholderText(/email/i);
    const passwordInput = screen.getByPlaceholderText(/senha/i);
    const submitButton = screen.getByRole('button', { name: /criar/i });

    // Simulate a user filling out the registration form.
    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'StrongPass1!' } });

    // Click the button to submit the form.
    fireEvent.click(submitButton);

    // Verify that axios.post was called with the correct endpoint and payload.
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        'http://localhost:5000/api/auth/register',
        {
          name: 'John Doe',
          email: 'john@example.com',
          password: 'StrongPass1!',
        }
      );
    });

    // Verify that the navigation function was called with "/note".
    await waitFor(() => {
      expect(mockedUsedNavigate).toHaveBeenCalledWith('/note');
    });
  });

  // Test: Registration failure handling.
  it('should display an alert and not navigate on registration failure', async () => {
    // Replace alert with a mock function.
    window.alert = vi.fn();
    const errorMessage = 'Registration failed!';
    axios.post.mockRejectedValue({
      response: { data: errorMessage },
      message: errorMessage,
    });

    render(
      <BrowserRouter>
        <CreateAccountPage />
      </BrowserRouter>
    );

    // Simulate filling in the registration form.
    const nameInput = screen.getByPlaceholderText(/nome/i);
    const emailInput = screen.getByPlaceholderText(/email/i);
    const passwordInput = screen.getByPlaceholderText(/senha/i);
    const submitButton = screen.getByRole('button', { name: /criar/i });

    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'InvalidPass' } });

    fireEvent.click(submitButton);

    // Ensure an alert is shown due to failure and navigation is not triggered.
    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith(
        'Registration failed! Please try again.'
      );
    });
    expect(mockedUsedNavigate).not.toHaveBeenCalled();
  });
});