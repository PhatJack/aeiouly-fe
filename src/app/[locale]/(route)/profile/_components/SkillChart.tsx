'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

import { BookOpen, Headphones, Mic, PenLine } from 'lucide-react';
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from 'recharts';

export type EnglishSkillScores = {
  listening: number;
  speaking: number;
  reading: number;
  writing: number;
};

const clampPercent = (value: number) => Math.min(100, Math.max(0, value));

const chartConfig = {
  score: {
    label: 'Score',
    color: 'var(--chart-1)',
  },
} satisfies ChartConfig;

const SKILLS = [
  { key: 'listening', label: 'Listening', icon: Headphones },
  { key: 'speaking', label: 'Speaking', icon: Mic },
  { key: 'reading', label: 'Reading', icon: BookOpen },
  { key: 'writing', label: 'Writing', icon: PenLine },
] as const;

export default function SkillChart({
  scores = {
    listening: 65,
    speaking: 45,
    reading: 70,
    writing: 55,
  },
}: {
  scores?: EnglishSkillScores;
}) {
  const normalized = {
    listening: clampPercent(scores.listening),
    speaking: clampPercent(scores.speaking),
    reading: clampPercent(scores.reading),
    writing: clampPercent(scores.writing),
  } satisfies EnglishSkillScores;

  const chartData = SKILLS.map((s) => ({
    skill: s.label,
    score: normalized[s.key],
  }));

  return (
    <Card className="overflow-hidden shadow-none">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">English skills</CardTitle>
        <CardDescription className="flex items-center justify-between">
          <span>Overall proficiency snapshot</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-80">
          <RadarChart
            data={chartData}
            margin={{
              top: 10,
              right: 10,
              bottom: 10,
              left: 10,
            }}
          >
            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
            <PolarAngleAxis
              dataKey="skill"
              tick={({ x, y, textAnchor, value, index, ...props }) => {
                const data = chartData[index];

                return (
                  <text x={x} y={y} textAnchor={textAnchor} {...props}>
                    <tspan fontSize={12} fontWeight={600}>
                      {data.score}%
                    </tspan>
                    <tspan x={x} dy={'1rem'} fontSize={9} className="fill-muted-foreground">
                      {data.skill}
                    </tspan>
                  </text>
                );
              }}
            />

            <PolarGrid />
            <Radar
              dataKey="score"
              stroke="var(--color-score)"
              fill="var(--color-score)"
              fillOpacity={0.25}
            />
          </RadarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
