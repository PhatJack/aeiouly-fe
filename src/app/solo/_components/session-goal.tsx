'use client';

import React, { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

import { PlayfulTodolist } from '@/components/animate-ui/playful-todolist';
import AddTodoForm from '@/components/app/solo/AddTodoForm';
import TooltipCustom from '@/components/custom/TooltipCustom';
import { useAuthStore } from '@/contexts/AuthContext';
import { useSoloStore } from '@/hooks/use-solo-store';
import { SessionGoalsStatusSchema } from '@/lib/schema/session-goal.schema';
import { updateSessionGoalApi, useGetAllSessionGoalsInfiniteQuery } from '@/services/session-goals';
import { useQueryClient } from '@tanstack/react-query';

import { OctagonAlert, Target, X } from 'lucide-react';
import { toast } from 'sonner';

const SessionGoal = () => {
  const queryClient = useQueryClient();
  const { ref, inView } = useInView();
  const { completedGoals, saveCompletedGoal, saveOpenGoals } = useSoloStore();
  const user = useAuthStore((state) => state.user);

  const { data, fetchNextPage, isFetchingNextPage } = useGetAllSessionGoalsInfiniteQuery({
    user: user?.id,
    status: 'OPEN',
  });

  useEffect(() => {
    if (inView) {
      fetchNextPage();
      saveOpenGoals(data?.items.length ?? 0);
    }
  }, [fetchNextPage, inView, data?.items.length, saveOpenGoals]);

  useEffect(() => {
    saveOpenGoals(data?.items.length ?? 0);
  }, [data?.items.length, saveOpenGoals]);

  const handleStatusChange = async (id: number, status: SessionGoalsStatusSchema) => {
    // Find the goal from data
    const goal = data?.items.find((g) => g.id === id);

    if (!goal) return;

    if (status === 'COMPLETED') {
      // Save to completed goals in store
      saveCompletedGoal({ goal: goal.goal, status });
    }

    // Update via API
    await updateSessionGoalApi(id, { status })
      .then((data) => {
        // queryClient.setQueryData(['session-goals-infinite'], (oldData: any) => {
        //   if (!oldData) return oldData;
        //   return {
        //     ...oldData,
        //     pages: oldData.pages.map((page: any) => ({
        //       ...page,
        //       items: page.items.filter((item: any) => item.id !== id),
        //     })),
        //   };
        // });
      })
      .catch(() => {
        toast.error('Tạo mục tiêu không thành công. Vui lòng thử lại.');
      });
  };

  return (
    <div className="bg-background text-foreground flex h-fit w-full flex-col space-y-4 rounded-md p-4 shadow-lg">
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center gap-1 text-xs">
          <Target size={14} />
          <strong>Session Goal</strong>
        </span>
        <div className="flex items-center gap-2">
          <TooltipCustom
            content={
              'Supercharge your focus by setting clear, bite-sized goals for each work session. Instead of “finish project,” try “draft 500 words” or “review 3 pages.” Pair it with a timer (like 25 minutes) to keep momentum. Small wins stack up—define your target, crush it, and watch progress soar!'
            }
          >
            <span className="cursor-pointer">
              <OctagonAlert size={16} />
            </span>
          </TooltipCustom>
          <span
            onClick={() => useSoloStore.getState().toggleButton('isOpenSessionGoal')}
            className="cursor-pointer"
          >
            <X size={16} />
          </span>
        </div>
      </div>
      <div className="flex flex-col space-y-2">
        <AddTodoForm user={user} isDisplayIcon={false} className="border p-2" />
        <div className="flex flex-col overflow-hidden">
          <div className="flex max-h-[300px] flex-col gap-1 overflow-y-auto">
            <PlayfulTodolist
              list={[
                ...(data?.items.map((goal) => ({
                  id: goal.id,
                  label: goal.goal,
                  status: goal.status,
                })) || []),
                ...completedGoals.map((goal, index) => ({
                  id: -(index + 1), // Use negative ID for completed goals
                  label: goal.goal,
                  status: 'COMPLETED' as const,
                })),
              ]}
              className="bg-transparent p-0"
              onStatusChange={handleStatusChange}
            />
            {isFetchingNextPage && (
              <div ref={ref} className="w-full text-center text-xs">
                Loading...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(SessionGoal);
