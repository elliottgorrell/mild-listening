import React from 'react';
import { View, Text, Image } from 'react-native';
import { Button } from '@/components';
import tw from '@/lib/tailwind';
import { useCurrentUserContext } from '@/context';
import { getProfilePicture } from '@/types/user';

export default function Profile(): React.JSX.Element {
  const { user, signOut } = useCurrentUserContext();

  return (
    <View
      style={tw`flex-1 flex-col bg-gray-300 items-center gap-5 justify-between`}
    >
      <Image
        source={getProfilePicture(user)}
        style={tw`rounded-full aspect-square w-2/6 m-5`}
      />

      <View style={tw`flex-2 bg-white rounded-3xl w-4/5`}>
        <View
          style={tw`bg-neutral-500 relative -top-4 py-2 px-5 rounded-3xl self-center`}
        >
          <Text style={tw`text-white  text-center text-base`}>Profile</Text>
        </View>
        <Text style={tw`text-gray-500 text-center font-extrabold`}>
          {user.user.display_name}
        </Text>
      </View>

      <View style={tw`flex-1 flex-row items-center gap-5`}>
        <Button onPress={signOut} text="Sign Out" style={tw`rounded-3xl`} />
      </View>
    </View>
  );
}
