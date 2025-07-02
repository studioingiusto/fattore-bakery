import { NextRequest, NextResponse } from 'next/server';

const WORDPRESS_URL = 'https://fattorebakery.it';
const WP_API_USERNAME = process.env.WP_API_USERNAME;
const WP_API_PASSWORD = process.env.WP_API_PASSWORD;

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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const formId = searchParams.get('id') || '14'; // Default form ID
    
    const headers = getAuthHeaders();
    const response = await fetch(`${WORDPRESS_URL}/wp-json/contact-form-7/v1/contact-forms/${formId}`, {
      headers,
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const formData = await response.json();
    
    // Parse form fields from WordPress structure
    const fields = [];
    if (formData.properties && formData.properties.form && formData.properties.form.fields) {
      for (const field of formData.properties.form.fields) {
        if (field.name && field.name.startsWith('your-')) {
          fields.push({
            name: field.name,
            type: mapWordPressFieldType(field.basetype),
            label: formatFieldLabel(field.name),
            required: field.type && field.type.includes('*'),
            placeholder: getFieldPlaceholder(field.name),
          });
        }
      }
    }
    
    const config = {
      id: formData.id,
      title: formData.title,
      fields: fields,
    };
    
    return NextResponse.json(config);
  } catch (error) {
    console.error('Error fetching form config:', error);
    return NextResponse.json(
      { error: 'Failed to fetch form configuration' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { formData, formId = 14 } = body;
    
    // Non impostiamo Content-Type per FormData - sarà gestito automaticamente
    const headers: HeadersInit = {
      'Authorization': `Basic ${btoa(`${WP_API_USERNAME}:${WP_API_PASSWORD}`)}`,
    };
    
    const formDataBody = new FormData();
    
    // Aggiungiamo i parametri richiesti da Contact Form 7
    formDataBody.append('_wpcf7', formId.toString());
    formDataBody.append('_wpcf7_version', '5.8.1');
    formDataBody.append('_wpcf7_locale', 'it_IT');
    formDataBody.append('_wpcf7_unit_tag', `wpcf7-f${formId}-o1`);
    
    // Aggiungiamo i dati del form
    Object.entries(formData).forEach(([key, value]) => {
      formDataBody.append(key, value as string);
    });
    
    const response = await fetch(`${WORDPRESS_URL}/wp-json/contact-form-7/v1/contact-forms/${formId}/feedback`, {
      method: 'POST',
      headers,
      body: formDataBody,
    });

    const result = await response.json();
    
    if (result.status === 'mail_sent') {
      return NextResponse.json({ success: true, message: 'Messaggio inviato con successo!' });
    } else {
      return NextResponse.json({ 
        success: false, 
        message: result.message || result.response || 'Errore nell\'invio del messaggio' 
      });
    }
  } catch (error) {
    console.error('Error submitting form:', error);
    return NextResponse.json(
      { success: false, message: 'Errore del server' },
      { status: 500 }
    );
  }
}

function mapWordPressFieldType(wpType: string): string {
  switch (wpType) {
    case 'text': return 'text';
    case 'email': return 'email';
    case 'tel': return 'tel';
    case 'textarea': return 'textarea';
    default: return 'text';
  }
}

function formatFieldLabel(fieldName: string): string {
  const labelMap: Record<string, string> = {
    'your-name': 'Nome',
    'your-surname': 'Cognome',
    'your-email': 'Email',
    'your-phone': 'Telefono',
    'your-address': 'Indirizzo',
    'your-city': 'Città',
    'your-message': 'Messaggio',
  };
  
  return labelMap[fieldName] || fieldName.replace('your-', '').replace('-', ' ');
}

function getFieldPlaceholder(fieldName: string): string {
  const placeholderMap: Record<string, string> = {
    'your-name': 'Il tuo nome',
    'your-surname': 'Il tuo cognome',
    'your-email': 'la-tua-email@esempio.com',
    'your-phone': 'Il tuo numero di telefono',
    'your-address': 'Il tuo indirizzo',
    'your-city': 'La tua città',
    'your-message': 'Il tuo messaggio...',
  };
  
  return placeholderMap[fieldName] || '';
} 