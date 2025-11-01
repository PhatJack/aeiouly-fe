import React from 'react';

import { useHistory } from '../../hooks/use-history';
import { MenuButton } from '../menu-button';

const RedoButton = () => {
  const { canRedo, redo } = useHistory();

  return (
    <MenuButton
      icon="redo"
      tooltip="Redo"
      shortcuts={['Mod', 'Y']}
      disabled={!canRedo}
      onClick={redo}
    />
  );
};

export default RedoButton;
