// src/constants/toastMessages.js
export const TOAST_MESSAGES = {
  // ─── Authentication ────────────────────────────────────────────────────────────
  SIGNUP_SUCCESS:        'Account created! Please sign in.',
  SIGNUP_ERROR:          'Could not create account. Please try again.',

  FIRST_LOGIN_SUCCESS:   'Username set & logged in successfully.',
  FIRST_LOGIN_ERROR:     'Failed to set username. Please try again.',

  LOGIN_SUCCESS:         'Logged in successfully.',
  LOGIN_ERROR:           'Login failed: check your credentials.',

  LOGOUT_SUCCESS:        'Logged out.',
  LOGOUT_ERROR:          'Logout failed. Please refresh and try again.',

  // ─── Profile / Settings ────────────────────────────────────────────────────────
  FETCH_PROFILE_ERROR:   'Could not load profile. Please refresh.',
  UPDATE_PROFILE_SUCCESS: 'Profile updated successfully.',
  UPDATE_PROFILE_ERROR:  'Failed to update profile. Please try again.',
  UPDATE_PASSWORD_SUCCESS: 'Password changed—please log in again.',
  UPDATE_PASSWORD_ERROR: 'Password update failed. Please try again.',

  // ─── Tickets / Contact Center ─────────────────────────────────────────────────
  FETCH_TICKETS_ERROR:   'Could not load tickets. Please try again.',
  FETCH_TICKET_ERROR:    'Could not load ticket details. Please try again.',

  REPLY_TICKET_SUCCESS:   'Reply sent.',
  REPLY_TICKET_ERROR:     'Failed to send reply. Please try again.',

  REASSIGN_TICKET_SUCCESS: 'Ticket reassigned successfully.',
  REASSIGN_TICKET_ERROR:   'Failed to reassign ticket. Please try again.',

  STATUS_UPDATE_SUCCESS:  'Ticket status updated.',
  STATUS_UPDATE_ERROR:    'Failed to update status. Please try again.',

  // ─── Chat Widget / Sessions ───────────────────────────────────────────────────
  CHAT_SESSION_START_SUCCESS: 'Chat session started.',
  CHAT_SESSION_START_ERROR:   'Could not start chat. Please refresh the page.',

  CHAT_MESSAGE_SEND_SUCCESS:  'Message sent.',
  CHAT_MESSAGE_SEND_ERROR:    'Failed to send message. Please try again.',

  // ─── Missed-Chat System Message ───────────────────────────────────────────────
  MISSED_CHAT_TRIGGERED:      'Auto-reply sent for missed chat.',

  // ─── Bot Configuration ────────────────────────────────────────────────────────
  FETCH_BOT_CONFIG_ERROR:   'Could not load chat-bot settings.',
  SAVE_BOT_CONFIG_SUCCESS:  'Chat-bot settings saved.',
  SAVE_BOT_CONFIG_ERROR:    'Failed to save settings. Please try again.',

  // ─── Analytics ────────────────────────────────────────────────────────────────
  FETCH_ANALYTICS_ERROR:    'Could not load analytics data. Please try again.',

  // ─── Teams Management ─────────────────────────────────────────────────────────
  FETCH_TEAMS_ERROR:        'Could not load team members.',
  ADD_TEAM_MEMBER_SUCCESS:  'Team member added.',
  ADD_TEAM_MEMBER_ERROR:    'Failed to add member. Please try again.',

  UPDATE_TEAM_MEMBER_SUCCESS: 'Team member updated successfully.',
  UPDATE_TEAM_MEMBER_ERROR:   'Failed to update member. Please try again.',

  REMOVE_TEAM_MEMBER_SUCCESS: 'Team member removed from team successfully.',
  REMOVE_TEAM_MEMBER_ERROR:   'Failed to remove team member. Please try again.',
}; 