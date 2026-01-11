'use client';

import React, { memo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import Image from 'next/image';

import AlertCustom from '@/components/custom/AlertCustom';
import Stepper, { Step } from '@/components/reactbits/stepper';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Field, FieldGroup } from '@/components/ui/field';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { AGES } from '@/constants/study-route/ages';
import { INTERESTS } from '@/constants/study-route/interests';
import { LEVELS } from '@/constants/study-route/level';
import { PROFESSIONS } from '@/constants/study-route/profession';
import { STUDY_ROUNTINE } from '@/constants/study-route/routine';
import { SKILLS } from '@/constants/study-route/skills';
import { STUDY_TIME_OPTIONS } from '@/constants/study-route/study-time';
import { GOALS } from '@/constants/study-route/targets';
import {
  LearningPathFormSchema,
  LearningPathStatusResponseSchema,
  learningPathFormSchema,
} from '@/lib/schema/learning-path.schema';
import { StudyInterest } from '@/lib/schema/study-route.schema';
import { zodResolver } from '@hookform/resolvers/zod';

import { AlertCircleIcon, Check, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

interface StudyRouteFormProps {
  onSubmit?: (data: LearningPathFormSchema) => void;
  status: LearningPathStatusResponseSchema | undefined;
  isLoading: boolean;
  onViewRoute?: () => void;
}

const StudyRouteForm = ({ onSubmit, status, isLoading, onViewRoute }: StudyRouteFormProps) => {
  const form = useForm<LearningPathFormSchema>({
    defaultValues: {
      goals: [],
      level: '',
      skills: [],
      interests: [],
      ageRange: '',
      profession: '',
      dailyLessonCount: 0,
      planDuration: '',
    },
    resolver: zodResolver(learningPathFormSchema),
  });

  const onSubmitForm = (data: LearningPathFormSchema) => {
    onSubmit?.(data);
  };

  const onErrorForm = (errors: any) => {
    console.log('Form errors:', errors);
  };

  return (
    <form
      id="form-create-study-route"
      className="xl:h-[calc(100vh-5.75rem-1px)] xl:max-h-full"
      onSubmit={form.handleSubmit(onSubmitForm, onErrorForm)}
    >
      <Stepper
        initialStep={1}
        onStepChange={(step) => {
          if (step === 2) {
            // Moving from welcome to goal - no validation needed
            return;
          } else if (step === 3) {
            // Validate goals
            const goals = form.getValues('goals');
            if (!goals || goals.length === 0) {
              toast.error('Vui lòng chọn ít nhất một mục tiêu học tiếng Anh');
              return false;
            }
          } else if (step === 4) {
            // Validate level
            if (form.getValues('level') === '') {
              toast.error('Vui lòng chọn trình độ tiếng Anh hiện tại của bạn');
              return false;
            }
          } else if (step === 5) {
            // Validate skills
            const skills = form.getValues('skills');
            if (!skills || skills.length === 0) {
              toast.error('Vui lòng chọn ít nhất một kĩ năng');
              return false;
            }
          } else if (step === 6) {
            // Validate interests
            const interests = form.getValues('interests');
            if (!interests || interests.length === 0) {
              toast.error('Vui lòng chọn ít nhất một chủ đề');
              return false;
            }
          } else if (step === 7) {
            // Validate age
            if (form.getValues('ageRange') === '') {
              toast.error('Vui lòng chọn độ tuổi');
              return false;
            }
          } else if (step === 8) {
            // Validate profession
            if (form.getValues('profession') === '') {
              toast.error('Vui lòng chọn nghề nghiệp');
              return false;
            }
          } else if (step === 9) {
            // Validate daily_lessons
            if (form.getValues('dailyLessonCount') === 0) {
              toast.error('Vui lòng chọn số bài học mỗi ngày');
              return false;
            }
          } else if (step === 10) {
            // Validate routine
            if (form.getValues('planDuration') === '') {
              toast.error('Vui lòng chọn thời gian học');
              return false;
            }
          }
        }}
        stepIndicatorStyle="progress"
        onFinalStepCompleted={() => {
          form.handleSubmit(onSubmitForm, onErrorForm)();
        }}
        backButtonText="Quay lại"
        nextButtonText="Tiếp tục"
        lastStepButtonText="Tạo lộ trình"
        footerClassName={status?.is_ready ? 'hidden' : ''}
        CompletedScreen={
          <div className="flex flex-1 flex-col items-center justify-center space-y-6">
            {status?.is_ready ? (
              <>
                <div className="relative flex items-center justify-center">
                  <CheckCircle2 className="text-primary h-48 w-48" strokeWidth={1.5} />
                </div>
                <div className="text-center">
                  <h2 className="mb-2 text-2xl font-bold sm:text-3xl">Hoàn thành!</h2>
                  <p className="text-muted-foreground mb-6 text-base whitespace-pre-line">
                    {status?.message || 'Lộ trình học tập của bạn đã được tạo thành công!'}
                  </p>
                  <Button size="lg" onClick={onViewRoute}>
                    Xem lộ trình ngay
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div className="relative flex items-center justify-center">
                  {/* Background Circle */}
                  <svg className="h-48 w-48 -rotate-90 transform">
                    <circle
                      cx="96"
                      cy="96"
                      r="88"
                      stroke="currentColor"
                      strokeWidth="12"
                      fill="none"
                      className="text-gray-200"
                    />
                    {/* Progress Circle */}
                    <circle
                      cx="96"
                      cy="96"
                      r="88"
                      stroke="currentColor"
                      strokeWidth="12"
                      fill="none"
                      strokeLinecap="round"
                      className="text-primary transition-all duration-500 ease-in-out"
                      strokeDasharray={`${2 * Math.PI * 88}`}
                      strokeDashoffset={`${2 * Math.PI * 88 * (1 - (status?.percent || 0) / 100)}`}
                    />
                  </svg>
                  {/* Progress Text */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-5xl font-bold">{status?.percent || 0}%</span>
                  </div>
                </div>

                <div className="text-center">
                  <h2 className="mb-2 text-2xl font-bold sm:text-3xl">
                    Đang tạo lộ trình học cho bạn...
                  </h2>
                  <p className="text-muted-foreground text-base whitespace-pre-line">
                    {status?.message ||
                      'Vui lòng chờ trong giây lát để hệ thống tạo lộ trình học tập phù hợp với bạn.'}
                  </p>
                </div>
              </>
            )}
          </div>
        }
      >
        {/* Welcome Step */}
        <Step>
          <div className="w-full flex-1 space-y-4 text-center">
            <Image
              src={'/logo.png'}
              alt="Aeiouly Logo"
              width={100}
              height={100}
              className="mx-auto rounded-full"
            />
            <h1 className="text-2xl font-bold sm:text-3xl">Chào mừng bạn đến với Aeiouly</h1>
            <p className="text-muted-foreground text-base sm:text-lg">
              Học tiếng Anh theo lộ trình cá nhân hóa dựa trên sở thích và mục tiêu của bạn. Hãy bắt
              đầu hành trình học tập của bạn ngay hôm nay!
            </p>
          </div>
        </Step>

        {/* Goal Step */}
        <Step>
          <FieldGroup>
            <h2 className="text-2xl font-bold sm:text-3xl">Mục tiêu học tiếng Anh</h2>
            <Controller
              control={form.control}
              name="goals"
              render={({ field }) => (
                <Field>
                  <div className="grid gap-3">
                    {GOALS.map((goal, index) => {
                      const isChecked = field.value?.includes(goal.id as any);
                      return (
                        <Label
                          key={`goal-${index}`}
                          className="group hover:bg-accent/50 has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-accent/50 relative flex cursor-pointer items-center gap-4 rounded-lg border-2 border-b-4 px-4 py-3 text-base transition-colors"
                        >
                          <Checkbox
                            checked={isChecked}
                            onCheckedChange={(checked) => {
                              const newValue = checked
                                ? [...(field.value || []), goal.id]
                                : field.value?.filter((v) => v !== goal.id);
                              field.onChange(newValue);
                            }}
                          />
                          <span className="flex-1">{goal.label}</span>
                          <Check className="text-primary absolute top-1/2 right-4 size-7 -translate-y-1/2 scale-0 opacity-0 transition-all duration-300 group-has-[[data-state=checked]]:scale-100 group-has-[[data-state=checked]]:opacity-100 group-has-[[data-state=unchecked]]:scale-0 group-has-[[data-state=unchecked]]:opacity-0" />
                        </Label>
                      );
                    })}
                  </div>
                </Field>
              )}
            />
          </FieldGroup>
        </Step>

        {/* Level Step */}
        <Step>
          <FieldGroup>
            <h2 className="text-2xl font-bold sm:text-3xl">
              Trình độ tiếng Anh hiện tại của bạn như thế nào?
            </h2>
            <Controller
              control={form.control}
              name="level"
              render={({ field }) => (
                <Field>
                  <RadioGroup value={field.value} onValueChange={field.onChange}>
                    {LEVELS.map((level, index) => (
                      <Label
                        key={`level-${index}`}
                        className="group hover:bg-accent/50 has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-accent/50 relative flex cursor-pointer items-start gap-4 rounded-lg border-2 border-b-4 py-3 pr-12 pl-4 text-base transition-colors"
                      >
                        <RadioGroupItem value={level.id} />
                        <div className="flex flex-col space-y-1.5">
                          <span className="flex-1 leading-3.5">{level.label}</span>
                          <p className="text-muted-foreground text-sm font-normal">
                            {level.description}
                          </p>
                        </div>
                        <Check className="text-primary absolute top-1/2 right-4 size-7 -translate-y-1/2 scale-0 opacity-0 transition-all duration-300 group-has-[[data-state=checked]]:scale-100 group-has-[[data-state=checked]]:opacity-100 group-has-[[data-state=unchecked]]:scale-0 group-has-[[data-state=unchecked]]:opacity-0" />
                      </Label>
                    ))}
                  </RadioGroup>
                </Field>
              )}
            />
          </FieldGroup>
        </Step>

        {/* Skills Step */}
        <Step>
          <FieldGroup>
            <h2 className="text-2xl font-bold sm:text-3xl">
              Kĩ năng tiếng Anh bạn muốn cải thiện nhất?
            </h2>
            <AlertCustom
              title="Hệ thống sẽ tạo số lượng bài các kĩ năng bạn chọn nhiều hơn!"
              variant={'warning'}
              icon={<AlertCircleIcon />}
            />
            <Controller
              control={form.control}
              name="skills"
              render={({ field }) => (
                <Field>
                  <div className="grid gap-3">
                    {SKILLS.map((skill, index) => {
                      const isChecked = field.value?.includes(skill.id as any);
                      return (
                        <Label
                          key={`skill-${index}`}
                          className="group hover:bg-accent/50 has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-accent/50 relative flex cursor-pointer items-center gap-4 rounded-lg border-2 border-b-4 py-3 pr-12 pl-4 text-base transition-colors"
                        >
                          <Checkbox
                            checked={isChecked}
                            onCheckedChange={(checked) => {
                              const newValue = checked
                                ? [...(field.value || []), skill.id]
                                : field.value?.filter((v) => v !== skill.id);
                              field.onChange(newValue);
                            }}
                          />
                          <span className="flex-1">{skill.label}</span>
                          <Check className="text-primary absolute top-1/2 right-4 size-7 -translate-y-1/2 scale-0 opacity-0 transition-all duration-300 group-has-[[data-state=checked]]:scale-100 group-has-[[data-state=checked]]:opacity-100 group-has-[[data-state=unchecked]]:scale-0 group-has-[[data-state=unchecked]]:opacity-0" />
                        </Label>
                      );
                    })}
                  </div>
                </Field>
              )}
            />
          </FieldGroup>
        </Step>

        {/* Interests Step */}
        <Step>
          <FieldGroup>
            <h2 className="text-2xl font-bold sm:text-3xl">Tuyệt! Bạn thích học các chủ đề nào?</h2>
            <Controller
              control={form.control}
              name="interests"
              render={({ field }) => (
                <Field>
                  <div className="flex flex-wrap gap-1.5">
                    {INTERESTS.map((interest, index) => {
                      const isChecked = field.value?.includes(interest.topic as StudyInterest);
                      return (
                        <Label
                          key={`interest-${index}`}
                          className="group hover:bg-accent/50 has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary relative flex w-fit cursor-pointer items-center gap-4 rounded-full border-2 px-4 py-2 text-base transition-colors"
                        >
                          <Checkbox
                            checked={isChecked}
                            onCheckedChange={(checked) => {
                              const newValue = checked
                                ? [...(field.value || []), interest.topic]
                                : field.value?.filter((v) => v !== interest.topic);
                              field.onChange(newValue);
                            }}
                            className="sr-only"
                          />
                          <span className="flex-1 group-has-[[data-state=checked]]:text-white">
                            {interest.label}
                          </span>
                        </Label>
                      );
                    })}
                  </div>
                </Field>
              )}
            />
          </FieldGroup>
        </Step>

        {/* Age Step */}
        <Step>
          <FieldGroup>
            <h2 className="text-2xl font-bold sm:text-3xl">Bạn bao nhiêu tuổi?</h2>
            <Controller
              control={form.control}
              name="ageRange"
              render={({ field }) => (
                <Field>
                  <RadioGroup value={field.value} onValueChange={field.onChange} className="grid">
                    {AGES.map((age, index) => (
                      <Label
                        key={`age-${index}`}
                        className="group hover:bg-accent/50 has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-accent/50 relative flex cursor-pointer items-center gap-4 rounded-lg border-2 border-b-4 py-3 pr-12 pl-4 text-base transition-colors"
                      >
                        <RadioGroupItem value={age.id} />
                        <span className="flex-1">{age.label}</span>
                        <Check className="text-primary absolute top-1/2 right-4 size-7 -translate-y-1/2 scale-0 opacity-0 transition-all duration-300 group-has-[[data-state=checked]]:scale-100 group-has-[[data-state=checked]]:opacity-100 group-has-[[data-state=unchecked]]:scale-0 group-has-[[data-state=unchecked]]:opacity-0" />
                      </Label>
                    ))}
                  </RadioGroup>
                </Field>
              )}
            />
          </FieldGroup>
        </Step>

        {/* Profession Step */}
        <Step>
          <FieldGroup>
            <h2 className="text-2xl font-bold sm:text-3xl">Nghề nghiệp của bạn là gì?</h2>
            <Controller
              control={form.control}
              name="profession"
              render={({ field }) => (
                <Field>
                  <RadioGroup value={field.value} onValueChange={field.onChange} className="grid">
                    {PROFESSIONS.map((profession, index) => (
                      <Label
                        key={`profession-${index}`}
                        className="group hover:bg-accent/50 has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-accent/50 relative flex cursor-pointer items-center gap-4 rounded-lg border-2 border-b-4 py-3 pr-12 pl-4 text-base transition-colors"
                      >
                        <RadioGroupItem value={profession.id} />
                        <span className="flex-1">{profession.label}</span>
                        <Check className="text-primary absolute top-1/2 right-4 size-7 -translate-y-1/2 scale-0 opacity-0 transition-all duration-300 group-has-[[data-state=checked]]:scale-100 group-has-[[data-state=checked]]:opacity-100 group-has-[[data-state=unchecked]]:scale-0 group-has-[[data-state=unchecked]]:opacity-0" />
                      </Label>
                    ))}
                  </RadioGroup>
                </Field>
              )}
            />
          </FieldGroup>
        </Step>

        {/* Daily Lessons Step */}
        <Step>
          <FieldGroup>
            <h2 className="text-2xl font-bold sm:text-3xl">Mỗi ngày bạn muốn học bao nhiêu bài?</h2>
            <AlertCustom
              variant="info"
              title="Hệ thống sẽ tạo số lượng bài học ngẫu nhiên 4 kĩ năng mỗi ngày"
            />
            <Controller
              control={form.control}
              name="dailyLessonCount"
              render={({ field }) => (
                <Field>
                  <RadioGroup
                    value={field.value?.toString()}
                    onValueChange={(value) => field.onChange(Number(value))}
                    className="grid gap-3"
                  >
                    {STUDY_TIME_OPTIONS.map((studyTime, index) => (
                      <Label
                        key={`study-time-${index}`}
                        className="group hover:bg-accent/50 has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-accent/50 relative flex cursor-pointer items-center gap-4 rounded-lg border-2 border-b-4 py-3 pr-12 pl-4 text-base transition-colors"
                      >
                        <RadioGroupItem value={studyTime.value.toString()} />
                        <span className="flex-1">{studyTime.label}</span>
                        <Check className="text-primary absolute top-1/2 right-4 size-7 -translate-y-1/2 scale-0 opacity-0 transition-all duration-300 group-has-[[data-state=checked]]:scale-100 group-has-[[data-state=checked]]:opacity-100 group-has-[[data-state=unchecked]]:scale-0 group-has-[[data-state=unchecked]]:opacity-0" />
                      </Label>
                    ))}
                  </RadioGroup>
                </Field>
              )}
            />
          </FieldGroup>
        </Step>

        {/* Routine Step */}
        <Step>
          <FieldGroup className="flex-1">
            <h2 className="text-2xl font-bold sm:text-3xl">
              Bạn muốn tạo lộ trình trong thời gian bao lâu?
            </h2>
            <Controller
              control={form.control}
              name="planDuration"
              render={({ field }) => (
                <Field>
                  <RadioGroup
                    value={field.value}
                    onValueChange={field.onChange}
                    className="grid gap-3"
                  >
                    {STUDY_ROUNTINE.map((routine, index) => (
                      <Label
                        key={`routine-${index}`}
                        className="group hover:bg-accent/50 has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-accent/50 relative flex cursor-pointer items-center gap-4 rounded-lg border-2 border-b-4 py-3 pr-12 pl-4 text-base transition-colors"
                      >
                        <RadioGroupItem value={routine.value} />
                        <span className="flex-1">{routine.label}</span>
                        <Check className="text-primary absolute top-1/2 right-4 size-7 -translate-y-1/2 scale-0 opacity-0 transition-all duration-300 group-has-[[data-state=checked]]:scale-100 group-has-[[data-state=checked]]:opacity-100 group-has-[[data-state=unchecked]]:scale-0 group-has-[[data-state=unchecked]]:opacity-0" />
                      </Label>
                    ))}
                  </RadioGroup>
                </Field>
              )}
            />
          </FieldGroup>
        </Step>

        {/* Final Step */}
        <Step>
          <div className="flex-1 space-y-6">
            <div className="space-y-4">
              {/* Goals */}
              <div>
                <h3 className="text-muted-foreground mb-2 text-sm font-semibold tracking-wide uppercase">
                  Mục tiêu học tiếng Anh
                </h3>
                <div className="flex flex-wrap gap-2">
                  {form.watch('goals')?.map((goalId) => {
                    const goal = GOALS.find((g) => g.id === goalId);
                    return (
                      <span
                        key={goalId}
                        className="bg-primary/10 text-primary rounded-full px-3 py-1 text-sm"
                      >
                        {goal?.label}
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Level */}
              <div>
                <h3 className="text-muted-foreground mb-2 text-sm font-semibold tracking-wide uppercase">
                  Trình độ tiếng Anh
                </h3>
                <p className="text-base font-medium">
                  {LEVELS.find((l) => l.id === form.watch('level'))?.label}
                </p>
              </div>

              {/* Skills */}
              <div>
                <h3 className="text-muted-foreground mb-2 text-sm font-semibold tracking-wide uppercase">
                  Kĩ năng muốn cải thiện
                </h3>
                <div className="flex flex-wrap gap-2">
                  {form.watch('skills')?.map((skillId) => {
                    const skill = SKILLS.find((s) => s.id === skillId);
                    return (
                      <span
                        key={skillId}
                        className="bg-primary/10 text-primary rounded-full px-3 py-1 text-sm"
                      >
                        {skill?.label}
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Interests */}
              <div>
                <h3 className="text-muted-foreground mb-2 text-sm font-semibold tracking-wide uppercase">
                  Chủ đề quan tâm
                </h3>
                <div className="flex flex-wrap gap-2">
                  {form
                    .watch('interests')
                    ?.slice(0, 10)
                    .map((interest) => {
                      const interestData = INTERESTS.find((i) => i.topic === interest);
                      return (
                        <span
                          key={interest}
                          className="bg-primary/10 text-primary rounded-full px-3 py-1 text-sm"
                        >
                          {interestData?.label}
                        </span>
                      );
                    })}
                  {(form.watch('interests')?.length ?? 0) > 10 && (
                    <span className="text-muted-foreground rounded-full px-3 py-1 text-sm">
                      +{(form.watch('interests')?.length ?? 0) - 10} chủ đề khác
                    </span>
                  )}
                </div>
              </div>

              {/* Age & Profession */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <h3 className="text-muted-foreground mb-2 text-sm font-semibold tracking-wide uppercase">
                    Độ tuổi
                  </h3>
                  <p className="text-base font-medium">
                    {AGES.find((a) => a.id === form.watch('ageRange'))?.label}
                  </p>
                </div>
                <div>
                  <h3 className="text-muted-foreground mb-2 text-sm font-semibold tracking-wide uppercase">
                    Nghề nghiệp
                  </h3>
                  <p className="text-base font-medium">
                    {PROFESSIONS.find((p) => p.id === form.watch('profession'))?.label}
                  </p>
                </div>
              </div>

              {/* Study Plan */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <h3 className="text-muted-foreground mb-2 text-sm font-semibold tracking-wide uppercase">
                    Số bài học mỗi ngày
                  </h3>
                  <p className="text-base font-medium">
                    {
                      STUDY_TIME_OPTIONS.find((s) => s.value === form.watch('dailyLessonCount'))
                        ?.label
                    }
                  </p>
                </div>
                <div>
                  <h3 className="text-muted-foreground mb-2 text-sm font-semibold tracking-wide uppercase">
                    Thời gian học
                  </h3>
                  <p className="text-base font-medium">
                    {STUDY_ROUNTINE.find((r) => r.value === form.watch('planDuration'))?.label}
                  </p>
                </div>
              </div>
            </div>

            <p className="text-muted-foreground text-center text-sm">
              Nhấn &quot;Tạo lộ trình&quot; để bắt đầu hành trình học tiếng Anh của bạn!
            </p>
          </div>
        </Step>
      </Stepper>
    </form>
  );
};

export default memo(StudyRouteForm);
