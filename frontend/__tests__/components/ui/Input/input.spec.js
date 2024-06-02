import React from 'react';
import { render,screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom'
import Input from '../../../../components/ui/Input/input';

describe('Input component', () => {
  it('renders without crashing', () => {
    render(<Input data-testid="test-input" />);
    const inputElement = screen.getByTestId('test-input');
    expect(inputElement).toBeInTheDocument();
  });
  

  it('renders label correctly', () => {
    const labelText = 'Test Label';
    render(<Input data-testid="test-input" label={labelText} />);
    const labelElement = screen.getByText(labelText);
    expect(labelElement).toBeInTheDocument();
  });

  it('passes props correctly', () => {
    const placeholderText = 'Test Placeholder';
    render(<Input data-testid="test-input" placeholder={placeholderText} />);
    const inputElement = screen.getByTestId('test-input');
    expect(inputElement).toHaveAttribute('placeholder', placeholderText);
  });

  it('handles onChange event', () => { 
    const handleChange = jest.fn();
    render(<Input data-testid="test-input" onChange={handleChange} />);
    const inputElement = screen.getByTestId('test-input');
    fireEvent.change(inputElement, { target: { value: 'test value' } });
    expect(handleChange).toHaveBeenCalled();
  });
});
