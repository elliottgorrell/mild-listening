import React, { useEffect } from 'react';
import { View, Dimensions, Image } from 'react-native';
import tw from '@/lib/tailwind';
import Carousel from 'react-native-reanimated-carousel';
import { getSpotifySdk } from '@/lib/spotify';
import { SavedAlbum } from '@spotify/web-api-ts-sdk';

export default function Home(): React.JSX.Element {
  let [albums, setAlbums] = React.useState<SavedAlbum[]>([]);

  const width = Dimensions.get('window').width;

  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        const spotify = await getSpotifySdk();
        const albums = await spotify.currentUser.albums.savedAlbums();
        setAlbums(albums.items);
        console.debug(`albums fetched count: ${albums.items.length}`);
      } catch (e) {
        console.error(e);
      }
    };
    fetchAlbums();
  }, []);

  return (
    <View style={tw`flex-1 flex-col bg-white items-center`}>
      <Carousel
        loop
        width={width}
        autoPlay={true}
        data={[...albums.keys()]}
        scrollAnimationDuration={1000}
        renderItem={({ index }) => (
          <View style={tw`flex-1 justify-center mx-5`}>
            <Image
              source={{ uri: albums[index].album.images[0].url }}
              style={tw`w-full rounded-full aspect-square`}
            />
          </View>
        )}
      />
    </View>
  );
}
