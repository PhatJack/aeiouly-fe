import React from 'react';

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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { shortcutsList } from '@/constants/settingListening';

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
          <Table className="w-full border-collapse border">
            <TableHeader>
              <TableRow className="bg-muted border-b">
                <TableHead className="border-r">Hành động</TableHead>
                <TableHead>Phím tắt</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {shortcutsList.map((item, idx) => (
                <TableRow key={idx} className="border-b">
                  <TableCell className="border-r">{item.action}</TableCell>
                  <TableCell className="flex gap-2">
                    {item.keys.split('+').map((key) => (
                      <span
                        key={key}
                        className="bg-muted inline-block rounded-lg border px-3 py-1 text-sm"
                      >
                        {key}
                      </span>
                    ))}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
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
