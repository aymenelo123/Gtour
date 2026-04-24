"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/AuthProvider';

interface WalletContextType {
  balance: number | null;
  isLoadingBalance: boolean;
  fetchBalance: () => Promise<void>;
  deductBalance: (amount: number) => Promise<boolean>;
  addWinnings: (amount: number) => Promise<void>;
}

const WalletContext = createContext<WalletContextType | null>(null);

export const WalletProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading: isAuthLoading } = useAuth();
  const [balance, setBalance] = useState<number | null>(null);
  const [isLoadingBalance, setIsLoadingBalance] = useState<boolean>(true);

  const fetchBalance = useCallback(async () => {
    if (!user?.id) {
      setBalance(0);
      setIsLoadingBalance(false);
      return;
    }
    
    setIsLoadingBalance(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('balance')
      .eq('id', user.id)
      .single();
      
    if (error) {
      // Don't log if the row is missing when they first sign up
      if (error.code !== 'PGRST116') {
        console.error('[WalletContext] Error fetching balance:', error);
      }
      setBalance(0);
    } else if (data && data.balance !== undefined) {
      setBalance(data.balance);
    }
    
    setIsLoadingBalance(false);
  }, [user?.id]); // Strictly depends on user.id string primitive

  useEffect(() => {
    // Only fetch once auth has initialized
    if (!isAuthLoading) {
      fetchBalance();
    }
  }, [fetchBalance, isAuthLoading]);

  const deductBalance = useCallback(async (amount: number) => {
    const { error } = await supabase.rpc('deduct_balance', { amount });
    
    if (error) {
      console.error('[WalletContext] deduct_balance RPC error:', error.message);
      return false;
    }
    
    await fetchBalance();
    return true;
  }, [fetchBalance]);

  const addWinnings = useCallback(async (amount: number) => {
    const { error } = await supabase.rpc('add_winnings', { amount });
    if (error) {
      console.error('[WalletContext] add_winnings RPC error:', error.message);
      return;
    }
    await fetchBalance();
  }, [fetchBalance]);

  return (
    <WalletContext.Provider value={{ balance, isLoadingBalance, deductBalance, fetchBalance, addWinnings }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};
