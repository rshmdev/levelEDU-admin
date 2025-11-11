import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { API_CONFIG } from '@/config/api';

export async function GET(
  request: NextRequest,
  { params }: { params: { tenantId: string } }
) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    // Verificar se o usuário tem acesso ao tenant
    if (session.user.tenantId !== params.tenantId) {
      return NextResponse.json(
        { error: 'Acesso negado' },
        { status: 403 }
      );
    }

    // Buscar dados da assinatura no backend
    const response = await fetch(`${API_CONFIG.baseUrl}/billing/subscription/${params.tenantId}`, {
      headers: {
        'Authorization': `Bearer ${session.accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Erro desconhecido' }));
      return NextResponse.json(
        { error: errorData.message || 'Erro ao buscar assinatura' },
        { status: response.status }
      );
    }

    const subscriptionData = await response.json();
    return NextResponse.json(subscriptionData);

  } catch (error) {
    console.error('Error fetching subscription:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}