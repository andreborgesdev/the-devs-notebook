"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface UserPreferences {
  codeBlocksExpanded: boolean;
  setCodeBlocksExpanded: (expanded: boolean) => void;
}

const UserPreferencesContext = createContext<UserPreferences | undefined>(
  undefined
);

export function UserPreferencesProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [codeBlocksExpanded, setCodeBlocksExpandedState] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("codeBlocksExpanded");
    if (saved !== null) {
      setCodeBlocksExpandedState(JSON.parse(saved));
    }
  }, []);

  const setCodeBlocksExpanded = (expanded: boolean) => {
    setCodeBlocksExpandedState(expanded);
    localStorage.setItem("codeBlocksExpanded", JSON.stringify(expanded));
  };

  return (
    <UserPreferencesContext.Provider
      value={{
        codeBlocksExpanded,
        setCodeBlocksExpanded,
      }}
    >
      {children}
    </UserPreferencesContext.Provider>
  );
}

export function useUserPreferences() {
  const context = useContext(UserPreferencesContext);
  if (context === undefined) {
    throw new Error(
      "useUserPreferences must be used within a UserPreferencesProvider"
    );
  }
  return context;
}
