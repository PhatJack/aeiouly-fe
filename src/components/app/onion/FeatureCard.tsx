import React from 'react';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export const FeatureCard = ({ icon, title, description }: FeatureCardProps) => (
  <div className="space-y-4 text-center">
    <div className="bg-primary/10 mx-auto flex h-16 w-16 items-center justify-center rounded-full p-4">
      {icon}
    </div>
    <h3 className="text-foreground text-lg font-semibold">{title}</h3>
    <p className="text-muted-foreground">{description}</p>
  </div>
);
