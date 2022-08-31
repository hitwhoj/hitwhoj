import type { ReactNode } from "react";

type Props = {
  icon: ReactNode;
  color: string;
  children: ReactNode;
};

/**
 * 展示大会员的标志
 */
export function AvatarBadge({ icon, color, children }: Props) {
  return (
    <div style={{ position: "relative" }}>
      {children}
      <span
        style={{
          display: "block",
          position: "absolute",
          right: 0,
          bottom: 0,
          height: 20,
          width: 20,
          lineHeight: "20px",
          textAlign: "center",
          color: "white",
          borderRadius: "50%",
          fontSize: "0.75rem",
          backgroundColor: `rgb(var(--${color}-6))`,
        }}
      >
        {icon}
      </span>
    </div>
  );
}
