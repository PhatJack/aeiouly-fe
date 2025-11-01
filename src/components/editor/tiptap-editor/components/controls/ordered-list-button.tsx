import React from 'react';

import { useList } from '../../hooks/use-list';
import { MenuButton } from '../menu-button';

const OrderedListButton = () => {
  const { isActive, canToggle, toggleList } = useList('orderedList');

  return (
    <MenuButton
      icon={'list-ordered'}
      tooltip={'Ordered List'}
      shortcuts={['Mod', 'Shift', '7']}
      active={isActive}
      disabled={!canToggle}
      onClick={toggleList}
    />
  );
};

export default OrderedListButton;
