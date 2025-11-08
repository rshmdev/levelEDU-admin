'use client';

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Palette, Eye, RotateCcw, Save } from "lucide-react";
import { useTenant } from "@/hooks/use-tenant";

// Paletas de cores pré-definidas para manter harmonia
const COLOR_PALETTES = {
  primary: [
    { name: 'Azul Clássico', value: 'oklch(0.72 0.19 252)', preview: '#4F46E5' },
    { name: 'Azul Oceano', value: 'oklch(0.65 0.25 230)', preview: '#0EA5E9' },
    { name: 'Verde Natureza', value: 'oklch(0.70 0.20 150)', preview: '#10B981' },
    { name: 'Violeta Moderno', value: 'oklch(0.68 0.24 285)', preview: '#8B5CF6' },
    { name: 'Rosa Elegante', value: 'oklch(0.70 0.22 350)', preview: '#EC4899' },
    { name: 'Laranja Vibrante', value: 'oklch(0.72 0.25 45)', preview: '#F97316' },
    { name: 'Vermelho Forte', value: 'oklch(0.65 0.28 25)', preview: '#EF4444' },
    { name: 'Teal Suave', value: 'oklch(0.68 0.18 180)', preview: '#14B8A6' },
  ],
  accent: [
    { name: 'Violeta Accent', value: 'oklch(0.65 0.25 285)', preview: '#8B5CF6' },
    { name: 'Rosa Accent', value: 'oklch(0.68 0.22 350)', preview: '#EC4899' },
    { name: 'Laranja Accent', value: 'oklch(0.70 0.25 45)', preview: '#F97316' },
    { name: 'Verde Accent', value: 'oklch(0.72 0.20 150)', preview: '#10B981' },
    { name: 'Azul Accent', value: 'oklch(0.70 0.22 230)', preview: '#0EA5E9' },
    { name: 'Amarelo Accent', value: 'oklch(0.75 0.20 85)', preview: '#F59E0B' },
  ]
};

interface BrandingSetupProps {
  onSave: (branding: any) => void;
  initialBranding?: any;
}

