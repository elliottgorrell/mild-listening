import React, { useContext } from "react";
import { StyleSheet, SafeAreaView, View } from "react-native";
import type { StackScreenProps } from "@react-navigation/stack";
import { Button } from "@/components";
import type { OnboardingStackParamList } from "@/navigation/onboardingStack";
import { CurrentUserContext } from "@/context";
import { OnboardingStage } from "@/types/user";
import { updateUserMetadata } from "@/db/user";
import Svg, { Path, G, Rect } from "react-native-svg";
import LottieView from "lottie-react-native";
import SuccessAnimation from "@/./assets/animations/Success.json";
import tw from "@/lib/tailwind";

const CompletionScreen: React.FC<
  StackScreenProps<OnboardingStackParamList, "Completion">
> = ({ navigation }) => {
  const currUserContext = useContext(CurrentUserContext);

  const completeStage = (): void => {
    updateUserMetadata(
      { onboardingStage: OnboardingStage.Finished },
      currUserContext,
    )
      .then(() => {
        console.debug("user marked as completed onboarding");
      })
      .catch((e) => {
        console.error(e);
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.svgContainer}>
        <Svg
          width="429.88"
          height="859.76"
          viewBox="0 0 429.88 859.76"
          preserveAspectRatio="none"
        >
          <Rect x="0" y="0" width="429.88" height="859.76" fill="#ffffff" />
          <G rotation={199} origin="214.94, 429.88">
            <Path
              d="M -286.59 709.76 S -153.29 677.76
          0.00 709.76 133.29 639.76
          286.59 709.76 419.88 635.76
          573.17 709.76 706.47 700.76
          859.76 709.76 894.35 666.76
          1146.35 709.76 h 110 V 1459.76 H -286.59 Z"
              fill={tw.color("neutral-500")}
            />
            <Path
              d="M -286.59 175.00 S -153.29 56.00
          0.00 175.00 133.29 69.00
          286.59 175.00 419.88 51.00
          573.17 175.00 696.76 79.00
          859.76 175.00 907.35 97.50
          1146.35 175.00 h 110 V -600 H -286.59 Z"
              fill={tw.color("secondary-700")}
            />
          </G>
        </Svg>
      </View>

      <View style={styles.animationContainer}>
        <LottieView
          source={SuccessAnimation}
          autoPlay
          loop={false}
          style={styles.animation}
        />
      </View>
      <View style={styles.buttonsContainer}>
        <Button style={styles.button} onPress={completeStage}>
          Complete
        </Button>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  animationContainer: {
    height: "85%",
    alignItems: "center",
    justifyContent: "center",
  },

  animation: {
    width: 200,
    height: 400,
  },

  button: {
    marginTop: 20,
  },

  text: {
    marginTop: 20,
    alignSelf: "center",
    color: "black",
    fontSize: 20,
    fontWeight: "bold",
  },

  buttonsContainer: {
    width: "80%",
    justifyContent: "center",
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

  svgContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});

export default CompletionScreen;
