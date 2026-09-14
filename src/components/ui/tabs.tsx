"use client";

import * as React from "react";

type TabsContextValue = {
  value: string;
  onValueChange: (value: string) => void;
};

const TabsContext = React.createContext<TabsContextValue | null>(null);

function Tabs({ value, defaultValue, onValueChange, className = "", children, ...props }: React.HTMLAttributes<HTMLDivElement> & { value?: string; defaultValue?: string; onValueChange?: (value: string) => void }) {
  const [internalValue, setInternalValue] = React.useState(defaultValue ?? "");
  const selectedValue = value ?? internalValue;
  const changeValue = (nextValue: string) => {
    if (value === undefined) setInternalValue(nextValue);
    onValueChange?.(nextValue);
  };

  return <TabsContext.Provider value={{ value: selectedValue, onValueChange: changeValue }}><div className={`tabs ${className}`} {...props}>{children}</div></TabsContext.Provider>;
}

function TabsList({ className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`tabs-list ${className}`} role="tablist" {...props} />;
}

const TabsTrigger = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & { value: string }>(({ className = "", value, children, onClick, ...props }, ref) => {
  const context = React.useContext(TabsContext);
  if (!context) throw new Error("TabsTrigger deve estar dentro de Tabs.");
  const active = context.value === value;

  return <button ref={ref} type="button" role="tab" aria-selected={active} data-state={active ? "active" : "inactive"} className={`tabs-trigger ${className}`} onClick={(event) => { onClick?.(event); if (!event.defaultPrevented) context.onValueChange(value); }} {...props}>{children}</button>;
});
TabsTrigger.displayName = "TabsTrigger";

export { Tabs, TabsList, TabsTrigger };
