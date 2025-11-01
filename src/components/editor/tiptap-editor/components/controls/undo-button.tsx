import React from 'react';

import { useHistory } from '../../hooks/use-history';
import { MenuButton } from '../menu-button';

const UndoButton = () => {
  const { canUndo, undo } = useHistory();

  return (
    <MenuButton
      icon="undo"
      tooltip="Undo"
      shortcuts={['Mod', 'Z']}
      disabled={!canUndo}
      onClick={undo}
    />
  );
};

export default UndoButton;
