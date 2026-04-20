import { API_BASE_URL } from '../config/api.config';
import { getAccessToken } from '../utils/tokenUtil';

export type NewsletterAudience = 'registered' | 'subscribers' | 'all';
export type NewsletterTemplateStyle = 'clean' | 'ocean' | 'forest';

export interface NewsletterBlocks {
  introTitle?: string;
  introText?: string;
  highlightTitle?: string;
  highlightText?: string;
  bullets?: string[];
  closingText?: string;
}

export interface NewsletterCustomization {
  templateStyle: NewsletterTemplateStyle;
  preheader?: string;
  ctaText?: string;
  ctaUrl?: string;
  senderName?: string;
  footerNote?: string;
  blocks?: NewsletterBlocks;
}

export interface RecipientsSummary {
  registered: number;
  subscribers: number;
  totalUnique: number;
}

export interface AdminSendCampaignPayload {
  subject: string;
  message: string;
  audience: NewsletterAudience;
  customization?: NewsletterCustomization;
}

export interface AdminSendCampaignResponse {
  message: string;
  audience: NewsletterAudience;
  totalRecipients: number;
  sent: number;
  failed: number;
  failedRecipients: string[];
  campaignId?: number;
}

export interface AdminSendTestPayload {
  toEmail: string;
  subject: string;
  message: string;
  customization?: NewsletterCustomization;
}

export interface AdminCampaignPreviewPayload {
  subject: string;
  message: string;
  previewEmail?: string;
  customization?: NewsletterCustomization;
}

export interface AdminCampaignPreviewResponse {
  subject: string;
  message: string;
  previewEmail: string;
  unsubscribeLink: string;
  customization: NewsletterCustomization;
  validation?: CampaignValidationResult;
  html: string;
  text: string;
}

export interface CampaignValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  usedVariables: string[];
  allowedVariables: string[];
}

export interface CampaignHistoryItem {
  id: number;
  subject: string;
  message: string;
  preheader?: string | null;
  templateStyle?: NewsletterTemplateStyle | null;
  customization?: NewsletterCustomization | null;
  audience: NewsletterAudience | 'test';
  totalRecipients: number;
  sent: number;
  failed: number;
  sentByEmail?: string | null;
  isTest: boolean;
  createdAt: string;
}

export interface CampaignHistoryResponse {
  data: CampaignHistoryItem[];
  total: number;
  page: number;
  totalPages: number;
  hasMore: boolean;
}

export interface CampaignDetailResponse extends CampaignHistoryItem {}

const withAuthHeaders = () => {
  const token = getAccessToken();
  if (!token) {
    throw new Error('No hay token de autenticacion');
  }

  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
};

export const adminNewsletterService = {
  async getRecipientsSummary(): Promise<RecipientsSummary> {
    const response = await fetch(`${API_BASE_URL}/newsletter/admin/recipients-summary`, {
      method: 'GET',
      headers: withAuthHeaders(),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Error al obtener resumen de destinatarios');
    }

    return data;
  },

  async sendCampaign(payload: AdminSendCampaignPayload): Promise<AdminSendCampaignResponse> {
    const response = await fetch(`${API_BASE_URL}/newsletter/admin/send`, {
      method: 'POST',
      headers: withAuthHeaders(),
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Error al enviar la campaña');
    }

    return data;
  },

  async sendTestEmail(payload: AdminSendTestPayload): Promise<{ message: string; campaignId?: number }> {
    const response = await fetch(`${API_BASE_URL}/newsletter/admin/send-test`, {
      method: 'POST',
      headers: withAuthHeaders(),
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Error al enviar email de prueba');
    }

    return data;
  },

  async previewCampaign(payload: AdminCampaignPreviewPayload): Promise<AdminCampaignPreviewResponse> {
    const response = await fetch(`${API_BASE_URL}/newsletter/admin/preview`, {
      method: 'POST',
      headers: withAuthHeaders(),
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Error al generar preview');
    }

    return data;
  },

  async validateCampaign(payload: AdminCampaignPreviewPayload): Promise<CampaignValidationResult> {
    const response = await fetch(`${API_BASE_URL}/newsletter/admin/validate`, {
      method: 'POST',
      headers: withAuthHeaders(),
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Error al validar campaña');
    }

    return data;
  },

  async getCampaignHistory(page = 1, limit = 20): Promise<CampaignHistoryResponse> {
    const response = await fetch(`${API_BASE_URL}/newsletter/admin/history?page=${page}&limit=${limit}`, {
      method: 'GET',
      headers: withAuthHeaders(),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Error al obtener historial de campañas');
    }

    return data;
  },

  async getCampaignDetail(id: number): Promise<CampaignDetailResponse> {
    const response = await fetch(`${API_BASE_URL}/newsletter/admin/campaigns/${id}`, {
      method: 'GET',
      headers: withAuthHeaders(),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Error al obtener detalle de campaña');
    }

    return data;
  },
};
