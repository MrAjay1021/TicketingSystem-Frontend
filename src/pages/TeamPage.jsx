import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Layout from '../components/Layout/Layout';
import styles from './TeamPage.module.css';
import apiService from '../services/api.jsx';
import { useAuth } from '../context/AuthContext';
import { TOAST_MESSAGES } from '../constants/toastMessages.jsx';
import { showSuccessToast, showErrorToast } from '../utils/toastUtils.jsx';

const TeamPage = () => {
  const { currentUser, loading: authLoading } = useAuth();
  // State for team members data and UI controls
  const [teamMembers, setTeamMembers] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editedMember, setEditedMember] = useState(null);
  const [editedRole, setEditedRole] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [teamId, setTeamId] = useState(null);

  // Setup react-hook-form
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  // Fetch team once AuthContext finishes loading and currentUser is available
  useEffect(() => {
    if (authLoading) return;
    if (!currentUser) return;

    const fetchTeam = async () => {
      setIsLoading(true);
      try {
        const response = await apiService.getTeam();
        if (response.error) throw new Error(response.message);
        const team = response.data;
        setTeamId(team._id);
        // Build member list including admin as first row
        const members = [];
        if (currentUser.role === 'admin') {
          // Admin sees themselves first
          members.push({
            id: `user_${currentUser.id}`,
            username: currentUser.username,
            email: currentUser.email,
            role: 'admin'
          });
        } else if (team.admin) {
          // Members see the admin user first
          members.push({
            id: `user_${team.admin._id}`,
            username: team.admin.username,
            email: team.admin.email,
            role: 'admin'
          });
        }

        // Add team members (excluding current user)
        if (team.members && team.members.length > 0) {
          team.members.forEach(m => {
            if (!m.userId) return;
            if (m.userId._id === currentUser.id) return;
            members.push({
              id: `member_${m.userId._id}`,
              username: m.userId.username,
              email: m.userId.email,
              role: m.role
            });
          });
        }

        setTeamMembers(members);
        setError(null);
      } catch (err) {
        console.error('Error fetching team:', err);
        setError('Failed to load team. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchTeam();
  }, [authLoading, currentUser]);

  // Handle adding a new team member
  const handleAddTeamMember = async (data) => {
    try {
      setIsLoading(true);
      const memberData = {
        email: data.email,
        username: data.username,
        role: data.designation.toLowerCase()
      };
      const response = await apiService.addTeamMember(teamId, memberData);
      
      // If response was successful
      if (response && response.success) {
        // Refresh the page to get updated team members
        const teamResponse = await apiService.getTeam();
        if (teamResponse.success) {
          const team = teamResponse.data;
          
          // Update members list including admin first
          const members = [];
          if (currentUser.role === 'admin') {
            members.push({
              id: `user_${currentUser.id}`,
              username: currentUser.username,
              email: currentUser.email,
              role: 'admin'
            });
          } else if (team.admin) {
            members.push({
              id: `user_${team.admin._id}`,
              username: team.admin.username,
              email: team.admin.email,
              role: 'admin'
            });
          }

          // Add remaining team members (excluding current user)
          if (team.members && team.members.length > 0) {
            team.members.forEach(m => {
              if (!m.userId) return;
              if (m.userId._id === currentUser.id) return;
              members.push({
                id: `member_${m.userId._id}`,
                username: m.userId.username,
                email: m.userId.email,
                role: m.role
              });
            });
          }

          setTeamMembers(members);
        }
        
      setShowAddModal(false);
      reset();
      setError(null);
      showSuccessToast(TOAST_MESSAGES.ADD_TEAM_MEMBER_SUCCESS);
      } else {
        throw new Error(response.message || 'Failed to add team member');
      }
    } catch (err) {
      console.error('Error adding team member:', err);
      
      // Check for duplicate key errors in the error message
      let errorMessage = 'Failed to add team member. Please try again.';
      if (err.message && err.message.includes('duplicate key error')) {
        errorMessage = 'This email is already invited to the team.';
      }
      
      setError(errorMessage);
      showErrorToast(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle deleting a team member
  const handleDeleteTeamMember = async () => {
    if (!selectedMember) return;
    try {
      setIsLoading(true);
      
      // Extract the actual user ID by removing the prefix if present
      let userId = selectedMember.id;
      if (userId.startsWith('member_')) {
        userId = userId.substring(7); // Remove 'member_' prefix
      }
      
      const response = await apiService.removeTeamMember(teamId, userId);
      
      if (!response || response.error) {
        throw new Error(response?.message || 'Failed to remove team member');
      }
      
      // Refresh the team members after successful deletion
      const teamResponse = await apiService.getTeam();
      if (teamResponse.success) {
        const team = teamResponse.data;
        
        // Refresh members list including admin first
        const members = [];
        if (currentUser.role === 'admin') {
          members.push({
            id: `user_${currentUser.id}`,
            username: currentUser.username,
            email: currentUser.email,
            role: 'admin'
          });
        } else if (team.admin) {
          members.push({
            id: `user_${team.admin._id}`,
            username: team.admin.username,
            email: team.admin.email,
            role: 'admin'
          });
        }

        // Add remaining team members (excluding current user)
        if (team.members && team.members.length > 0) {
          team.members.forEach(m => {
            if (!m.userId) return;
            if (m.userId._id === currentUser.id) return;
            members.push({
              id: `member_${m.userId._id}`,
              username: m.userId.username,
              email: m.userId.email,
              role: m.role
            });
          });
        }

        setTeamMembers(members);
      } else {
        setTeamMembers([]);
      }
      
      setShowDeleteModal(false);
      setSelectedMember(null);
      setError(null);
      showSuccessToast(TOAST_MESSAGES.REMOVE_TEAM_MEMBER_SUCCESS);
    } catch (err) {
      console.error('Error removing team member:', err);
      setError('Failed to remove team member. Please try again.');
      showErrorToast(TOAST_MESSAGES.REMOVE_TEAM_MEMBER_ERROR);
    } finally {
      setIsLoading(false);
    }
  };

  // Show delete confirmation modal
  const confirmDelete = (member) => {
    // Store the full member information for display and deletion
    setSelectedMember({
      ...member,
      // Store the original ID without prefix for display purposes
      originalId: member.id.startsWith('member_') ? member.id.substring(7) : member.id
    });
    setShowDeleteModal(true);
  };

  // Open edit modal for a team member
  const handleEdit = (member) => {
    console.log('Edit clicked for member:', member);

    // ─── Validate that we actually have the fields we need ──────────────────────
    if (!member || !member.username || !member.email || !member.role) {
      console.error('Cannot open edit modal. Invalid member data:', member);
      showErrorToast('Failed to load member data. Please refresh and try again.');
      return;
    }

    // ─── Close any other open modals ───────────────────────────────────────────
    setShowAddModal(false);
    setShowDeleteModal(false);

    // ─── Populate and show edit form ───────────────────────────────────────────
    setEditedMember(member);
    setEditedRole(member.role);
    setShowEditModal(true);
  };

  // Handle edit form submission
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editedMember) return;
    try {
      setIsLoading(true);
      // Extract userId from prefixed id
      let userId = editedMember.id;
      if (userId.startsWith('member_')) userId = userId.substring(7);
      else if (userId.startsWith('user_')) userId = userId.substring(5);
      const res = await apiService.updateTeamMember(teamId, userId, editedRole);
      if (res.error) throw new Error(res.message);
      // Update local members state
      setTeamMembers(prev => prev.map(m => m.id === editedMember.id ? { ...m, role: editedRole } : m));
      showSuccessToast(TOAST_MESSAGES.UPDATE_TEAM_MEMBER_SUCCESS);
      setError(null);
      setShowEditModal(false);
      setEditedMember(null);
    } catch (err) {
      console.error('Error updating team member:', err);
      showErrorToast(TOAST_MESSAGES.UPDATE_TEAM_MEMBER_ERROR);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className={styles.teamPage}>
        <h1 className={styles.pageTitle}>Team</h1>
        
        {/* Error message display */}
        {error && (
          <div className={styles.errorMessage}>
            <p>{error}</p>
            <button onClick={() => setError(null)} className={styles.dismissButton}>
              Dismiss
            </button>
          </div>
        )}
        
        {/* Team members table */}
        <div className={styles.tableContainer}>
          <table className={styles.teamTable}>
            <thead>
              <tr>
                <th className={styles.fullNameHeader}>
                  Username
                </th>
                <th>Email</th>
                <th>Role</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {teamMembers.map((member) => (
                <tr key={member.id}>
                  <td>{member.username}</td>
                  <td>{member.email}</td>
                  <td>{member.role === 'admin' ? 'Admin' : 'Member'}</td>
                  <td className={styles.actionButtons}>
                    <button 
                      type="button"
                      className={styles.editButton} 
                      onClick={() => handleEdit(member)}
                      aria-label="Edit"
                    >
                      <img src={process.env.PUBLIC_URL + '/img/edit.svg'} alt="Edit" />
                    </button>
                    {currentUser.role === 'admin' && member.id.startsWith('member_') && (
                      <button 
                        type="button"
                        className={styles.deleteButton} 
                        onClick={() => confirmDelete(member)}
                        aria-label="Delete"
                      >
                        <img src={process.env.PUBLIC_URL + '/img/delete.svg'} alt="Delete" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Add Team Member Button */}
        {currentUser.role === 'admin' && (
          <button 
            className={styles.addTeamButton}
            onClick={() => setShowAddModal(true)}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 4.16675V15.8334" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M4.16699 10H15.8337" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Add Team members
          </button>
        )}
        
        {/* Add Team Member Modal */}
        {showAddModal && (
          <div className={styles.modalOverlay}>
            <div className={styles.modal}>
              <h2 className={styles.modalTitle}>Add Team members</h2>
              <p className={styles.modalDescription}>
                Talk with colleagues in a group chat. Messages in this group are only visible to it's participants. New teammates may only be invited by the administrators.
              </p>
              
              <form onSubmit={handleSubmit(handleAddTeamMember)}>
                <div className={styles.formGroup}>
                  <label htmlFor="username">Name </label>
                  <input 
                    id="username"
                    type="text" 
                    placeholder="Enter Member or Admin name"
                    className={styles.formInput}
                    {...register("username", { 
                      required: "Full name is required"
                    })}
                  />
                  {errors.username && <p className={styles.errorText}>{errors.username.message}</p>}
                </div>
                
                <div className={styles.formGroup}>
                  <label htmlFor="email">Email ID</label>
                  <input 
                    id="email"
                    type="email" 
                    placeholder="Email ID"
                    className={styles.formInput}
                    {...register("email", { 
                      required: "Email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address"
                      }
                    })}
                  />
                  {errors.email && <p className={styles.errorText}>{errors.email.message}</p>}
                </div>
                
                <div className={styles.formGroup}>
                  <label htmlFor="designation">Designation</label>
                  <select 
                    id="designation"
                    className={styles.formInput}
                    defaultValue="Member"
                    {...register("designation", { required: "Designation is required" })}
                  >
                    <option value="Member">Member</option>
                    <option value="Admin">Admin</option>
                  </select>
                  {errors.designation && <p className={styles.errorText}>{errors.designation.message}</p>}
                </div>
                
                <div className={styles.modalActions}>
                  <button 
                    type="button" 
                    className={styles.cancelButton}
                    onClick={() => {
                      setShowAddModal(false);
                      reset();
                    }}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className={styles.saveButton}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Saving...' : 'Save'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        
        {/* Delete Confirmation Modal */}
        {showDeleteModal && selectedMember && (
          <div className={styles.modalOverlay}>
            <div className={styles.deleteModal}>
              <p className={styles.deleteMessage}>
                Are you sure you want to remove {selectedMember.username || 'this team member'}?
              </p>
              <div className={styles.deleteActions}>
                <button 
                  className={styles.cancelButton}
                  onClick={() => {
                    setShowDeleteModal(false);
                    setSelectedMember(null);
                  }}
                >
                  Cancel
                </button>
                <button 
                  className={styles.confirmButton}
                  onClick={handleDeleteTeamMember}
                  disabled={isLoading}
                >
                  {isLoading ? 'Deleting...' : 'Confirm'}
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Edit Team Member Modal */}
        {showEditModal && editedMember && (
          <div className={styles.modalOverlay}>
            <div className={styles.modal}>
              <h2 className={styles.modalTitle}>Edit Team Member</h2>
              <form onSubmit={handleEditSubmit}>
                <div className={styles.formGroup}>
                  <label>Full Name</label>
                  <input
                    type="text"
                    value={editedMember.username}
                    disabled
                    className={styles.formInput}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Email ID</label>
                  <input
                    type="email"
                    value={editedMember.email}
                    disabled
                    className={styles.formInput}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Role</label>
                  <select
                    value={editedRole}
                    onChange={e => setEditedRole(e.target.value)}
                    className={styles.formInput}
                  >
                    <option value="admin">Admin</option>
                    <option value="member">Member</option>
                  </select>
                </div>
                <div className={styles.modalActions}>
                  <button
                    type="button"
                    className={styles.cancelButton}
                    onClick={() => { setShowEditModal(false); setEditedMember(null); }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className={styles.saveButton}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Saving...' : 'Save'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        
        {/* Loading overlay */}
        {isLoading && (
          <div className={styles.loadingOverlay}>
            <div className={styles.spinner}></div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default TeamPage; 