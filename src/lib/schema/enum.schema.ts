import z from 'zod';

// Enums
export const CEFRLevelSchema = z.enum(['A1', 'A2', 'B1', 'B2', 'C1', 'C2']);
export const SessionStatusSchema = z.enum(['active', 'completed']);
export const MessageRoleSchema = z.enum(['user', 'assistant']);
export const ReadingGenreSchema = z.enum([
  'Bài báo',
  'Email/Thư từ',
  'Truyện ngắn',
  'Hội thoại',
  'Bài luận',
  'Đánh giá sản phẩm',
  'Bài mạng xã hội',
  'Hướng dẫn sử dụng',
]);

// Types
export type CEFRLevel = z.infer<typeof CEFRLevelSchema>;
export type SessionStatus = z.infer<typeof SessionStatusSchema>;
export type MessageRole = z.infer<typeof MessageRoleSchema>;
export type ReadingGenre = z.infer<typeof ReadingGenreSchema>;
