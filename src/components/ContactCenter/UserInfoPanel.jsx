import React, { useState, useEffect } from 'react';
import styles from './UserInfoPanel.module.css';
import apiService from '../../services/api.jsx';
import { useAuth } from '../../context/AuthContext';

const UserInfoPanel = ({ selectedChat, onAssignTeamMember, onStatusChange }) => {
  const [showAssignConfirm, setShowAssignConfirm] = useState(false);
  const [selectedTeamMember, setSelectedTeamMember] = useState(null);
  const [teamMembers, setTeamMembers] = useState([]);
  const [showResolveConfirm, setShowResolveConfirm] = useState(false);
  const [status, setStatus] = useState('unresolved');
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showTeammateDropdown, setShowTeammateDropdown] = useState(false);
  const { currentUser } = useAuth();

  let userDetails = { name: '', phone: '', email: '' };
  if (selectedChat) {
    userDetails = {
      name: selectedChat.name || '',
      phone: selectedChat.phone || '',
      email: selectedChat.email || ''
    };
  }

  useEffect(() => {
    // Load team members list for assignment dropdown
    const loadTeamMembers = async () => {
      try {
        const res = await apiService.getTeam();
        if (res.error) throw new Error(res.message);
        const team = res.data;
        // Only include actual teammates (role === 'member')
        const members = (team.members || [])
          .filter(m => m.userId && m.role === 'member')
          .map(m => ({
            id: m.userId._id,
            name: m.userId.username || `${m.userId.firstName} ${m.userId.lastName}`
          }));
        // Admin should only see team members, not themselves
        setTeamMembers(members);
      } catch (err) {
        console.error('Error loading team members:', err);
      }
    };
    loadTeamMembers();
  }, []);

  useEffect(() => {
    if (selectedChat?.assignedTo) {
      // Normalize assignedTo ID (string or object)
      const assignedId = typeof selectedChat.assignedTo === 'string'
        ? selectedChat.assignedTo
        : (selectedChat.assignedTo._id || selectedChat.assignedTo);
      // Try to find the assigned user among actual teammates
      const teamMember = teamMembers.find(m => m.id === assignedId);
      if (teamMember) {
        setSelectedTeamMember(teamMember);
      } else {
        // Fallback to using the assignedTo user (e.g. admin)
        const assignedUser = selectedChat.assignedTo;
        const name = assignedUser.username 
          || `${assignedUser.firstName || ''} ${assignedUser.lastName || ''}`.trim();
        setSelectedTeamMember({ id: assignedId, name });
      }
    }
  }, [selectedChat, teamMembers]);

  const handleTeamMemberClick = (member) => {
    setSelectedTeamMember(member);
    setShowAssignConfirm(true);
  };

  const handleConfirmAssign = () => {
    if (onAssignTeamMember && selectedTeamMember) {
      onAssignTeamMember(selectedTeamMember);
    }
    setShowAssignConfirm(false);
  };

  const handleCancelAssign = () => {
    setShowAssignConfirm(false);
    setSelectedTeamMember(null);
  };

  const handleStatusClick = () => {
    setShowStatusDropdown(!showStatusDropdown);
  };
  
  const handleStatusSelect = (selectedStatus) => {
    if (selectedStatus === 'resolved' && status !== 'resolved') {
      setShowResolveConfirm(true);
    } else {
      setStatus(selectedStatus);
      if (onStatusChange) {
        onStatusChange(selectedStatus);
      }
    }
    setShowStatusDropdown(false);
  };

  const handleConfirmResolve = () => {
    setStatus('resolved');
    if (onStatusChange) {
      onStatusChange('resolved');
    }
    setShowResolveConfirm(false);
  };

  const handleCancelResolve = () => {
    setShowResolveConfirm(false);
  };

  if (!selectedChat) {
    return (
      <div className={styles.userInfoPanel}>
        <div className={styles.noSelection}>
          <p>Select a chat to view user details</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.userInfoPanel}>
      <div className={styles.sectionTitle}>Details</div>
      
      <div className={styles.detailsSection}>
        <div className={styles.detailItem}>
          <img src="/img/userIcon.svg" alt="User" className={styles.detailIcon} />
          <span className={styles.detailText}>{userDetails.name}</span>
        </div>
        
        <div className={styles.detailItem}>
          <img src="/img/phoneIcon.svg" alt="Phone" className={styles.detailIcon} />
          <span className={styles.detailText}>{userDetails.phone}</span>
        </div>
        
        <div className={styles.detailItem}>
          <img src="/img/mailIcon.svg" alt="Email" className={styles.detailIcon} />
          <span className={styles.detailText}>{userDetails.email}</span>
        </div>
      </div>
      
      {/* Assignment section: dropdown only for admin, static for members */}
      {currentUser?.role === 'admin' ? (
        <>
          <div className={styles.sectionTitle}>Teammates</div>
          <div className={styles.teammatesSection}>
            {/* Dropdown for selecting teammate */}
            <div
              className={styles.ticketStatusItem}
              onClick={() => setShowTeammateDropdown(!showTeammateDropdown)}
            >
              {selectedTeamMember ? (
                <div className={styles.avatar}>
                  <div className={styles.avatarFallback}>
                    {selectedTeamMember?.name?.charAt(0) || ''}
                  </div>
                </div>
              ) : (
                <img src="/img/teamIcon.svg" alt="Assign" className={styles.detailIcon} />
              )}
              <span className={styles.detailText}>
                {selectedTeamMember ? selectedTeamMember.name : 'Select Teammate'}
              </span>
              <div className={styles.dropdownIcon}>▼</div>
            </div>
            {/* Dropdown list */}
            {showTeammateDropdown && (
              <div className={styles.statusDropdown} style={{ position: 'static' }}>
                {teamMembers.map(member => (
                  <div
                    key={member.id}
                    className={styles.statusOption}
                    onClick={() => { handleTeamMemberClick(member); setShowTeammateDropdown(false); }}
                  >
                    <div className={styles.avatar}>
                      <div className={styles.avatarFallback}>
                        {member.name?.charAt(0) || ''}
                      </div>
                    </div>
                    {member.name}
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      ) : (
        <>
          <div className={styles.sectionTitle}>Assigned To</div>
          <div className={styles.detailsSection}>
            <div className={styles.detailItem}>
              {selectedTeamMember ? (
                <div className={styles.avatar}>
                  <div className={styles.avatarFallback}>
                    {selectedTeamMember?.name?.charAt(0) || ''}
                  </div>
                </div>
              ) : (
                <img src="/img/teamIcon.svg" alt="Assigned To" className={styles.detailIcon} />
              )}
              <span className={styles.detailText}>
                {selectedTeamMember?.name 
                  ? selectedTeamMember.name 
                  : (selectedChat?.assignedTo?.username || 'Not assigned')}
              </span>
            </div>
          </div>
        </>
      )}
      
      <div className={styles.ticketStatusSection}>
        <div 
          className={styles.ticketStatusItem}
          onClick={handleStatusClick}
        >
          <img src="/img/ticketStatusIcon.svg" alt="Status" className={styles.detailIcon} />
          <span className={styles.detailText}>Ticket status</span>
          <div className={styles.dropdownIcon}>▼</div>
        </div>
        
        {showStatusDropdown && (
          <div className={styles.statusDropdown}>
            <div 
              className={`${styles.statusOption} ${status === 'unresolved' ? styles.active : ''}`}
              onClick={() => handleStatusSelect('unresolved')}
            >
              Unresolved
            </div>
            <div 
              className={`${styles.statusOption} ${status === 'resolved' ? styles.active : ''}`}
              onClick={() => handleStatusSelect('resolved')}
            >
              Resolved
            </div>
          </div>
        )}
      </div>
      
      {/* Assign confirmation dialog */}
      {showAssignConfirm && (
        <div className={styles.confirmDialog}>
          <p>Chat would be assigned to different team member</p>
          <div className={styles.buttonContainer}>
            <button onClick={handleCancelAssign} className={styles.cancelButton}>Cancel</button>
            <button onClick={handleConfirmAssign} className={styles.confirmButton}>Confirm</button>
          </div>
        </div>
      )}
      
      {/* Resolve confirmation dialog */}
      {showResolveConfirm && (
        <div className={styles.confirmDialog}>
          <p>Chat will be closed</p>
          <div className={styles.buttonContainer}>
            <button onClick={handleCancelResolve} className={styles.cancelButton}>Cancel</button>
            <button onClick={handleConfirmResolve} className={styles.confirmButton}>Confirm</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserInfoPanel; 