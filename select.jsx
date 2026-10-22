export function Select({ children }) {
  return <div>{children}</div>;
}

export function SelectTrigger({ children }) {
  return <div>{children}</div>;
}

export function SelectValue({ placeholder }) {
  return <span>{placeholder}</span>;
}

export function SelectContent({ children }) {
  return <div>{children}</div>;
}

export function SelectItem({ children, value }) {
  return <option value={value}>{children}</option>;
}