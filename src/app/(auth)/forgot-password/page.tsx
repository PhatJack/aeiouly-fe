import { Metadata } from "next";
import ForgotPWForm from "../_components/ForgotPWForm";

export const metadata: Metadata = {
  title: "Forgot Password",
};

export default function ForgotPasswordPage() {
  return <ForgotPWForm />;
}
