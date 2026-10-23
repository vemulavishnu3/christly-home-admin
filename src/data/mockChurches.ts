import { Church, AuditRecord } from '../types/church';
import { normalizeChurch } from '../lib/verification';

export const INITIAL_MOCK_CHURCHES: Church[] = [
  {
    id: 'c1',
    name: 'Eastside Fellowship',
    denomination: 'Pentecostal',
    pastor: 'Demo Pastor A. Wilson',
    email: 'demo-eastside@example.test',
    phone: '+91 98401 23456',
    website: 'https://example.test/demo-eastside',
    address: '42 Anna Salai, Guindy',
    city: 'Chennai',
    state: 'Tamil Nadu',
    pincode: '600032',
    distanceKm: 3.2,
    isLive: true,
    liveSessionTitle: 'Sunday Morning Breakthrough Service',
    verificationStatus: 'approved',
    status: 'VERIFIED',
    isVerified: true,
    founded: '2008',
    members: 1240,
    about: 'A vibrant Christ-centered family fellowship passionate about worship, prayer, authentic discipleship, and city-wide outreach ministries.',
    coordinates: { lat: 13.0067, lng: 80.2023, xPercent: 54, yPercent: 78 },
    avatarBg: '#5B2D8E',
    avatarInitials: 'GF',
    media: {
      photos: [
        'https://images.unsplash.com/photo-1543807535-eceef0bc6599?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&w=600&q=80'
      ],
      youtubeUrl: 'https://example.test/demo-eastside',
      liveStreamUrl: 'https://example.test/demo-eastside/live'
    },
    serviceTimings: [
      { id: 'st1', day: 'Sunday', time: '07:30 AM', serviceName: 'Early Morning Worship', language: 'Tamil', type: 'IN_PERSON' },
      { id: 'st2', day: 'Sunday', time: '10:00 AM', serviceName: 'Main Celebration Service', language: 'English', type: 'HYBRID' },
      { id: 'st3', day: 'Wednesday', time: '06:30 PM', serviceName: 'Midweek Bible Study & Prayer', language: 'English & Tamil', type: 'ONLINE' }
    ],
    documents: [
      { id: 'd1', name: 'Church Trust Registration Deed', type: 'REGISTRATION_CERTIFICATE', fileName: 'grace_trust_reg.pdf', fileSize: '2.4 MB', uploadedAt: '2024-01-10', status: 'APPROVED' },
      { id: 'd2', name: 'Senior Pastor Ordination Credential', type: 'PASTOR_CREDENTIALS', fileName: 'rev_wilson_credentials.pdf', fileSize: '1.8 MB', uploadedAt: '2024-01-10', status: 'APPROVED' },
      { id: 'd3', name: '80G Tax Exemption Certificate', type: 'TAX_EXEMPTION', fileName: '80g_exemption.pdf', fileSize: '980 KB', uploadedAt: '2024-01-12', status: 'APPROVED' }
    ],
    auditTrail: [
      { id: 'at-1', churchId: 'c1', churchName: 'Eastside Fellowship', action: 'CHURCH_REGISTERED', reviewer: 'Demo System Onboarding', role: 'PORTAL_USER', timestamp: '2024-01-10 10:15', details: 'DEMO record: application submitted with sample verification documents' },
      { id: 'at-2', churchId: 'c1', churchName: 'Eastside Fellowship', action: 'CHURCH_VERIFIED', reviewer: 'Demo Super Admin', role: 'SUPER_ADMIN', timestamp: '2024-01-15 14:30', details: 'DEMO record: sample approval for prototype review only' }
    ]
  },
  {
    id: 'c2',
    name: 'Riverside Meeting',
    denomination: 'Baptist',
    pastor: 'Demo Pastor E. Raj',
    email: 'demo-riverside@example.test',
    phone: '+91 94402 34567',
    website: 'https://example.test/demo-riverside',
    address: 'Plot 18, Road No. 12, Banjara Hills',
    city: 'Hyderabad',
    state: 'Telangana',
    pincode: '500034',
    distanceKm: 8.5,
    isLive: false,
    verificationStatus: 'approved',
    status: 'VERIFIED',
    isVerified: true,
    founded: '2012',
    members: 876,
    about: 'Dedicated to preaching biblical truth, serving our neighborhood with compassion programs, and mentoring families into deeper faith.',
    coordinates: { lat: 17.4156, lng: 78.4357, xPercent: 46, yPercent: 62 },
    avatarBg: '#0284C7',
    avatarInitials: 'HC',
    media: {
      photos: [
        'https://images.unsplash.com/photo-1510525009512-ad7fc13eefab?auto=format&fit=crop&w=600&q=80'
      ],
      youtubeUrl: 'https://example.test/demo-riverside'
    },
    serviceTimings: [
      { id: 'st4', day: 'Sunday', time: '09:00 AM', serviceName: 'Sunday Worship Service', language: 'Telugu', type: 'IN_PERSON' },
      { id: 'st5', day: 'Sunday', time: '11:15 AM', serviceName: 'Contemporary Service', language: 'English', type: 'HYBRID' },
      { id: 'st6', day: 'Friday', time: '07:00 PM', serviceName: 'Youth Fellowship', language: 'English', type: 'IN_PERSON' }
    ],
    documents: [
      { id: 'd4', name: 'Society Registration Certificate', type: 'REGISTRATION_CERTIFICATE', fileName: 'hope_society_reg.pdf', fileSize: '1.9 MB', uploadedAt: '2024-02-04', status: 'APPROVED' },
      { id: 'd5', name: 'Pastoral Council Endorsement', type: 'PASTOR_CREDENTIALS', fileName: 'council_endorsement.pdf', fileSize: '1.2 MB', uploadedAt: '2024-02-04', status: 'APPROVED' }
    ],
    auditTrail: [
      { id: 'at-3', churchId: 'c2', churchName: 'Riverside Meeting', action: 'CHURCH_REGISTERED', reviewer: 'Demo System Onboarding', role: 'PORTAL_USER', timestamp: '2024-02-04 11:20', details: 'DEMO record: sample application submitted' },
      { id: 'at-4', churchId: 'c2', churchName: 'Riverside Meeting', action: 'CHURCH_VERIFIED', reviewer: 'Demo Platform Admin', role: 'PLATFORM_ADMIN', timestamp: '2024-02-08 16:45', details: 'DEMO record: sample approval only' }
    ]
  },
  {
    id: 'c3',
    name: 'Metro Gathering',
    denomination: 'Non-Denominational',
    pastor: 'Demo Pastor P. Nair',
    email: 'demo-metro@example.test',
    phone: '+91 99803 45678',
    website: 'https://example.test/demo-metro',
    address: '88 100ft Road, Indiranagar',
    city: 'Bangalore',
    state: 'Karnataka',
    pincode: '560038',
    distanceKm: 4.1,
    isLive: true,
    liveSessionTitle: 'Midweek Worship & Communion Encounter',
    verificationStatus: 'approved',
    status: 'VERIFIED',
    isVerified: true,
    founded: '2015',
    members: 2100,
    about: 'An energetic multi-generational church focused on passionate contemporary praise, deep scriptural teaching, and community care groups.',
    coordinates: { lat: 12.9784, lng: 77.6408, xPercent: 44, yPercent: 79 },
    avatarBg: '#16A34A',
    avatarInitials: 'NL',
    media: {
      photos: [
        'https://images.unsplash.com/photo-1478147427282-58a87a120781?auto=format&fit=crop&w=600&q=80'
      ],
      youtubeUrl: 'https://example.test/demo-metro',
      liveStreamUrl: 'https://example.test/demo-metro/live'
    },
    serviceTimings: [
      { id: 'st7', day: 'Sunday', time: '08:00 AM', serviceName: 'Kannada Service', language: 'Kannada', type: 'IN_PERSON' },
      { id: 'st8', day: 'Sunday', time: '10:30 AM', serviceName: 'Celebration Worship', language: 'English', type: 'HYBRID' },
      { id: 'st9', day: 'Sunday', time: '05:30 PM', serviceName: 'Evening Revival', language: 'English & Hindi', type: 'HYBRID' }
    ],
    documents: [
      { id: 'd6', name: 'Charitable Trust Certificate', type: 'REGISTRATION_CERTIFICATE', fileName: 'nlc_charitable_trust.pdf', fileSize: '3.1 MB', uploadedAt: '2024-01-20', status: 'APPROVED' },
      { id: 'd7', name: 'Pastor Theological Degree & Ordination', type: 'PASTOR_CREDENTIALS', fileName: 'priya_nair_theology.pdf', fileSize: '1.5 MB', uploadedAt: '2024-01-20', status: 'APPROVED' }
    ],
    auditTrail: [
      { id: 'at-5', churchId: 'c3', churchName: 'Metro Gathering', action: 'CHURCH_REGISTERED', reviewer: 'Demo System Onboarding', role: 'PORTAL_USER', timestamp: '2024-01-20 09:12', details: 'DEMO record: submitted with sample documentation' },
      { id: 'at-6', churchId: 'c3', churchName: 'Metro Gathering', action: 'CHURCH_VERIFIED', reviewer: 'Demo Super Admin', role: 'SUPER_ADMIN', timestamp: '2024-01-23 15:00', details: 'DEMO record: sample full verification' }
    ]
  },
  {
    id: 'c4',
    name: 'Harbour Parish',
    denomination: 'Methodist',
    pastor: 'Demo Pastor A. Paul',
    email: 'demo-harbour@example.test',
    phone: '+91 98204 56789',
    website: 'https://example.test/demo-harbour',
    address: '15 Hill Road, Bandra West',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400050',
    distanceKm: 18.2,
    isLive: false,
    verificationStatus: 'approved',
    status: 'VERIFIED',
    isVerified: true,
    founded: '1995',
    members: 654,
    about: 'Historic Methodist parish offering traditional and contemporary liturgical worship, music ministries, and medical outreach clinics.',
    coordinates: { lat: 19.0596, lng: 72.8295, xPercent: 32, yPercent: 55 },
    avatarBg: '#D97706',
    avatarInitials: 'CC',
    media: {
      photos: [
        'https://images.unsplash.com/photo-1548625361-125016556e44?auto=format&fit=crop&w=600&q=80'
      ]
    },
    serviceTimings: [
      { id: 'st10', day: 'Sunday', time: '08:30 AM', serviceName: 'Choral Communion', language: 'English', type: 'IN_PERSON' },
      { id: 'st11', day: 'Sunday', time: '10:30 AM', serviceName: 'Family Fellowship Service', language: 'Marathi & Hindi', type: 'IN_PERSON' }
    ],
    documents: [
      { id: 'd8', name: 'Methodist Conference Affiliation Certificate', type: 'MINISTRY_LICENSE', fileName: 'methodist_affiliation.pdf', fileSize: '2.0 MB', uploadedAt: '2024-02-15', status: 'APPROVED' }
    ],
    auditTrail: [
      { id: 'at-7', churchId: 'c4', churchName: 'Harbour Parish', action: 'CHURCH_VERIFIED', reviewer: 'Demo Platform Admin', role: 'PLATFORM_ADMIN', timestamp: '2024-02-18 10:00', details: 'DEMO record: sample affiliation check' }
    ]
  },
  {
    id: 'c5',
    name: 'North Ring Fellowship',
    denomination: 'Pentecostal',
    pastor: 'Demo Pastor S. George',
    email: 'demo-northring@example.test',
    phone: '+91 94815 67890',
    address: '74 Ring Road, Hebbal',
    city: 'Bangalore',
    state: 'Karnataka',
    pincode: '560024',
    distanceKm: 24.5,
    isLive: false,
    verificationStatus: 'pending',
    status: 'PENDING',
    isVerified: false,
    founded: '2021',
    members: 310,
    about: 'Growing revival congregation gathering believers for weekend prayer towers, deliverance ministry, and student outreach.',
    coordinates: { lat: 13.0358, lng: 77.597, xPercent: 43, yPercent: 77 },
    avatarBg: '#7C3AED',
    avatarInitials: 'BR',
    media: {
      photos: []
    },
    serviceTimings: [
      { id: 'st12', day: 'Sunday', time: '09:30 AM', serviceName: 'Revival Worship Service', language: 'English & Kannada', type: 'IN_PERSON' },
      { id: 'st13', day: 'Saturday', time: '06:00 PM', serviceName: 'Youth Awakening Night', language: 'English', type: 'HYBRID' }
    ],
    documents: [
      { id: 'd9', name: 'Provisional Trust Deed Registration', type: 'REGISTRATION_CERTIFICATE', fileName: 'bethesda_provisional_trust.pdf', fileSize: '1.4 MB', uploadedAt: '2024-10-14', status: 'PENDING' },
      { id: 'd10', name: 'Pastor Pastoral Letter of Reference', type: 'PASTOR_CREDENTIALS', fileName: 'pastoral_reference.pdf', fileSize: '850 KB', uploadedAt: '2024-10-14', status: 'PENDING' }
    ],
    auditTrail: [
      { id: 'at-8', churchId: 'c5', churchName: 'North Ring Fellowship', action: 'CHURCH_REGISTERED', reviewer: 'Demo Applicant', role: 'APPLICANT', timestamp: '2024-10-14 16:40', details: 'DEMO record: pending sample application awaiting review.' }
    ]
  },
  {
    id: 'c6',
    name: 'Coastal Chapel',
    denomination: 'Non-Denominational',
    pastor: 'Demo Pastor M. Raju',
    email: 'demo-coastal@example.test',
    phone: '+91 89123 45678',
    website: 'https://example.test/demo-coastal',
    address: 'Sector 5, MVP Colony',
    city: 'Visakhapatnam',
    state: 'Andhra Pradesh',
    pincode: '530017',
    distanceKm: 42.0,
    isLive: false,
    verificationStatus: 'approved',
    status: 'VERIFIED',
    isVerified: true,
    founded: '2005',
    members: 1450,
    about: 'Verse by verse chapter by chapter study of the Bible, missions support along coastal Andhra, and daily discipleship fellowship.',
    coordinates: { lat: 17.7383, lng: 83.3371, xPercent: 57, yPercent: 61 },
    avatarBg: '#059669',
    avatarInitials: 'CC',
    media: {
      photos: [
        'https://images.unsplash.com/photo-1544427920-c49ccfb85579?auto=format&fit=crop&w=600&q=80'
      ]
    },
    serviceTimings: [
      { id: 'st14', day: 'Sunday', time: '08:30 AM', serviceName: 'Morning Service', language: 'Telugu', type: 'HYBRID' },
      { id: 'st15', day: 'Sunday', time: '10:45 AM', serviceName: 'English Service', language: 'English', type: 'IN_PERSON' }
    ],
    documents: [
      { id: 'd11', name: 'Calvary Global Network Charter', type: 'MINISTRY_LICENSE', fileName: 'cgn_charter.pdf', fileSize: '1.7 MB', uploadedAt: '2024-03-01', status: 'APPROVED' }
    ],
    auditTrail: [
      { id: 'at-9', churchId: 'c6', churchName: 'Coastal Chapel', action: 'CHURCH_VERIFIED', reviewer: 'Demo Super Admin', role: 'SUPER_ADMIN', timestamp: '2024-03-05 11:30', details: 'DEMO record: sample affiliation check' }
    ]
  },
  {
    id: 'c7',
    name: 'Capital Fellowship',
    denomination: 'Evangelical',
    pastor: 'Demo Pastor J. Samuel',
    email: 'demo-capital@example.test',
    phone: '+91 98111 23456',
    address: 'C-42 Green Park Extension',
    city: 'New Delhi',
    state: 'Delhi',
    pincode: '110016',
    distanceKm: 68.0,
    isLive: true,
    liveSessionTitle: 'Capital Prayer & Worship Night',
    verificationStatus: 'approved',
    status: 'VERIFIED',
    isVerified: true,
    founded: '2016',
    members: 890,
    about: 'Planting gospel seeds in the capital through contemporary worship services, university campus ministries, and mercy relief projects.',
    coordinates: { lat: 28.5588, lng: 77.2028, xPercent: 39, yPercent: 28 },
    avatarBg: '#EA580C',
    avatarInitials: 'HC',
    media: {
      photos: [
        'https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=600&q=80'
      ],
      youtubeUrl: 'https://example.test/demo-capital'
    },
    serviceTimings: [
      { id: 'st16', day: 'Sunday', time: '10:00 AM', serviceName: 'Sunday Morning Worship', language: 'English & Hindi', type: 'HYBRID' }
    ],
    documents: [
      { id: 'd12', name: 'Society Registration', type: 'REGISTRATION_CERTIFICATE', fileName: 'delhi_society_reg.pdf', fileSize: '2.5 MB', uploadedAt: '2024-01-30', status: 'APPROVED' }
    ],
    auditTrail: [
      { id: 'at-10', churchId: 'c7', churchName: 'Capital Fellowship', action: 'CHURCH_VERIFIED', reviewer: 'Demo Platform Admin', role: 'PLATFORM_ADMIN', timestamp: '2024-02-02 09:30', details: 'DEMO record: sample approval' }
    ]
  },
  {
    id: 'c8',
    name: 'Lakeside Gathering',
    denomination: 'Pentecostal',
    pastor: 'Demo Pastor M. Thomas',
    email: 'demo-lakeside@example.test',
    phone: '+91 98470 12345',
    address: 'Kaloor Kadavanthra Road',
    city: 'Kochi',
    state: 'Kerala',
    pincode: '682017',
    distanceKm: 31.0,
    isLive: false,
    verificationStatus: 'rejected',
    status: 'REJECTED',
    isVerified: false,
    founded: '2023',
    members: 267,
    about: 'Local fellowship in Ernakulam district seeking community registration.',
    coordinates: { lat: 9.9816, lng: 76.2999, xPercent: 38, yPercent: 88 },
    avatarBg: '#DC2626',
    avatarInitials: 'LW',
    media: {
      photos: []
    },
    serviceTimings: [
      { id: 'st17', day: 'Sunday', time: '09:00 AM', serviceName: 'Malayalam Worship Service', language: 'Malayalam', type: 'IN_PERSON' }
    ],
    documents: [
      { id: 'd13', name: 'Local Lease Agreement Copy', type: 'OTHER', fileName: 'lease_deed_scan.jpg', fileSize: '650 KB', uploadedAt: '2024-09-15', status: 'REJECTED' }
    ],
    auditTrail: [
      { id: 'at-11', churchId: 'c8', churchName: 'Lakeside Gathering', action: 'CHURCH_REGISTERED', reviewer: 'Demo Applicant', role: 'APPLICANT', timestamp: '2024-09-15 14:00', details: 'DEMO record: sample application submitted without society deed' },
      { id: 'at-12', churchId: 'c8', churchName: 'Lakeside Gathering', action: 'CHURCH_REJECTED', reviewer: 'Demo Super Admin', role: 'SUPER_ADMIN', timestamp: '2024-09-20 11:15', reason: 'DEMO rejection: missing sample trust/society certificate; lease agreement is unnotarized.', details: 'DEMO record: applicant would be notified to resubmit. Not a live compliance action.' }
    ]
  },
  {
    id: 'c9',
    name: 'Heritage Parish',
    denomination: 'Catholic',
    pastor: 'Demo Pastor J. Varghese',
    email: 'demo-heritage@example.test',
    phone: '+91 94440 98765',
    address: 'Santhome High Road, Mylapore',
    city: 'Chennai',
    state: 'Tamil Nadu',
    pincode: '600004',
    distanceKm: 6.2,
    isLive: false,
    verificationStatus: 'approved',
    status: 'VERIFIED',
    isVerified: true,
    founded: '1896',
    members: 3800,
    about: 'DEMO record: sample historic parish profile for prototype review. Not a real cathedral or verification record.',
    coordinates: { lat: 13.0336, lng: 80.2785, xPercent: 55, yPercent: 78 },
    avatarBg: '#4F46E5',
    avatarInitials: 'ST',
    media: {
      photos: [
        'https://images.unsplash.com/photo-1548625361-125016556e44?auto=format&fit=crop&w=600&q=80'
      ]
    },
    serviceTimings: [
      { id: 'st18', day: 'Sunday', time: '06:30 AM', serviceName: 'Holy Mass (Tamil)', language: 'Tamil', type: 'IN_PERSON' },
      { id: 'st19', day: 'Sunday', time: '08:30 AM', serviceName: 'Solemn High Mass (English)', language: 'English', type: 'HYBRID' },
      { id: 'st20', day: 'Sunday', time: '05:30 PM', serviceName: 'Evening Mass (Tamil)', language: 'Tamil', type: 'IN_PERSON' }
    ],
    documents: [
      { id: 'd14', name: 'Archdiocese Official Decree', type: 'MINISTRY_LICENSE', fileName: 'archdiocese_decree.pdf', fileSize: '4.2 MB', uploadedAt: '2023-11-10', status: 'APPROVED' }
    ],
    auditTrail: [
      { id: 'at-13', churchId: 'c9', churchName: 'Heritage Parish', action: 'CHURCH_VERIFIED', reviewer: 'Demo Super Admin', role: 'SUPER_ADMIN', timestamp: '2023-11-15 10:00', details: 'DEMO record: sample heritage parish approval' }
    ]
  },
  {
    id: 'c10',
    name: 'Tech Corridor Fellowship',
    denomination: 'Pentecostal',
    pastor: 'Demo Pastor C. Dan',
    email: 'demo-corridor@example.test',
    phone: '+91 97910 11223',
    address: 'Near Tech Park, Whitefield',
    city: 'Bangalore',
    state: 'Karnataka',
    pincode: '560066',
    distanceKm: 9.8,
    isLive: false,
    verificationStatus: 'pending',
    status: 'PENDING',
    isVerified: false,
    founded: '2022',
    members: 195,
    about: 'Emerging tech corridor church planting community serving young software professionals, families, and student interns.',
    coordinates: { lat: 12.9698, lng: 77.75, xPercent: 47, yPercent: 79 },
    avatarBg: '#9333EA',
    avatarInitials: 'ZC',
    media: {
      photos: []
    },
    serviceTimings: [
      { id: 'st21', day: 'Sunday', time: '10:00 AM', serviceName: 'Sunday Contemporary Service', language: 'English', type: 'HYBRID' }
    ],
    documents: [
      { id: 'd15', name: 'Trust Registration Application', type: 'REGISTRATION_CERTIFICATE', fileName: 'zion_city_trust_app.pdf', fileSize: '1.6 MB', uploadedAt: '2024-10-17', status: 'PENDING' },
      { id: 'd16', name: 'Pastor Government ID & Aadhaar', type: 'GOVT_ID', fileName: 'pastor_caleb_id.pdf', fileSize: '720 KB', uploadedAt: '2024-10-17', status: 'PENDING' }
    ],
    auditTrail: [
      { id: 'at-14', churchId: 'c10', churchName: 'Tech Corridor Fellowship', action: 'CHURCH_REGISTERED', reviewer: 'Demo Applicant', role: 'APPLICANT', timestamp: '2024-10-17 11:35', details: 'DEMO record: self-onboarding with 2 pending sample documents' }
    ]
  }
];

