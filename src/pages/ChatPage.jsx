import React from 'react';
import MainLayout from '../layouts/MainLayout';

const ChatPage = () => {
  return (
    <MainLayout hideChat={true}>
      {/* This page will only show the chat widget on mobile */}
      <div></div>
    </MainLayout>
  );
};

export default ChatPage; 