export default function BrandingSetup({ onSave, initialBranding }: BrandingSetupProps) {
  const { tenant } = useTenant();
  const [selectedColors, setSelectedColors] = useState({
    primary: initialBranding?.primaryColor || COLOR_PALETTES.primary[0].value,
    accent: initialBranding?.accentColor || COLOR_PALETTES.accent[0].value,
  });
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  // Aplicar preview em tempo real
  useEffect(() => {
    if (isPreviewMode) {
      const root = document.documentElement;
      root.style.setProperty('--primary', selectedColors.primary);
      root.style.setProperty('--accent', selectedColors.accent);
    }
  }, [selectedColors, isPreviewMode]);

  // Restaurar cores originais quando sair do preview
  useEffect(() => {
    return () => {
      if (isPreviewMode) {
        const root = document.documentElement;
        root.style.removeProperty('--primary');
        root.style.removeProperty('--accent');
      }
    };
  }, [isPreviewMode]);

  const handleColorSelect = (type: 'primary' | 'accent', color: string) => {
    setSelectedColors(prev => ({ ...prev, [type]: color }));
  };

  const handlePreviewToggle = () => {
    setIsPreviewMode(!isPreviewMode);
    if (!isPreviewMode) {
      // Ativar preview
      const root = document.documentElement;
      root.style.setProperty('--primary', selectedColors.primary);
      root.style.setProperty('--accent', selectedColors.accent);
    } else {
      // Desativar preview
      const root = document.documentElement;
      root.style.removeProperty('--primary');
      root.style.removeProperty('--accent');
    }
  };

  const handleReset = () => {
    const defaultColors = {
      primary: COLOR_PALETTES.primary[0].value,
      accent: COLOR_PALETTES.accent[0].value,
    };
    setSelectedColors(defaultColors);
  };

  const handleSave = () => {
    const brandingData = {
      primaryColor: selectedColors.primary,
      accentColor: selectedColors.accent,
      secondaryColor: 'oklch(0.25 0 0)', // Mantém padrão
      backgroundColor: 'oklch(0.985 0 0)', // Mantém padrão
      textColor: 'oklch(0.205 0 0)', // Mantém padrão
    };
    
    onSave(brandingData);
  };

  const getPalettePreview = (type: 'primary' | 'accent', colorValue: string) => {
    return COLOR_PALETTES[type].find(c => c.value === colorValue)?.preview || '#000';
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2 flex items-center justify-center gap-3">
          <Palette className="w-8 h-8 text-primary" />
          Personalize sua Escola
        </h1>
        <p className="text-muted-foreground">
          Escolha as cores que representam a identidade da sua instituição
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Cor Primária */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Cor Primária</CardTitle>
            <CardDescription>
              Cor principal da interface, botões e destaques importantes
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {COLOR_PALETTES.primary.map((color) => (
                <button
                  key={color.value}
                  onClick={() => handleColorSelect('primary', color.value)}
                  className={`p-3 rounded-lg border-2 transition-all hover:scale-105 ${
                    selectedColors.primary === color.value
                      ? 'border-primary shadow-lg'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div 
                    className="w-full h-8 rounded mb-2"
                    style={{ backgroundColor: color.preview }}
                  />
                  <span className="text-sm font-medium">{color.name}</span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Cor Accent */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Cor de Destaque</CardTitle>
            <CardDescription>
              Cor secundária para ênfases, ícones especiais e detalhes
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {COLOR_PALETTES.accent.map((color) => (
                <button
                  key={color.value}
                  onClick={() => handleColorSelect('accent', color.value)}
                  className={`p-3 rounded-lg border-2 transition-all hover:scale-105 ${
                    selectedColors.accent === color.value
                      ? 'border-primary shadow-lg'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div 
                    className="w-full h-8 rounded mb-2"
                    style={{ backgroundColor: color.preview }}
                  />
                  <span className="text-sm font-medium">{color.name}</span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Preview Demo */}
      <Card>
        <CardHeader>
          <CardTitle>Preview da Interface</CardTitle>
          <CardDescription>
            Veja como ficará sua escola com as cores selecionadas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-6 border rounded-lg bg-background/50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">
                Dashboard - {tenant?.name || 'Sua Escola'}
              </h3>
              <Badge 
                className="text-xs"
                style={{ 
                  backgroundColor: getPalettePreview('accent', selectedColors.accent),
                  color: 'white'
                }}
              >
                Novo
              </Badge>
            </div>
            
            <div className="space-y-3">
              <Button 
                className="w-full justify-start"
                style={{ 
                  backgroundColor: getPalettePreview('primary', selectedColors.primary),
                  borderColor: getPalettePreview('primary', selectedColors.primary)
                }}
              >
                Botão Primário
              </Button>
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  style={{ 
                    borderColor: getPalettePreview('primary', selectedColors.primary),
                    color: getPalettePreview('primary', selectedColors.primary)
                  }}
                >
                  Botão Secundário
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon"
                  style={{ color: getPalettePreview('accent', selectedColors.accent) }}
                >
                  <Eye className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ações */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between">
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={handlePreviewToggle}
            className="flex items-center gap-2"
          >
            <Eye className="w-4 h-4" />
            {isPreviewMode ? 'Sair do Preview' : 'Preview Geral'}
          </Button>
          <Button
            variant="outline"
            onClick={handleReset}
            className="flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Resetar
          </Button>
        </div>
        
        <Button
          onClick={handleSave}
          className="flex items-center gap-2 bg-primary hover:bg-primary/90"
          style={{ 
            backgroundColor: getPalettePreview('primary', selectedColors.primary)
          }}
        >
          <Save className="w-4 h-4" />
          Salvar Personalização
        </Button>
      </div>

      {isPreviewMode && (
        <div className="fixed bottom-4 right-4 bg-primary text-primary-foreground px-4 py-2 rounded-lg shadow-lg">
          <div className="flex items-center gap-2 text-sm">
            <Eye className="w-4 h-4" />
            Modo Preview Ativo
          </div>
        </div>
      )}
    </div>
  );
}