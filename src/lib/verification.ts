import { AuditRecord, Church, VerificationStatus } from '../types/church';

export type CanonicalVerification = 'approved' | 'pending' | 'rejected';

export function toCanonicalVerification(
  value: unknown,
  fallbackStatus?: unknown
): CanonicalVerification {
  const canonicalValue = value == null ? '' : String(value).toLowerCase();
  if (canonicalValue) {
    if (canonicalValue === 'approved') return 'approved';
    if (canonicalValue === 'rejected') return 'rejected';
    if (canonicalValue === 'pending') return 'pending';
    return 'pending';
  }

  const legacyValue = String(fallbackStatus ?? '').toLowerCase();
  if (legacyValue === 'approved' || legacyValue === 'verified') return 'approved';
  if (legacyValue === 'rejected') return 'rejected';
  if (legacyValue === 'pending') return 'pending';
  return 'pending';
}

export function isApprovedChurch(church: Pick<Church, 'verificationStatus'>): boolean {
  return church.verificationStatus === 'approved';
}

export function legacyStatusFromCanonical(status: CanonicalVerification): VerificationStatus {
  if (status === 'approved') return 'VERIFIED';
  if (status === 'rejected') return 'REJECTED';
  return 'PENDING';
}

export function normalizeChurch(church: Church): Church {
  const verificationStatus = toCanonicalVerification(
    church.verificationStatus,
    church.status
  );
  return {
    ...church,
    verificationStatus,
    status: legacyStatusFromCanonical(verificationStatus),
    isVerified: verificationStatus === 'approved'
  };
}

export function recordVerificationDecision(
  church: Church,
  decision: 'approved' | 'rejected',
  reason?: string,
  category?: string
): Church {
  if (church.verificationStatus !== 'pending') {
    return church;
  }

  const normalizedReason = reason?.trim();
  if (decision === 'rejected' && !normalizedReason) {
    throw new Error('A rejection reason is required.');
  }

  const timestamp = new Date().toISOString();
  const auditRecord: AuditRecord = {
    id: `at-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    churchId: church.id,
    churchName: church.name,
    action: decision === 'approved' ? 'CHURCH_VERIFIED' : 'CHURCH_REJECTED',
    reviewer: 'Prototype Admin Reviewer',
    role: 'PROTOTYPE_ADMIN',
    timestamp,
    ...(normalizedReason ? { reason: normalizedReason } : {}),
    details: decision === 'approved'
      ? 'Church verification approved in the prototype admin portal.'
      : `Application declined under category: ${category || 'Other Administrative Non-Compliance'}`
  };

  return normalizeChurch({
    ...church,
    verificationStatus: decision,
    auditTrail: [...church.auditTrail, auditRecord]
  });
}
