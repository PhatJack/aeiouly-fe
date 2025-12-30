import Link from 'next/link';

import EmptyCustom from '@/components/custom/EmptyCustom';
import { Button } from '@/components/ui/button';

import { Home } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="flex min-h-dvh w-full items-center justify-center">
      <EmptyCustom
        icon={<Home className="text-muted-foreground h-12 w-12" />}
        title="404 - Không Tìm Thấy Trang"
        description="Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển."
        className="max-w-2xl"
        content={
          <Button asChild variant="default">
            <Link href="/app">
              <Home className="h-4 w-4" />
              Trở Về Trang Chủ
            </Link>
          </Button>
        }
      />
    </div>
  );
};

export default NotFound;
