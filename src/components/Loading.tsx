import React from 'react';

import { LoaderPinwheel } from 'lucide-react';

const Loading = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <LoaderPinwheel className="animate-spin text-white" size={30} />
    </div>
  );
};

export default Loading;
