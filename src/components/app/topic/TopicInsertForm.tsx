'use client';

import React, { memo, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { useRouter } from 'nextjs-toploader/app';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  WritingSessionCreateSchema,
  writingSessionCreateSchema,
} from '@/lib/schema/writing-session.schema';
import { useCreateWritingSessionMutation } from '@/services/writing-session';
import { zodResolver } from '@hookform/resolvers/zod';

import { toast } from 'sonner';

interface TopicInsertFormProps {
  values?: WritingSessionCreateSchema;
}

const TopicInsertForm = ({ values }: TopicInsertFormProps) => {
  const router = useRouter();
  const createWritingSessionMutation = useCreateWritingSessionMutation();
  const formRef = React.useRef<HTMLDivElement>(null);

  const form = useForm<WritingSessionCreateSchema>({
    defaultValues: {
      topic: values?.topic || '',
      difficulty: values?.difficulty || 'A1',
      total_sentences: values?.total_sentences || 5,
    },
    resolver: zodResolver(writingSessionCreateSchema),
  });

  // Update form values when the values prop changes
  useEffect(() => {
    if (values) {
      form.reset({
        topic: values.topic,
        difficulty: values.difficulty,
        total_sentences: values.total_sentences,
      });

      // Scroll to form and focus on topic input
      setTimeout(() => {
        formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        form.setFocus('topic');
      }, 100);
    }
  }, [values, form]);

  const onSubmit = (data: WritingSessionCreateSchema) => {
    createWritingSessionMutation.mutate(data, {
      onSuccess: (data) => {
        toast.success('Tạo phiên viết thành công!');
        router.push(`/topic/${data.id}`);
      },
      onError: (error) => {
        toast.error('Đã có lỗi xảy ra khi tạo phiên viết. Vui lòng thử lại.');
      },
    });
  };
  return (
    <Card ref={formRef} className="mx-auto w-full shadow-none sm:max-w-md">
      <CardContent>
        <form id="form-create-writing-session" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup className="gap-4">
            <Controller
              control={form.control}
              name="topic"
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>Chủ đề viết</FieldLabel>
                  <Input
                    {...field}
                    id="form-create-writing-session-title"
                    aria-invalid={fieldState.invalid}
                    placeholder="Nhập chủ đề viết"
                    autoComplete="off"
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name="difficulty"
              render={({ field, fieldState }) => (
                <Field orientation="responsive" data-invalid={fieldState.invalid}>
                  <FieldLabel>Độ khó</FieldLabel>
                  <Select name={field.name} value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger
                      id="form-create-writing-session-select-difficulty"
                      aria-invalid={fieldState.invalid}
                    >
                      <SelectValue placeholder="Chọn độ khó" />
                    </SelectTrigger>
                    <SelectContent position="item-aligned">
                      <SelectItem value={'A1'}>A1</SelectItem>
                      <SelectSeparator />
                      {['A2', 'B1', 'B2', 'C1', 'C2'].map((level, index) => (
                        <SelectItem key={`${level}-${index}`} value={level}>
                          {level}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name="total_sentences"
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>Tổng số câu</FieldLabel>
                  <Input
                    {...field}
                    type="number"
                    value={field.value}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    id="form-create-writing-session-input-total_sentences"
                    aria-invalid={fieldState.invalid}
                    placeholder="Nhập số lượng câu"
                    autoComplete="off"
                    min={1}
                    max={20}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter>
        <Field orientation="horizontal">
          <Button tabIndex={-1} type="button" variant="outline" onClick={() => form.reset()}>
            Reset
          </Button>
          <Button type="submit" form="form-create-writing-session">
            Bắt đầu ngay
          </Button>
        </Field>
      </CardFooter>
    </Card>
  );
};

export default memo(TopicInsertForm);
