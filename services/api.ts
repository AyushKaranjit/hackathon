const API_BASE = 'http://172.20.10.86:8000';

export interface ExtractedField {
  field_name: string;
  value: string;
  confidence: number;
}

export interface DocumentAnalysisResult {
  document_type: string;
  extracted_fields: ExtractedField[];
  authenticity_score: number;
  authenticity_details: string[];
  warnings: string[];
}

export interface FaceMatchResult {
  match_score: number;
  match_details: string;
  is_match: boolean;
}

export interface FullVerificationResult {
  verification_id: string;
  document_analysis: DocumentAnalysisResult;
  face_match: FaceMatchResult;
  overall_verdict: 'verified' | 'suspicious' | 'failed';
  overall_score: number;
  summary: string;
  timestamp: string;
}

async function apiCall<T>(endpoint: string, body: object): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Network error' }));
    throw new Error(error.detail || `API error: ${response.status}`);
  }

  return response.json();
}

export async function analyzeDocument(
  imageBase64: string,
  documentType?: string
): Promise<DocumentAnalysisResult> {
  return apiCall<DocumentAnalysisResult>('/api/analyze-document', {
    image_base64: imageBase64,
    document_type: documentType ?? null,
  });
}

export async function matchFaces(
  documentImageBase64: string,
  selfieImageBase64: string
): Promise<FaceMatchResult> {
  return apiCall<FaceMatchResult>('/api/match-faces', {
    document_image_base64: documentImageBase64,
    selfie_image_base64: selfieImageBase64,
  });
}

export async function verifyComplete(
  documentImageBase64: string,
  selfieImageBase64: string,
  documentType?: string
): Promise<FullVerificationResult> {
  return apiCall<FullVerificationResult>('/api/verify-complete', {
    document_image_base64: documentImageBase64,
    selfie_image_base64: selfieImageBase64,
    document_type: documentType ?? null,
  });
}

export async function getVerifications(): Promise<{ verifications: FullVerificationResult[] }> {
  const response = await fetch(`${API_BASE}/api/verifications`);
  if (!response.ok) throw new Error('Failed to fetch verifications');
  return response.json();
}
