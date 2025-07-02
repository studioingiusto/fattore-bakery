// Configurazione flessibile per diversi ambienti
const WORDPRESS_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL || 'https://admin.fattorebakery.it';
const API_BASE = `${WORDPRESS_URL}/wp-json/wp/v2`;

// API Credentials - DA CONFIGURARE in .env.local
const WP_API_USERNAME = process.env.WP_API_USERNAME;
const WP_API_PASSWORD = process.env.WP_API_PASSWORD;

// Types for WordPress data
export interface WordPressPost {
  id: number;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
  excerpt: {
    rendered: string;
  };
  slug: string;
  date: string;
  featured_media: number;
  author: number;
  categories: number[];
  tags: number[];
  _links: {
    'wp:featuredmedia'?: Array<{
      href: string;
    }>;
  };
}

export interface WordPressMedia {
  id: number;
  source_url: string;
  alt_text: string;
  media_details: {
    sizes: {
      [key: string]: {
        source_url: string;
        width: number;
        height: number;
      };
    };
  };
}

export interface WordPressPage {
  id: number;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
  slug: string;
  date: string;
  featured_media: number;
}

export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  message: string;
}

// New interface for form field configuration
export interface ContactFormField {
  name: string;
  type: 'text' | 'email' | 'tel' | 'textarea' | 'select' | 'checkbox' | 'radio';
  label: string;
  required: boolean;
  placeholder?: string;
  options?: string[]; // Per select, checkbox, radio
}

export interface ContactFormConfig {
  id: number;
  title: string;
  fields: ContactFormField[];
  form_html?: string;
}

