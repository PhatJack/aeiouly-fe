'use client';

import React, { useState } from 'react';

import Image from 'next/image';

import AlertCustom from '@/components/custom/AlertCustom';
import Stepper, { Step } from '@/components/reactbits/stepper';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Timeline,
  TimelineContent,
  TimelineDescription,
  TimelineDot,
  TimelineHeading,
  TimelineItem,
} from '@/components/ui/timeline';
import { AGES } from '@/constants/study-route/ages';
import { INTERESTS } from '@/constants/study-route/interests';
import { LEVELS } from '@/constants/study-route/level';
import { PROFESSIONS } from '@/constants/study-route/profession';
import { STUDY_ROUNTINE } from '@/constants/study-route/routine';
import { SKILLS } from '@/constants/study-route/skills';
import { STUDY_TIME_OPTIONS } from '@/constants/study-route/study-time';
import { GOALS } from '@/constants/study-route/targets';

import { BookOpen, Check, CheckIcon, Headphones, Mic, PenTool } from 'lucide-react';

type ActivityStatus = 'start' | 'in-progress' | 'done';

type Activity = {
  id: string;
  type: 'listening' | 'speaking' | 'reading' | 'writing';
  title: string;
  description: string;
  duration: string;
  status: ActivityStatus;
  level: string;
};

type TimelineDay = {
  dayNumber: number;
  title: string;
  description: string;
  activities: Activity[];
  isCompleted: boolean;
};

// Mock data
const MOCK_TIMELINE_DATA: TimelineDay[] = [
  {
    dayNumber: 1,
    title: 'Chào mừng & Giới thiệu bản thân',
    description:
      'Học từ vựng cơ bản về giới thiệu, luyện phát âm alphabet, và hoàn thành bài kiểm tra đầu vào để đánh giá trình độ',
    isCompleted: true,
    activities: [
      {
        id: 'day1-listening-1',
        type: 'listening',
        title: 'Luyện Nghe',
        description: 'Nghe và hiểu các cuộc hội thoại giới thiệu bản thân',
        duration: '15 phút',
        level: 'A1',
        status: 'done',
      },
      {
        id: 'day1-speaking-1',
        type: 'speaking',
        title: 'Luyện Nói',
        description: 'Thực hành giới thiệu bản thân bằng tiếng Anh',
        duration: '10 phút',
        level: 'A1',
        status: 'done',
      },
    ],
  },
  {
    dayNumber: 2,
    title: 'Gia đình & Mối quan hệ',
    description:
      'Từ vựng về gia đình, sở hữu cách, luyện nghe hội thoại về giới thiệu gia đình và viết đoạn văn ngắn',
    isCompleted: true,
    activities: [
      {
        id: 'day2-reading-1',
        type: 'reading',
        title: 'Luyện Đọc',
        description: 'Đọc hiểu bài viết về gia đình và mối quan hệ',
        duration: '20 phút',
        level: 'A1',
        status: 'done',
      },
    ],
  },
  {
    dayNumber: 3,
    title: 'Hoạt động hàng ngày',
    description:
      'Động từ chỉ hoạt động thường ngày, thì hiện tại đơn, luyện nói về thói quen hàng ngày và đọc bài về daily routine',
    isCompleted: true,
    activities: [
      {
        id: 'day3-writing-1',
        type: 'writing',
        title: 'Luyện Viết',
        description: 'Viết đoạn văn ngắn về thói quen hàng ngày của bạn',
        duration: '25 phút',
        level: 'A1',
        status: 'done',
      },
      {
        id: 'day3-listening-1',
        type: 'listening',
        title: 'Luyện Nghe',
        description: 'Nghe và ghi chép thói quen hàng ngày',
        duration: '15 phút',
        level: 'A1',
        status: 'done',
      },
    ],
  },
  {
    dayNumber: 4,
    title: 'Sở thích & Giải trí',
    description:
      'Từ vựng về sở thích, cấu trúc like/love/enjoy + V-ing, luyện nghe podcast về hobbies và thảo luận về sở thích cá nhân',
    isCompleted: false,
    activities: [
      {
        id: 'day4-speaking-1',
        type: 'speaking',
        title: 'Luyện Nói',
        description: 'Thảo luận về sở thích và hoạt động giải trí yêu thích',
        duration: '20 phút',
        level: 'A2',
        status: 'in-progress',
      },
      {
        id: 'day4-reading-1',
        type: 'reading',
        title: 'Luyện Đọc',
        description: 'Đọc bài viết về các hoạt động giải trí phổ biến',
        duration: '18 phút',
        level: 'A2',
        status: 'start',
      },
    ],
  },
  {
    dayNumber: 5,
    title: 'Mua sắm & Tiền tệ',
    description:
      'Học từ vựng mua sắm, số đếm và giá cả, luyện hội thoại tại cửa hàng, viết email đặt hàng',
    isCompleted: false,
    activities: [
      {
        id: 'day5-listening-1',
        type: 'listening',
        title: 'Luyện Nghe',
        description: 'Nghe các cuộc hội thoại mua sắm tại cửa hàng',
        duration: '15 phút',
        level: 'A2',
        status: 'start',
      },
    ],
  },
  {
    dayNumber: 6,
    title: 'Du lịch & Phương tiện',
    description:
      'Từ vựng về du lịch, giới từ chỉ nơi chốn, luyện nghe thông báo tại sân bay, đọc brochure du lịch',
    isCompleted: false,
    activities: [
      {
        id: 'day6-writing-1',
        type: 'writing',
        title: 'Luyện Viết',
        description: 'Viết email đặt phòng khách sạn',
        duration: '30 phút',
        level: 'A2',
        status: 'start',
      },
      {
        id: 'day6-speaking-1',
        type: 'speaking',
        title: 'Luyện Nói',
        description: 'Hỏi đường và chỉ đường bằng tiếng Anh',
        duration: '15 phút',
        level: 'A2',
        status: 'start',
      },
    ],
  },
  {
    dayNumber: 7,
    title: 'Ôn tập & Kiểm tra tuần',
    description:
      'Ôn tập toàn bộ từ vựng và ngữ pháp đã học, làm bài kiểm tra tổng hợp 4 kỹ năng, nhận feedback và lộ trình tuần tiếp theo',
    isCompleted: false,
    activities: [
      {
        id: 'day7-reading-1',
        type: 'reading',
        title: 'Luyện Đọc',
        description: 'Bài kiểm tra đọc hiểu tổng hợp',
        duration: '25 phút',
        level: 'A2',
        status: 'start',
      },
    ],
  },
];

