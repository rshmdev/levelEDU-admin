"use client"

import { useState, useEffect } from 'react';
import { API_CONFIG } from '@/config/api';

interface SpecialOffer {
  id: string;
  name: string;
  description: string;
  discountPercentage: number;
  benefits: string[];
  guarantees: string[];
  couponCode: string;
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
}

interface UseSpecialOfferReturn {
  offer: SpecialOffer | null;
  timeRemaining: TimeRemaining;
  schoolsRemaining: number;
  isActive: boolean;
  loading: boolean;
  error: string | null;
  validateOffer: (offerId: string, plan: 'basic' | 'premium') => Promise<any>;
}

export function useSpecialOffer(): UseSpecialOfferReturn {
  const [offer, setOffer] = useState<SpecialOffer | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false
  });
  const [schoolsRemaining, setSchoolsRemaining] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Buscar oferta atual da API
  const fetchCurrentOffer = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_CONFIG.baseUrl}/api/special-offers/current`);
      const data = await response.json();

      if (data.success && data.data.hasActiveOffer) {
        setOffer(data.data.offer);
        setTimeRemaining(data.data.offer.timeRemaining);
        setSchoolsRemaining(data.data.offer.schoolsRemaining);
        setIsActive(true);
      } else {
        setIsActive(false);
        setOffer(null);
      }
    } catch (err: any) {
      console.error('Erro ao buscar oferta:', err);
      setError(err.message);
      setIsActive(false);
    } finally {
      setLoading(false);
    }
  };

  // Atualizar timer a cada segundo
  useEffect(() => {
    if (!isActive || !offer) return;

    const interval = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev.isExpired) return prev;

        let { days, hours, minutes, seconds } = prev;

        if (seconds > 0) {
          seconds--;
        } else if (minutes > 0) {
          minutes--;
          seconds = 59;
        } else if (hours > 0) {
          hours--;
          minutes = 59;
          seconds = 59;
        } else if (days > 0) {
          days--;
          hours = 23;
          minutes = 59;
          seconds = 59;
        } else {
          return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
        }

        return { days, hours, minutes, seconds, isExpired: false };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, offer]);

  // Buscar oferta na inicialização
  useEffect(() => {
    fetchCurrentOffer();
  }, []);

  // Validar oferta no backend
  const validateOffer = async (offerId: string, plan: 'basic' | 'premium') => {
    try {
      const response = await fetch(`${API_CONFIG.baseUrl}/api/special-offers/validate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ offerId, plan }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Erro ao validar oferta');
      }

      return data.data;
    } catch (error: any) {
      console.error('Erro ao validar oferta:', error);
      throw error;
    }
  };

  return {
    offer,
    timeRemaining,
    schoolsRemaining,
    isActive,
    loading,
    error,
    validateOffer
  };
}