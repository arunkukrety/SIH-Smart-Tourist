import { useEffect } from "react";
import { useRouter } from "expo-router";

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    // redirect to QR page on app start
    router.replace("/QR");
  }, []);

  return null;
}
