import { Suspense } from "react";
import AuthForm from "@/components/AuthForm";

export default function Registro() {
  return (
    <Suspense>
      <AuthForm mode="signup" />
    </Suspense>
  );
}
