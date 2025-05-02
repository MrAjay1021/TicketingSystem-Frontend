import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout/Layout';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import styles from './Analytics.module.css';
import apiService from '../services/api.jsx';

const Analytics = () => {
  // State for all analytics data
  const [analyticsData, setAnalyticsData] = useState({
    // from /api/analytics/overview
    totalTickets: 0,
    resolvedTickets: 0,
    unresolvedTickets: 0,
    resolutionRate: 0,
    ticketsByStatus: {},
    ticketsByPriority: {},
    resolutionTimes: { average: 0, minimum: 0, maximum: 0 },
    // other metrics retained
    missedChats: [],
    averageReplyTime: 0,
    totalChats: 0,
    isLoading: true,
    error: null
  });

  // Fetch analytics overview, response time, and total chats
  useEffect(() => {
    const fetchAllAnalytics = async () => {
      try {
        const [
          overviewRes,
          responseRes,
          totalRes,
          missedRes
        ] = await Promise.all([
          apiService.getAnalyticsOverview(),
          apiService.getResponseTimeAnalytics(),
          apiService.getTotalChatsAnalytics(),
          apiService.getMissedChatsAnalytics()
        ]);
        if (!overviewRes.success) throw new Error(overviewRes.message);
        if (!responseRes.success) throw new Error(responseRes.message);
        if (!totalRes.success) throw new Error(totalRes.message);
        if (!missedRes.success) throw new Error(missedRes.message);
        // Overview data
        const {
          totalTickets,
          resolvedTickets,
          resolutionRate,
          ticketsByStatus,
          ticketsByPriority,
          resolutionTimes
        } = overviewRes.data;
        const unresolvedTickets = totalTickets - resolvedTickets;
        // Response time data
        const avgReplyTime = responseRes.data.averageResponseTimeFormatted || '0 secs';
        // Total chats data
        const totalChats = totalRes.data.total || 0;
        const missedCount = missedRes.data.count;
        setAnalyticsData(prev => ({
          ...prev,
          totalTickets,
          resolvedTickets,
          unresolvedTickets,
          resolutionRate,
          ticketsByStatus,
          ticketsByPriority,
          resolutionTimes,
          averageReplyTime: avgReplyTime,
          totalChats,
          missedChats: [{ name: 'Missed Chats', value: missedCount }],
          isLoading: false,
          error: null
        }));
      } catch (error) {
        console.error('Error fetching analytics data:', error);
        setAnalyticsData(prev => ({ ...prev, isLoading: false, error: 'Failed to load analytics data.' }));
      }
    };
    fetchAllAnalytics();
  }, []);

  // Custom tooltip component for the chart
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className={styles.customTooltip}>
          <p className={styles.tooltipLabel}>Chats</p>
          <p className={styles.tooltipValue}>{payload[0].value}</p>
        </div>
      );
    }
    return null;
  };

  // Loading state
  if (analyticsData.isLoading) {
    return (
      <Layout>
        <div className={styles.analytics}>
          <h1 className={styles.pageTitle}>Analytics</h1>
          <div className={styles.loading}>Loading analytics data...</div>
        </div>
      </Layout>
    );
  }

  // Error state
  if (analyticsData.error) {
    return (
      <Layout>
        <div className={styles.analytics}>
          <h1 className={styles.pageTitle}>Analytics</h1>
          <div className={styles.error}>{analyticsData.error}</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className={styles.analytics}>
        <h1 className={styles.pageTitle}>Analytics</h1>
        
        {/* Missed Chats Chart Section */}
        <div className={styles.chartCard}>
          <div className={styles.cardHeader}>
            <h2 className={styles.chartTitle}>Missed Chats</h2>
            <div className={styles.menuIcon}>
              <img src="/img/menu.svg" alt="Menu" />
            </div>
          </div>
          
          <div className={styles.chartContainer}>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart
                data={analyticsData.missedChats}
                margin={{ top: 20, right: 30, left: 20, bottom: 30 }}
              >
                <CartesianGrid 
                  strokeDasharray="0" 
                  horizontal={true} 
                  vertical={false} 
                  stroke="rgba(0,0,0,0.05)" 
                />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fontFamily: 'Nunito', opacity: 0.7 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fontFamily: 'Nunito', opacity: 0.7 }}
                  ticks={[0, 5, 10, 15, 20, 25]}
                  domain={[0, 25]}
                  dx={-10}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#00D907" 
                  strokeWidth={4} 
                  dot={{ stroke: '#000000', strokeWidth: 3, r: 7, fill: '#FFFFFF' }}
                  activeDot={{ stroke: '#000000', strokeWidth: 3, r: 7, fill: '#FFFFFF' }}
                  isAnimationActive={true}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Metrics Sections */}
        <div className={styles.metricsContainer}>
          {/* Average Reply Time */}
          <div className={styles.metricCard}>
            <div className={styles.metricHeader}>
              <h2 className={styles.metricTitle}>Average Reply time</h2>
              <p className={styles.metricValue}>
                {typeof analyticsData.averageReplyTime === 'string'
                  ? analyticsData.averageReplyTime
                  : `${analyticsData.averageReplyTime} secs`}
              </p>
            </div>
            <p className={styles.metricDescription}>
              For highest customer satisfaction rates you should aim to reply to an incoming customer's message in 15 
              seconds or less. Quick responses will get you more conversations, help you earn customers trust and 
              make more sales.
            </p>
          </div>
          
          {/* Resolved Tickets */}
          <div className={styles.metricCard}>
            <div className={styles.metricHeader}>
              <h2 className={styles.metricTitle}>Resolved Tickets</h2>
              <div className={styles.circleProgress}>
                <div className={styles.progressValue}>{analyticsData.resolutionRate}%</div>
              </div>
            </div>
            <p className={styles.metricDescription}>
              A callback system on a website, as well as proactive invitations, help to attract even more customers. A 
              separate round button for ordering a call with a small animation helps to motivate more 
              customers to make calls.
            </p>
          </div>
          
          {/* Total Chats */}
          <div className={styles.metricCard}>
            <div className={styles.metricHeader}>
              <h2 className={styles.metricTitle}>Total Chats</h2>
              <p className={styles.metricValue}>{analyticsData.totalChats} Chats</p>
            </div>
            <p className={styles.metricDescription}>
              This metric Shows the total number of chats for all Channels for the selected period
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Analytics; 