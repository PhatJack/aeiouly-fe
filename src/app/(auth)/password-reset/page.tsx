import { Metadata } from "next";
import { PasswordResetForm } from "../_components/PasswordResetForm";

export const metadata: Metadata = {
  title: "Password Reset",
};

export default function PasswordResetPage() {
  return <PasswordResetForm />;
}
