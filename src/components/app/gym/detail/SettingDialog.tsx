import React from 'react';

import TooltipCustom from '@/components/custom/TooltipCustom';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import { Settings } from 'lucide-react';

const SettingDialog = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {/* <TooltipCustom content="Cài đặt phím tắt" side="bottom"> */}
        <Button variant="outline" size={'icon'} className="h-10 w-10">
          <Settings />
        </Button>
        {/* </TooltipCustom> */}
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Cài đặt phím tắt</DialogTitle>
        </DialogHeader>

        {/* Table 2 cột */}
        <div className="mt-4 overflow-x-auto">
          <table className="w-full table-auto border-collapse rounded-lg border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2 text-left">Hành động</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Phím tắt</th>
              </tr>
            </thead>
            <tbody>
              {/* Thêm hàng ở đây */}
              <tr>
                <td className="border border-gray-300 px-4 py-2">Phát lại video</td>
                <td className="border border-gray-300 px-4">
                  <span className="rounded-lg bg-gray-100 px-4 py-1">Ctrl</span>
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">Bật/Tắt video</td>
                <td className="border border-gray-300 px-4">
                  <span className="rounded-lg bg-gray-100 px-4 py-1">Space</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <DialogFooter className="mt-4">
          <DialogClose asChild>
            <Button>Đóng</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SettingDialog;
