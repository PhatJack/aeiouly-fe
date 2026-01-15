'use client';

import React, { memo, useCallback, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { useTranslations } from 'next-intl';
import { useRouter } from 'nextjs-toploader/app';

import {
  Tabs,
  TabsContent,
  TabsContents,
  TabsList,
  TabsTrigger,
} from '@/components/animate-ui/components/animate/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { CEFRLevelSchema, ReadingGenreSchema } from '@/lib/schema/enum.schema';
import {
  ReadingSessionCreateSchema,
  readingSessionCreateSchema,
} from '@/lib/schema/reading-session.schema';
import { useCreateReadingSessionMutation } from '@/services/reading-session';
import { zodResolver } from '@hookform/resolvers/zod';

import { Plus } from 'lucide-react';
import { toast } from 'sonner';

interface CreateSessionFormProps {
  onSuccess?: () => void;
}

const CreateSessionForm = memo(({ onSuccess }: CreateSessionFormProps) => {
  const router = useRouter();
  const t = useTranslations('reading.create');
  const [activeTab, setActiveTab] = useState<'ai' | 'custom'>('ai');

  const createSessionMutation = useCreateReadingSessionMutation();

  const form = useForm<ReadingSessionCreateSchema>({
    resolver: zodResolver(readingSessionCreateSchema),
    defaultValues: {
      level: undefined,
      genre: undefined,
      word_count: 300,
      topic: '',
      custom_text: '',
    },
  });

  const onSubmit = useCallback(
    (data: ReadingSessionCreateSchema) => {
      const { custom_text, ...rest } = data;

      createSessionMutation.mutate(activeTab === 'ai' ? rest : { custom_text }, {
        onSuccess: (session) => {
          toast.success(t('success'));
          form.reset();
          onSuccess?.();
          router.push(`/reading/${session.id}`);
        },
        onError: () => {
          toast.error(t('error'));
        },
      });
    },
    [activeTab, createSessionMutation, form, onSuccess, router]
  );

  const onError = (error: any) => {
    console.log(error);
  };

  const handleTabChange = useCallback((value: string) => {
    setActiveTab(value as 'ai' | 'custom');
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          {t('title')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="ai">{t('tabs.ai')}</TabsTrigger>
            <TabsTrigger value="custom">{t('tabs.custom')}</TabsTrigger>
          </TabsList>

          <form onSubmit={form.handleSubmit(onSubmit, onError)} className="mt-2 space-y-2">
            <TabsContents>
              <TabsContent value="ai" className="mt-0">
                <FieldGroup className="gap-4 p-2">
                  <Controller
                    control={form.control}
                    name="level"
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel>{t('form.level')}</FieldLabel>
                        <Select
                          name={field.name}
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger aria-invalid={fieldState.invalid}>
                            <SelectValue placeholder={t('form.levelPlaceholder')} />
                          </SelectTrigger>
                          <SelectContent>
                            {CEFRLevelSchema.options.map((level) => (
                              <SelectItem key={level} value={level}>
                                {level}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />

                  <Controller
                    control={form.control}
                    name="genre"
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel>{t('form.genre')}</FieldLabel>
                        <Select
                          name={field.name}
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger aria-invalid={fieldState.invalid}>
                            <SelectValue placeholder={t('form.genrePlaceholder')} />
                          </SelectTrigger>
                          <SelectContent>
                            {ReadingGenreSchema.options.map((genre) => (
                              <SelectItem key={genre} value={genre}>
                                {genre}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />

                  <Controller
                    control={form.control}
                    name="topic"
                    render={({ field, fieldState }) => (
                      <Field>
                        <FieldLabel>{t('form.topic')}</FieldLabel>
                        <Input
                          {...field}
                          aria-invalid={fieldState.invalid}
                          placeholder={t('form.topicPlaceholder')}
                          autoComplete="off"
                        />
                        <p className="text-muted-foreground text-xs">{t('form.topicHelp')}</p>
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />

                  <Controller
                    control={form.control}
                    name="word_count"
                    render={({ field, fieldState }) => (
                      <Field>
                        <FieldLabel>{t('form.wordCount')}</FieldLabel>
                        <Input
                          {...field}
                          type="number"
                          min={100}
                          max={1000}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (value === '') {
                              field.onChange(undefined);
                              return;
                            }
                            field.onChange(parseInt(value));
                          }}
                          aria-invalid={fieldState.invalid}
                          autoComplete="off"
                        />
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />
                </FieldGroup>
              </TabsContent>

              <TabsContent value="custom" className="mt-0">
                <FieldGroup className="gap-4 p-2">
                  <Controller
                    control={form.control}
                    name="custom_text"
                    render={({ field, fieldState }) => (
                      <Field>
                        <FieldLabel>{t('form.customText')}</FieldLabel>
                        <Textarea
                          {...field}
                          placeholder={t('form.customTextPlaceholder')}
                          className="min-h-[300px] resize-none"
                          aria-invalid={fieldState.invalid}
                        />
                        <p className="text-muted-foreground text-xs">
                          {t('form.characterCount', { count: field.value?.length || 0 })}
                        </p>
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />
                </FieldGroup>
              </TabsContent>
            </TabsContents>

            <Button type="submit" className="w-full" disabled={createSessionMutation.isPending}>
              {createSessionMutation.isPending ? t('loading') : t('submit')}
            </Button>
          </form>
        </Tabs>
      </CardContent>
    </Card>
  );
});

CreateSessionForm.displayName = 'CreateSessionForm';

export default CreateSessionForm;
