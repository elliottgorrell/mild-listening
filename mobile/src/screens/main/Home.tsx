import React from 'react';
import { View, Text } from 'react-native';
import tw from '@/lib/tailwind';

export default function Home(): React.JSX.Element {
  return (
    <View style={tw`flex-1 flex-col bg-white items-center`}>
      <Text style={tw`text-3xl font-extrabold`}>Hello World</Text>
    </View>
  );
}
