import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import BackButton from "../components/BackButton";
import Icon from "../components/Icon";

const MonitoringDashboard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [lotos, setLotos] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [dateFilter, setDateFilter] = useState('all'); // 'all', 'today', 'week', 'month', 'custom'
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');

  useEffect(() => {
    fetchCurrentUser();
    fetchData();
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        "https://loto-backend-643788243736.europe-west1.run.app/api/auth/me",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCurrentUser(res.data.user);
    } catch (err) {
      console.error("Error fetching user:", err);
    }
  };

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const [lotosRes, usersRes] = await Promise.all([
        axios.get("https://loto-backend-643788243736.europe-west1.run.app/api/loto", config),
        axios.get("https://loto-backend-643788243736.europe-west1.run.app/api/admin/users", config),
      ]);

      const lotosData = Array.isArray(lotosRes.data?.data) ? lotosRes.data.data : [];
      const usersData = Array.isArray(usersRes.data?.users) ? usersRes.data.users : [];

      setLotos(lotosData);
      setUsers(usersData);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching data:", err);
      setLoading(false);
    }
  };

  // Filter LOTOs by date range
  const getFilteredLotosByDate = () => {
    if (dateFilter === 'all') return lotos;

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    return lotos.filter(loto => {
      const lotoDate = new Date(loto.date);
      
      switch (dateFilter) {
        case 'today':
          const lotoDay = new Date(lotoDate.getFullYear(), lotoDate.getMonth(), lotoDate.getDate());
          return lotoDay.getTime() === today.getTime();
        
        case 'week':
          const weekAgo = new Date(today);
          weekAgo.setDate(weekAgo.getDate() - 7);
          return lotoDate >= weekAgo;
        
        case 'month':
          const monthAgo = new Date(today);
          monthAgo.setMonth(monthAgo.getMonth() - 1);
          return lotoDate >= monthAgo;
        
        case 'custom':
          if (!customStartDate && !customEndDate) return true;
          const start = customStartDate ? new Date(customStartDate) : new Date(0);
          const end = customEndDate ? new Date(customEndDate) : new Date();
          end.setHours(23, 59, 59, 999);
          return lotoDate >= start && lotoDate <= end;
        
        default:
          return true;
      }
    });
  };

  // Calculate statistics using filtered LOTOs
  const filteredLotos = getFilteredLotosByDate();
  
  const stats = {
    pendingVerification: filteredLotos.filter(l => l.status === "pending_verification_new").length,
    active: filteredLotos.filter(l => l.status === "active").length,
    pendingHandover: filteredLotos.filter(l => l.status === "pending_handover_verification").length,
    handedOver: filteredLotos.filter(l => l.status === "handed_over").length,
    completed: filteredLotos.filter(l => l.status === "completed").length,
    rejected: filteredLotos.filter(l => l.status === "rejected").length,
    shiftA: filteredLotos.filter(l => l.shift === "A").length,
    shiftB: filteredLotos.filter(l => l.shift === "B").length,
    shiftC: filteredLotos.filter(l => l.shift === "C").length,
    totalUsers: users.length,
    activeUsers: users.filter(u => u.isActive !== false).length,
    totalLotos: filteredLotos.filter(l => !l.isSnapshot).length,
    totalHandovers: filteredLotos.reduce((sum, l) => sum + (l.handoverHistory?.length || 0), 0),
    lotosWithHandovers: filteredLotos.filter(l => l.handoverHistory?.length > 0).length,
    verifiedLotos: filteredLotos.filter(l => l.verifiedBy).length,
  };

  const handleFilterClick = (filterType, filterValue, displayName) => {
    setSelectedFilter({ type: filterType, value: filterValue, displayName });
    setShowDetailsModal(true);
  };

  const getFilteredLotos = () => {
    if (!selectedFilter) return [];
    const { type, value } = selectedFilter;
    
    // Apply date filter first
    const dateFiltered = getFilteredLotosByDate();
    
    switch (type) {
      case 'status':
        return dateFiltered.filter(l => l.status === value);
      case 'shift':
        return dateFiltered.filter(l => l.shift === value);
      case 'location':
        return dateFiltered.filter(l => l.location === value);
      default:
        return [];
    }
  };

  // Chart data
  const statusChartData = [
    { name: 'Pending Verification', value: stats.pendingVerification, color: '#f59e0b', status: 'pending_verification_new', emoji: '⏳' },
    { name: 'Active', value: stats.active, color: '#10b981', status: 'active', emoji: '✅' },
    { name: 'Pending Handover', value: stats.pendingHandover, color: '#8b5cf6', status: 'pending_handover_verification', emoji: '🤝' },
    { name: 'Handed Over', value: stats.handedOver, color: '#3b82f6', status: 'handed_over', emoji: '📋' },
    { name: 'Completed', value: stats.completed, color: '#6366f1', status: 'completed', emoji: '🏁' },
    { name: 'Rejected', value: stats.rejected, color: '#ef4444', status: 'rejected', emoji: '❌' },
  ].filter(item => item.value > 0);

  const shiftChartData = [
    { name: 'Shift A', shift: 'A', value: stats.shiftA, color: '#3b82f6' },
    { name: 'Shift B', shift: 'B', value: stats.shiftB, color: '#8b5cf6' },
    { name: 'Shift C', shift: 'C', value: stats.shiftC, color: '#ec4899' },
  ].filter(item => item.value > 0);

  const locationData = {};
  lotos.forEach(loto => {
    const loc = loto.location || 'Unknown';
    if (!locationData[loc]) locationData[loc] = 0;
    locationData[loc]++;
  });

  const locationChartData = Object.entries(locationData)
    .map(([name, value]) => ({ name, value, location: name }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 8);

  // Daily trend (last 14 days)
  const dailyData = [];
  for (let i = 13; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
    const dayLotos = lotos.filter(l => {
        const lotoDate = new Date(l.date).toISOString().split('T')[0];
        return lotoDate === dateStr;
      });

    dailyData.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      total: dayLotos.length,
      completed: dayLotos.filter(l => l.status === 'completed').length,
      active: dayLotos.filter(l => l.status === 'active').length,
    });
  }

  if (!currentUser || currentUser.role !== "admin") {
    return (
      <div className="loto-details-container animate-fade-in">
        <div style={{ textAlign: 'center', padding: '5rem 2rem', background: 'white', borderRadius: '20px', maxWidth: '600px', margin: '2rem auto', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}>
          <div style={{ fontSize: '5rem', marginBottom: '1.5rem', filter: 'grayscale(1)', opacity: 0.5 }}>🔒</div>
          <h2 style={{ fontSize: '2rem', fontWeight: '800', color: '#1f2937', marginBottom: '1rem' }}>Access Denied</h2>
          <p style={{ fontSize: '1.1rem', color: '#6b7280', marginBottom: '2rem' }}>
            Administrator privileges required
          </p>
          <button 
            onClick={() => navigate("/Home")}
            style={{
              padding: '1rem 2.5rem',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '1rem',
              boxShadow: '0 10px 15px -3px rgba(102, 126, 234, 0.4)',
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
            onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
          >
            ← Return to Home
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="loto-details-container animate-fade-in">
        <div style={{ textAlign: 'center', padding: '5rem 2rem' }}>
          <div className="loading-spinner" style={{ width: '60px', height: '60px', margin: '0 auto 2rem' }}></div>
          <h3 style={{ fontSize: '1.5rem', color: '#6b7280' }}>Loading Dashboard...</h3>
          <p style={{ color: '#9ca3af', marginTop: '0.5rem' }}>Fetching real-time data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="loto-details-container animate-fade-in" style={{ 
      maxWidth: '1600px', 
      margin: '0 auto',
      background: '#f8f9fa',
      minHeight: '100vh'
    }}>
      <BackButton to="/Home" label="Back to Home" />
      
      {/* Professional Header */}
      <div className="loto-details-header" style={{
        background: 'linear-gradient(135deg, #0033a0 0%, #0052cc 100%)',
        padding: '2rem',
        marginBottom: '2rem',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        borderRadius: '0 0 16px 16px'
      }}>
        <div className="header-content" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="header-brand" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div className="brand-icon" style={{
              background: 'rgba(255,255,255,0.15)',
              padding: '1rem',
              borderRadius: '12px',
              backdropFilter: 'blur(10px)'
            }}>
              <Icon name="chart" size={32} color="white" />
            </div>
            <div className="brand-text">
              <h1 style={{ 
                fontSize: '2rem', 
                fontWeight: '700', 
                color: 'white',
                margin: '0 0 0.25rem 0',
                lineHeight: '1.2'
              }}>
                {t('monitoringDashboard.title')}
              </h1>
              <p style={{ 
                fontSize: '1rem', 
                color: 'rgba(255,255,255,0.9)',
                margin: 0,
                fontWeight: '400'
              }}>
                {t('monitoringDashboard.subtitle')}
              </p>
            </div>
          </div>
          <div className="header-actions" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.75rem',
              padding: '0.75rem 1.25rem',
              background: 'rgba(255,255,255,0.15)',
              borderRadius: '10px',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.2)'
            }}>
              <Icon name="refresh" size={18} color="rgba(255,255,255,0.9)" />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.125rem' }}>
                <span style={{ fontSize: '0.7rem', fontWeight: '500', color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Last Updated
                </span>
                <span style={{ fontSize: '0.95rem', fontWeight: '700', color: 'white' }}>
                  {currentTime.toLocaleTimeString()}
                </span>
              </div>
            </div>
            <button
              className="action-btn secondary"
              onClick={fetchData}
              style={{
                background: 'white',
                color: '#0033a0',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '10px',
                fontWeight: '600',
                fontSize: '0.95rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <Icon name="refresh" size={20} color="#0033a0" />
              <span>{t('monitoringDashboard.refresh')}</span>
            </button>
            <button
              className="action-btn primary"
              onClick={() => navigate("/Home")}
              style={{
                background: 'rgba(255,255,255,0.2)',
                color: 'white',
                border: '2px solid rgba(255,255,255,0.4)',
                padding: '0.75rem 1.5rem',
                borderRadius: '10px',
                fontWeight: '600',
                fontSize: '0.95rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
                backdropFilter: 'blur(10px)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.3)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <Icon name="home" size={20} />
              <span>{t('monitoringDashboard.home')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Date Filter Section */}
      <div style={{
        background: 'white',
        padding: '1.5rem 2rem',
        marginBottom: '2rem',
        borderRadius: '12px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
        marginLeft: '2rem',
        marginRight: '2rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Icon name="calendar" size={20} color="#6b7280" />
            <span style={{ fontWeight: '600', color: '#374151', fontSize: '0.95rem' }}>Filter by Date:</span>
          </div>
          
          <button
            onClick={() => {
              setDateFilter('all');
              setCustomStartDate('');
              setCustomEndDate('');
            }}
            style={{
              padding: '0.5rem 1.25rem',
              borderRadius: '8px',
              border: dateFilter === 'all' ? '2px solid #0033a0' : '2px solid #e5e7eb',
              background: dateFilter === 'all' ? '#0033a0' : 'white',
              color: dateFilter === 'all' ? 'white' : '#6b7280',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '0.875rem',
              transition: 'all 0.2s'
            }}
          >
            All Time
          </button>

          <button
            onClick={() => setDateFilter('today')}
            style={{
              padding: '0.5rem 1.25rem',
              borderRadius: '8px',
              border: dateFilter === 'today' ? '2px solid #0033a0' : '2px solid #e5e7eb',
              background: dateFilter === 'today' ? '#0033a0' : 'white',
              color: dateFilter === 'today' ? 'white' : '#6b7280',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '0.875rem',
              transition: 'all 0.2s'
            }}
          >
            Today
          </button>

          <button
            onClick={() => setDateFilter('week')}
            style={{
              padding: '0.5rem 1.25rem',
              borderRadius: '8px',
              border: dateFilter === 'week' ? '2px solid #0033a0' : '2px solid #e5e7eb',
              background: dateFilter === 'week' ? '#0033a0' : 'white',
              color: dateFilter === 'week' ? 'white' : '#6b7280',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '0.875rem',
              transition: 'all 0.2s'
            }}
          >
            Last 7 Days
          </button>

          <button
            onClick={() => setDateFilter('month')}
            style={{
              padding: '0.5rem 1.25rem',
              borderRadius: '8px',
              border: dateFilter === 'month' ? '2px solid #0033a0' : '2px solid #e5e7eb',
              background: dateFilter === 'month' ? '#0033a0' : 'white',
              color: dateFilter === 'month' ? 'white' : '#6b7280',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '0.875rem',
              transition: 'all 0.2s'
            }}
          >
            Last 30 Days
          </button>

          <button
            onClick={() => setDateFilter('custom')}
            style={{
              padding: '0.5rem 1.25rem',
              borderRadius: '8px',
              border: dateFilter === 'custom' ? '2px solid #0033a0' : '2px solid #e5e7eb',
              background: dateFilter === 'custom' ? '#0033a0' : 'white',
              color: dateFilter === 'custom' ? 'white' : '#6b7280',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '0.875rem',
              transition: 'all 0.2s'
            }}
          >
            Custom Range
          </button>

          {dateFilter === 'custom' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginLeft: '1rem', padding: '0.5rem', background: '#f9fafb', borderRadius: '8px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <label style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: '600' }}>From:</label>
                <input
                  type="date"
                  value={customStartDate}
                  onChange={(e) => setCustomStartDate(e.target.value)}
                  style={{
                    padding: '0.5rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '0.875rem',
                    fontFamily: 'inherit'
                  }}
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <label style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: '600' }}>To:</label>
                <input
                  type="date"
                  value={customEndDate}
                  onChange={(e) => setCustomEndDate(e.target.value)}
                  style={{
                    padding: '0.5rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '0.875rem',
                    fontFamily: 'inherit'
                  }}
                />
          </div>
        </div>
      )}
        </div>
      </div>

      {/* Professional Status Cards Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', 
        gap: '1.25rem',
        padding: '0 2rem',
        marginBottom: '2.5rem'
      }}>
        {/* Total LOTOs */}
        <div 
          onClick={() => navigate('/loto-list')}
          style={{
            background: 'white',
            borderRadius: '16px',
            padding: '1.5rem',
            cursor: 'pointer',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.08)',
            border: '1px solid rgba(0,51,160,0.1)',
            position: 'relative',
            overflow: 'hidden'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-6px)';
            e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,51,160,0.15)';
            e.currentTarget.style.borderColor = '#0033a0';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.08)';
            e.currentTarget.style.borderColor = 'rgba(0,51,160,0.1)';
          }}
        >
          <div style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '80px',
            height: '80px',
            background: 'linear-gradient(135deg, rgba(0,51,160,0.1) 0%, transparent 100%)',
            borderRadius: '0 16px 0 100%'
          }} />
          <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.75rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', position: 'relative' }}>
            Total LOTOs
          </div>
          <div style={{ fontSize: '2.75rem', fontWeight: '800', color: '#0033a0', lineHeight: '1', position: 'relative' }}>
            {stats.totalLotos}
          </div>
          <div style={{ 
            marginTop: '0.5rem', 
            fontSize: '0.7rem', 
            color: '#9ca3af',
            fontWeight: '500',
            position: 'relative'
          }}>
            Click to view all
          </div>
        </div>

        {/* Pending Verification */}
        <div 
          onClick={() => handleFilterClick('status', 'pending_verification_new', 'Pending Verification')}
          style={{
            background: 'white',
            borderRadius: '16px',
            padding: '1.5rem',
            cursor: 'pointer',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.08)',
            border: '1px solid rgba(245,158,11,0.1)',
            position: 'relative',
            overflow: 'hidden'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-6px)';
            e.currentTarget.style.boxShadow = '0 12px 24px rgba(245,158,11,0.15)';
            e.currentTarget.style.borderColor = '#f59e0b';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.08)';
            e.currentTarget.style.borderColor = 'rgba(245,158,11,0.1)';
          }}
        >
          <div style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '80px',
            height: '80px',
            background: 'linear-gradient(135deg, rgba(245,158,11,0.1) 0%, transparent 100%)',
            borderRadius: '0 16px 0 100%'
          }} />
          <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.75rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', position: 'relative' }}>
            Pending
          </div>
          <div style={{ fontSize: '2.75rem', fontWeight: '800', color: '#f59e0b', lineHeight: '1', position: 'relative' }}>
            {stats.pendingVerification}
          </div>
          <div style={{ 
            marginTop: '0.5rem', 
            fontSize: '0.7rem', 
            color: '#9ca3af',
            fontWeight: '500',
            position: 'relative'
          }}>
            Awaiting verification
          </div>
        </div>

        {/* Active */}
        <div 
          onClick={() => handleFilterClick('status', 'active', 'Active LOTOs')}
          style={{
            background: 'white',
            borderRadius: '16px',
            padding: '1.5rem',
            cursor: 'pointer',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.08)',
            border: '1px solid rgba(16,185,129,0.1)',
            position: 'relative',
            overflow: 'hidden'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-6px)';
            e.currentTarget.style.boxShadow = '0 12px 24px rgba(16,185,129,0.15)';
            e.currentTarget.style.borderColor = '#10b981';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.08)';
            e.currentTarget.style.borderColor = 'rgba(16,185,129,0.1)';
          }}
        >
          <div style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '80px',
            height: '80px',
            background: 'linear-gradient(135deg, rgba(16,185,129,0.1) 0%, transparent 100%)',
            borderRadius: '0 16px 0 100%'
          }} />
          <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.75rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', position: 'relative' }}>
            Active
          </div>
          <div style={{ fontSize: '2.75rem', fontWeight: '800', color: '#10b981', lineHeight: '1', position: 'relative' }}>
            {stats.active}
          </div>
          <div style={{ 
            marginTop: '0.5rem', 
            fontSize: '0.7rem', 
            color: '#9ca3af',
            fontWeight: '500',
            position: 'relative'
          }}>
            Currently in progress
          </div>
        </div>

        {/* Completed */}
        <div 
          onClick={() => handleFilterClick('status', 'completed', 'Completed LOTOs')}
          style={{
            background: 'white',
            borderRadius: '16px',
            padding: '1.5rem',
            cursor: 'pointer',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.08)',
            border: '1px solid rgba(99,102,241,0.1)',
            position: 'relative',
            overflow: 'hidden'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-6px)';
            e.currentTarget.style.boxShadow = '0 12px 24px rgba(99,102,241,0.15)';
            e.currentTarget.style.borderColor = '#6366f1';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.08)';
            e.currentTarget.style.borderColor = 'rgba(99,102,241,0.1)';
          }}
        >
          <div style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '80px',
            height: '80px',
            background: 'linear-gradient(135deg, rgba(99,102,241,0.1) 0%, transparent 100%)',
            borderRadius: '0 16px 0 100%'
          }} />
          <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.75rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', position: 'relative' }}>
            Completed
          </div>
          <div style={{ fontSize: '2.75rem', fontWeight: '800', color: '#6366f1', lineHeight: '1', position: 'relative' }}>
            {stats.completed}
          </div>
          <div style={{ 
            marginTop: '0.5rem', 
            fontSize: '0.7rem', 
            color: '#9ca3af',
            fontWeight: '500',
            position: 'relative'
          }}>
            Successfully finished
          </div>
        </div>

        {/* Pending Handover */}
        {stats.pendingHandover > 0 && (
          <div 
            onClick={() => handleFilterClick('status', 'pending_handover_verification', 'Pending Handover')}
            style={{
              background: 'white',
              borderRadius: '16px',
              padding: '1.5rem',
              cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.08)',
              border: '1px solid rgba(139,92,246,0.1)',
              position: 'relative',
              overflow: 'hidden'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-6px)';
              e.currentTarget.style.boxShadow = '0 12px 24px rgba(139,92,246,0.15)';
              e.currentTarget.style.borderColor = '#8b5cf6';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.08)';
              e.currentTarget.style.borderColor = 'rgba(139,92,246,0.1)';
            }}
          >
            <div style={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: '80px',
              height: '80px',
              background: 'linear-gradient(135deg, rgba(139,92,246,0.1) 0%, transparent 100%)',
              borderRadius: '0 16px 0 100%'
            }} />
            <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.75rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', position: 'relative' }}>
              Handover
      </div>
            <div style={{ fontSize: '2.75rem', fontWeight: '800', color: '#8b5cf6', lineHeight: '1', position: 'relative' }}>
              {stats.pendingHandover}
            </div>
            <div style={{ 
              marginTop: '0.5rem', 
              fontSize: '0.7rem', 
              color: '#9ca3af',
              fontWeight: '500',
              position: 'relative'
            }}>
              Pending transfer
            </div>
          </div>
        )}

        {/* Rejected */}
        {stats.rejected > 0 && (
          <div 
            onClick={() => handleFilterClick('status', 'rejected', 'Rejected LOTOs')}
            style={{
              background: 'white',
              borderRadius: '16px',
              padding: '1.5rem',
              cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.08)',
              border: '1px solid rgba(239,68,68,0.1)',
              position: 'relative',
              overflow: 'hidden'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-6px)';
              e.currentTarget.style.boxShadow = '0 12px 24px rgba(239,68,68,0.15)';
              e.currentTarget.style.borderColor = '#ef4444';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.08)';
              e.currentTarget.style.borderColor = 'rgba(239,68,68,0.1)';
            }}
          >
            <div style={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: '80px',
              height: '80px',
              background: 'linear-gradient(135deg, rgba(239,68,68,0.1) 0%, transparent 100%)',
              borderRadius: '0 16px 0 100%'
            }} />
            <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.75rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', position: 'relative' }}>
              Rejected
          </div>
            <div style={{ fontSize: '2.75rem', fontWeight: '800', color: '#ef4444', lineHeight: '1', position: 'relative' }}>
              {stats.rejected}
          </div>
            <div style={{ 
              marginTop: '0.5rem', 
              fontSize: '0.7rem', 
              color: '#9ca3af',
              fontWeight: '500',
              position: 'relative'
            }}>
              Not approved
            </div>
          </div>
        )}
        </div>

      {/* Main Content */}
      <div className="loto-details-content">

        {/* Charts Section */}
        <div className="additional-info-sections" style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))',
          gap: '1.5rem',
          padding: '0 2rem 2rem'
        }}>
          {/* Status Distribution - Donut Chart */}
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '2rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.08)',
            border: '1px solid rgba(0,0,0,0.05)',
            transition: 'all 0.3s'
          }}>
            <div style={{ marginBottom: '1.5rem' }}>
              <h5 style={{ 
                fontSize: '1.25rem', 
                fontWeight: '700', 
                color: '#111827',
                margin: '0 0 0.5rem 0',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem'
              }}>
                <span style={{ 
                  background: 'linear-gradient(135deg, #0033a0, #0052cc)',
                  width: '8px',
                  height: '32px',
                  borderRadius: '4px',
                  display: 'inline-block'
                }} />
                Status Distribution
              </h5>
              <p style={{ 
                fontSize: '0.875rem', 
                color: '#6b7280',
                margin: 0,
                paddingLeft: '1.5rem'
              }}>
                Click on any segment to view LOTOs
              </p>
          </div>
              <div style={{ height: '300px', marginTop: '1rem' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip 
                  formatter={(value, name) => {
                    const total = statusChartData.reduce((sum, item) => sum + item.value, 0);
                    const percent = total > 0 ? ((value / total) * 100).toFixed(1) : '0.0';
                    return [`${percent}%`, name];
                  }}
                  labelStyle={{ color: '#374151', fontWeight: '600' }}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    padding: '8px 12px'
                  }}
                />
                <Pie
                  data={statusChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={0}
                  outerRadius={120}
                  dataKey="value"
                  paddingAngle={3}
                  labelLine={false}
                  onClick={(data) => {
                    if (data && data.status) {
                      handleFilterClick('status', data.status, data.name);
                    }
                  }}
                  label={false}
                >
                  {statusChartData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.color}
                      style={{ 
                        cursor: 'pointer',
                        filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))',
                        transition: 'all 0.3s'
                      }}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
        </div>

          {/* Custom Legend */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(2, 1fr)', 
            gap: '0.75rem',
            marginTop: '1rem'
          }}>
            {statusChartData.map((item, index) => (
              <div 
                key={index}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onClick={() => handleFilterClick('status', item.status, item.name)}
                onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <div style={{ 
                  width: '12px', 
                  height: '12px', 
                  borderRadius: '50%', 
                  background: item.color,
                  flexShrink: 0
                }}></div>
                <span style={{ fontSize: '0.85rem', fontWeight: '600', color: '#374151' }}>
                  {item.emoji} {item.name}
                </span>
                <span style={{ 
                  marginLeft: 'auto', 
                  fontSize: '0.9rem', 
                  fontWeight: '800', 
                  color: item.color,
                  background: item.color + '15',
                  padding: '0.15rem 0.5rem',
                  borderRadius: '6px'
                }}>
                  {item.value}
                </span>
          </div>
            ))}
              </div>
          </div>
        </div>

          {/* Shift Distribution */}
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '2rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.08)',
            border: '1px solid rgba(0,0,0,0.05)',
            transition: 'all 0.3s'
          }}>
            <div style={{ marginBottom: '1.5rem' }}>
              <h5 style={{ 
                fontSize: '1.25rem', 
                fontWeight: '700', 
                color: '#111827',
                margin: '0 0 0.5rem 0',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem'
              }}>
                <span style={{ 
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  width: '8px',
                  height: '32px',
                  borderRadius: '4px',
                  display: 'inline-block'
                }} />
                Shift Distribution
              </h5>
              <p style={{ 
                fontSize: '0.875rem', 
                color: '#6b7280',
                margin: 0,
                paddingLeft: '1.5rem'
              }}>
                LOTO activity by shift (A, B, C)
              </p>
          </div>
              <div style={{ height: '280px', marginTop: '1rem' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={shiftChartData}
                onClick={(data) => {
                  if (data && data.activePayload && data.activePayload[0]) {
                    const shift = data.activePayload[0].payload.shift;
                    const name = data.activePayload[0].payload.name;
                    handleFilterClick('shift', shift, name);
                  }
                }}
                margin={{ top: 30, right: 30, left: 20, bottom: 30 }}
              >
                <defs>
                  {shiftChartData.map((entry, index) => (
                    <linearGradient key={index} id={`colorShift${index}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={entry.color} stopOpacity={0.9}/>
                      <stop offset="95%" stopColor={entry.color} stopOpacity={0.7}/>
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" strokeWidth={1.5} />
                <XAxis 
                  dataKey="name" 
                  stroke="#6b7280"
                  style={{ fontSize: '1rem', fontWeight: '700' }}
                  tickLine={false}
                />
                <YAxis 
                  stroke="#6b7280" 
                  style={{ fontSize: '0.9rem' }}
                  tickLine={false}
                />
                <Tooltip 
                  cursor={{ fill: 'rgba(99, 102, 241, 0.1)' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div style={{
                          background: 'white',
                          padding: '1rem 1.25rem',
                          borderRadius: '12px',
                          boxShadow: '0 10px 25px -5px rgba(0,0,0,0.15)',
                          border: '2px solid ' + data.color
                        }}>
                          <div style={{ fontWeight: '700', fontSize: '1.1rem', color: data.color, marginBottom: '0.5rem' }}>
                            {data.name}
                          </div>
                          <div style={{ fontSize: '1.75rem', fontWeight: '900', color: '#111827' }}>
                            {data.value} LOTOs
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar 
                  dataKey="value" 
                  radius={[16, 16, 0, 0]}
                  maxBarSize={100}
                >
                  {shiftChartData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={`url(#colorShift${index})`}
                      style={{ cursor: 'pointer' }}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

          {/* 14-Day Trend */}
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '2rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.08)',
            border: '1px solid rgba(0,0,0,0.05)',
            transition: 'all 0.3s'
          }}>
            <div style={{ marginBottom: '1.5rem' }}>
              <h5 style={{ 
                fontSize: '1.25rem', 
                fontWeight: '700', 
                color: '#111827',
                margin: '0 0 0.5rem 0',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem'
              }}>
                <span style={{ 
                  background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                  width: '8px',
                  height: '32px',
                  borderRadius: '4px',
                  display: 'inline-block'
                }} />
                14-Day Activity Trend
              </h5>
              <p style={{ 
                fontSize: '0.875rem', 
                color: '#6b7280',
                margin: 0,
                paddingLeft: '1.5rem'
              }}>
                LOTO creation and completion trends
              </p>
          </div>
              <div style={{ height: '280px', marginTop: '1rem' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dailyData} margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.05}/>
                  </linearGradient>
                  <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.05}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" strokeWidth={1.5} />
                <XAxis 
                  dataKey="date" 
                  stroke="#6b7280"
                  style={{ fontSize: '0.8rem' }}
                  tickLine={false}
                />
                <YAxis 
                  stroke="#6b7280" 
                  style={{ fontSize: '0.9rem' }}
                  tickLine={false}
                />
                <Tooltip 
                  contentStyle={{
                    background: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '1rem',
                    boxShadow: '0 10px 25px -5px rgba(0,0,0,0.15)'
                  }}
                />
                <Legend 
                  wrapperStyle={{ paddingTop: '1rem' }}
                  iconType="circle"
                />
                <Area 
                  type="monotone" 
                  dataKey="total" 
                  stroke="#6366f1"
                  strokeWidth={3}
                  fill="url(#colorTotal)"
                  name="Total Created"
                />
                <Area 
                  type="monotone" 
                  dataKey="completed" 
                  stroke="#10b981"
                  strokeWidth={3}
                  fill="url(#colorCompleted)"
                  name="Completed"
                />
              </AreaChart>
            </ResponsiveContainer>
                  </div>
                  </div>

          {/* Top Locations */}
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '2rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.08)',
            border: '1px solid rgba(0,0,0,0.05)',
            transition: 'all 0.3s'
          }}>
            <div style={{ marginBottom: '1.5rem' }}>
              <h5 style={{ 
                fontSize: '1.25rem', 
                fontWeight: '700', 
                color: '#111827',
                margin: '0 0 0.5rem 0',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem'
              }}>
                <span style={{ 
                  background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                  width: '8px',
                  height: '32px',
                  borderRadius: '4px',
                  display: 'inline-block'
                }} />
                Top Locations
              </h5>
              <p style={{ 
                fontSize: '0.875rem', 
                color: '#6b7280',
                margin: 0,
                paddingLeft: '1.5rem'
              }}>
                Most active production areas
              </p>
                </div>
              <div style={{ height: '280px', marginTop: '1rem' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={locationChartData}
                onClick={(data) => {
                  if (data && data.activePayload && data.activePayload[0]) {
                    const location = data.activePayload[0].payload.location;
                    const name = data.activePayload[0].payload.name;
                    handleFilterClick('location', location, name);
                  }
                }}
                margin={{ top: 10, right: 30, left: 10, bottom: 80 }}
              >
                <defs>
                  <linearGradient id="colorLocation" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.9}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.6}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" strokeWidth={1.5} />
                <XAxis 
                  dataKey="name"
                  stroke="#6b7280"
                  style={{ fontSize: '0.75rem' }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  tickLine={false}
                />
                <YAxis 
                  stroke="#6b7280" 
                  style={{ fontSize: '0.9rem' }}
                  tickLine={false}
                />
                <Tooltip 
                  cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }}
                  contentStyle={{
                    background: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '1rem',
                    boxShadow: '0 10px 25px -5px rgba(0,0,0,0.15)'
                  }}
                />
                <Bar 
                  dataKey="value" 
                  fill="url(#colorLocation)"
                  radius={[16, 16, 0, 0]}
                  style={{ cursor: 'pointer' }}
                  maxBarSize={60}
                />
              </BarChart>
            </ResponsiveContainer>
              </div>
          </div>
       

        {/* Quick Stats - Full Width */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '2rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.08)',
          border: '1px solid rgba(0,0,0,0.05)',
          margin: '0 2rem 2rem',
          transition: 'all 0.3s'
        }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <h5 style={{ 
              fontSize: '1.25rem', 
              fontWeight: '700', 
              color: '#111827',
              margin: '0 0 0.5rem 0',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem'
            }}>
              <span style={{ 
                background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                width: '8px',
                height: '32px',
                borderRadius: '4px',
                display: 'inline-block'
              }} />
              Quick Insights
            </h5>
            <p style={{ 
              fontSize: '0.875rem', 
              color: '#6b7280',
              margin: 0,
              paddingLeft: '1.5rem'
            }}>
              Additional statistics and metrics
            </p>
        </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '1.25rem'
          }}>
            {/* Active Users */}
            <div style={{ 
              padding: '1.5rem', 
              background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)', 
              borderRadius: '12px', 
              border: '1px solid #bfdbfe',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div style={{ fontSize: '0.75rem', color: '#1e40af', marginBottom: '0.75rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Active Users
          </div>
              <div style={{ fontSize: '2rem', fontWeight: '800', color: '#1e3a8a' }}>
                {stats.activeUsers}
                <span style={{ fontSize: '1.1rem', opacity: 0.6, fontWeight: '600' }}> / {stats.totalUsers}</span>
              </div>
            </div>

            {/* Verified */}
            <div style={{ 
              padding: '1.5rem', 
              background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)', 
              borderRadius: '12px', 
              border: '1px solid #bbf7d0',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div style={{ fontSize: '0.75rem', color: '#15803d', marginBottom: '0.75rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Verified LOTOs
              </div>
              <div style={{ fontSize: '2rem', fontWeight: '800', color: '#166534' }}>
                {stats.verifiedLotos}
                <span style={{ fontSize: '1.1rem', opacity: 0.6, fontWeight: '600' }}>
                  {' '}({stats.totalLotos > 0 ? Math.round((stats.verifiedLotos / stats.totalLotos) * 100) : 0}%)
                </span>
            </div>
            </div>

            {/* Handovers */}
            <div style={{ 
              padding: '1.5rem', 
              background: 'linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%)', 
              borderRadius: '12px', 
              border: '1px solid #e9d5ff',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div style={{ fontSize: '0.75rem', color: '#7c3aed', marginBottom: '0.75rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Total Handovers
            </div>
              <div style={{ fontSize: '2rem', fontWeight: '800', color: '#6b21a8' }}>
                {stats.totalHandovers}
          </div>
              <div style={{ fontSize: '0.75rem', color: '#7c3aed', marginTop: '0.5rem', opacity: 0.8, fontWeight: '500' }}>
                {stats.lotosWithHandovers} LOTOs with handovers
        </div>
      </div>

            {/* Completion Rate */}
            <div style={{ 
              padding: '1.5rem', 
              background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)', 
              borderRadius: '12px', 
              border: '1px solid #fcd34d',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div style={{ fontSize: '0.75rem', color: '#92400e', marginBottom: '0.75rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Completion Rate
          </div>
              <div style={{ fontSize: '2rem', fontWeight: '800', color: '#78350f' }}>
                {stats.totalLotos > 0 ? Math.round((stats.completed / stats.totalLotos) * 100) : 0}%
            </div>
              <div style={{ fontSize: '0.75rem', color: '#92400e', marginTop: '0.5rem', opacity: 0.8, fontWeight: '500' }}>
                {stats.completed} / {stats.totalLotos} LOTOs
              </div>
            </div>
              </div>
            </div>
     

      {/* Details Modal - Ultra Modern */}
      {showDetailsModal && selectedFilter && ReactDOM.createPortal(
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.7)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px',
            animation: 'fadeIn 0.2s ease-out'
          }}
          onClick={() => setShowDetailsModal(false)}
        >
          <div 
            style={{
              background: 'white',
              borderRadius: '24px',
              maxWidth: '1100px',
              width: '100%',
              maxHeight: '90vh',
              overflow: 'hidden',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
              display: 'flex',
              flexDirection: 'column',
              animation: 'slideUp 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header - Gradient */}
            <div style={{
              padding: '2rem',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{
                position: 'absolute',
                top: '-30px',
                left: '-30px',
                width: '150px',
                height: '150px',
                background: 'rgba(255,255,255,0.1)',
                borderRadius: '50%'
              }}></div>
              
              <div style={{ position: 'relative', zIndex: 1 }}>
                <h2 style={{ 
                  margin: 0, 
                  fontSize: '2rem', 
                  fontWeight: '800',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem'
                }}>
                  <span style={{ fontSize: '2.5rem' }}>📋</span>
                  {selectedFilter.displayName}
                </h2>
                <p style={{ 
                  margin: '0.75rem 0 0 0', 
                  fontSize: '1.1rem', 
                  opacity: 0.95,
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <span style={{ 
                    background: 'rgba(255,255,255,0.2)', 
                    padding: '0.25rem 0.75rem', 
                    borderRadius: '8px',
                    fontSize: '1.2rem',
                    fontWeight: '800'
                  }}>
                    {getFilteredLotos().length}
                  </span>
                  LOTOs found
                </p>
              </div>
              
              <button 
                onClick={() => setShowDetailsModal(false)}
                style={{
                  background: 'rgba(255,255,255,0.2)',
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderRadius: '12px',
                  width: '48px',
                  height: '48px',
                  cursor: 'pointer',
                  color: 'white',
                  fontSize: '1.5rem',
                  fontWeight: '700',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s',
                  backdropFilter: 'blur(10px)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(255,255,255,0.3)';
                  e.target.style.transform = 'rotate(90deg)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'rgba(255,255,255,0.2)';
                  e.target.style.transform = 'rotate(0deg)';
                }}
              >
                ✕
              </button>
            </div>

            {/* Modal Content - Scrollable Table */}
            <div style={{ padding: '2rem', overflow: 'auto', flex: 1, background: '#fafbfc' }}>
              {getFilteredLotos().length === 0 ? (
                <div style={{ 
                  textAlign: 'center', 
                  padding: '4rem 2rem',
                  background: 'white',
                  borderRadius: '16px',
                  border: '2px dashed #e5e7eb'
                }}>
                  <div style={{ fontSize: '4rem', marginBottom: '1rem', opacity: 0.5 }}>📭</div>
                  <h3 style={{ fontSize: '1.5rem', color: '#6b7280', fontWeight: '700' }}>
                    No LOTOs Found
                  </h3>
                  <p style={{ color: '#9ca3af', marginTop: '0.5rem' }}>
                    No LOTOs match this filter criteria
                  </p>
          </div>
              ) : (
                <div style={{ 
                  background: 'white', 
                  borderRadius: '16px', 
                  overflow: 'hidden',
                  border: '1px solid #e5e7eb'
                }}>
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ 
                      width: '100%', 
                      borderCollapse: 'collapse',
                      fontSize: '0.9rem'
                    }}>
                      <thead>
                        <tr style={{ background: 'linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)' }}>
                          <th style={{ 
                            padding: '1.25rem 1rem', 
                            textAlign: 'left', 
                            fontWeight: '800', 
                            color: '#111827',
                            fontSize: '0.85rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            borderBottom: '3px solid #e5e7eb'
                          }}>
                            Serial #
                          </th>
                          <th style={{ padding: '1.25rem 1rem', textAlign: 'left', fontWeight: '800', color: '#111827', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '3px solid #e5e7eb' }}>
                            Date
                          </th>
                          <th style={{ padding: '1.25rem 1rem', textAlign: 'center', fontWeight: '800', color: '#111827', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '3px solid #e5e7eb' }}>
                            Shift
                          </th>
                          <th style={{ padding: '1.25rem 1rem', textAlign: 'left', fontWeight: '800', color: '#111827', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '3px solid #e5e7eb' }}>
                            Location
                          </th>
                          <th style={{ padding: '1.25rem 1rem', textAlign: 'left', fontWeight: '800', color: '#111827', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '3px solid #e5e7eb' }}>
                            Isolator
                          </th>
                          <th style={{ padding: '1.25rem 1rem', textAlign: 'left', fontWeight: '800', color: '#111827', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '3px solid #e5e7eb' }}>
                            Status
                          </th>
                          <th style={{ padding: '1.25rem 1rem', textAlign: 'center', fontWeight: '800', color: '#111827', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '3px solid #e5e7eb' }}>
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {getFilteredLotos().map((loto, index) => (
                          <tr 
                            key={loto._id} 
                            style={{ 
                              background: 'white',
                              borderBottom: '1px solid #f3f4f6',
                              transition: 'all 0.2s'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.background = '#f0f9ff'}
                            onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                          >
                            <td style={{ padding: '1.25rem 1rem' }}>
                              <span style={{ 
                                fontWeight: '800', 
                                color: '#3b82f6',
                                fontSize: '1rem'
                              }}>
                                {loto.serialNumber}
                              </span>
                            </td>
                            <td style={{ padding: '1.25rem 1rem', color: '#6b7280', fontSize: '0.85rem' }}>
                              {new Date(loto.date).toLocaleDateString('en-US', { 
                                month: 'short', 
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </td>
                            <td style={{ padding: '1.25rem 1rem', textAlign: 'center' }}>
                              <span style={{
                                padding: '0.4rem 1rem',
                                background: loto.shift === 'A' ? '#dbeafe' : loto.shift === 'B' ? '#e9d5ff' : '#fce7f3',
                                color: loto.shift === 'A' ? '#1e40af' : loto.shift === 'B' ? '#6b21a8' : '#9f1239',
                                borderRadius: '8px',
                                fontWeight: '800',
                                fontSize: '0.9rem',
                                border: '2px solid ' + (loto.shift === 'A' ? '#93c5fd' : loto.shift === 'B' ? '#d8b4fe' : '#fbcfe8')
                              }}>
                                {loto.shift}
                              </span>
                            </td>
                            <td style={{ padding: '1.25rem 1rem', color: '#374151', fontWeight: '600' }}>
                              {loto.location}
                            </td>
                            <td style={{ padding: '1.25rem 1rem', color: '#6b7280' }}>
                              {loto.isolatorName}
                            </td>
                            <td style={{ padding: '1.25rem 1rem' }}>
                              <span style={{
                                padding: '0.5rem 1rem',
                                borderRadius: '10px',
                                fontSize: '0.8rem',
                                fontWeight: '700',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                background: 
                                  loto.status === 'completed' ? '#d1fae5' :
                                  loto.status === 'active' ? '#d1fae5' :
                                  loto.status === 'pending_verification_new' ? '#fef3c7' :
                                  loto.status === 'pending_handover_verification' ? '#e9d5ff' :
                                  loto.status === 'rejected' ? '#fee2e2' : '#f3f4f6',
                                color: 
                                  loto.status === 'completed' ? '#065f46' :
                                  loto.status === 'active' ? '#065f46' :
                                  loto.status === 'pending_verification_new' ? '#92400e' :
                                  loto.status === 'pending_handover_verification' ? '#6b21a8' :
                                  loto.status === 'rejected' ? '#991b1b' : '#374151',
                                border: '2px solid ' + (
                                  loto.status === 'completed' ? '#6ee7b7' :
                                  loto.status === 'active' ? '#6ee7b7' :
                                  loto.status === 'pending_verification_new' ? '#fcd34d' :
                                  loto.status === 'pending_handover_verification' ? '#d8b4fe' :
                                  loto.status === 'rejected' ? '#fca5a5' : '#e5e7eb')
                              }}>
                                {loto.status === 'completed' && '🏁'}
                                {loto.status === 'active' && '✅'}
                                {loto.status === 'pending_verification_new' && '⏳'}
                                {loto.status === 'pending_handover_verification' && '🤝'}
                                {loto.status === 'rejected' && '❌'}
                                {loto.status === 'pending_verification_new' ? 'Pending' :
                                 loto.status === 'pending_handover_verification' ? 'Handover' :
                                 loto.status.charAt(0).toUpperCase() + loto.status.slice(1)}
                              </span>
                            </td>
                            <td style={{ padding: '1.25rem 1rem', textAlign: 'center' }}>
                              <button
                                onClick={() => {
                                  setShowDetailsModal(false);
                                  navigate(`/loto/${loto._id}`);
                                }}
                                style={{
                                  padding: '0.65rem 1.5rem',
                                  background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                                  color: 'white',
                                  border: 'none',
                                  borderRadius: '10px',
                                  cursor: 'pointer',
                                  fontSize: '0.85rem',
                                  fontWeight: '700',
                                  transition: 'all 0.3s',
                                  boxShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.3)'
                                }}
                                onMouseEnter={(e) => {
                                  e.target.style.transform = 'translateY(-2px)';
                                  e.target.style.boxShadow = '0 10px 15px -3px rgba(59, 130, 246, 0.5)';
                                }}
                                onMouseLeave={(e) => {
                                  e.target.style.transform = 'translateY(0)';
                                  e.target.style.boxShadow = '0 4px 6px -1px rgba(59, 130, 246, 0.3)';
                                }}
                              >
                                View Details →
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
        </div>
      </div>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default MonitoringDashboard;
