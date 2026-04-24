"use client";
import React, { createContext, useContext } from 'react';
import { supabase } from '@/lib/supabase';

const WalletContext = createContext<any>(null);

export const WalletProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <WalletContext.Provider value={{ 
      balance: 0, 
      deductBalance: async (amount: number) => {
        const { error } = await supabase.rpc('deduct_balance', { amount });
        return !error;
      }, 
      addWinnings: async (amount: number) => {
        await supabase.rpc('add_winnings', { amount });
      } 
    }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => useContext(WalletContext) || { balance: 0, deductBalance: async () => true, addWinnings: async () => {} };
