import { useMemo } from 'react';
import { useWatch } from 'react-hook-form';
import { Control } from 'react-hook-form';

import { cn } from '@/lib/utils';

import { CheckCircle, XIcon } from 'lucide-react';

type PasswordStrengthMeterProps = {
  passwordFieldName: string;
  control: Control<any>;
  className?: string;
};

export const PasswordStrengthMeter = ({
  passwordFieldName,
  control,
  className,
}: PasswordStrengthMeterProps) => {
  const password = useWatch({ control, name: passwordFieldName });

  const checkStrength = (pass: string) => {
    const requirements = [
      { regex: /.{8,}/, text: 'Ít nhất 8 ký tự' },
      { regex: /[0-9]/, text: 'Ít nhất 1 số' },
      { regex: /[a-z]/, text: 'Ít nhất 1 chữ cái thường' },
      { regex: /[A-Z]/, text: 'Ít nhất 1 chữ cái hoa' },
    ];

    return requirements.map((req) => ({
      met: req.regex.test(pass || ''),
      text: req.text,
    }));
  };

  const strength = useMemo(() => checkStrength(password || ''), [password]);

  const strengthScore = useMemo(() => {
    return strength.filter((req) => req.met).length;
  }, [strength]);

  const getStrengthColor = (score: number) => {
    if (score === 0) return 'bg-border';
    if (score <= 1) return 'bg-red-500';
    if (score <= 2) return 'bg-orange-500';
    if (score === 3) return 'bg-amber-500';
    return 'bg-emerald-500';
  };

  return (
    <div className={cn('space-y-2 pt-2', className)}>
      <div className="rounded-full bg-gray-100 dark:bg-gray-600">
        <div
          style={{ width: `${strengthScore * 25}%` }}
          className={`h-1.5 rounded-full transition-[width] duration-300 ${getStrengthColor(strengthScore)}`}
        />
      </div>
      <div className="space-y-1 text-xs">
        {strength.map((req, i) => (
          <div key={i} className="flex items-center gap-1.5">
            {req.met ? (
              <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
            ) : (
              <XIcon className="text-destructive h-3.5 w-3.5" />
            )}
            <span className={cn(req.met ? 'text-emerald-600' : 'text-muted-foreground')}>
              {req.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