const getActivityIcon = (type: Activity['type']) => {
  switch (type) {
    case 'listening':
      return Headphones;
    case 'speaking':
      return Mic;
    case 'reading':
      return BookOpen;
    case 'writing':
      return PenTool;
  }
};

const getActivityButtonText = (status: ActivityStatus) => {
  switch (status) {
    case 'start':
      return 'Bắt đầu học';
    case 'in-progress':
      return 'Tiếp tục';
    case 'done':
      return 'Đã hoàn thành';
  }
};

const StudyRoutePage = () => {
  const [timelineData, setTimelineData] = useState<TimelineDay[]>(MOCK_TIMELINE_DATA);

  const handleActivityClick = (dayIndex: number, activityId: string) => {
    // Simulate navigation or session creation
    console.log('Starting activity:', { dayIndex, activityId });
    // In real app, this would navigate to the session page or create a new session
  };
  return (
    <div>
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 space-y-2">
          <h1 className="text-3xl font-bold">Lộ trình học tiếng Anh 7 ngày</h1>
          <p className="text-muted-foreground">
            Hoàn thành các hoạt động học tập theo thứ tự để đạt hiệu quả tốt nhất
          </p>
        </div>

        <Timeline>
          {timelineData.map((day, dayIndex) => {
            const Icon = day.isCompleted ? CheckIcon : null;
            return (
              <TimelineItem key={`day-${day.dayNumber}`}>
                <TimelineDot variant={day.isCompleted ? 'success' : 'primary'}>
                  <div
                    className={`flex size-8 items-center justify-center rounded-full ${
                      day.isCompleted ? 'bg-green-500' : 'bg-primary'
                    }`}
                  >
                    {Icon ? (
                      <Icon className="size-4 text-white" />
                    ) : (
                      <span className="text-sm font-bold text-white">{day.dayNumber}</span>
                    )}
                  </div>
                </TimelineDot>
                <TimelineContent>
                  <TimelineHeading>
                    {!day.isCompleted && dayIndex === 3 && 'Đang học: '}
                    {day.title}
                  </TimelineHeading>
                  <TimelineDescription>{day.description}</TimelineDescription>
                  <div className="mt-4 space-y-3">
                    {day.activities.map((activity) => {
                      const ActivityIcon = getActivityIcon(activity.type);
                      const isDisabled = activity.status === 'done';
                      const variant =
                        activity.status === 'in-progress'
                          ? 'default'
                          : activity.status === 'done'
                            ? 'outline'
                            : 'default';

                      return (
                        <div
                          key={activity.id}
                          className={`rounded-lg border p-3 ${
                            activity.status === 'done'
                              ? 'border-green-200 bg-green-50/50 dark:border-green-900 dark:bg-green-950/20'
                              : activity.status === 'in-progress'
                                ? 'border-primary bg-primary/5'
                                : 'border-border bg-background'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex flex-1 items-start gap-3">
                              <div
                                className={`mt-0.5 rounded-lg p-2 ${
                                  activity.status === 'done'
                                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                    : activity.status === 'in-progress'
                                      ? 'bg-primary/10 text-primary'
                                      : 'bg-muted text-muted-foreground'
                                }`}
                              >
                                <ActivityIcon className="size-4" />
                              </div>
                              <div className="flex-1 space-y-1">
                                <div className="flex items-center gap-2">
                                  <h4 className="font-medium">{activity.title}</h4>
                                  <span
                                    className={`rounded px-2 py-0.5 text-xs font-medium ${
                                      activity.status === 'done'
                                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                        : activity.status === 'in-progress'
                                          ? 'bg-primary/10 text-primary'
                                          : 'bg-muted text-muted-foreground'
                                    }`}
                                  >
                                    {activity.level}
                                  </span>
                                </div>
                                <p className="text-muted-foreground text-sm">
                                  {activity.description}
                                </p>
                              </div>
                            </div>
                            <Button
                              size="sm"
                              variant={variant}
                              disabled={isDisabled}
                              onClick={() => handleActivityClick(dayIndex, activity.id)}
                              className="shrink-0"
                            >
                              {getActivityButtonText(activity.status)}
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </TimelineContent>
              </TimelineItem>
            );
          })}
        </Timeline>
      </div>
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
