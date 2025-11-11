'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Building, Mail, User, Loader2, AlertCircle, Check, ArrowRight } from "lucide-react";
import { useCreateCheckout, formatCurrency } from "@/lib/stripe-client";

interface SchoolSignupFormProps {
  plan: {
    id: string;
    name: string;
    description: string;
    priceMonthly: number;
    priceYearly: number;
    features: string[];
  };
  trialDays?: number;
}

export default function SchoolSignupForm({ plan, trialDays }: SchoolSignupFormProps) {
  const router = useRouter();
  const { mutate: createCheckout, isPending } = useCreateCheckout();
  
  const [formData, setFormData] = useState({
    schoolName: '',
    adminName: '',
    adminEmail: '',
    subdomain: '',
    isYearly: false
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [subdomainChecked, setSubdomainChecked] = useState(false);
  const [subdomainAvailable, setSubdomainAvailable] = useState(false);

  // Generate subdomain suggestion from school name
  const generateSubdomain = (schoolName: string) => {
    return schoolName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '')
      .slice(0, 20);
  };

  const handleSchoolNameChange = (name: string) => {
    setFormData(prev => ({
      ...prev,
      schoolName: name,
      subdomain: prev.subdomain || generateSubdomain(name)
    }));
  };

  const checkSubdomainAvailability = async () => {
    if (!formData.subdomain) return;
    
    setSubdomainChecked(false);
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tenants/check-availability/${formData.subdomain}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Erro ao verificar disponibilidade');
      }
      
      const data = await response.json();
      const isAvailable = data.success && data.data.available;
      
      setSubdomainAvailable(isAvailable);
      setSubdomainChecked(true);
      
      if (!isAvailable) {
        setErrors(prev => ({ 
          ...prev, 
          subdomain: data.data.reason || 'Este subdomain não está disponível' 
        }));
      } else {
        setErrors(prev => ({ ...prev, subdomain: '' }));
      }
    } catch (error) {
      console.error('Erro ao verificar subdomain:', error);
      // Fallback para validação offline
      const isAvailable = !['admin', 'www', 'api', 'test', 'demo'].includes(formData.subdomain);
      setSubdomainAvailable(isAvailable);
      setSubdomainChecked(true);
      
      if (!isAvailable) {
        setErrors(prev => ({ ...prev, subdomain: 'Este subdomain não está disponível' }));
      } else {
        setErrors(prev => ({ ...prev, subdomain: '' }));
      }
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.schoolName.trim()) {
      newErrors.schoolName = 'Nome da escola é obrigatório';
    }

    if (!formData.adminName.trim()) {
      newErrors.adminName = 'Nome do administrador é obrigatório';
    }

    if (!formData.adminEmail.trim()) {
      newErrors.adminEmail = 'Email é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.adminEmail)) {
      newErrors.adminEmail = 'Email inválido';
    }

    if (!formData.subdomain.trim()) {
      newErrors.subdomain = 'Subdomain é obrigatório';
    } else if (!/^[a-z0-9]+$/.test(formData.subdomain)) {
      newErrors.subdomain = 'Subdomain deve conter apenas letras minúsculas e números';
    } else if (!subdomainAvailable) {
      newErrors.subdomain = 'Subdomain não disponível';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    // Criar checkout session com todos os dados
    createCheckout({
      planId: plan.id,
      isYearly: formData.isYearly,
      tenantSubdomain: formData.subdomain,
      customerData: {
        email: formData.adminEmail,
        name: formData.adminName
      }
    });
  };

  const selectedPrice = formData.isYearly ? plan.priceYearly : plan.priceMonthly;
  const savings = formData.isYearly ? Number(((plan.priceMonthly * 12 - plan.priceYearly) / (plan.priceMonthly * 12) * 100).toFixed(0)) : 0;

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex items-center justify-center py-10">
      {/* Background effects */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-[120px] animate-pulse delay-700" />

      <div className="container relative z-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-linear-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
              Criar sua escola no LevelEdu
            </h1>
            <p className="text-muted-foreground">
              Plano selecionado: <span className="font-medium text-foreground">{plan.name}</span>
              {trialDays && (
                <span className="ml-2 text-primary font-medium">
                  • {trialDays} dias grátis
                </span>
              )}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Formulário */}
            <Card className="bg-card/50 backdrop-blur-xl border border-border">
              <CardHeader>
                <CardTitle>Informações da escola</CardTitle>
                <CardDescription>
                  Preencha os dados para criar sua conta
                </CardDescription>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="schoolName">Nome da escola</Label>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="schoolName"
                        placeholder="Escola Exemplo"
                        value={formData.schoolName}
                        onChange={(e) => handleSchoolNameChange(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    {errors.schoolName && (
                      <p className="text-sm text-destructive">{errors.schoolName}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="adminName">Nome do administrador</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="adminName"
                        placeholder="João Silva"
                        value={formData.adminName}
                        onChange={(e) => setFormData(prev => ({ ...prev, adminName: e.target.value }))}
                        className="pl-10"
                      />
                    </div>
                    {errors.adminName && (
                      <p className="text-sm text-destructive">{errors.adminName}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="adminEmail">Email do administrador</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="adminEmail"
                        type="email"
                        placeholder="admin@escola.com"
                        value={formData.adminEmail}
                        onChange={(e) => setFormData(prev => ({ ...prev, adminEmail: e.target.value }))}
                        className="pl-10"
                      />
                    </div>
                    {errors.adminEmail && (
                      <p className="text-sm text-destructive">{errors.adminEmail}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subdomain">Subdomain da escola</Label>
                    <div className="flex">
                      <Input
                        id="subdomain"
                        placeholder="minhaescola"
                        value={formData.subdomain}
                        onChange={(e) => setFormData(prev => ({ ...prev, subdomain: e.target.value.toLowerCase() }))}
                        onBlur={checkSubdomainAvailability}
                        className="rounded-r-none"
                      />
                      <div className="bg-muted border border-l-0 border-input rounded-r-md px-3 flex items-center text-sm text-muted-foreground">
                        .leveledu.com.br
                      </div>
                    </div>
                    {subdomainChecked && (
                      <div className={`flex items-center gap-2 text-sm ${subdomainAvailable ? 'text-green-600' : 'text-destructive'}`}>
                        {subdomainAvailable ? (
                          <>
                            <Check className="h-3 w-3" />
                            <span>Subdomain disponível!</span>
                          </>
                        ) : (
                          <>
                            <AlertCircle className="h-3 w-3" />
                            <span>{errors.subdomain}</span>
                          </>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <Label>Frequência de pagamento</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, isYearly: false }))}
                        className={`p-3 rounded-md border text-left transition-colors ${
                          !formData.isYearly 
                            ? 'border-primary bg-primary/10 text-primary' 
                            : 'border-border hover:bg-accent'
                        }`}
                      >
                        <div className="font-medium">Mensal</div>
                        <div className="text-sm text-muted-foreground">
                          {formatCurrency(plan.priceMonthly)}/mês
                        </div>
                      </button>
                      
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, isYearly: true }))}
                        className={`p-3 rounded-md border text-left transition-colors ${
                          formData.isYearly 
                            ? 'border-primary bg-primary/10 text-primary' 
                            : 'border-border hover:bg-accent'
                        }`}
                      >
                        <div className="font-medium flex items-center gap-2">
                          Anual 
                          {savings > 0 && (
                            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                              -{savings}%
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {formatCurrency(plan.priceYearly)}/ano
                        </div>
                      </button>
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full h-11 text-base font-medium"
                    disabled={isPending}
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processando...
                      </>
                    ) : (
                      <>
                        Continuar para pagamento
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Resumo do plano */}
            <Card className="bg-card/30 backdrop-blur-sm border border-border h-fit">
              <CardHeader>
                <CardTitle>Resumo do pedido</CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="rounded-lg bg-primary/10 border border-primary/20 p-4">
                  <h3 className="font-medium text-primary mb-2">{plan.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{plan.description}</p>
                  
                  <div className="text-2xl font-bold text-foreground mb-1">
                    {formatCurrency(selectedPrice)}
                    <span className="text-sm font-normal text-muted-foreground ml-1">
                      /{formData.isYearly ? 'ano' : 'mês'}
                    </span>
                  </div>
                  
                  {formData.isYearly && savings > 0 && (
                    <div className="text-sm text-green-600">
                      Economia de {savings}% com pagamento anual
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Recursos inclusos:</h4>
                  {plan.features.slice(0, 5).map((feature, index) => (
                    <div key={index} className="flex items-start gap-2 text-sm">
                      <Check className="h-3 w-3 text-primary mt-1 shrink-0" />
                      <span className="text-muted-foreground">{feature}</span>
                    </div>
                  ))}
                  {plan.features.length > 5 && (
                    <div className="text-sm text-primary">
                      +{plan.features.length - 5} recursos adicionais
                    </div>
                  )}
                </div>

                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Teste grátis por 30 dias. Cancele a qualquer momento.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}