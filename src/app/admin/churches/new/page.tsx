'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Church, ServiceTiming, ChurchDocument } from '../../../../types/church';
import { getStoredChurches, saveStoredChurches } from '../../../../data/mockChurches';
import {
  ArrowLeft,
  Building2,
  Clock,
  UploadCloud,
  FileCheck,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  ShieldAlert,
  Info
} from 'lucide-react';

const COMMON_DENOMINATIONS = [
  'Pentecostal',
  'Baptist',
  'Catholic',
  'Non-Denominational',
  'Methodist',
  'Evangelical',
  'Anglican',
  'Presbyterian',
  'Assemblies of God',
  'Other'
];

const MAX_DOCUMENT_SIZE_BYTES = 10 * 1024 * 1024;
const ALLOWED_DOCUMENT_MIME_TYPES: Record<string, string> = {
  pdf: 'application/pdf',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png'
};

function validateDocumentFile(file: File): string | null {
  const extension = file.name.split('.').pop()?.toLowerCase() ?? '';
  const expectedMimeType = ALLOWED_DOCUMENT_MIME_TYPES[extension];

  if (!expectedMimeType || (file.type && file.type.toLowerCase() !== expectedMimeType)) {
    return 'Choose a PDF, JPG, or PNG document.';
  }
  if (file.size === 0) {
    return 'The selected file is empty.';
  }
  if (file.size > MAX_DOCUMENT_SIZE_BYTES) {
    return 'The selected file must be 10 MB or smaller.';
  }
  return null;
}

