'use client';

import React, { useCallback, useEffect, useState } from 'react';

import { useRouter } from 'nextjs-toploader/app';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { PostResponseSchema } from '@/lib/schema/post.schema';
import { useDeletePostMutation, useUpdatePostMutation } from '@/services/posts';
import { useGetAllPostsAdminQuery } from '@/services/posts/get-all-post-admin.api';
import { useQueryClient } from '@tanstack/react-query';

import debounce from 'lodash.debounce';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

import { createColumns } from './columns';
import { DataTable } from './data-table';

const PostsTable = () => {
  const router = useRouter();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<PostResponseSchema | null>(null);
  const [pagination, setPagination] = useState({ page: 1, size: 10, search: '' });
  const [searchTerm, setSearchTerm] = useState('');

  const { data } = useGetAllPostsAdminQuery(pagination);

  const debouncedSearch = useCallback(
    debounce((searchValue: string) => {
      setPagination((prev) => ({ ...prev, search: searchValue, page: 1 }));
    }, 500),
    []
  );

  useEffect(() => {
    debouncedSearch(searchTerm);
    return () => {
      debouncedSearch.cancel();
    };
  }, [searchTerm, debouncedSearch]);

  const deletePostMutation = useDeletePostMutation();
  const updatePostMutation = useUpdatePostMutation();

  const handleRowClick = (post: PostResponseSchema) => {
    router.push(`/admin/posts/${post.id}`);
  };

  const handleDelete = (post: PostResponseSchema) => {
    setPostToDelete(post);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (!postToDelete) return;

    deletePostMutation.mutate(postToDelete.id, {
      onSuccess: () => {
        toast.success('Xóa bài viết thành công!');
        router.refresh();
        setDeleteDialogOpen(false);
        setPostToDelete(null);
      },
      onError: () => {
        toast.error('Có lỗi xảy ra khi xóa bài viết');
      },
    });
  };

  const handleTogglePublish = (post: PostResponseSchema) => {
    updatePostMutation.mutate(
      {
        postId: post.id,
        data: { is_published: !post.is_published },
      },
      {
        onSuccess: () => {
          toast.success(
            post.is_published
              ? 'Chuyển bài viết thành nháp thành công!'
              : 'Xuất bản bài viết thành công!'
          );
          router.refresh();
        },
        onError: () => {
          toast.error('Có lỗi xảy ra');
        },
      }
    );
  };

  const columns = createColumns({
    onDelete: handleDelete,
    onTogglePublish: handleTogglePublish,
  });

  const handlePaginationChange = (newPagination: { pageIndex: number; pageSize: number }) => {
    setPagination((prev) => ({
      ...prev,
      page: newPagination.pageIndex + 1, // API uses 1-based pagination
      size: newPagination.pageSize,
    }));
  };

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Quản lý bài viết</h2>
          <p className="text-muted-foreground text-sm">Xem và quản lý tất cả bài viết</p>
        </div>
        <Button onClick={() => router.push('/admin/posts/create')}>
          <Plus className="mr-2 h-4 w-4" />
          Tạo bài viết mới
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={data?.items || []}
        onRowClick={handleRowClick}
        pageCount={data?.total ? Math.ceil(data.total / pagination.size) : 0}
        pageIndex={pagination.page - 1} // Table uses 0-based pagination
        pageSize={pagination.size}
        onPaginationChange={handlePaginationChange}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle>
            <AlertDialogDescription>
              Hành động này không thể hoàn tác. Bài viết sẽ bị xóa vĩnh viễn khỏi hệ thống.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive hover:bg-destructive/90"
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default PostsTable;
