import z from 'zod';

// Study Route Enums
export const studyRouteGoalSchema = z.enum(
  [
    'daily_communication',
    'work',
    'travel',
    'study_exam',
    'certificate',
    'immigration',
    'personal_interest',
  ],
  {
    error: 'Vui lòng chọn mục tiêu học tiếng Anh',
  }
);

export const studyRouteLevelSchema = z.enum(['A1', 'A2', 'B1', 'B2', 'C1', 'C2', ''], {
  error: 'Vui lòng chọn trình độ tiếng Anh hiện tại của bạn',
});

export const studyRouteSkillSchema = z.enum(['listening', 'speaking', 'reading', 'writing', '']);

export const studyRouteAgeSchema = z.enum(
  ['under_18', '18_24', '25_34', '35_44', '45_54', '55_64', '65_above', ''],
  { error: 'Vui lòng chọn độ tuổi của bạn' }
);

export const studyRouteProfessionSchema = z.enum(
  [
    'student',
    'office_worker',
    'software_engineer',
    'designer',
    'marketing',
    'sales',
    'customer_support',
    'teacher',
    'healthcare',
    'engineer',
    'finance',
    'hr',
    'business_owner',
    'freelancer',
    'content_creator',
    'tourism_hospitality',
    'logistics',
    'manufacturing',
    'government',
    'researcher',
    'job_seeker',
    'stay_at_home',
    'retired',
    '',
  ],
  { error: 'Vui lòng chọn nghề nghiệp của bạn' }
);

export const studyRouteRoutineSchema = z.enum(['7_days', '30_days', '90_days', '']);

export const studyInterestsSchema = z.enum([
  'Du lịch',
  'Lịch sử',
  'Khoa học',
  'Thiên nhiên',
  'Ẩm thực',
  'Âm nhạc',
  'Thể thao',
  'Công nghệ',
  'Nghệ thuật',
  'Văn học',
  'Điện ảnh',
  'Thời trang',
  'Sức khỏe',
  'Giáo dục',
  'Kinh doanh',
  'Tài chính',
  'Vũ trụ',
  'Động vật',
  'Môi trường',
  'Chính trị',
  'Tôn giáo',
  'Tâm lý học',
  'Triết học',
  'Nhiếp ảnh',
  'Trò chơi',
  'Làm vườn',
  'Xe cộ',
  'Kiến trúc',
  'Pháp luật',
  'Ngôn ngữ',
  'Toán học',
  'Địa lý',
  'Hóa học',
  'Vật lý',
  'Sinh học',
  'Thiên văn',
  'Gia đình',
  'Tình yêu',
  'Lễ hội',
  'Thủ công',
  'Yoga',
  'Thiền định',
  'Lặn biển',
  'Leo núi',
  'Nông nghiệp',
  'Hải dương',
  'Thần thoại',
  'Kịch nghệ',
  'Phong cách sống',
  'Thời tiết',
  '',
]);

// Study Route Create Schema
export const studyRouteCreateSchema = z.object({
  goal: studyRouteGoalSchema,
  level: studyRouteLevelSchema,
  skills: z.array(studyRouteSkillSchema).min(1, { error: 'Vui lòng chọn ít nhất một kỹ năng' }),
  interests: z.array(studyInterestsSchema).min(1, { error: 'Vui lòng chọn ít nhất một chủ đề' }),
  age: studyRouteAgeSchema,
  profession: studyRouteProfessionSchema,
  daily_lessons: z
    .string()
    .min(1)
    .max(1)
    .refine((val) => !isNaN(Number(val)), { error: 'Không hợp lệ' }),
  routine: studyRouteRoutineSchema,
});

// Types
export type StudyRouteCreateSchema = z.infer<typeof studyRouteCreateSchema>;
export type StudyRouteGoal = z.infer<typeof studyRouteGoalSchema>;
export type StudyRouteLevel = z.infer<typeof studyRouteLevelSchema>;
export type StudyRouteSkill = z.infer<typeof studyRouteSkillSchema>;
export type StudyRouteAge = z.infer<typeof studyRouteAgeSchema>;
export type StudyRouteProfession = z.infer<typeof studyRouteProfessionSchema>;
export type StudyRouteRoutine = z.infer<typeof studyRouteRoutineSchema>;
export type StudyInterest = z.infer<typeof studyInterestsSchema>;
