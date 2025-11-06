import { useEffect, useLayoutEffect, useRef, useState } from 'react';

const useKeyPress = (targetKey: string, handler?: () => void): boolean => {
  const [isKeyPressed, setIsKeyPressed] = useState(false);

  const latestHandler = useRef<(() => void) | null>(handler ?? null);

  useLayoutEffect(() => {
    latestHandler.current = handler ?? null;
  }, [handler]);

  useEffect(() => {
    const downHandler = (e: KeyboardEvent) => {
      if (e.key === targetKey) {
        setIsKeyPressed(true);
        latestHandler.current?.();
      }
    };

    const upHandler = (e: KeyboardEvent) => {
      if (e.key === targetKey) {
        setIsKeyPressed(false);
      }
    };

    window.addEventListener('keydown', downHandler);
    window.addEventListener('keyup', upHandler);

    return () => {
      window.removeEventListener('keydown', downHandler);
      window.removeEventListener('keyup', upHandler);
    };
  }, [targetKey]);

  return isKeyPressed;
};

export default useKeyPress;
