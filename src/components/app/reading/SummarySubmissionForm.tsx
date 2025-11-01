'use client';

import React, { memo } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Textarea } from '@/components/ui/textarea';
import {
  SummarySubmissionSchema,
  summarySubmissionSchema,
} from '@/lib/schema/reading-session.schema';
import { useBlockNavigation } from '@/stores/use-block-navigation';
import { zodResolver } from '@hookform/resolvers/zod';

import { FileText } from 'lucide-react';

interface SummarySubmissionFormProps {
  onSubmit: (data: SummarySubmissionSchema) => void;
  isPending: boolean;
}

const SummarySubmissionForm = ({ onSubmit, isPending }: SummarySubmissionFormProps) => {
  const { setUnsaved } = useBlockNavigation();
  const summaryForm = useForm<SummarySubmissionSchema>({
    resolver: zodResolver(summarySubmissionSchema),
    defaultValues: {
      summary: '',
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Viết bài tóm tắt
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={summaryForm.handleSubmit(onSubmit)} className="space-y-4">
          <FieldGroup>
            <Controller
              control={summaryForm.control}
              name="summary"
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>Nội dung tóm tắt</FieldLabel>
                  <Textarea
                    placeholder="Viết bài tóm tắt của bạn ở đây..."
                    className="min-h-[120px] resize-none"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      setUnsaved(true);
                    }}
                  />
                  <FieldError>{fieldState.error?.message}</FieldError>
                </Field>
              )}
            />
          </FieldGroup>
          <Button type="submit" disabled={isPending}>
            {isPending ? 'Đang nộp...' : 'Nộp bài tóm tắt'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default memo(SummarySubmissionForm);
