'use client';

import { useForm } from 'react-hook-form';

import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { UserUpdateSchema } from '@/lib/schema/user.schema';
import { zodResolver } from '@hookform/resolvers/zod';

import { z } from 'zod';

interface EditFieldDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  fieldLabel: string;
  fieldName: keyof UserUpdateSchema;
  fieldType?: 'text' | 'email';
  currentValue: string;
  placeholder?: string;
  onSubmit: (value: UserUpdateSchema, fieldName: keyof UserUpdateSchema) => void;
  validationSchema?: z.ZodObject<any>;
}

const EditFieldDialog = ({
  open,
  onOpenChange,
  title,
  description,
  fieldLabel,
  fieldName,
  fieldType = 'text',
  currentValue,
  placeholder,
  onSubmit,
  validationSchema,
}: EditFieldDialogProps) => {
  const t = useTranslations('profile');
  const form = useForm<UserUpdateSchema>({
    defaultValues: {
      [fieldName]: currentValue,
    },
    resolver: validationSchema ? zodResolver(validationSchema) : undefined,
  });

  const handleSubmit = (data: UserUpdateSchema) => {
    onSubmit(data, fieldName);
    onOpenChange(false);
  };

  const handleCancel = () => {
    form.reset({ [fieldName]: currentValue });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        <form id={`form-edit-${fieldName}`} onSubmit={form.handleSubmit(handleSubmit)}>
          <Field>
            <FieldLabel>{fieldLabel}</FieldLabel>
            <Input
              {...form.register(fieldName)}
              type={fieldType}
              placeholder={placeholder}
              aria-invalid={!!form.formState.errors[fieldName]}
            />
            {form.formState.errors[fieldName] && (
              <FieldError errors={[form.formState.errors[fieldName]]} />
            )}
          </Field>
        </form>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={handleCancel}>
            {t('cancel')}
          </Button>
          <Button type="submit" form={`form-edit-${fieldName}`}>
            {t('save')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditFieldDialog;
