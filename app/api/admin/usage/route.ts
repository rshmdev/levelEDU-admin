import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { API_CONFIG } from '@/config/api';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    // Fazer request para o backend
    const response = await fetch(`${API_CONFIG.baseUrl}/admin/usage`, {
      headers: {
        'Authorization': `Bearer ${session.accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Erro desconhecido' }));
      return NextResponse.json(
        { error: errorData.message || 'Erro ao buscar dados de uso' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('Error fetching usage data:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}