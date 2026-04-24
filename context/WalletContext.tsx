"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/AuthProvider';

interface WalletContextType {
  balance: number;
  fetchBalance: () => Promise<void>;
  deductBalance: (amount: number) => Promise<boolean>;
  addWinnings: (amount: number) => Promise<void>;
}

const WalletContext = createContext<WalletContextType | null>(null);

export const WalletProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [balance, setBalance] = useState<number>(0);

  const fetchBalance = async () => {
    if (!user || !user.id) {
      setBalance(0);
      return;
    }
    
    const { data, error } = await supabase
      .from('profiles')
      .select('balance')
      .eq('id', user.id)
      .single();
      
    if (error) {
      console.error('Error fetching balance:', error);
      return;
    }
    
    if (data) {
      setBalance(data.balance);
    }
  };

  // This prevents the balance from reverting to 0 on page refresh
  useEffect(() => {
    fetchBalance();
  }, [user]);

  const deductBalance = async (amount: number) => {
    // Calling the RPC function exactly as defined in Supabase with the 'amount' parameter
    const { error } = await supabase.rpc('deduct_balance', { amount });
    
    if (error) {
      console.error('[WalletContext] deduct_balance RPC error:', error.message);
      return false;
    }
    
    // Force immediate UI sync after successful deduction
    await fetchBalance();
    return true;
  };

  // Preserved addWinnings for Admin dashboard functionality
  const addWinnings = async (amount: number) => {
    const { error } = await supabase.rpc('add_winnings', { amount });
    if (error) {
      console.error('[WalletContext] add_winnings RPC error:', error.message);
      return;
    }
    await fetchBalance();
  };

  return (
    <WalletContext.Provider value={{ balance, deductBalance, fetchBalance, addWinnings }}>
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
