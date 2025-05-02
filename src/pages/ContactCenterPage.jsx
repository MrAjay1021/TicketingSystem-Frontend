import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import TicketingLayout from '../layouts/TicketingLayout';
import ContactCenterPanel from '../components/ContactCenter/ContactCenterPanel';
import ChatSection from '../components/ContactCenter/ChatSection';
import UserInfoPanel from '../components/ContactCenter/UserInfoPanel';
import styles from './ContactCenterPage.module.css';
import apiService from '../services/api.jsx';
import { TOAST_MESSAGES } from '../constants/toastMessages.jsx';
import { useAuth } from '../context/AuthContext';
import { showSuccessToast, showErrorToast } from '../utils/toastUtils.jsx';

const ContactCenterPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const initialTicketId = location.state?.ticketId || params.get('ticketId');
  const [selectedChat, setSelectedChat] = useState(null);
  const [isChatResolved, setIsChatResolved] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [chats, setChats] = useState([]);
  const { currentUser } = useAuth();

  useEffect(() => {
    // Reset error state when component mounts
    setError(null);
  }, []);

  // Stable handler for selecting chats, wrapped in useCallback
  const handleChatSelect = useCallback(async (chat) => {
    // Update URL so selection persists on refresh
    navigate(`/tickets?ticketId=${chat.ticket._id}`, { replace: true });
    setLoading(true);
    setSelectedChat(chat);
    setIsChatResolved(false);
    setError(null);
    try {
      const historyRes = await apiService.getChatHistory(chat.id);
      if (!historyRes.success) throw new Error(historyRes.message);
      setSelectedChat(prev => ({ ...prev, messages: historyRes.data.messages }));
    } catch (err) {
      setError('Failed to load chat details. Please try again.');
      console.error('Error selecting chat:', err);
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  // Fetch chats on mount based on user role
  // eslint-disable-next-line react-hooks/exhaustive-deps, no-use-before-define
  useEffect(() => {
    const fetchChats = async () => {
      setLoading(true);
      try {
        // Admin sees all chats for admin; members see only assigned to them
        const res = currentUser?.role === 'admin'
          ? await apiService.getAdminChats()
          : await apiService.getAssignedChats();
        if (!res.success) throw new Error(res.message || 'Failed to load chats');
        // Backend already returns chat.id as sessionId
        const chatsList = res.data || [];
        setChats(chatsList);
        // If navigated with ticketId, auto-select that chat
        if (initialTicketId) {
          const matched = chatsList.find(c => String(c.ticket._id) === initialTicketId);
          if (matched) {
            await handleChatSelect(matched);
          }
        }
      } catch (err) {
        setError('Failed to load chats. Please try again.');
        showErrorToast(TOAST_MESSAGES.FETCH_TICKETS_ERROR);
        console.error('Error fetching admin chats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchChats();
  }, [currentUser, handleChatSelect, initialTicketId]);

  const handleResolve = async () => {
    try {
      setLoading(true);
      // Mark ticket as resolved
      const res = await apiService.updateTicketStatus(selectedChat.ticket._id, 'resolved');
      if (res.error) throw new Error(res.message);
      setIsChatResolved(true);
      setError(null);
      showSuccessToast(TOAST_MESSAGES.STATUS_UPDATE_SUCCESS);
    } catch (err) {
      showErrorToast(TOAST_MESSAGES.STATUS_UPDATE_ERROR);
      setError('Failed to resolve chat. Please try again.');
      console.error('Error resolving chat:', err);
      // Revert state change in case of error
      setIsChatResolved(false);
    } finally {
      setLoading(false);
    }
  };

  const handleAssignTeamMember = async (teamMember) => {
    try {
      setLoading(true);
      const res = await apiService.reassignTicket(selectedChat.ticket._id, teamMember.id);
      if (res.error) throw new Error(res.message);
      // Update selectedChat.assignedTo so dropdown shows new member
      setSelectedChat(prev => prev ? {
        ...prev,
        assignedTo: { _id: teamMember.id, username: teamMember.name }
      } : prev);
      // ALSO update the chat list in the left panel
      setChats(prevChats => prevChats.map(c =>
        c.id === selectedChat.id
          ? { ...c, assignedTo: { _id: teamMember.id, username: teamMember.name } }
          : c
      ));
      setError(null);
      showSuccessToast(TOAST_MESSAGES.REASSIGN_TICKET_SUCCESS);
    } catch (err) {
      setError('Failed to assign team member. Please try again.');
      showErrorToast(TOAST_MESSAGES.REASSIGN_TICKET_ERROR);
      console.error('Error assigning team member:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (status) => {
    try {
      setLoading(true);
      // Map 'unresolved' to 'open' for backend
      const apiStatus = status === 'unresolved' ? 'open' : status;
      // Update ticket status
      const res = await apiService.updateTicketStatus(selectedChat.ticket._id, apiStatus);
      if (res.error) throw new Error(res.message);
      setIsChatResolved(status === 'resolved');
      setError(null);
      showSuccessToast(TOAST_MESSAGES.STATUS_UPDATE_SUCCESS);
    } catch (err) {
      setError('Failed to update status. Please try again.');
      showErrorToast(TOAST_MESSAGES.STATUS_UPDATE_ERROR);
      console.error('Error updating status:', err);
      // Revert state change in case of error
      if (status === 'resolved') setIsChatResolved(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <TicketingLayout>
      <div className={styles.contactCenterPage}>
        {error && (
          <div className={styles.errorMessage}>
            <p>{error}</p>
            <button onClick={() => setError(null)} className={styles.dismissButton}>
              Dismiss
            </button>
          </div>
        )}
        
        {loading && <div className={styles.loadingOverlay}>Loading...</div>}
        
        <ContactCenterPanel chats={chats} onChatSelect={handleChatSelect} selectedChatId={selectedChat?.id} />
        <ChatSection 
          selectedChat={selectedChat} 
          onResolve={handleResolve} 
          isResolved={isChatResolved}
        />
        <UserInfoPanel 
          selectedChat={selectedChat}
          onAssignTeamMember={handleAssignTeamMember}
          onStatusChange={handleStatusChange}
        />
      </div>
    </TicketingLayout>
  );
};

export default ContactCenterPage; 