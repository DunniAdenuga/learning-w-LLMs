import React from "react";

export const Card = ({ children }) => {
  return <div className="card">{children}</div>;
};

export const CardContent = ({ children }) => {
  return <div className="card-content">{children}</div>;
};
