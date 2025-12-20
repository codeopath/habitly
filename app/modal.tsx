import { Text, View } from 'react-native';

export default function ModalScreen() {
  return (
    // <ThemedView style={styles.container}>
    //   <ThemedText type="title">This is a modal</ThemedText>
    //   <Link href="/" dismissTo style={styles.link}>
    //     <ThemedText type="link">Go to home screen</ThemedText>
    //   </Link>
    // </ThemedView>
    <View className="flex-1 items-center justify-center bg-amber-50">
      <Text className="text-xl font-bold text-red-800">Welcome to Nativewind!</Text>
    </View>
  );
}
