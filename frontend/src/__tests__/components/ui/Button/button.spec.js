import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import "@testing-library/jest-dom"
import Button  from '../../../../components/ui/Button';

describe('Button component', () => {

  it('renders without crashing', () => {
    render(<Button>Click me</Button>);
    const buttonElement = screen.getByText('Click me');
    expect(buttonElement).toBeInTheDocument();
  });

  it('renders with custom class name', () => {
    render(<Button className="custom-class">Click me</Button>);
    const buttonElement = screen.getByText('Click me');
    expect(buttonElement).toHaveClass('custom-class');
  });

  it('calls onClick handler when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    const buttonElement = screen.getByText('Click me');
    fireEvent.click(buttonElement);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('renders with default type "submit"', () => {
    render(<Button>Click me</Button>);
    const buttonElement = screen.getByText('Click me');
    expect(buttonElement).toHaveAttribute('type', 'submit');
  });

  it('renders with custom type', () => {
    render(<Button type="button">Click me</Button>);
    const buttonElement = screen.getByText('Click me');
    expect(buttonElement).toHaveAttribute('type', 'button');
  });
});
