'use client';

import React from 'react';

import Image from 'next/image';

import AlertCustom from '@/components/custom/AlertCustom';
import Stepper, { Step } from '@/components/reactbits/stepper';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
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

import { Check } from 'lucide-react';

const StudyRoutePage = () => {
  return (
    <div className="xl:h-[calc(100vh-5.75rem-1px)]">
      {/* <Stepper
        initialStep={1}
        onStepChange={(step) => {
          console.log(step);
        }}
        stepIndicatorStyle="progress"
        onFinalStepCompleted={() => console.log('All steps completed!')}
        backButtonText="Quay lại"
        nextButtonText="Tiếp tục"
      >
        <Step>
          <div className="w-full space-y-4 text-center flex-1">
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
        <Step>
          <div className="space-y-4">
            <h2 className="text-2xl font-bold sm:text-3xl">Mục tiêu học tiếng Anh</h2>
            <RadioGroup defaultValue="">
              {GOALS.map((goal, index) => (
                <Label
                  key={`goal-${index}`}
                  className="group hover:bg-accent/50 has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-accent/50 relative flex cursor-pointer items-center gap-4 rounded-lg border-2 border-b-4 px-4 py-3 text-base transition-colors"
                >
                  <RadioGroupItem value={goal.id} />
                  <span className="flex-1">{goal.label}</span>
                  <Check className="text-primary absolute top-1/2 right-4 size-7 -translate-y-1/2 scale-0 opacity-0 transition-all duration-300 group-has-[[data-state=checked]]:scale-100 group-has-[[data-state=checked]]:opacity-100 group-has-[[data-state=unchecked]]:scale-0 group-has-[[data-state=unchecked]]:opacity-0" />
                </Label>
              ))}
            </RadioGroup>
          </div>
        </Step>
        <Step>
          <div className="space-y-4">
            <h2 className="text-2xl font-bold sm:text-3xl">
              Trình độ tiếng Anh hiện tại của bạn như thế nào?
            </h2>
            <RadioGroup defaultValue="">
              {LEVELS.map((goal, index) => (
                <Label
                  key={`goal-${index}`}
                  className="group hover:bg-accent/50 has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-accent/50 relative flex cursor-pointer items-start gap-4 rounded-lg border-2 border-b-4 py-3 pr-12 pl-4 text-base transition-colors"
                >
                  <RadioGroupItem value={goal.id} />
                  <div className="flex flex-col space-y-1.5">
                    <span className="flex-1 leading-3.5">{goal.label}</span>
                    <p className="text-muted-foreground text-sm font-normal">{goal.description}</p>
                  </div>
                  <Check className="text-primary absolute top-1/2 right-4 size-7 -translate-y-1/2 scale-0 opacity-0 transition-all duration-300 group-has-[[data-state=checked]]:scale-100 group-has-[[data-state=checked]]:opacity-100 group-has-[[data-state=unchecked]]:scale-0 group-has-[[data-state=unchecked]]:opacity-0" />
                </Label>
              ))}
            </RadioGroup>
          </div>
        </Step>
        <Step>
          <div className="space-y-4">
            <h2 className="text-2xl font-bold sm:text-3xl">
              Kĩ năng tiếng Anh bạn muốn cải thiện nhất?
            </h2>
            <div className="grid gap-3">
              {SKILLS.map((skill, index) => (
                <Label
                  key={`skill-${index}`}
                  className="group hover:bg-accent/50 has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-accent/50 relative flex cursor-pointer items-center gap-4 rounded-lg border-2 border-b-4 py-3 pr-12 pl-4 text-base transition-colors"
                >
                  <Checkbox value={skill.id} className="sr-only" />
                  <span className="flex-1">{skill.label}</span>
                  <Check className="text-primary absolute top-1/2 right-4 size-7 -translate-y-1/2 scale-0 opacity-0 transition-all duration-300 group-has-[[data-state=checked]]:scale-100 group-has-[[data-state=checked]]:opacity-100 group-has-[[data-state=unchecked]]:scale-0 group-has-[[data-state=unchecked]]:opacity-0" />
                </Label>
              ))}
            </div>
          </div>
        </Step>
        <Step>
          <div className="space-y-4">
            <h2 className="text-2xl font-bold sm:text-3xl">Tuyệt! Bạn thích học các chủ đề nào?</h2>
            <div className="flex flex-wrap gap-2">
              {INTERESTS.map((interest, index) => (
                <Label
                  key={`interest-${index}`}
                  className="group hover:bg-accent/50 has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary relative flex w-fit cursor-pointer items-center gap-4 rounded-full border-2 px-4 py-2 text-base transition-colors"
                >
                  <Checkbox value={interest.topic} className="sr-only" />
                  <span className="flex-1 group-has-[[data-state=checked]]:text-white">
                    {interest.label}
                  </span>
                </Label>
              ))}
            </div>
          </div>
        </Step>
        <Step>
          <div className="space-y-4">
            <h2 className="text-2xl font-bold sm:text-3xl">Bạn bao nhiêu tuổi?</h2>
            <RadioGroup className="g grid">
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
          </div>
        </Step>
        <Step>
          <div className="space-y-4">
            <h2 className="text-2xl font-bold sm:text-3xl">Nghề nghiệp của bạn là gì?</h2>
            <RadioGroup className="g grid">
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
          </div>
        </Step>
        <Step>
          <div className="space-y-4">
            <h2 className="text-2xl font-bold sm:text-3xl">Mỗi ngày bạn muốn học bao nhiêu bài?</h2>
            <AlertCustom
              variant="info"
              title="Hệ thống sẽ tạo số lượng bài học ngẫu nhiên 4 kĩ năng mỗi ngày"
            />
            <RadioGroup className="grid gap-3">
              {STUDY_TIME_OPTIONS.map((studyTime, index) => (
                <Label
                  key={`study-time-${index}`}
                  className="group hover:bg-accent/50 has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-accent/50 relative flex cursor-pointer items-center gap-4 rounded-lg border-2 border-b-4 py-3 pr-12 pl-4 text-base transition-colors"
                >
                  <RadioGroupItem value={studyTime.value.toLocaleString()} />
                  <span className="flex-1">{studyTime.label}</span>
                  <Check className="text-primary absolute top-1/2 right-4 size-7 -translate-y-1/2 scale-0 opacity-0 transition-all duration-300 group-has-[[data-state=checked]]:scale-100 group-has-[[data-state=checked]]:opacity-100 group-has-[[data-state=unchecked]]:scale-0 group-has-[[data-state=unchecked]]:opacity-0" />
                </Label>
              ))}
            </RadioGroup>
          </div>
        </Step>
        <Step>
          <div className="space-y-4">
            <h2 className="text-2xl font-bold sm:text-3xl">
              Bạn muốn tạo lộ trình trong thời gian bao lâu?
            </h2>
            <RadioGroup className="grid gap-3">
              {STUDY_ROUNTINE.map((studyTime, index) => (
                <Label
                  key={`study-time-${index}`}
                  className="group hover:bg-accent/50 has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-accent/50 relative flex cursor-pointer items-center gap-4 rounded-lg border-2 border-b-4 py-3 pr-12 pl-4 text-base transition-colors"
                >
                  <RadioGroupItem value={studyTime.value} />
                  <span className="flex-1">{studyTime.label}</span>
                  <Check className="text-primary absolute top-1/2 right-4 size-7 -translate-y-1/2 scale-0 opacity-0 transition-all duration-300 group-has-[[data-state=checked]]:scale-100 group-has-[[data-state=checked]]:opacity-100 group-has-[[data-state=unchecked]]:scale-0 group-has-[[data-state=unchecked]]:opacity-0" />
                </Label>
              ))}
            </RadioGroup>
          </div>
        </Step>
        <Step>
          <h2>Final Step</h2>
          <p>You made it!</p>
        </Step>
      </Stepper> */}
    </div>
  );
};

export default StudyRoutePage;
