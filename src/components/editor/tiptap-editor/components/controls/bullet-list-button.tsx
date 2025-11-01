import React from 'react';

import { useList } from '../../hooks/use-list';
import { MenuButton } from '../menu-button';

const BulletListButton = () => {
  const { isActive, canToggle, toggleList } = useList('bulletList');

  return (
    <MenuButton
      icon={'list'}
      tooltip={'Bullet List'}
      shortcuts={['Mod', 'Shift', '8']}
      active={isActive}
      disabled={!canToggle}
      onClick={toggleList}
    />
  );
};

export default BulletListButton;
