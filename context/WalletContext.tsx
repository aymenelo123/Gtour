"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface WalletContextType {
  balance: number;
  deductBalance: (amount: number) => boolean;
  addWinnings: (amount: number) => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  // Initialize default state with 1852.00
  const [balance, setBalance] = useState<number>(1852.00);

  const deductBalance = (amount: number): boolean => {
    if (balance >= amount) {
      setBalance((prev) => prev - amount);
      return true;
    }
    return false;
  };

  const addWinnings = (amount: number) => {
    setBalance((prev) => prev + amount);
  };

  return (
    <WalletContext.Provider value={{ balance, deductBalance, addWinnings }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
}
