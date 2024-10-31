import React from 'react';
import MainStack from './mainStack';
import AuthStack from './authStack';
import { LoggedOutUser } from '@/types/user';
import { useCurrentUserContext } from '@/context';

export default function RootNavigation(): React.JSX.Element {
  const { user } = useCurrentUserContext();

  if (user === LoggedOutUser) {
    return <AuthStack />;
  }

  return <MainStack />;
}
