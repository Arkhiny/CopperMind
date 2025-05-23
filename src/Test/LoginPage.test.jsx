// LoginPage.test.jsx
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginPage from '../pages/Login.jsx'; // Adjusted relative path
import axios from 'axios';
import { BrowserRouter } from 'react-router-dom';

// -------------------------
// ----- MOCK SETUP --------
// -------------------------

// Mock Axios to simulate API requests
vi.mock('axios');

// Mock useNavigate from react-router-dom so we can test navigation
const mockedUsedNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockedUsedNavigate,
  };
});

// Clear mocks and local storage before each test
beforeEach(() => {
  vi.clearAllMocks();
  localStorage.clear();
});

describe('LoginPage Component - Input and Action Tests', () => {
  // Test: Valid input field update
  it('should accept valid email and password inputs (e.g., "test@example.com", "password123") and update the fields', () => {
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );

    // Locate the input fields by their placeholders
    const emailInput = screen.getByPlaceholderText(/email/i);
    const passwordInput = screen.getByPlaceholderText(/senha/i);

    // Simulate user typing valid input values
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    // Assertion: The input values are updated accordingly
    expect(emailInput.value).toBe('test@example.com');
    expect(passwordInput.value).toBe('password123');
  });

  // Test: Toggle password visibility
  it('should toggle password visibility when clicking the eye icon', () => {
    // Render component and access using container to locate the eye icon (a span with role="button")
    const { container } = render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );

    const passwordInput = screen.getByPlaceholderText(/senha/i);
    
    // Initial expectation: Input type is set to "password"
    expect(passwordInput).toHaveAttribute('type', 'password');

    // Find the toggle button via its role
    const toggleButton = container.querySelector('span[role="button"]');
    expect(toggleButton).toBeDefined();

    // Simulate clicking the toggle to show the password (input type becomes "text")
    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'text');

    // Click again to hide the password (input type reverts to "password")
    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  // Test: Successful login with accepted input values
  it('should successfully log in with acceptable credentials (e.g., "test@example.com", "password123") by storing token and navigating to /Note', async () => {
    // Fake successful response from backend
    const fakeResponse = {
      data: {
        token: 'fakeToken123',
        user: { id: 1, name: 'Test User', email: 'test@example.com' },
      },
    };
    axios.post.mockResolvedValue(fakeResponse);

    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );

    // Locate inputs and submit button
    const emailInput = screen.getByPlaceholderText(/email/i);
    const passwordInput = screen.getByPlaceholderText(/senha/i);
    const submitButton = screen.getByRole('button', { name: /entrar/i });

    // Fill in acceptable credentials
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    // Click submit button to trigger login
    fireEvent.click(submitButton);

    // Verify that the Axios post call is made with the expected payload
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        'http://localhost:5000/api/auth/login',
        {
          email: 'test@example.com',
          password: 'password123',
        }
      );
    });

    // Check that tokens are stored in localStorage and user is saved correctly
    expect(localStorage.getItem('authToken')).toBe('fakeToken123');
    expect(JSON.parse(localStorage.getItem('activeUser'))).toEqual({
      id: 1,
      name: 'Test User',
      email: 'test@example.com',
    });

    // Verify navigation occurred to '/Note'
    await waitFor(() =>
      expect(mockedUsedNavigate).toHaveBeenCalledWith('/Note')
    );
  });

  // Test: Unsuccessful login should be handled gracefully
  it('should reject invalid login credentials (e.g., "wrong@example.com", "wrongpassword") and show an alert', async () => {
    // Replace the global alert function with a mock to verify it is called
    window.alert = vi.fn();
    
    // Set Axios to reject the login attempt
    const errorMessage = 'Invalid credentials';
    axios.post.mockRejectedValue({
      response: { data: errorMessage },
      message: errorMessage,
    });

    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );

    // Locate inputs and submit button
    const emailInput = screen.getByPlaceholderText(/email/i);
    const passwordInput = screen.getByPlaceholderText(/senha/i);
    const submitButton = screen.getByRole('button', { name: /entrar/i });

    // Fill in invalid credentials
    fireEvent.change(emailInput, { target: { value: 'wrong@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });

    // Click the submit button to trigger a login attempt
    fireEvent.click(submitButton);

    // Check that an alert is triggered with the expected message and no navigation happens
    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith(
        'Login failed! Please check your credentials.'
      );
    });
    expect(mockedUsedNavigate).not.toHaveBeenCalled();
  });
});