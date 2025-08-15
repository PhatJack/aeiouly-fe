import {
  QueryClient,
  defaultShouldDehydrateQuery,
  isServer,
} from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { ZodError } from "zod";

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 10000, // Dữ liệu sẽ được xem là "cũ" sau 10s
        refetchOnWindowFocus: true, // Khi người dùng quay lại tab, query sẽ được refetch
        throwOnError: (error) => {
          if (isAxiosError(error)) return true; // Nếu lỗi từ Axios, ném lỗi
          if (error instanceof ZodError) {
            // Nếu lỗi từ Zod, log lỗi rồi trả về false
            // console.error(
            //   "ZodError",
            //   error.errors.map((e) => e.message),
            //   error
            // );
          }
          return false;
        },
      },
      mutations: {
        throwOnError: (error) => {
          if (isAxiosError(error)) return true; // Nếu lỗi từ Axios, ném lỗi
          if (error instanceof ZodError) {
            // Nếu lỗi từ Zod, log lỗi rồi trả về false
            // console.error(
            //   "ZodError",
            //   error.errors.map((e) => e.message),
            //   error
            // );
          }
          return false;
        },
      },
      dehydrate: {
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) || // Điều kiện mặc định của react-query
          query.state.status === "pending", // Nếu query đang ở trạng thái "pending", nó cũng sẽ bị dehydrate
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

export function getQueryClient() {
  if (isServer) {
    return makeQueryClient();
  } else {
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}
