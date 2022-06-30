import React from "react";

export function TagSpace(_props: React.HTMLProps<HTMLDivElement>) {
  const { style, ...props } = _props;

  return (
    <div
      {...props}
      style={{ display: "flex", gap: 8, flexWrap: "wrap", ...style }}
    />
  );
}
