'use client';

import React, { useState } from 'react';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import CreatePost from '@/components/app/news/CreatePost';
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
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { PostResponseSchema } from '@/lib/schema/post.schema';
import {
  useDeletePostMutation,
  useGetAllPostsQuery,
  useUpdatePostMutation,
} from '@/services/posts';
import { useQueryClient } from '@tanstack/react-query';

import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Calendar, Eye, EyeOff, Heart, Image as ImageIcon, Plus, Trash2, User } from 'lucide-react';
import { toast } from 'sonner';

import { createColumns } from './columns';
import { DataTable } from './data-table';

const PostsTable = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [selectedPost, setSelectedPost] = useState<PostResponseSchema | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<PostResponseSchema | null>(null);
  const [pagination, setPagination] = useState({ page: 1, size: 10 });
  const { data } = useGetAllPostsQuery(pagination);

  const deletePostMutation = useDeletePostMutation();
  const updatePostMutation = useUpdatePostMutation();

  const handleRowClick = (post: PostResponseSchema) => {
    setSelectedPost(post);
    setIsSheetOpen(true);
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
        if (selectedPost?.id === postToDelete.id) {
          setIsSheetOpen(false);
          setSelectedPost(null);
        }
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
          if (selectedPost?.id === post.id) {
            setSelectedPost({ ...post, is_published: !post.is_published });
          }
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
    setPagination({
      page: newPagination.pageIndex + 1, // API uses 1-based pagination
      size: newPagination.pageSize,
    });
  };

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Quản lý bài viết</h2>
          <p className="text-muted-foreground text-sm">Xem và quản lý tất cả bài viết</p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
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
      />

      {/* Detail Sheet */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="w-full sm:max-w-2xl">
          {selectedPost && (
            <>
              <SheetHeader className="mt-5">
                <SheetTitle className="flex items-center justify-between">
                  <span>Chi tiết bài viết #{selectedPost.id}</span>
                  <Badge variant={selectedPost.is_published ? 'default' : 'secondary'}>
                    {selectedPost.is_published ? 'Đã xuất bản' : 'Nháp'}
                  </Badge>
                </SheetTitle>
                <SheetDescription>Xem và quản lý thông tin chi tiết của bài viết</SheetDescription>
              </SheetHeader>

              <ScrollArea className="h-auto overflow-y-auto pb-4">
                <div className="space-y-4 px-4">
                  {/* Content */}
                  <div>
                    <h3 className="mb-3 text-sm font-semibold">Nội dung</h3>
                    <div className="rounded-lg border p-4">
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">
                        {selectedPost.content}
                      </p>
                    </div>
                  </div>

                  {/* Image */}
                  {selectedPost.image_url && (
                    <>
                      <Separator />
                      <div>
                        <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold">
                          <ImageIcon className="h-4 w-4" />
                          Hình ảnh
                        </h3>
                        <div className="relative aspect-video w-full overflow-hidden rounded-lg border">
                          <Image
                            src={selectedPost.image_url}
                            alt="Post image"
                            fill
                            className="object-cover"
                          />
                        </div>
                      </div>
                    </>
                  )}

                  <Separator />

                  {/* Stats */}
                  <div>
                    <h3 className="mb-3 text-sm font-semibold">Thống kê</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="rounded-lg border p-4">
                        <div className="text-muted-foreground flex items-center gap-2">
                          <Heart className="h-4 w-4" />
                          <span className="text-xs">Lượt thích</span>
                        </div>
                        <p className="mt-2 text-2xl font-bold">{selectedPost.likes_count}</p>
                      </div>
                      <div className="rounded-lg border p-4">
                        <div className="text-muted-foreground flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span className="text-xs">Ngày tạo</span>
                        </div>
                        <p className="mt-2 text-sm font-medium">
                          {format(new Date(selectedPost.created_at), 'dd/MM/yyyy', { locale: vi })}
                        </p>
                        <p className="text-muted-foreground text-xs">
                          {format(new Date(selectedPost.created_at), 'HH:mm', { locale: vi })}
                        </p>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Actions */}
                  <div className="space-y-2">
                    <h3 className="mb-3 text-sm font-semibold">Hành động</h3>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => handleTogglePublish(selectedPost)}
                        disabled={updatePostMutation.isPending}
                      >
                        {selectedPost.is_published ? (
                          <>
                            <EyeOff className="mr-2 h-4 w-4" />
                            Chuyển thành nháp
                          </>
                        ) : (
                          <>
                            <Eye className="mr-2 h-4 w-4" />
                            Xuất bản
                          </>
                        )}
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => handleDelete(selectedPost)}
                        disabled={deletePostMutation.isPending}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Xóa
                      </Button>
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Create Post Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent aria-describedby={undefined} className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Tạo bài viết mới</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <CreatePost
              onSuccess={(data) => {
                queryClient.setQueryData(['posts', pagination], (oldData: any) => {
                  return {
                    ...oldData,
                    items: [data, ...oldData.items],
                  };
                });
                setIsCreateDialogOpen(false);
                router.refresh();
              }}
            />
          </div>
        </DialogContent>
      </Dialog>

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
