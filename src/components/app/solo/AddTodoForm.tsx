'use client';

import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { useAuthStore } from '@/contexts/AuthContext';
import { SessionGoalCreateSchema } from '@/lib/schema/session-goal.schema';
import { UserResponseSchema } from '@/lib/schema/user.schema';
import { cn } from '@/lib/utils';
import { createSessionGoalApi } from '@/services/session-goals';
import { useQueryClient } from '@tanstack/react-query';

import { Loader, Plus, Target } from 'lucide-react';
import { toast } from 'sonner';

interface Props {
  user?: UserResponseSchema | null;
  isDisplayIcon?: boolean;
  className?: string;
}

const AddTodoForm = ({ isDisplayIcon = true, className }: Props) => {
  const user = useAuthStore((state) => state.user);
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  const createGoalForm = useForm<SessionGoalCreateSchema>({
    defaultValues: {
      goal: '',
      status: 'OPEN',
    },
  });

  const onSubmit = async (data: SessionGoalCreateSchema) => {
    setIsLoading(true);
    await createSessionGoalApi(data)
      .then((data) => {
        queryClient.setQueryData(
          ['session-goals-infinite', { user: user?.id, status: 'OPEN' }],
          (oldData: any) => {
            console.log(oldData);
            if (!oldData) return oldData;
            return {
              ...oldData,
              pages: oldData.pages.map((page: any, index: number) =>
                index === 0 ? { ...page, items: [data, ...page.items] } : page
              ),
            };
          }
        );
        toast.success('Tạo mục tiêu thành công!');
        createGoalForm.reset();
        setIsLoading(false);
      })
      .catch(() => {
        toast.error('Failed to create goal. Please try again.');
        setIsLoading(false);
      });
  };

  return (
    <form
      onSubmit={createGoalForm.handleSubmit(onSubmit)}
      className="flex w-full items-center gap-2"
    >
      <Controller
        control={createGoalForm.control}
        name="goal"
        render={({ field }) => (
          <Field>
            <div
              className={cn(
                `bg-background border-primary relative h-auto flex-1 rounded-xl border-2 py-2 pr-2`,
                isDisplayIcon ? 'pl-9' : '',
                className
              )}
            >
              {isDisplayIcon && (
                <span className="absolute top-1/5 left-3">
                  <Target className="text-rose-600" />
                </span>
              )}
              <Input
                {...field}
                disabled={isLoading}
                className="h-6 border-none bg-transparent px-2 shadow-none focus-visible:ring-0 dark:bg-transparent"
                placeholder="Type a goal..."
              />
            </div>
          </Field>
        )}
      />
      <Button size={'icon'} className="h-10 w-10" disabled={!createGoalForm.watch('goal')}>
        {isLoading ? <Loader className="animate-spin" /> : <Plus />}
      </Button>
    </form>
  );
};

export default React.memo(AddTodoForm);
