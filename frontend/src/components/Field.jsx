import { useId } from "react";

export default function Field({ label, type = "text", value, onChange, children, ...rest }) {
  const id = useId();

  return (
    <div>
      <label htmlFor={id}>{label}</label>
      {children || (
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          {...rest}
        />
      )}
    </div>
  );
}