// Helper functions with LocalStorage synchronization (session/demo only — not a backend)
const STORAGE_KEY = 'christly_churches_store_v2';

export function getStoredChurches(): Church[] {
  const seed = INITIAL_MOCK_CHURCHES.map(normalizeChurch);
  if (typeof window === 'undefined') {
    return seed;
  }
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
      return seed;
    }
    const parsed = JSON.parse(data) as Church[];
    const normalized = parsed.map(normalizeChurch);
    if (JSON.stringify(parsed) !== JSON.stringify(normalized)) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
      } catch (e) {
        console.error('Could not persist normalized church records to localStorage:', e);
      }
    }
    return normalized;
  } catch (e) {
    console.error('Error reading churches from localStorage:', e);
    return seed;
  }
}

export function saveStoredChurches(churches: Church[]): void {
  if (typeof window === 'undefined') return;
  try {
    const normalized = churches.map(normalizeChurch);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
    window.dispatchEvent(new Event('churches_updated'));
  } catch (e) {
    console.error('Error saving churches to localStorage:', e);
  }
}

export function getChurchById(id: string): Church | undefined {
  return getStoredChurches().find((c) => c.id === id);
}

export function getAllAuditRecords(): AuditRecord[] {
  const churches = getStoredChurches();
  const allLogs: AuditRecord[] = [];
  churches.forEach(c => {
    if (c.auditTrail) {
      allLogs.push(...c.auditTrail);
    }
  });
  // Sort descending by timestamp
  return allLogs.sort((a, b) => (b.timestamp > a.timestamp ? 1 : -1));
}
