import React, { memo } from 'react';

import { VariantProps } from 'class-variance-authority';

import { Alert, AlertDescription, AlertTitle, alertVariants } from '../ui/alert';

interface AlertCustomProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  variant?: VariantProps<typeof alertVariants>['variant'];
}

const AlertCustom = ({ title, description, icon, variant }: AlertCustomProps) => {
  return (
    <Alert variant={variant}>
      {icon && icon}
      <AlertTitle>{title}</AlertTitle>
      {description && <AlertDescription>{description}</AlertDescription>}
    </Alert>
  );
};

export default memo(AlertCustom);
