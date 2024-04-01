import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { screen, render } from '@testing-library/react';
import '@testing-library/jest-dom';

import  { ChatContext } from '../../../Context/chatProvider';
import ScrollableChat from '../../../components/chats/ScrollableChat';


describe('ScrollableChat component', () => {
  test('renders messages correctly', () => {
    const messages = [
      { sender: { _id: '1', pic: 'pic1.jpg' }, content: 'Message 1', image: 'pic3.jpg' },
      { sender: { _id: '2', pic: 'pic2.jpg' }, content: 'Message 2' },
    ];

    let scrollIntoViewMock = jest.fn();
    window.HTMLElement.prototype.scrollIntoView = scrollIntoViewMock;

    render(
    <BrowserRouter>
        <ChatContext.Provider value={{user: {_id: 1}}}>
            <ScrollableChat messages={messages} />
        </ChatContext.Provider> 
    </BrowserRouter>
    );

    // Check if both messages are rendered
    expect(screen.getByText('Message 1')).toBeInTheDocument();
    expect(screen.getByText('Message 2')).toBeInTheDocument();
    expect(screen.getByAltText('pic3.jpg')).toBeInTheDocument()
  });
});
