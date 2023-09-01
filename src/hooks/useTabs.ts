import { useState } from 'react';

export default function useTabs(defaultValue: string) {
  const [currentTab, setCurrentTab] = useState(defaultValue || '');

  return {
    currentTab,
    onChangeTab: (_event: React.SyntheticEvent<Element, Event>, newValue: string) => {
      setCurrentTab(newValue);
    },
    setCurrentTab,
  };
}