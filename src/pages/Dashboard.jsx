import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../services/api.jsx';
import Layout from '../components/Layout/Layout';
import styles from './Dashboard.module.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');
  const [tickets, setTickets] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  // Function to load tickets based on current tab
  const loadTickets = async (statusTab) => {
    setLoading(true);
    try {
      const statusFilter = statusTab === 'all' ? '' : statusTab;
      const res = await apiService.getTickets(statusFilter);
      if (!res.success) throw new Error(res.message);
      setTickets(res.data || []);
    } catch (err) {
      console.error('Error loading tickets:', err);
    } finally {
      setLoading(false);
    }
  };

  // Load tickets when activeTab changes
  useEffect(() => {
    loadTickets(activeTab);
  }, [activeTab]);

  // Listen for global refresh event to reload tickets
  useEffect(() => {
    const handleRefresh = () => loadTickets(activeTab);
    window.addEventListener('refreshTickets', handleRefresh);
    return () => window.removeEventListener('refreshTickets', handleRefresh);
  }, [activeTab]);

  // Compute filtered tickets based on searchTerm
  const filteredTickets = useMemo(() => {
    if (!searchTerm) return tickets;
    const term = searchTerm.toLowerCase();
    return tickets.filter(ticket => {
      const id = ticket._id.toLowerCase();
      const email = ticket.customer?.email?.toLowerCase() || '';
      const username = ticket.customer?.username?.toLowerCase() || '';
      return id.includes(term) || email.includes(term) || username.includes(term);
    });
  }, [searchTerm, tickets]);

  return (
    <Layout>
      <div className={styles.dashboard}>
        <div className={styles.header}>
          <div className={styles.searchContainer}>
            <div className={styles.searchIcon}>
              <img src="/img/searchIcon.svg" alt="Search" />
            </div>
            <input
              type="text"
              placeholder="Search for ticket"
              className={styles.searchInput}
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className={styles.tabsContainer}>
          <div className={styles.tabs}>
            <button 
              className={`${styles.tab} ${activeTab === 'all' ? styles.active : ''}`}
              onClick={() => handleTabChange('all')}
            >
              <img src="/img/sms.svg" alt="Tickets" className={styles.tabIcon} />
              All Tickets
            </button>
            <button 
              className={`${styles.tab} ${activeTab === 'resolved' ? styles.active : ''}`}
              onClick={() => handleTabChange('resolved')}
            >
              Resolved
            </button>
            <button 
              className={`${styles.tab} ${activeTab === 'unresolved' ? styles.active : ''}`}
              onClick={() => handleTabChange('unresolved')}
            >
              Unresolved
            </button>
          </div>
          <div className={styles.tabIndicator}>
            <div 
              className={styles.indicator} 
              style={{ 
                left: activeTab === 'all' ? '20px' : 
                     activeTab === 'resolved' ? '148px' : 
                     '260px',
                width: activeTab === 'all' ? '72px' : 
                      activeTab === 'resolved' ? '61px' : 
                      '76px'
              }}
            ></div>
          </div>
        </div>

        <div className={styles.ticketsContainer}>
          {loading && <p>Loading tickets...</p>}
          {!loading && filteredTickets.map(ticket => (
            <div key={ticket._id} className={styles.ticketCard}>
              <div className={styles.ticketHeader}>
                <div className={styles.ticketIdentifier}>
                  <div className={styles.avatar}></div>
                  <span className={styles.ticketId}>Ticket# {ticket._id}</span>
                </div>
                <span className={styles.ticketTime}>
                  Posted at {new Date(ticket.createdAt).toLocaleDateString(undefined, { day: '2-digit', month: '2-digit', year: 'numeric' })}, {new Date(ticket.createdAt).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', hour12: true })}
                </span>
              </div>
              <div className={styles.ticketMessage}>
                {/* Display latest chat message if available; otherwise fallback to description */}
                {ticket.lastMessage || ticket.description || ''}
              </div>
              <div className={styles.ticketFooter}>
                <div className={styles.customerInfo}>
                  <div className={styles.customerName}>
                    {ticket.customer?.firstName || 'Unknown'} {ticket.customer?.lastName || ''}
                  </div>
                  <div className={styles.customerContact}>
                    {ticket.customer?.phone || ''} {ticket.customer?.email || ''}
                  </div>
                </div>
                <button
                  className={styles.openTicketBtn}
                  onClick={() => navigate(`/tickets?ticketId=${ticket._id}`)}
                >Open Ticket</button>
              </div>
              <div className={styles.divider}></div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard; 