import { apiClient } from '@/lib/client';
import {
  DictionaryTranslateRequestSchema,
  DictionaryTranslateResponseSchema,
} from '@/lib/schema/dictionary.schema';
import { ErrorResponseSchema } from '@/lib/schema/error';
import { UseQueryOptions, useQuery } from '@tanstack/react-query';

export async function getDictionaryTranslateApi(params: DictionaryTranslateRequestSchema) {
  const response = await apiClient.post<DictionaryTranslateResponseSchema>(
    `/dictionary/translate`,
    params
  );
  return response.data;
}

export const useGetDictionaryTranslateQuery = (
  params: DictionaryTranslateRequestSchema,
  options?: Omit<
    UseQueryOptions<DictionaryTranslateResponseSchema, ErrorResponseSchema>,
    'queryKey' | 'queryFn'
  >
) => {
  return useQuery<DictionaryTranslateResponseSchema, ErrorResponseSchema>({
    queryKey: ['dictionary', 'translate', params],
    queryFn: () => getDictionaryTranslateApi(params),
    refetchOnWindowFocus: false,
    meta: {
      ignoreGlobal: true,
    },
    ...options,
  });
};
