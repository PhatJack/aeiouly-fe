'use client';

import React from 'react';
import { Controller, useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { SessionGoalCreateSchema, sessionGoalCreateSchema } from '@/lib/schema/session-goal.schema';
import { UserResponseSchema } from '@/lib/schema/user.schema';
import { cn } from '@/lib/utils';
import { useCreateSessionGoalMutation } from '@/services/session-goals';
import { zodResolver } from '@hookform/resolvers/zod';

import { Plus, Target } from 'lucide-react';
import { toast } from 'sonner';

interface Props {
  user?: UserResponseSchema | null;
  isDisplayIcon?: boolean;
  className?: string;
}

const AddTodoForm = ({ user, isDisplayIcon = true, className }: Props) => {
  const createGoalMutation = useCreateSessionGoalMutation();
  const createGoalForm = useForm<SessionGoalCreateSchema>({
    defaultValues: {
      goal: '',
      status: 'OPEN',
    },
    resolver: zodResolver(sessionGoalCreateSchema),
  });

  const onSubmit = (data: SessionGoalCreateSchema) => {
    createGoalMutation.mutate(data, {
      onSuccess() {
        toast.success('Goal created successfully!');
        createGoalForm.reset();
      },
      onError(error) {
        console.log(error);
        toast.error('Failed to create goal!');
      },
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
                isDisplayIcon ? 'pl-9' : 'pl-2',
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
                disabled={createGoalMutation.isPending}
                className="h-6 border-none bg-transparent shadow-none focus-visible:ring-0"
                placeholder="Type a goal..."
              />
            </div>
          </Field>
        )}
      />
      <Button size={'icon'} className="h-10 w-10" disabled={!createGoalForm.watch('goal')}>
        <Plus />
      </Button>
    </form>
  );
};

export default React.memo(AddTodoForm);
