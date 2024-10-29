import React from "react";
import { StyleSheet, SafeAreaView, View, Text } from "react-native";
import type { StackScreenProps } from "@react-navigation/stack";
import { Button } from "@/components/button";
import type { OnboardingStackParamList } from "@/navigation/onboardingStack";
import Svg, { Path, G, Rect } from "react-native-svg";
import tw from "@/lib/tailwind";

const WelcomeScreen: React.FC<
  StackScreenProps<OnboardingStackParamList, "Welcome">
> = ({ navigation }) => {
  const totalSteps = 2;
  const currentStep = 1;

  const completeStage = (): void => {
    navigation.navigate("Completion");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.progressContainer}>
        {Array.from({ length: totalSteps }, (_, index) => (
          <View
            key={index}
            style={[
              styles.progressStep,
              index + 1 === currentStep
                ? styles.activeStep
                : styles.inactiveStep,
            ]}
          />
        ))}
      </View>

      <View style={styles.svgContainer}>
        <Svg
          viewBox="0 0 429.88 859.76"
          width="429.88"
          height="859.76"
          preserveAspectRatio="none"
        >
          <Rect
            id="bg"
            x="0"
            y="0"
            width="429.88"
            height="859.76"
            fill="#ffffff"
          />
          <G transform="rotate(25 214.94 429.88)">
            <Path
              d="M -286.59 629.76 S -294.00 608.76
               0.00 629.76 133.29 506.76
               286.59 629.76 308.17 556.76
               573.17 629.76 665.76 520.76
               859.76 629.76 993.05 519.76
               1146.35 629.76 h 110 V 1459.76 H -286.59 Z"
              fill={tw.color("secondary-700")}
            />
            <Path
              d="M -286.59 255.00 S -153.29 33.00
               0.00 255.00 78.59 137.50
               286.59 255.00 419.88 137.50
               573.17 255.00 584.76 137.50
               859.76 255.00 993.05 87.00
               1146.35 255.00 h 110 V -600 H -286.59 Z"
              fill={tw.color("neutral-500")}
            />
          </G>
        </Svg>
      </View>

      <View
        style={{
          flex: 1,
          alignItems: "center",
          marginHorizontal: 24,
          marginVertical: 24,
        }}
      >
        <Text style={styles.text}>Welcome</Text>

        <View style={styles.whiteBox}>
          <Text style={styles.subHeading}>Welcome to Onboarding</Text>
        </View>
      </View>

      <View style={styles.buttonsContainer}>
        <Button style={styles.button} onPress={completeStage}>
          Continue
        </Button>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },

  svgContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },

  imageOverlay: {
    backgroundColor: "rgba(128, 128, 128, 0.7)",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
  },

  button: {
    marginTop: 20,
  },

  text: {
    marginBottom: 20,
    alignSelf: "center",
  },

  subHeading: {
    marginTop: 20,
    textAlign: "center",
    fontSize: 20,
  },

  buttonsContainer: {
    width: "80%",
    justifyContent: "center",
  },

  touchableOpacity: {
    marginTop: 70,
    alignItems: "center",
  },
  selectedTouchableOpacity: {
    backgroundColor: "fff",
  },
  unselectedTouchableOpacity: {
    backgroundColor: "fff",
  },

  progressContainer: {
    flexDirection: "row",
    justifyContent: "center",
    paddingVertical: 20,
    zIndex: 1,
  },
  progressStep: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#e0e0e0",
    marginHorizontal: 5,
  },
  activeStep: {
    backgroundColor: "#3C1053",
  },
  inactiveStep: {
    backgroundColor: "#e0e0e0",
  },

  whiteBox: {
    width: "100%",
    height: "80%",
    backgroundColor: "white",
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5, // for Android shadow
    padding: 20,
    borderRadius: 20,
  },

  accountName: {
    fontSize: 25,
  },
});

export default WelcomeScreen;
