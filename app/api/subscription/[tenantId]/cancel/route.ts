import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { API_CONFIG } from '@/config/api';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ tenantId: string }> }
) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    // Await params in Next.js 15
    const { tenantId } = await params;

    // Verificar se o usuário tem acesso ao tenant e é admin
    if (session.user.tenantId !== tenantId || session.user.role !== 'tenant_admin') {
      return NextResponse.json(
        { error: 'Acesso negado' },
        { status: 403 }
      );
    }

    // Cancelar assinatura no backend
    const response = await fetch(`${API_CONFIG.baseUrl}/billing/subscription/${tenantId}/cancel`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Erro desconhecido' }));
      return NextResponse.json(
        { error: errorData.message || 'Erro ao cancelar assinatura' },
        { status: response.status }
      );
    }

    const result = await response.json();
    return NextResponse.json(result);

  } catch (error) {
    console.error('Error canceling subscription:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}