import { Image } from "react-native";

export default function CaptchaImage({
  captchaUrl,
}: {
  captchaUrl: string;
}) {
  return (
    <Image
      source={{
        uri: captchaUrl,
      }}
      resizeMode="contain"
      style={{
        width: 180,
        height: 70,
      }}
    />
  );
}