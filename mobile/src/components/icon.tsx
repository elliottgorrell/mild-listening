import {
  AntDesign,
  Entypo,
  EvilIcons,
  Feather,
  FontAwesome,
  FontAwesome5,
  Fontisto,
  Foundation,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
  Octicons,
  SimpleLineIcons,
  Zocial,
} from "@expo/vector-icons";

export type IconNameMap = {
  AntDesign: keyof typeof AntDesign.glyphMap;
  Entypo: keyof typeof Entypo.glyphMap;
  EvilIcons: keyof typeof EvilIcons.glyphMap;
  Feather: keyof typeof Feather.glyphMap;
  FontAwesome: keyof typeof FontAwesome.glyphMap;
  FontAwesome5: keyof typeof FontAwesome5.glyphMap;
  Ionicons: keyof typeof Ionicons.glyphMap;
  Fontisto: keyof typeof Fontisto.glyphMap;
  Foundation: keyof typeof Foundation.glyphMap;
  MaterialCommunityIcons: keyof typeof MaterialCommunityIcons.glyphMap;
  MaterialIcons: keyof typeof MaterialIcons.glyphMap;
  Octicons: keyof typeof Octicons.glyphMap;
  SimpleLineIcons: keyof typeof SimpleLineIcons.glyphMap;
  Zocial: keyof typeof Zocial.glyphMap;
};

// Define IconType based on the keys of IconNameMap
export type IconType = keyof IconNameMap;

// Create a type that maps IconProps based on IconType
export type IconProps<T extends IconType = IconType> = {
  type: T;
  name: IconNameMap[T];
  size?: number;
  color?: string;
};

/**
 * An easy to use wrapper around expo-vector-icons
 */
export const Icon = <T extends IconType>({
  type,
  name,
  size,
  color,
}: IconProps<T>) => {
  if (type === "AntDesign") {
    return <AntDesign name={name as any} size={size} color={color} />;
  }

  if (type === "Entypo") {
    return <Entypo name={name as any} size={size} color={color} />;
  }

  if (type === "EvilIcons") {
    return <EvilIcons name={name as any} size={size} color={color} />;
  }

  if (type === "Feather") {
    return <Feather name={name as any} size={size} color={color} />;
  }

  if (type === "FontAwesome") {
    return <FontAwesome name={name as any} size={size} color={color} />;
  }

  if (type === "FontAwesome5") {
    return <FontAwesome5 name={name as any} size={size} color={color} />;
  }

  if (type === "Fontisto") {
    return <Fontisto name={name as any} size={size} color={color} />;
  }

  if (type === "Foundation") {
    return <Foundation name={name as any} size={size} color={color} />;
  }

  if (type === "Ionicons") {
    return <Ionicons name={name as any} size={size} color={color} />;
  }

  if (type === "MaterialCommunityIcons") {
    return (
      <MaterialCommunityIcons name={name as any} size={size} color={color} />
    );
  }

  if (type === "MaterialIcons") {
    return <MaterialIcons name={name as any} size={size} color={color} />;
  }

  if (type === "Octicons") {
    return <Octicons name={name as any} size={size} color={color} />;
  }

  if (type === "SimpleLineIcons") {
    return <SimpleLineIcons name={name as any} size={size} color={color} />;
  }

  if (type === "Zocial") {
    return <Zocial name={name as any} size={size} color={color} />;
  }

  return null;
};
