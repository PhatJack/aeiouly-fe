import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { Home } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="flex min-h-dvh w-full items-center justify-center">
      <Card className="border-border w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-foreground text-center text-2xl">
            404 - Không Tìm Thấy Trang
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          <p className="text-muted-foreground text-center">
            Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
          </p>
          <Button asChild variant="default">
            <Link href="/app">
              <Home className="mr-2 h-4 w-4" />
              Trở Về Trang Chủ
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound;
