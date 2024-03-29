import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import { act } from 'react-dom/test-utils';
import '@testing-library/jest-dom';

import SignupPage from '../../Pages/SignupPage/SignupPage'; 



jest.mock('axios'); 


describe('SignupPage Component', () => {
   
    it('renders all input fields correctly', () => {

        render(
            <BrowserRouter>
                <SignupPage />
            </BrowserRouter>
        );

        expect(screen.getByLabelText('Name')).toBeInTheDocument();
        expect(screen.getByTestId('user_name_input')).toBeInTheDocument();

        expect(screen.getByLabelText('Email')).toBeInTheDocument();
        expect(screen.getByTestId('user_email_input')).toBeInTheDocument();

        expect(screen.getByLabelText('Password')).toBeInTheDocument();
        expect(screen.getByTestId('user_password_input')).toBeInTheDocument();

        expect(screen.getByLabelText('Confirm Password')).toBeInTheDocument();
        expect(screen.getByTestId('user_confirm_password_input')).toBeInTheDocument();

        expect(screen.getByText('Create Account')).toBeInTheDocument()

    });

    it('displays error message if email or password is not entered', async () => {
        render(
            <BrowserRouter>
                <SignupPage />
            </BrowserRouter>
        );
        fireEvent.click(screen.getByText('Create Account'));
  
        await waitFor(() => {
          expect(screen.getByText('Please fill all the fields!')).toBeInTheDocument();
        });
    });

    it('should display success toast message on successful form submission', async () => {
        axios.post.mockResolvedValueOnce({ data:  { userId: 123 } });

        render(
            <BrowserRouter>
                <SignupPage />
            </BrowserRouter>
        );

      
        global.fetch = jest.fn();

        fetch.mockResolvedValueOnce({
            json: () => Promise.resolve({ url: 'https://example.com/image.jpg' }),
        });

        

        // eslint-disable-next-line testing-library/no-unnecessary-act
        await act(async () => {
            fireEvent.change(screen.getByTestId('user_name_input'), { target: { value: 'Test Name' } });
            fireEvent.change(screen.getByTestId('user_email_input'), { target: { value: 'test@example.com' } });
            fireEvent.change(screen.getByTestId('user_password_input'), { target: { value: 'password123' } });
            fireEvent.change(screen.getByTestId('user_confirm_password_input'), { target: { value: 'password123' } });
      
            const file = new File(['dummy text'], 'dummy.txt', { type: 'image/plain' });
            fireEvent.change(screen.getByTestId('user_profile_pic'), { target: { files: [file] } });
        });


        fireEvent.click(screen.getByText('Create Account'));

        expect(axios.post).toHaveBeenCalledWith("http://localhost:4000/api/user", {"email": "test@example.com", "name": "Test Name", "password": "password123", "pic": "https://example.com/image.jpg"}, {"headers": {"Content-type": "application/json"}});
        expect(axios.post).toHaveBeenCalledTimes(1)

        await waitFor(() => {
            expect(screen.getByText('Account created successfully!')).toBeInTheDocument();
        });
    });
});