export default function ChurchOnboardingPage() {
  const router = useRouter();

  // Basic Info Form State
  const [name, setName] = useState('');
  const [denomination, setDenomination] = useState(COMMON_DENOMINATIONS[0]);
  const [pastor, setPastor] = useState('');
  const [founded, setFounded] = useState('');
  const [members, setMembers] = useState('');
  const [about, setAbout] = useState('');

  // Location & Contact Form State
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [website, setWebsite] = useState('');

  // Service Timings State
  const [serviceTimings, setServiceTimings] = useState<ServiceTiming[]>([
    {
      id: 'st-new-1',
      day: 'Sunday',
      time: '09:30 AM',
      serviceName: 'Sunday Morning Worship',
      language: 'English',
      type: 'IN_PERSON'
    }
  ]);

  // Uploaded Documents Prototype State
  const [uploadedFiles, setUploadedFiles] = useState<Array<{
    type: ChurchDocument['type'];
    label: string;
    file: File | null;
    uploadedAt: string;
    mockName?: string;
  }>>([
    { type: 'REGISTRATION_CERTIFICATE', label: 'Church Registration / Trust Deed Certificate *', file: null, uploadedAt: '', mockName: '' },
    { type: 'PASTOR_CREDENTIALS', label: 'Pastor Ordination / Ministerial Credentials *', file: null, uploadedAt: '', mockName: '' },
    { type: 'TAX_EXEMPTION', label: '80G / Tax Exemption Certificate (Optional)', file: null, uploadedAt: '', mockName: '' },
    { type: 'GOVT_ID', label: 'Senior Pastor Government Photo ID (Aadhaar / Passport) *', file: null, uploadedAt: '', mockName: '' }
  ]);

  // Validation & Submission States
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [registeredChurchId, setRegisteredChurchId] = useState<string>('');

  const addServiceTiming = () => {
    setServiceTimings([
      ...serviceTimings,
      {
        id: `st-new-${Date.now()}`,
        day: 'Sunday',
        time: '11:00 AM',
        serviceName: 'Celebration Gathering',
        language: 'English',
        type: 'HYBRID'
      }
    ]);
  };

  const removeServiceTiming = (index: number) => {
    if (serviceTimings.length <= 1) return;
    setServiceTimings(serviceTimings.filter((_, i) => i !== index));
  };

  const updateServiceTiming = (index: number, field: keyof ServiceTiming, value: any) => {
    const updated = [...serviceTimings];
    updated[index] = { ...updated[index], [field]: value };
    setServiceTimings(updated);
  };

  const handleFileChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const validationError = validateDocumentFile(file);
      const updated = [...uploadedFiles];
      updated[index] = {
        ...updated[index],
        file: validationError ? null : file,
        mockName: validationError ? '' : file.name,
        uploadedAt: validationError ? '' : new Date().toISOString().split('T')[0]
      };
      setUploadedFiles(updated);
      setErrors(previous => {
        const next = { ...previous };
        if (validationError) {
          next[`doc${index}`] = validationError;
        } else {
          delete next[`doc${index}`];
        }
        return next;
      });
      if (validationError) {
        e.target.value = '';
      }
    }
  };

  const validateForm = (): boolean => {
    const errs: Record<string, string> = {};

    if (!name.trim()) errs.name = 'Church organization name is required.';
    if (!pastor.trim()) errs.pastor = 'Senior Pastor / Leader name is required.';
    if (!address.trim()) errs.address = 'Street address is required.';
    if (!city.trim()) errs.city = 'City is required.';
    if (!state.trim()) errs.state = 'State is required.';
    if (!pincode.trim() || !/^\d{5,6}$/.test(pincode.trim())) {
      errs.pincode = 'Valid 5 or 6-digit postal code is required.';
    }

    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errs.email = 'Valid church contact email is required.';
    }

    if (!phone.trim() || phone.replace(/\D/g, '').length < 8) {
      errs.phone = 'Valid phone contact number is required.';
    }

    uploadedFiles.forEach((document, index) => {
      const required = index === 0 || index === 1 || index === 3;
      if (required && !document.file) {
        errs[`doc${index}`] = errors[`doc${index}`] ?? `${document.label.replace(' *', '')} is required for verification.`;
      } else if (document.file) {
        const validationError = validateDocumentFile(document.file);
        if (validationError) errs[`doc${index}`] = validationError;
      }
    });

    if (!denomination.trim()) {
      errs.denomination = 'Select a denomination.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const churches = getStoredChurches();
      const newId = `c-${Date.now()}`;
      const now = new Date().toISOString().replace('T', ' ').substring(0, 16);

      // Build initial documents list
      const formattedDocs: ChurchDocument[] = uploadedFiles
        .filter(f => f.file || f.mockName)
        .map((f, i) => ({
          id: `doc-${Date.now()}-${i}`,
          name: f.label.replace(' *', '').replace(' (Optional)', ''),
          type: f.type,
          fileName: f.file ? f.file.name : f.mockName || 'uploaded_document.pdf',
          fileSize: f.file ? `${(f.file.size / (1024 * 1024)).toFixed(1)} MB` : '1.8 MB',
          uploadedAt: new Date().toISOString().split('T')[0],
          status: 'PENDING'
        }));

      // Generate random map coordinates centered in India
      const randomX = Math.floor(35 + Math.random() * 25);
      const randomY = Math.floor(40 + Math.random() * 45);

      const initials = name
        .split(' ')
        .map(w => w[0])
        .join('')
        .substring(0, 2)
        .toUpperCase();

      const newChurch: Church = {
        id: newId,
        name: name.trim(),
        denomination,
        pastor: pastor.trim(),
        email: email.trim(),
        phone: phone.trim(),
        website: website.trim() || undefined,
        address: address.trim(),
        city: city.trim(),
        state: state.trim(),
        pincode: pincode.trim(),
        distanceKm: Math.round((Math.random() * 25 + 2) * 10) / 10,
        isLive: false,
        verificationStatus: 'pending',
        status: 'PENDING', // Always PENDING on initial submission
        isVerified: false, // FR-CHURCH-04: strict requirement: Pending churches must NOT display verified badge
        founded: founded.trim() || '2024',
        members: parseInt(members) || 50,
        about: about.trim() || `${name} is an active Christian community worshiping in ${city}, ${state}.`,
        coordinates: {
          lat: 13.0827,
          lng: 80.2707,
          xPercent: randomX,
          yPercent: randomY
        },
        avatarBg: '#5B2D8E',
        avatarInitials: initials || 'CH',
        media: {
          photos: []
        },
        serviceTimings,
        documents: formattedDocs,
        auditTrail: [
          {
            id: `at-${Date.now()}`,
            churchId: newId,
            churchName: name.trim(),
            action: 'CHURCH_REGISTERED',
            reviewer: pastor.trim(),
            role: 'APPLICANT',
            timestamp: now,
            details: `Church onboarding application submitted with ${formattedDocs.length} selected document references. File contents are not retained. Pending review.`
          }
        ]
      };

      const updatedChurches = [newChurch, ...churches];
      saveStoredChurches(updatedChurches);

      setIsSubmitting(false);
      setRegisteredChurchId(newId);
      setSubmissionSuccess(true);
    }, 700);
  };

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', paddingBottom: 60 }}>
      {/* Back Link */}
      <div style={{ marginBottom: 20 }}>
        <Link
          href="/admin/churches"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            color: 'var(--color-primary)',
            fontSize: 14,
            fontWeight: 600,
            textDecoration: 'none'
          }}
        >
          <ArrowLeft size={16} />
          Back to Church Management
        </Link>
      </div>

      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: 'var(--color-text)', margin: 0 }}>
          Church Onboarding &amp; Registration
        </h1>
        <p style={{ fontSize: 14, color: 'var(--color-warm-gray)', marginTop: 4 }}>
          Register a local church assembly into the Christly Home Faith Network. Submitted applications are queued for administrator verification.
        </p>
      </div>

      {/* Prototype Notice Banner */}
      <div style={{
        padding: '14px 18px',
        borderRadius: 12,
        backgroundColor: '#EFF6FF',
        border: '1px solid #BFDBFE',
        display: 'flex',
        alignItems: 'flex-start',
        gap: 12,
        marginBottom: 24
      }}>
        <Info size={20} style={{ color: '#2563EB', flexShrink: 0, marginTop: 2 }} />
        <div style={{ fontSize: 13, color: '#1E40AF', lineHeight: 1.5 }}>
          <b>FR-CHURCH-05 Prototype Notice:</b> This frontend prototype does not upload or retain file contents. It stores selected document names and metadata in browser local storage for the <b>Church Verification Queue</b>.
        </div>
      </div>

      {/* Submission Success Screen */}
      {submissionSuccess ? (
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 16,
          padding: 40,
          textAlign: 'center',
          boxShadow: 'var(--shadow-card)',
          border: '1px solid #D1D5DB'
        }}>
          <div style={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            backgroundColor: '#DCFCE7',
            color: '#15803D',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 20
          }}>
            <CheckCircle2 size={36} />
          </div>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--color-text)' }}>
            Application Submitted Successfully!
          </h2>
          <p style={{ color: 'var(--color-warm-gray)', fontSize: 14, maxWidth: 540, margin: '8px auto 24px' }}>
            <b>{name}</b> has been registered and placed into the <b>Church Verification Queue</b> with <b>PENDING</b> status. In accordance with compliance standards, the Verified badge will remain hidden until full administrator sign-off.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: 14 }}>
            <Link
              href="/admin/churches/verify"
              style={{
                padding: '10px 20px',
                borderRadius: 10,
                backgroundColor: 'var(--color-primary)',
                color: 'white',
                fontWeight: 600,
                fontSize: 14,
                textDecoration: 'none'
              }}
            >
              Go to Verification Queue
            </Link>
            <Link
              href="/admin/churches"
              style={{
                padding: '10px 20px',
                borderRadius: 10,
                backgroundColor: '#F3F4F6',
                color: '#374151',
                fontWeight: 600,
                fontSize: 14,
                textDecoration: 'none'
              }}
            >
              View in Church Management
            </Link>
          </div>
        </div>
      ) : (
        /* Registration Form */
        <form className="onboarding-form" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* SECTION 1: BASIC INFORMATION */}
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 16,
            padding: 24,
            boxShadow: 'var(--shadow-card)',
            border: '1px solid var(--color-border)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18, borderBottom: '1px solid #F3F4F6', paddingBottom: 12 }}>
              <Building2 size={20} style={{ color: 'var(--color-primary)' }} />
              <h3 style={{ fontSize: 17, fontWeight: 700, color: 'var(--color-text)', margin: 0 }}>
                1. Church Identity &amp; Denomination
              </h3>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--color-text)', marginBottom: 6 }}>
                  Church Official Name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Calvary Assembly of God"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 8,
                    border: errors.name ? '1.5px solid #DC2626' : '1px solid #D1D5DB',
                    fontSize: 14,
                    backgroundColor: '#FAFAF9'
                  }}
                />
                {errors.name && <p style={{ color: '#DC2626', fontSize: 12, marginTop: 4 }}>{errors.name}</p>}
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--color-text)', marginBottom: 6 }}>
                  Denomination / Tradition *
                </label>
                <select
                  value={denomination}
                  onChange={(e) => setDenomination(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 8,
                    border: errors.denomination ? '1.5px solid #DC2626' : '1px solid #D1D5DB',
                    fontSize: 14,
                    backgroundColor: '#FAFAF9'
                  }}
                >
                  {COMMON_DENOMINATIONS.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
                {errors.denomination && <p style={{ color: '#DC2626', fontSize: 12, marginTop: 4 }}>{errors.denomination}</p>}
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--color-text)', marginBottom: 6 }}>
                  Senior Pastor / Leader Name *
                </label>
                <input
                  type="text"
                  value={pastor}
                  onChange={(e) => setPastor(e.target.value)}
                  placeholder="e.g. Pastor David Samuel"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 8,
                    border: errors.pastor ? '1.5px solid #DC2626' : '1px solid #D1D5DB',
                    fontSize: 14,
                    backgroundColor: '#FAFAF9'
                  }}
                />
                {errors.pastor && <p style={{ color: '#DC2626', fontSize: 12, marginTop: 4 }}>{errors.pastor}</p>}
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--color-text)', marginBottom: 6 }}>
                  Year Founded
                </label>
                <input
                  type="number"
                  value={founded}
                  onChange={(e) => setFounded(e.target.value)}
                  placeholder="e.g. 2010"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 8,
                    border: '1px solid #D1D5DB',
                    fontSize: 14,
                    backgroundColor: '#FAFAF9'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--color-text)', marginBottom: 6 }}>
                  Estimated Active Congregation / Members
                </label>
                <input
                  type="number"
                  value={members}
                  onChange={(e) => setMembers(e.target.value)}
                  placeholder="e.g. 450"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 8,
                    border: '1px solid #D1D5DB',
                    fontSize: 14,
                    backgroundColor: '#FAFAF9'
                  }}
                />
              </div>
            </div>

            <div style={{ marginTop: 16 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--color-text)', marginBottom: 6 }}>
                Church Bio / Statement of Purpose
              </label>
              <textarea
                rows={3}
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                placeholder="Briefly describe the vision, history, and community focus of this church assembly..."
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 8,
                  border: '1px solid #D1D5DB',
                  fontSize: 14,
                  backgroundColor: '#FAFAF9',
                  fontFamily: 'inherit'
                }}
              />
            </div>
          </div>

          {/* SECTION 2: LOCATION & CONTACT DETAILS */}
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 16,
            padding: 24,
            boxShadow: 'var(--shadow-card)',
            border: '1px solid var(--color-border)'
          }}>
            <h3 style={{ fontSize: 17, fontWeight: 700, color: 'var(--color-text)', marginBottom: 18, borderBottom: '1px solid #F3F4F6', paddingBottom: 12 }}>
              2. Location &amp; Contact Details
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--color-text)', marginBottom: 6 }}>
                  Street Address *
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Plot/Door No, Street Name, Landmark"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 8,
                    border: errors.address ? '1.5px solid #DC2626' : '1px solid #D1D5DB',
                    fontSize: 14,
                    backgroundColor: '#FAFAF9'
                  }}
                />
                {errors.address && <p style={{ color: '#DC2626', fontSize: 12, marginTop: 4 }}>{errors.address}</p>}
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--color-text)', marginBottom: 6 }}>
                  City *
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Chennai"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 8,
                    border: errors.city ? '1.5px solid #DC2626' : '1px solid #D1D5DB',
                    fontSize: 14,
                    backgroundColor: '#FAFAF9'
                  }}
                />
                {errors.city && <p style={{ color: '#DC2626', fontSize: 12, marginTop: 4 }}>{errors.city}</p>}
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--color-text)', marginBottom: 6 }}>
                  State / Province *
                </label>
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder="e.g. Tamil Nadu"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 8,
                    border: errors.state ? '1.5px solid #DC2626' : '1px solid #D1D5DB',
                    fontSize: 14,
                    backgroundColor: '#FAFAF9'
                  }}
                />
                {errors.state && <p style={{ color: '#DC2626', fontSize: 12, marginTop: 4 }}>{errors.state}</p>}
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--color-text)', marginBottom: 6 }}>
                  Postal Code / PIN *
                </label>
                <input
                  type="text"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  placeholder="e.g. 600032"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 8,
                    border: errors.pincode ? '1.5px solid #DC2626' : '1px solid #D1D5DB',
                    fontSize: 14,
                    backgroundColor: '#FAFAF9'
                  }}
                />
                {errors.pincode && <p style={{ color: '#DC2626', fontSize: 12, marginTop: 4 }}>{errors.pincode}</p>}
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--color-text)', marginBottom: 6 }}>
                  Church Email *
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="info@churchdomain.org"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 8,
                    border: errors.email ? '1.5px solid #DC2626' : '1px solid #D1D5DB',
                    fontSize: 14,
                    backgroundColor: '#FAFAF9'
                  }}
                />
                {errors.email && <p style={{ color: '#DC2626', fontSize: 12, marginTop: 4 }}>{errors.email}</p>}
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--color-text)', marginBottom: 6 }}>
                  Contact Phone Number *
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98400 12345"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 8,
                    border: errors.phone ? '1.5px solid #DC2626' : '1px solid #D1D5DB',
                    fontSize: 14,
                    backgroundColor: '#FAFAF9'
                  }}
                />
                {errors.phone && <p style={{ color: '#DC2626', fontSize: 12, marginTop: 4 }}>{errors.phone}</p>}
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--color-text)', marginBottom: 6 }}>
                  Official Website (Optional)
                </label>
                <input
                  type="url"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="https://churchdomain.org"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 8,
                    border: '1px solid #D1D5DB',
                    fontSize: 14,
                    backgroundColor: '#FAFAF9'
                  }}
                />
              </div>
            </div>
          </div>

          {/* SECTION 3: SERVICE TIMINGS SCHEDULE */}
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 16,
            padding: 24,
            boxShadow: 'var(--shadow-card)',
            border: '1px solid var(--color-border)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18, borderBottom: '1px solid #F3F4F6', paddingBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Clock size={20} style={{ color: 'var(--color-primary)' }} />
                <h3 style={{ fontSize: 17, fontWeight: 700, color: 'var(--color-text)', margin: 0 }}>
                  3. Service Timings Schedule
                </h3>
              </div>
              <button
                type="button"
                onClick={addServiceTiming}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '6px 12px',
                  borderRadius: 8,
                  backgroundColor: 'var(--color-lavender)',
                  color: 'var(--color-primary-dark)',
                  border: 'none',
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                <Plus size={14} /> Add Service
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {serviceTimings.map((st, i) => (
                <div
                  key={st.id}
                  className="service-timing-row"
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '120px 140px 1fr 140px 140px 40px',
                    gap: 10,
                    alignItems: 'center',
                    backgroundColor: '#F8FAFC',
                    padding: 12,
                    borderRadius: 10,
                    border: '1px solid #E2E8F0'
                  }}
                >
                  <select
                    value={st.day}
                    onChange={(e) => updateServiceTiming(i, 'day', e.target.value)}
                    style={{ padding: '8px 10px', borderRadius: 6, border: '1px solid #D1D5DB', fontSize: 13 }}
                  >
                    {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(day => (
                      <option key={day} value={day}>{day}</option>
                    ))}
                  </select>

                  <input
                    type="text"
                    value={st.time}
                    onChange={(e) => updateServiceTiming(i, 'time', e.target.value)}
                    placeholder="09:30 AM"
                    style={{ padding: '8px 10px', borderRadius: 6, border: '1px solid #D1D5DB', fontSize: 13 }}
                  />

                  <input
                    type="text"
                    value={st.serviceName}
                    onChange={(e) => updateServiceTiming(i, 'serviceName', e.target.value)}
                    placeholder="Service Name (e.g. Worship & Word)"
                    style={{ padding: '8px 10px', borderRadius: 6, border: '1px solid #D1D5DB', fontSize: 13 }}
                  />

                  <input
                    type="text"
                    value={st.language}
                    onChange={(e) => updateServiceTiming(i, 'language', e.target.value)}
                    placeholder="Language"
                    style={{ padding: '8px 10px', borderRadius: 6, border: '1px solid #D1D5DB', fontSize: 13 }}
                  />

                  <select
                    value={st.type}
                    onChange={(e) => updateServiceTiming(i, 'type', e.target.value)}
                    style={{ padding: '8px 10px', borderRadius: 6, border: '1px solid #D1D5DB', fontSize: 13 }}
                  >
                    <option value="IN_PERSON">In-Person</option>
                    <option value="HYBRID">Hybrid</option>
                    <option value="ONLINE">Online Stream</option>
                  </select>

                  <button
                    type="button"
                    disabled={serviceTimings.length <= 1}
                    onClick={() => removeServiceTiming(i)}
                    style={{
                      border: 'none',
                      background: 'none',
                      color: serviceTimings.length <= 1 ? '#D1D5DB' : '#DC2626',
                      cursor: serviceTimings.length <= 1 ? 'not-allowed' : 'pointer'
                    }}
                    title="Remove timing"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 4: REQUIRED VERIFICATION EVIDENCE & DOCUMENTS */}
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 16,
            padding: 24,
            boxShadow: 'var(--shadow-card)',
            border: '1px solid var(--color-border)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14, borderBottom: '1px solid #F3F4F6', paddingBottom: 12 }}>
              <UploadCloud size={20} style={{ color: 'var(--color-primary)' }} />
              <div>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: 'var(--color-text)', margin: 0 }}>
                  4. Required Verification Evidence &amp; Documents
                </h3>
                <p style={{ fontSize: 12, color: 'var(--color-warm-gray)', margin: '2px 0 0' }}>
                  Select PDF, JPG, or PNG files up to 10 MB each. Only names and metadata are retained in this browser prototype; file contents are not available to reviewers.
                </p>
              </div>
            </div>

            <div style={{ display: 'grid', gap: 16 }}>
              {uploadedFiles.map((docItem, index) => (
                <div
                  key={docItem.type}
                  style={{
                    border: '1px dashed #CBD5E1',
                    borderRadius: 12,
                    padding: 16,
                    backgroundColor: docItem.file || docItem.mockName ? '#F0FDF4' : '#F8FAFC',
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text)' }}>
                        {docItem.label}
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--color-warm-gray)', marginTop: 2 }}>
                        {docItem.file ? (
                          <span style={{ color: '#15803D', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                          <FileCheck size={14} /> Selected: {docItem.file.name}
                          </span>
                        ) : (
                          'Accepted formats: PDF, JPG, PNG (Max 10 MB)'
                        )}
                      </div>
                    </div>

                    <div>
                      <input
                        type="file"
                        id={`file-input-${index}`}
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => handleFileChange(index, e)}
                        style={{ display: 'none' }}
                      />
                      <label
                        htmlFor={`file-input-${index}`}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 6,
                          padding: '8px 14px',
                          borderRadius: 8,
                          backgroundColor: docItem.file ? '#DCFCE7' : '#FFFFFF',
                          color: docItem.file ? '#166534' : 'var(--color-primary)',
                          border: docItem.file ? '1px solid #86EFAC' : '1px solid var(--color-primary)',
                          fontSize: 13,
                          fontWeight: 600,
                          cursor: 'pointer'
                        }}
                      >
                        <UploadCloud size={14} />
                        {docItem.file ? 'Change File' : 'Select Document'}
                      </label>
                    </div>
                  </div>

                  {errors[`doc${index}`] && (
                    <p style={{ color: '#DC2626', fontSize: 12, marginTop: 8 }}>
                      {errors[`doc${index}`]}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Form Actions */}
          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 14,
            paddingTop: 10
          }}>
            <button
              type="button"
              onClick={() => router.push('/admin/churches')}
              style={{
                padding: '12px 24px',
                borderRadius: 10,
                border: '1px solid #D1D5DB',
                backgroundColor: '#FFFFFF',
                color: '#374151',
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                padding: '12px 32px',
                borderRadius: 10,
                border: 'none',
                backgroundColor: 'var(--color-primary)',
                color: '#FFFFFF',
                fontSize: 14,
                fontWeight: 700,
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                opacity: isSubmitting ? 0.7 : 1,
                boxShadow: '0 4px 6px -1px rgba(91, 45, 142, 0.3)'
              }}
            >
              {isSubmitting ? 'Validating & Registering...' : 'Submit Church Application'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
