'use client';
import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Church } from '../../../types/church';
import { getStoredChurches, saveStoredChurches } from '../../../data/mockChurches';
import { isApprovedChurch, recordVerificationDecision } from '../../../lib/verification';
import VerifiedBadge from '../../../components/churches/VerifiedBadge';
import ChurchMapView from '../../../components/churches/ChurchMapView';
import ChurchDetailsModal from '../../../components/churches/ChurchDetailsModal';
import RejectionModal from '../../../components/churches/RejectionModal';
import {
  Search,
  List,
  Map as MapIcon,
  Plus,
  ShieldCheck,
  Radio,
  SlidersHorizontal,
  RotateCcw,
  Eye,
  CheckCircle,
  XCircle,
  Phone,
  MapPin,
  Users,
  ChevronRight
} from 'lucide-react';

export default function ChurchesPage() {
  const [churches, setChurches] = useState<Church[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(6);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusTab, setStatusTab] = useState<'ALL' | 'approved' | 'pending' | 'rejected'>('ALL');
  const [selectedDenomination, setSelectedDenomination] = useState('ALL');
  const [maxDistance, setMaxDistance] = useState<string>('ALL');
  const [liveStatusFilter, setLiveStatusFilter] = useState<'ALL' | 'LIVE' | 'OFFLINE'>('ALL');

  // Modals
  const [selectedChurch, setSelectedChurch] = useState<Church | null>(null);
  const [churchToReject, setChurchToReject] = useState<Church | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load from localStorage or mock data
  const loadChurches = () => {
    try {
      const data = getStoredChurches();
      setChurches(data);
      setLoadError(null);
    } catch {
      setLoadError('Could not load demo church records from local storage.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadChurches();
    const handleUpdate = () => loadChurches();
    window.addEventListener('churches_updated', handleUpdate);
    return () => window.removeEventListener('churches_updated', handleUpdate);
  }, []);

  useEffect(() => {
    if (!selectedChurch) return;
    setSelectedChurch(churches.find(church => church.id === selectedChurch.id) ?? null);
  }, [churches, selectedChurch?.id]);

  const showNotification = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Distinct denominations list for filter dropdown
  const denominations = useMemo(() => {
    const list = Array.from(new Set(churches.map(c => c.denomination))).filter(Boolean);
    return ['ALL', ...list.sort()];
  }, [churches]);

  // Combined Search & Filter Logic (FR-CHURCH-01, FR-CHURCH-03)
  const filteredChurches = useMemo(() => {
    return churches.filter(church => {
      // Status tab
      if (statusTab !== 'ALL' && church.verificationStatus !== statusTab) {
        return false;
      }

      // Search Query (name, pastor, city, state, or denomination)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches =
          church.name.toLowerCase().includes(q) ||
          church.pastor.toLowerCase().includes(q) ||
          church.city.toLowerCase().includes(q) ||
          church.state.toLowerCase().includes(q) ||
          church.denomination.toLowerCase().includes(q);
        if (!matches) return false;
      }

      // Denomination filter
      if (selectedDenomination !== 'ALL' && church.denomination !== selectedDenomination) {
        return false;
      }

      // Distance filter (< 5 km, < 10 km, < 25 km, < 50 km)
      if (maxDistance !== 'ALL') {
        const limit = parseFloat(maxDistance);
        if (!isNaN(limit) && church.distanceKm > limit) {
          return false;
        }
      }

      // Live-status filter
      if (liveStatusFilter === 'LIVE' && !church.isLive) {
        return false;
      }
      if (liveStatusFilter === 'OFFLINE' && church.isLive) {
        return false;
      }

      return true;
    });
  }, [churches, statusTab, searchQuery, selectedDenomination, maxDistance, liveStatusFilter]);

  const pendingCount = useMemo(() => {
    return churches.filter(c => c.verificationStatus === 'pending').length;
  }, [churches]);

  const verifiedCount = useMemo(() => {
    return churches.filter(isApprovedChurch).length;
  }, [churches]);

  const pagedChurches = useMemo(() => {
    return filteredChurches.slice(0, visibleCount);
  }, [filteredChurches, visibleCount]);

  // Approve action
  const handleApproveChurch = (church: Church) => {
    if (!churches.some(c => c.id === church.id && c.verificationStatus === 'pending')) {
      showNotification('This church is no longer pending review. Refresh the directory and try again.');
      return;
    }

    const updated = churches.map(c =>
      c.id === church.id ? recordVerificationDecision(c, 'approved') : c
    );

    saveStoredChurches(updated);
    setChurches(updated);
    setSelectedChurch(null);
    showNotification(`✅ "${church.name}" has been approved & verified!`);
  };

  // Reject action with reason (FR-CHURCH-06)
  const handleConfirmReject = (churchId: string, reason: string, category: string) => {
    if (!churches.some(c => c.id === churchId && c.verificationStatus === 'pending')) {
      setChurchToReject(null);
      showNotification('This church is no longer pending review. Refresh the directory and try again.');
      return;
    }

    const updated = churches.map(c =>
      c.id === churchId
        ? recordVerificationDecision(c, 'rejected', reason, category)
        : c
    );

    saveStoredChurches(updated);
    setChurches(updated);
    setChurchToReject(null);
    setSelectedChurch(null);
    showNotification(`⚠️ Application declined. Audit record updated with rejection reason.`);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setStatusTab('ALL');
    setSelectedDenomination('ALL');
    setMaxDistance('ALL');
    setLiveStatusFilter('ALL');
    setVisibleCount(6);
  };

  useEffect(() => {
    setVisibleCount(6);
  }, [statusTab, searchQuery, selectedDenomination, maxDistance, liveStatusFilter]);

  return (
    <div style={{ paddingBottom: 40 }}>
      {/* Toast Notification */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          top: 24,
          right: 24,
          backgroundColor: '#1E293B',
          color: '#FFFFFF',
          padding: '12px 20px',
          borderRadius: 12,
          boxShadow: '0 10px 25px -5px rgba(0,0,0,0.3)',
          zIndex: 2000,
          fontSize: 14,
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          animation: 'slideIn 0.25s ease'
        }}>
          {toastMessage}
        </div>
      )}

      {/* Page Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
        flexWrap: 'wrap',
        gap: 16
      }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: 'var(--color-text)', margin: 0 }}>
            Church Discovery &amp; Management
          </h1>
          <p style={{ fontSize: 14, color: 'var(--color-warm-gray)', marginTop: 4 }}>
            {churches.length} demo churches • {verifiedCount} approved • {pendingCount} pending review. Records are labelled [DEMO] and stored in this browser only.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          {/* Quick link to Verification Queue */}
          <Link
            href="/admin/churches/verify"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 16px',
              backgroundColor: '#FEF3C7',
              color: '#92400E',
              border: '1px solid #FDE68A',
              borderRadius: 10,
              fontSize: 13,
              fontWeight: 600,
              textDecoration: 'none'
            }}
          >
            <ShieldCheck size={16} />
            Review Queue
            {pendingCount > 0 && (
              <span style={{
                backgroundColor: '#D97706',
                color: 'white',
                padding: '2px 7px',
                borderRadius: 999,
                fontSize: 11,
                fontWeight: 800
              }}>
                {pendingCount}
              </span>
            )}
          </Link>

          {/* Add Church Button */}
          <Link
            href="/admin/churches/new"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 18px',
              backgroundColor: 'var(--color-primary)',
              color: 'white',
              borderRadius: 10,
              fontSize: 13,
              fontWeight: 600,
              textDecoration: 'none',
              boxShadow: '0 2px 4px rgba(91,45,142,0.2)'
            }}
          >
            <Plus size={16} />
            Register Church
          </Link>
        </div>
      </div>

      {/* Main Container Card */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 24,
        boxShadow: 'var(--shadow-card)',
        border: '1px solid var(--color-border)'
      }}>
        {/* Status Tabs and View Mode Switcher */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid var(--color-border)',
          paddingBottom: 16,
          marginBottom: 20,
          flexWrap: 'wrap',
          gap: 16
        }}>
          {/* Status Tabs */}
          <div style={{ display: 'flex', gap: 8 }}>
            {[
              { id: 'ALL', label: 'All Churches', count: churches.length },
              { id: 'approved', label: 'Approved', count: verifiedCount },
              { id: 'pending', label: 'Pending', count: pendingCount },
              { id: 'rejected', label: 'Rejected', count: churches.filter(c => c.verificationStatus === 'rejected').length }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setStatusTab(tab.id as any)}
                style={{
                  padding: '8px 16px',
                  borderRadius: 10,
                  fontSize: 13,
                  fontWeight: statusTab === tab.id ? 700 : 500,
                  backgroundColor: statusTab === tab.id ? 'var(--color-primary)' : '#F3F4F6',
                  color: statusTab === tab.id ? '#FFFFFF' : 'var(--color-warm-gray)',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  transition: 'all 0.15s ease'
                }}
              >
                {tab.label}
                <span style={{
                  padding: '2px 7px',
                  borderRadius: 999,
                  fontSize: 11,
                  backgroundColor: statusTab === tab.id ? 'rgba(255,255,255,0.25)' : '#E5E7EB',
                  color: statusTab === tab.id ? '#FFFFFF' : '#4B5563',
                  fontWeight: 700
                }}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* List View / Map View Toggle (FR-CHURCH-01) */}
          <div style={{
            display: 'inline-flex',
            backgroundColor: '#F3F4F6',
            borderRadius: 10,
            padding: 3,
            border: '1px solid #E5E7EB'
          }}>
            <button
              onClick={() => setViewMode('list')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '6px 14px',
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 600,
                border: 'none',
                backgroundColor: viewMode === 'list' ? '#FFFFFF' : 'transparent',
                color: viewMode === 'list' ? 'var(--color-primary)' : 'var(--color-warm-gray)',
                boxShadow: viewMode === 'list' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                cursor: 'pointer'
              }}
            >
              <List size={16} />
              List View
            </button>
            <button
              onClick={() => setViewMode('map')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '6px 14px',
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 600,
                border: 'none',
                backgroundColor: viewMode === 'map' ? '#FFFFFF' : 'transparent',
                color: viewMode === 'map' ? 'var(--color-primary)' : 'var(--color-warm-gray)',
                boxShadow: viewMode === 'map' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                cursor: 'pointer'
              }}
            >
              <MapIcon size={16} />
              Map View
            </button>
          </div>
        </div>

        {/* Filters & Search Toolbar (FR-CHURCH-01, FR-CHURCH-03) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 12,
          marginBottom: 20
        }}>
          {/* Search Input */}
          <div style={{
            position: 'relative',
            gridColumn: 'span 2'
          }}>
            <Search
              size={18}
              style={{
                position: 'absolute',
                left: 12,
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#9CA3AF'
              }}
            />
            <label htmlFor="church-search" className="sr-only" style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0,0,0,0)' }}>
              Search churches
            </label>
            <input
              id="church-search"
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by church name, pastor, city, or denomination..."
              aria-label="Search churches"
              style={{
                width: '100%',
                padding: '10px 14px 10px 38px',
                borderRadius: 10,
                border: '1px solid var(--color-border)',
                fontSize: 14,
                backgroundColor: '#FAFAF9',
                color: 'var(--color-text)'
              }}
            />
          </div>

          {/* Denomination Filter (FR-CHURCH-03) */}
          <div>
            <label htmlFor="denomination-filter" style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 6, color: 'var(--color-warm-gray)' }}>
              Denomination
            </label>
            <select
              id="denomination-filter"
              value={selectedDenomination}
              onChange={(e) => setSelectedDenomination(e.target.value)}
              aria-label="Filter by denomination"
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: 10,
                border: '1px solid var(--color-border)',
                fontSize: 13,
                backgroundColor: '#FAFAF9',
                color: 'var(--color-text)',
                fontWeight: 500
              }}
            >
              <option value="ALL">All Denominations</option>
              {denominations.filter(d => d !== 'ALL').map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {/* Distance Filter (FR-CHURCH-03) */}
          <div>
            <label htmlFor="distance-filter" style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 6, color: 'var(--color-warm-gray)' }}>
              Distance
            </label>
            <select
              id="distance-filter"
              value={maxDistance}
              onChange={(e) => setMaxDistance(e.target.value)}
              aria-label="Filter by distance"
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: 10,
                border: '1px solid var(--color-border)',
                fontSize: 13,
                backgroundColor: '#FAFAF9',
                color: 'var(--color-text)',
                fontWeight: 500
              }}
            >
              <option value="ALL">All Distances</option>
              <option value="5">Within 5 km</option>
              <option value="10">Within 10 km</option>
              <option value="25">Within 25 km</option>
              <option value="50">Within 50 km</option>
            </select>
          </div>

          {/* Live Status Filter (FR-CHURCH-03) */}
          <div>
            <label htmlFor="live-filter" style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 6, color: 'var(--color-warm-gray)' }}>
              Live / open status
            </label>
            <select
              id="live-filter"
              value={liveStatusFilter}
              onChange={(e) => setLiveStatusFilter(e.target.value as any)}
              aria-label="Filter by live or open status"
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: 10,
                border: '1px solid var(--color-border)',
                fontSize: 13,
                backgroundColor: '#FAFAF9',
                color: 'var(--color-text)',
                fontWeight: 500
              }}
            >
              <option value="ALL">All Broadcast Statuses</option>
              <option value="LIVE">🔴 Live Broadcast Only</option>
              <option value="OFFLINE">Offline / Scheduled</option>
            </select>
          </div>

          {/* Reset Filters */}
          {(searchQuery || statusTab !== 'ALL' || selectedDenomination !== 'ALL' || maxDistance !== 'ALL' || liveStatusFilter !== 'ALL') && (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <button
                onClick={handleResetFilters}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '10px 14px',
                  borderRadius: 10,
                  border: '1px solid #E5E7EB',
                  backgroundColor: '#FFFFFF',
                  color: 'var(--color-warm-gray)',
                  fontSize: 13,
                  cursor: 'pointer'
                }}
              >
                <RotateCcw size={14} />
                Reset Filters
              </button>
            </div>
          )}
        </div>

        {/* View Content: MAP VIEW or LIST VIEW */}
        {isLoading ? (
          <div role="status" style={{ padding: 48, textAlign: 'center', color: 'var(--color-warm-gray)' }}>
            Loading church directory…
          </div>
        ) : loadError ? (
          <div role="alert" style={{ padding: 24, borderRadius: 12, background: '#FEF2F2', color: '#991B1B' }}>
            {loadError}
          </div>
        ) : viewMode === 'map' ? (
          <ChurchMapView
            churches={filteredChurches}
            onSelectChurch={(church) => setSelectedChurch(church)}
          />
        ) : (
          /* LIST VIEW */
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--color-border)', backgroundColor: '#FAFAF9' }}>
                  <th style={{ padding: '14px 16px', fontSize: 12, fontWeight: 700, color: 'var(--color-warm-gray)', textTransform: 'uppercase' }}>
                    Church &amp; Verification
                  </th>
                  <th style={{ padding: '14px 16px', fontSize: 12, fontWeight: 700, color: 'var(--color-warm-gray)', textTransform: 'uppercase' }}>
                    Denomination
                  </th>
                  <th style={{ padding: '14px 16px', fontSize: 12, fontWeight: 700, color: 'var(--color-warm-gray)', textTransform: 'uppercase' }}>
                    Location &amp; Distance
                  </th>
                  <th style={{ padding: '14px 16px', fontSize: 12, fontWeight: 700, color: 'var(--color-warm-gray)', textTransform: 'uppercase' }}>
                    Pastor &amp; Contact
                  </th>
                  <th style={{ padding: '14px 16px', fontSize: 12, fontWeight: 700, color: 'var(--color-warm-gray)', textTransform: 'uppercase' }}>
                    Members
                  </th>
                  <th style={{ padding: '14px 16px', fontSize: 12, fontWeight: 700, color: 'var(--color-warm-gray)', textTransform: 'uppercase' }}>
                    Status
                  </th>
                  <th style={{ padding: '14px 16px', fontSize: 12, fontWeight: 700, color: 'var(--color-warm-gray)', textTransform: 'uppercase', textAlign: 'right' }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredChurches.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ padding: '48px 20px', textAlign: 'center' }}>
                      <div style={{ color: 'var(--color-warm-gray)', fontSize: 15 }}>
                        No churches match the selected criteria.
                      </div>
                      <button
                        onClick={handleResetFilters}
                        style={{
                          marginTop: 12,
                          padding: '8px 16px',
                          borderRadius: 8,
                          backgroundColor: 'var(--color-lavender)',
                          color: 'var(--color-primary-dark)',
                          border: 'none',
                          fontSize: 13,
                          fontWeight: 600,
                          cursor: 'pointer'
                        }}
                      >
                        Clear Active Filters
                      </button>
                    </td>
                  </tr>
                ) : (
                  filteredChurches.map(c => (
                    <tr
                      key={c.id}
                      style={{
                        borderBottom: '1px solid var(--color-border)',
                        transition: 'background-color 0.15s ease'
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F9FAFB')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      {/* Name, Avatar, and FR-CHURCH-04 Verification Badge */}
                      <td style={{ padding: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <div style={{
                            width: 44,
                            height: 44,
                            borderRadius: 12,
                            backgroundColor: c.avatarBg,
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 700,
                            fontSize: 15,
                            flexShrink: 0
                          }}>
                            {c.avatarInitials}
                          </div>
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                              <span style={{ fontWeight: 600, fontSize: 14, color: 'var(--color-text)' }}>
                                {c.name}
                              </span>
                              {/* FR-CHURCH-04 Strict verification badge */}
                              <VerifiedBadge church={c} size="sm" />
                              {c.isLive && (
                                <span style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: 4,
                                  backgroundColor: '#FEE2E2',
                                  color: '#DC2626',
                                  fontSize: 10,
                                  fontWeight: 800,
                                  padding: '1px 6px',
                                  borderRadius: 999
                                }}>
                                  <Radio size={10} />
                                  LIVE
                                </span>
                              )}
                            </div>
                            <div style={{ fontSize: 12, color: 'var(--color-warm-gray)', marginTop: 2 }}>
                              Founded {c.founded}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Denomination */}
                      <td style={{ padding: '16px', fontSize: 14, color: 'var(--color-text)' }}>
                        <span style={{
                          padding: '4px 10px',
                          borderRadius: 8,
                          backgroundColor: '#F3F4F6',
                          fontSize: 12,
                          fontWeight: 500
                        }}>
                          {c.denomination}
                        </span>
                      </td>

                      {/* Location & Distance */}
                      <td style={{ padding: '16px', fontSize: 13, color: 'var(--color-text)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <MapPin size={13} style={{ color: 'var(--color-primary)' }} />
                          {c.city}, {c.state}
                        </div>
                        <div style={{ fontSize: 12, color: 'var(--color-warm-gray)', marginTop: 2 }}>
                          {c.distanceKm} km away
                        </div>
                      </td>

                      {/* Pastor & Contact */}
                      <td style={{ padding: '16px', fontSize: 13, color: 'var(--color-text)' }}>
                        <div style={{ fontWeight: 500 }}>{c.pastor}</div>
                        <div style={{ fontSize: 12, color: 'var(--color-warm-gray)', marginTop: 2 }}>
                          {c.phone}
                        </div>
                      </td>

                      {/* Members */}
                      <td style={{ padding: '16px', fontSize: 14, fontWeight: 600 }}>
                        {c.members.toLocaleString()}
                      </td>

                      {/* Status */}
                      <td style={{ padding: '16px' }}>
                        <span style={{
                          padding: '4px 10px',
                          borderRadius: 999,
                          fontSize: 12,
                          fontWeight: 700,
                          backgroundColor:
                            c.verificationStatus === 'approved'
                              ? '#DCFCE7'
                              : c.verificationStatus === 'pending'
                              ? '#FEF3C7'
                              : '#FEE2E2',
                          color:
                            c.verificationStatus === 'approved'
                              ? '#15803D'
                              : c.verificationStatus === 'pending'
                              ? '#92400E'
                              : '#B91C1C'
                        }}>
                          {c.verificationStatus.toUpperCase() === 'APPROVED' ? 'VERIFIED' : c.verificationStatus.toUpperCase()}
                        </span>
                      </td>

                      {/* Actions */}
                      <td style={{ padding: '16px', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: 6, alignItems: 'center' }}>
                          <button
                            onClick={() => setSelectedChurch(c)}
                            title="View Full Church Profile"
                            style={{
                              padding: '6px 12px',
                              borderRadius: 8,
                              border: '1px solid #E5E7EB',
                              backgroundColor: '#FFFFFF',
                              color: 'var(--color-primary)',
                              fontSize: 12,
                              fontWeight: 600,
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 4
                            }}
                          >
                            <Eye size={13} />
                            View
                          </button>

                          {c.verificationStatus === 'pending' && (
                            <>
                              <button
                                onClick={() => handleApproveChurch(c)}
                                title="Approve & Verify"
                                style={{
                                  padding: '6px 10px',
                                  borderRadius: 8,
                                  border: 'none',
                                  backgroundColor: '#10B981',
                                  color: 'white',
                                  fontSize: 12,
                                  fontWeight: 600,
                                  cursor: 'pointer'
                                }}
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => setChurchToReject(c)}
                                title="Reject Application with Reason"
                                style={{
                                  padding: '6px 10px',
                                  borderRadius: 8,
                                  border: 'none',
                                  backgroundColor: '#DC2626',
                                  color: 'white',
                                  fontSize: 12,
                                  fontWeight: 600,
                                  cursor: 'pointer'
                                }}
                              >
                                Reject
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Profile Detail Modal (FR-CHURCH-02) */}
      <ChurchDetailsModal
        church={selectedChurch}
        onClose={() => setSelectedChurch(null)}
        onApprove={handleApproveChurch}
        onReject={(c) => {
          setSelectedChurch(null);
          setChurchToReject(c);
        }}
      />

      {/* Rejection Reason Modal (FR-CHURCH-06) */}
      <RejectionModal
        church={churchToReject}
        onClose={() => setChurchToReject(null)}
        onConfirmReject={handleConfirmReject}
      />
    </div>
  );
}