// Fetch posts from WordPress
export async function getPosts(params: {
  per_page?: number;
  page?: number;
  search?: string;
  categories?: number[];
} = {}): Promise<WordPressPost[]> {
  const searchParams = new URLSearchParams();
  
  if (params.per_page) searchParams.append('per_page', params.per_page.toString());
  if (params.page) searchParams.append('page', params.page.toString());
  if (params.search) searchParams.append('search', params.search);
  if (params.categories?.length) {
    searchParams.append('categories', params.categories.join(','));
  }

  try {
    const response = await fetch(`${API_BASE}/posts?${searchParams}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
}

// Fetch a single post by slug
export async function getPostBySlug(slug: string): Promise<WordPressPost | null> {
  try {
    const response = await fetch(`${API_BASE}/posts?slug=${slug}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const posts = await response.json();
    return posts.length > 0 ? posts[0] : null;
  } catch (error) {
    console.error('Error fetching post:', error);
    return null;
  }
}

// Fetch featured media
export async function getMedia(mediaId: number): Promise<WordPressMedia | null> {
  if (!mediaId) return null;
  
  try {
    const response = await fetch(`${API_BASE}/media/${mediaId}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching media:', error);
    return null;
  }
}

// Fetch pages
export async function getPages(): Promise<WordPressPage[]> {
  try {
    const response = await fetch(`${API_BASE}/pages`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching pages:', error);
    return [];
  }
}

// Utility function to create auth headers
function getAuthHeaders(): HeadersInit {
  if (!WP_API_USERNAME || !WP_API_PASSWORD) {
    throw new Error('WordPress API credentials not configured');
  }
  
  const credentials = btoa(`${WP_API_USERNAME}:${WP_API_PASSWORD}`);
  return {
    'Authorization': `Basic ${credentials}`,
    'Content-Type': 'application/json',
  };
}

// Get list of available contact forms
export async function getContactForms(): Promise<ContactFormConfig[]> {
  try {
    const headers = getAuthHeaders();
    const response = await fetch(`${WORDPRESS_URL}/wp-json/contact-form-7/v1/contact-forms`, {
      headers,
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const forms = await response.json();
    return forms.map((form: { id: number; title: string; form: string }) => ({
      id: form.id,
      title: form.title,
      fields: parseFormFields(form.form),
      form_html: form.form,
    }));
  } catch (error) {
    console.error('Error fetching contact forms:', error);
    return [];
  }
}

// Get specific contact form configuration
export async function getContactFormConfig(formId?: number): Promise<ContactFormConfig | null> {
  try {
    // Se non è specificato un ID, usa il form di default (ID 14)
    if (!formId) {
      formId = 14; // ID del form "Form richiedi maggiori informazioni"
    }
    
    const headers = getAuthHeaders();
    const response = await fetch(`${WORDPRESS_URL}/wp-json/contact-form-7/v1/contact-forms/${formId}`, {
      headers,
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const formData = await response.json();
    
    return {
      id: formData.id,
      title: formData.title,
      fields: parseWordPressFormFields(formData.properties),
      form_html: formData.properties?.form?.content || '',
    };
  } catch (error) {
    console.error('Error fetching contact form config:', error);
    return null;
  }
}

// Parse WordPress Contact Form 7 form structure to extract fields
function parseWordPressFormFields(properties: { form?: { fields?: Array<{ basetype: string; type: string; name: string }> } }): ContactFormField[] {
  const fields: ContactFormField[] = [];
  
  if (!properties?.form?.fields) {
    return fields;
  }
  
  properties.form.fields.forEach((field: { basetype: string; type: string; name: string }) => {
    // Skip submit buttons
    if (field.basetype === 'submit') return;
    
    const isRequired = field.type.includes('*');
    const fieldType = field.basetype as ContactFormField['type'];
    
    // Genera label dal nome del campo
    let label = field.name
      .replace(/^your-/, '')
      .replace(/-/g, ' ')
      .replace(/\b\w/g, (l: string) => l.toUpperCase());
    
    // Traduzioni specifiche per il form
    const labelTranslations: Record<string, string> = {
      'Name': 'Nome',
      'Surname': 'Cognome', 
      'Address': 'Indirizzo',
      'City': 'Città',
      'Phone': 'Telefono',
      'Email': 'Email',
    };
    
    label = labelTranslations[label] || label;
    
    // Genera placeholder appropriato
    let placeholder = `Inserisci ${label.toLowerCase()}`;
    if (fieldType === 'email') {
      placeholder = 'la-tua-email@esempio.com';
    } else if (field.name === 'your-phone') {
      placeholder = '+39 123 456 7890';
    }
    
    fields.push({
      name: field.name,
      type: fieldType,
      label,
      required: isRequired,
      placeholder,
    });
  });
  
  return fields;
}

// Parse Contact Form 7 form markup to extract fields
function parseFormFields(formHtml: string): ContactFormField[] {
  const fields: ContactFormField[] = [];
  
  // RegEx patterns per i diversi tipi di field di Contact Form 7
  const patterns = {
    text: /\[text(\*?)\s+([^\]]+)\]/g,
    email: /\[email(\*?)\s+([^\]]+)\]/g,
    tel: /\[tel(\*?)\s+([^\]]+)\]/g,
    textarea: /\[textarea(\*?)\s+([^\]]+)\]/g,
    select: /\[select(\*?)\s+([^\]]+)\]/g,
    checkbox: /\[checkbox(\*?)\s+([^\]]+)\]/g,
    radio: /\[radio(\*?)\s+([^\]]+)\]/g,
  };
  
  Object.entries(patterns).forEach(([type, regex]) => {
    let match;
    while ((match = regex.exec(formHtml)) !== null) {
      const isRequired = match[1] === '*';
      const fieldConfig = match[2];
      const fieldName = fieldConfig.split(' ')[0];
      
      // Estrae placeholder se presente
      const placeholderMatch = fieldConfig.match(/placeholder\s+"([^"]+)"/);
      const placeholder = placeholderMatch ? placeholderMatch[1] : undefined;
      
      // Genera label dal nome del campo
      const label = fieldName
        .replace(/^your-/, '')
        .replace(/-/g, ' ')
        .replace(/\b\w/g, l => l.toUpperCase());
      
      fields.push({
        name: fieldName,
        type: type as ContactFormField['type'],
        label,
        required: isRequired,
        placeholder,
      });
    }
  });
  
  return fields;
}

// Submit contact form with dynamic fields
export async function submitDynamicContactForm(
  formData: Record<string, string>, 
  formId: number = 14
): Promise<{ success: boolean; message: string }> {
  try {
    // Contact Form 7 endpoint per l'invio
    const response = await fetch(`${WORDPRESS_URL}/wp-json/contact-form-7/v1/contact-forms/${formId}/feedback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams(formData),
    });

    const result = await response.json();
    
    if (result.status === 'mail_sent') {
      return { success: true, message: 'Messaggio inviato con successo!' };
    } else {
      return { success: false, message: result.message || 'Errore nell\'invio del messaggio' };
    }
  } catch (error) {
    console.error('Error submitting form:', error);
    return { success: false, message: 'Errore di connessione. Riprova più tardi.' };
  }
}

// Utility to strip HTML tags and decode entities
export function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'");
}

// Format date
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('it-IT', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

// Submit contact form (for Contact Form 7 integration) - COMPATIBILITY
export async function submitContactForm(data: ContactFormData): Promise<{ success: boolean; message: string }> {
  // Use the dynamic submit function with default form ID
  const formData: Record<string, string> = {
    'your-name': data.name,
    'your-email': data.email,
    'your-phone': data.phone || '',
    'your-message': data.message,
  };
  return submitDynamicContactForm(formData, 14);
} 