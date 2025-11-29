import React, { useEffect } from 'react';
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
import { Textarea } from '@/components/ui/textarea';
import { CEFRLevel } from '@/lib/schema/enum.schema';
import {
  SpeakingSessionCreateSchema,
  speakingSessionCreateSchema,
} from '@/lib/schema/speaking-session.schema';
import { useCreateSpeakingSessionMutation } from '@/services/speaking-session';
import { zodResolver } from '@hookform/resolvers/zod';

import { toast } from 'sonner';

interface SpeakingSessionFormProps {
  initialValues?: Partial<SpeakingSessionCreateSchema>;
}

export const SpeakingSessionForm: React.FC<SpeakingSessionFormProps> = ({ initialValues }) => {
  const router = useRouter();
  const form = useForm<SpeakingSessionCreateSchema>({
    resolver: zodResolver(speakingSessionCreateSchema),
    defaultValues: {
      my_character: initialValues?.my_character || '',
      ai_character: initialValues?.ai_character || '',
      ai_gender: initialValues?.ai_gender || 'male',
      scenario: initialValues?.scenario || '',
      level: (initialValues?.level as CEFRLevel) || 'A1',
    },
  });

  useEffect(() => {
    if (initialValues) {
      form.reset({
        my_character: initialValues.my_character || '',
        ai_character: initialValues.ai_character || '',
        ai_gender: initialValues.ai_gender || 'male',
        scenario: initialValues.scenario || '',
        level: (initialValues.level as CEFRLevel) || 'A1',
      });
      setTimeout(() => form.setFocus('my_character'), 50);
    }
  }, [initialValues, form]);

  const mutation = useCreateSpeakingSessionMutation({
    onSuccess: (data) => {
      toast.success('Tạo phiên luyện nói thành công');
      router.push(`/onion/${data.id}`);
      form.reset();
    },
  });

  const onSubmit = (values: SpeakingSessionCreateSchema) => mutation.mutate(values);

  return (
    <Card className="mx-auto w-full shadow-none">
      <CardContent>
        <form id="form-create-speaking-session" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup className="gap-4">
            <Controller
              control={form.control}
              name="my_character"
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel htmlFor="form-create-speaking-session-my-character">
                    Nhân vật của bạn
                  </FieldLabel>
                  <Input
                    {...field}
                    id="form-create-speaking-session-my-character"
                    aria-invalid={fieldState.invalid}
                    placeholder="Ví dụ: Khách hàng"
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name="ai_character"
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel htmlFor="form-create-speaking-session-ai-character">
                    Nhân vật AI
                  </FieldLabel>
                  <Input
                    {...field}
                    id="form-create-speaking-session-ai-character"
                    aria-invalid={fieldState.invalid}
                    placeholder="Ví dụ: Nhân viên pha chế"
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name="ai_gender"
              render={({ field, fieldState }) => (
                <Field orientation="responsive" data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-create-speaking-session-ai-gender">
                    Giới tính AI
                  </FieldLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger
                      id="form-create-speaking-session-ai-gender"
                      aria-invalid={fieldState.invalid}
                    >
                      <SelectValue placeholder="Chọn giới tính" />
                    </SelectTrigger>
                    <SelectContent position="item-aligned">
                      <SelectItem value="male">Nam</SelectItem>
                      <SelectItem value="female">Nữ</SelectItem>
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name="scenario"
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel htmlFor="form-create-speaking-session-scenario">
                    Tình huống
                  </FieldLabel>
                  <Textarea
                    {...field}
                    id="form-create-speaking-session-scenario"
                    aria-invalid={fieldState.invalid}
                    placeholder="Mô tả ngắn về tình huống..."
                    className="min-h-[135px]"
                    rows={4}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name="level"
              render={({ field, fieldState }) => (
                <Field orientation="responsive" data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-create-speaking-session-level">
                    Cấp độ (CEFR)
                  </FieldLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger
                      id="form-create-speaking-session-level"
                      aria-invalid={fieldState.invalid}
                    >
                      <SelectValue placeholder="Chọn cấp độ" />
                    </SelectTrigger>
                    <SelectContent position="item-aligned">
                      <SelectItem value="A1">A1</SelectItem>
                      <SelectSeparator />
                      {['A2', 'B1', 'B2', 'C1', 'C2'].map((l) => (
                        <SelectItem key={l} value={l}>
                          {l}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter>
        <Field orientation="horizontal">
          <Button type="button" variant="outline" onClick={() => form.reset()} tabIndex={-1}>
            Reset
          </Button>
          <Button type="submit" form="form-create-speaking-session" disabled={mutation.isPending}>
            {mutation.isPending ? 'Đang tạo...' : 'Tạo phiên'}
          </Button>
        </Field>
      </CardFooter>
    </Card>
  );
};
