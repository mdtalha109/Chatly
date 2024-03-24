import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import '@testing-library/jest-dom';
import { act } from 'react-dom/test-utils';

import HomePage from '../../Pages/HomePage/HomePage';

jest.mock('axios');

describe('HomePage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
   
      render(
        <BrowserRouter>
          <HomePage />
        </BrowserRouter>
      );
   

    it('renders the login form correctly', () => {
      expect(screen.getByText('Login')).toBeInTheDocument();
      expect(screen.getByLabelText('Email')).toBeInTheDocument();
      expect(screen.getByLabelText('Password')).toBeInTheDocument();
      expect(screen.getByText('LOGIN')).toBeInTheDocument();
      expect(screen.getByText('New User?')).toBeInTheDocument();
      expect(screen.getByText('Create your account')).toBeInTheDocument();
    });

    it('displays error message if email or password is not entered', async () => {
      // fireEvent.click(screen.getByText('LOGIN'));

      // await waitFor(() => {
      //   expect(screen.getByText('Please fill all the fields!')).toBeInTheDocument();
      // });
    });
  });

  // describe('Form Submission', () => {
  //   it('handles form submission correctly', async () => {
  //     const mockedData = { token: 'mockedToken' };
  //     axios.post.mockResolvedValueOnce({ data: mockedData });

  //     render(
  //       <BrowserRouter>
  //         <HomePage />
  //       </BrowserRouter>
  //     );

  //     fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } });
  //     fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password' } });
  //     fireEvent.click(screen.getByText('LOGIN'));

  //     await waitFor(() => {
  //       expect(axios.post).toHaveBeenCalledWith(
  //         'http://localhost:4000/api/user/login',
  //         { email: 'test@example.com', password: 'password' },
  //         { headers: { 'Content-type': 'application/json' } }
  //       );
  //     });
     
     
  //   });
  // });
});
