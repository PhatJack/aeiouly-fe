import React from 'react';

interface StatCardProps {
  value: string | number;
  label: string;
  icon?: React.ReactNode;
}

export const StatCard = ({ value, label, icon }: StatCardProps) => (
  <div className="border-border rounded-lg border p-6 text-center transition-shadow hover:shadow-md">
    <div className="text-primary mb-2 text-3xl font-bold">{value}</div>
    <div className="text-muted-foreground text-sm">{label}</div>
    {icon && <div className="text-primary mt-2 flex justify-center">{icon}</div>}
  </div>
);
