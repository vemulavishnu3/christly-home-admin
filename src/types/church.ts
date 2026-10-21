export type VerificationStatus = 'VERIFIED' | 'PENDING' | 'REJECTED';
export type CanonicalVerificationStatus = 'approved' | 'pending' | 'rejected';

export interface ServiceTiming {
  id: string;
  day: string;
  time: string;
  serviceName: string;
  language: string;
  type: 'IN_PERSON' | 'ONLINE' | 'HYBRID';
}

export interface ChurchDocument {
  id: string;
  name: string;
  type: 'REGISTRATION_CERTIFICATE' | 'PASTOR_CREDENTIALS' | 'MINISTRY_LICENSE' | 'TAX_EXEMPTION' | 'GOVT_ID' | 'OTHER';
  fileName: string;
  fileSize: string;
  uploadedAt: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

export interface AuditRecord {
  id: string;
  churchId: string;
  churchName: string;
  action: 'CHURCH_REGISTERED' | 'CHURCH_VERIFIED' | 'CHURCH_REJECTED' | 'DOCUMENT_UPLOADED' | 'DETAILS_UPDATED';
  reviewer: string;
  role: string;
  timestamp: string;
  reason?: string;
  details?: string;
}

export interface Church {
  id: string;
  name: string;
  denomination: string;
  pastor: string;
  email: string;
  phone: string;
  website?: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  distanceKm: number; // simulated distance for FR-CHURCH-03
  isLive: boolean;
  liveSessionTitle?: string;
  /** Canonical FR-CHURCH-04 field. Verified badge only when this equals "approved". */
  verificationStatus: CanonicalVerificationStatus;
  /** Legacy display status kept in sync with verificationStatus. */
  status: VerificationStatus;
  isVerified: boolean; // FR-CHURCH-04: must be true only when verificationStatus === "approved"
  founded: string;
  members: number;
  about: string;
  coordinates: {
    lat: number;
    lng: number;
    xPercent: number; // percentage coordinate for map visualizer
    yPercent: number;
  };
  avatarBg: string;
  avatarInitials: string;
  media: {
    photos: string[];
    youtubeUrl?: string;
    liveStreamUrl?: string;
  };
  serviceTimings: ServiceTiming[];
  documents: ChurchDocument[];
  auditTrail: AuditRecord[];
}
