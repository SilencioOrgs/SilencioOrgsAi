import type { CSSProperties } from "react";

type IconProps = {
  className?: string;
  filled?: boolean;
  name: string;
  size?: number;
};

export function Icon({ className = "", filled = false, name, size }: IconProps) {
  const style: CSSProperties = {
    fontVariationSettings: `'FILL' ${filled ? 1 : 0}, 'wght' 500, 'GRAD' 0, 'opsz' 24`,
    ...(size ? { fontSize: `${size}px` } : {}),
  };

  return (
    <span aria-hidden="true" className={`material-symbols-outlined ${className}`} style={style}>
      {name}
    </span>
  );
}
