import { apiClient } from '@/lib/client';
import { ErrorResponseSchema } from '@/lib/schema/error';
import {
  FlashcardSessionResponseSchema,
  StudySessionCreateSchema,
} from '@/lib/schema/vocabulary.schema';
import { useMutation } from '@tanstack/react-query';

export async function createFlashcardSessionApi(body: StudySessionCreateSchema) {
  const response = await apiClient.post<FlashcardSessionResponseSchema, StudySessionCreateSchema>(
    '/vocabulary/study/flashcard',
    body
  );
  return response.data;
}

export const useCreateFlashcardSessionMutation = () => {
  return useMutation<FlashcardSessionResponseSchema, ErrorResponseSchema, StudySessionCreateSchema>(
    {
      mutationKey: ['createFlashcardSession'],
      mutationFn: (body) => createFlashcardSessionApi(body),
      meta: {
        ignoreGlobal: true,
      },
    }
  );
};
