import { toast } from 'sonner';

export const useGetStream = (deviceId: string | null) => {
  const getStream = async (): Promise<MediaStream | undefined> => {
    try {
      const newStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          deviceId: deviceId ? { exact: deviceId } : undefined,
        },
        video: false,
      });
      return newStream;
    } catch (error) {
      console.error('Error accessing media devices:', error);
      toast.error(
        'Không thể truy cập thiết bị âm thanh. Vui lòng kiểm tra quyền truy cập của bạn.',
        {
          description: 'Đảm bảo rằng trình duyệt có quyền truy cập vào microphone.',
        }
      );
    }
  };

  return { getStream };
};
