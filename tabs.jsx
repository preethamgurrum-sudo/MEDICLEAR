export function Tabs({ children }) {
  return <div>{children}</div>;
}

export function TabsList({ children }) {
  return <div className="flex gap-2">{children}</div>;
}

export function TabsTrigger({ children, ...props }) {
  return <button {...props}>{children}</button>;
}

export function TabsContent({ children }) {
  return <div>{children}</div>;
}