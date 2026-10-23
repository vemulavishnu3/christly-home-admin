'use client';
import React, { useEffect, useState } from 'react';
import { Church } from '../../types/church';
import VerifiedBadge from './VerifiedBadge';
import { MapPin, Navigation, Radio, Users, Phone, ExternalLink, Plus, Minus, RotateCcw } from 'lucide-react';

interface ChurchMapViewProps {
  churches: Church[];
  onSelectChurch: (church: Church) => void;
}

export default function ChurchMapView({ churches, onSelectChurch }: ChurchMapViewProps) {
  const [selectedChurch, setSelectedChurch] = useState<Church | null>(
    churches.length > 0 ? churches[0] : null
  );
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  useEffect(() => {
    setSelectedChurch(current => current
      ? churches.find(church => church.id === current.id) ?? churches[0] ?? null
      : null
    );
  }, [churches]);

  const handlePinClick = (church: Church) => {
    setSelectedChurch(church);
    onSelectChurch(church);
  };

  return (
    <div className="church-map-view" style={{
      position: 'relative',
      width: '100%',
      height: 600,
      borderRadius: 16,
      overflow: 'hidden',
      backgroundColor: '#F3F4F6',
      border: '1px solid var(--color-border)',
      boxShadow: 'var(--shadow-card)',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Top Map Toolbar */}
      <div className="church-map-toolbar" style={{
        position: 'absolute',
        top: 16,
        left: 16,
        zIndex: 20,
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(8px)',
        padding: '8px 16px',
        borderRadius: 12,
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        border: '1px solid #E5E7EB'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Navigation size={18} style={{ color: 'var(--color-primary)' }} />
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text)' }}>
            Map View
          </span>
          <span style={{
            fontSize: 12,
            backgroundColor: 'var(--color-lavender)',
            color: 'var(--color-primary-dark)',
            padding: '2px 8px',
            borderRadius: 999,
            fontWeight: 600
          }}>
            {churches.length} plotted
          </span>
        </div>
        <div style={{ height: 16, width: 1, backgroundColor: '#E5E7EB' }} />
        <div className="church-map-legend" style={{ display: 'flex', gap: 12, fontSize: 12, color: 'var(--color-warm-gray)' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#5B2D8E', display: 'inline-block' }} />
            Verified
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#D97706', display: 'inline-block' }} />
            Pending
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#DC2626', display: 'inline-block' }} />
            Live Now
          </span>
        </div>
      </div>

      {/* Zoom Controls */}
      <div style={{
        position: 'absolute',
        top: 16,
        right: 16,
        zIndex: 20,
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 4,
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        border: '1px solid #E5E7EB'
      }}>
        <button
          onClick={() => setZoomLevel(prev => Math.min(prev + 0.15, 1.45))}
          style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', borderRadius: 6, color: '#374151' }}
          title="Zoom In"
        >
          <Plus size={16} />
        </button>
        <button
          onClick={() => setZoomLevel(prev => Math.max(prev - 0.15, 0.8))}
          style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', borderRadius: 6, color: '#374151' }}
          title="Zoom Out"
        >
          <Minus size={16} />
        </button>
        <button
          onClick={() => setZoomLevel(1)}
          style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', borderRadius: 6, color: '#374151' }}
          title="Reset Zoom"
        >
          <RotateCcw size={14} />
        </button>
      </div>

      {/* Stylized Canvas Grid & Map Graphic */}
      <div style={{
        flex: 1,
        position: 'relative',
        transform: `scale(${zoomLevel})`,
        transformOrigin: 'center center',
        transition: 'transform 0.2s ease',
        background: `
          radial-gradient(#CBD5E1 1px, transparent 1px),
          radial-gradient(#E2E8F0 1px, #F8FAFC 1px)
        `,
        backgroundSize: '32px 32px',
        backgroundPosition: '0 0, 16px 16px'
      }}>
        {/* Decorative Map Features */}
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.25, pointerEvents: 'none' }}>
          <path d="M 50,200 Q 200,100 450,220 T 800,280 T 1100,450" fill="none" stroke="#94A3B8" strokeWidth="3" strokeDasharray="6 4" />
          <path d="M 120,480 Q 320,380 600,440 T 980,390" fill="none" stroke="#94A3B8" strokeWidth="2" strokeDasharray="4 4" />
          {/* Visual Regional Clusters */}
          <circle cx="48%" cy="75%" r="140" fill="#E0E7FF" fillOpacity="0.3" />
          <circle cx="42%" cy="60%" r="110" fill="#EDE9FE" fillOpacity="0.3" />
          <circle cx="38%" cy="30%" r="90" fill="#FEF3C7" fillOpacity="0.25" />
        </svg>

        {/* Region Labels */}
        <div style={{ position: 'absolute', top: '24%', left: '36%', fontSize: 13, fontWeight: 700, color: '#94A3B8', letterSpacing: 1, pointerEvents: 'none' }}>
          NORTH ZONE
        </div>
        <div style={{ position: 'absolute', top: '56%', left: '40%', fontSize: 13, fontWeight: 700, color: '#94A3B8', letterSpacing: 1, pointerEvents: 'none' }}>
          CENTRAL &amp; DECCAN
        </div>
        <div style={{ position: 'absolute', top: '72%', left: '46%', fontSize: 13, fontWeight: 700, color: '#94A3B8', letterSpacing: 1, pointerEvents: 'none' }}>
          SOUTH METRO HUB
        </div>

        {/* Interactive Church Pins */}
        {churches.map((church) => {
          const isSelected = selectedChurch?.id === church.id;
          const pinColor = church.isLive ? '#DC2626' : church.verificationStatus === 'approved' ? '#5B2D8E' : church.verificationStatus === 'pending' ? '#D97706' : '#9CA3AF';

          return (
            <div
              key={church.id}
              onClick={() => handlePinClick(church)}
              style={{
                position: 'absolute',
                left: `${church.coordinates.xPercent}%`,
                top: `${church.coordinates.yPercent}%`,
                transform: 'translate(-50%, -100%)',
                cursor: 'pointer',
                zIndex: isSelected ? 30 : 10,
                transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)'
              }}
            >
              {/* Pin Icon with Glow & Animation */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                transform: isSelected ? 'scale(1.25)' : 'scale(1)'
              }}>
                <div style={{
                  position: 'relative',
                  backgroundColor: pinColor,
                  color: 'white',
                  padding: '6px 10px',
                  borderRadius: 16,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  boxShadow: isSelected ? `0 8px 20px ${pinColor}66` : '0 3px 8px rgba(0,0,0,0.2)',
                  border: isSelected ? '2px solid white' : '1.5px solid rgba(255,255,255,0.85)'
                }}>
                  {church.isLive && (
                    <span style={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      backgroundColor: '#FFFFFF',
                      animation: 'pulse 1.2s infinite'
                    }} />
                  )}
                  <span style={{ fontSize: 12, fontWeight: 700, whiteSpace: 'nowrap' }}>
                    {church.avatarInitials}
                  </span>
                  {church.verificationStatus === 'approved' && (
                    <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#60A5FA' }} />
                  )}
                </div>
                {/* Pointer Arrow */}
                <div style={{
                  width: 0,
                  height: 0,
                  borderLeft: '6px solid transparent',
                  borderRight: '6px solid transparent',
                  borderTop: `6px solid ${pinColor}`,
                  marginTop: -1
                }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Church Detail Card Overlay */}
      {selectedChurch && (
        <div className="church-map-selected-card" style={{
          position: 'absolute',
          bottom: 16,
          left: 16,
          right: 16,
          maxWidth: 480,
          backgroundColor: 'rgba(255, 255, 255, 0.98)',
          backdropFilter: 'blur(10px)',
          borderRadius: 16,
          padding: 16,
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.15), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
          border: '1px solid #E5E7EB',
          zIndex: 40,
          animation: 'fadeIn 0.2s ease'
        }}>
          <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
            <div style={{
              width: 52,
              height: 52,
              borderRadius: 14,
              backgroundColor: selectedChurch.avatarBg,
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 18,
              fontWeight: 800,
              flexShrink: 0
            }}>
              {selectedChurch.avatarInitials}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <h4 style={{
                  fontSize: 16,
                  fontWeight: 700,
                  color: 'var(--color-text)',
                  margin: 0,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {selectedChurch.name}
                </h4>
                {/* FR-CHURCH-04: Strict Verification Badge */}
                <VerifiedBadge church={selectedChurch} size="sm" showLabel />
                {selectedChurch.isLive && (
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 4,
                    backgroundColor: '#FEE2E2',
                    color: '#DC2626',
                    padding: '2px 8px',
                    borderRadius: 999,
                    fontSize: 11,
                    fontWeight: 700
                  }}>
                    <Radio size={12} />
                    LIVE
                  </span>
                )}
              </div>
              <p style={{ fontSize: 13, color: 'var(--color-warm-gray)', marginTop: 2, marginBottom: 8 }}>
                {selectedChurch.denomination} • {selectedChurch.city}, {selectedChurch.state}
              </p>
              <div style={{ display: 'flex', gap: 16, fontSize: 12, color: 'var(--color-warm-gray)', marginBottom: 12 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <MapPin size={13} style={{ color: 'var(--color-primary)' }} />
                  {selectedChurch.distanceKm} km away
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Users size={13} style={{ color: '#059669' }} />
                  {selectedChurch.members.toLocaleString()} members
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Phone size={13} style={{ color: '#3B82F6' }} />
                  {selectedChurch.phone}
                </span>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  onClick={() => onSelectChurch(selectedChurch)}
                  style={{
                    backgroundColor: 'var(--color-primary)',
                    color: 'white',
                    border: 'none',
                    borderRadius: 8,
                    padding: '8px 14px',
                    fontSize: 13,
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6
                  }}
                >
                  View Full Profile
                  <ExternalLink size={14} />
                </button>
                <button
                  onClick={() => setSelectedChurch(null)}
                  style={{
                    backgroundColor: '#F3F4F6',
                    color: '#4B5563',
                    border: 'none',
                    borderRadius: 8,
                    padding: '8px 14px',
                    fontSize: 13,
                    fontWeight: 500
                  }}
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
