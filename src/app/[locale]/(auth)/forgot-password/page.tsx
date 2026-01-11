import { Metadata } from 'next';

import { ForgotPWForm } from '../_components/ForgotPWForm';

export const metadata: Metadata = {
  title: 'Quên mật khẩu',
};

export default function ForgotPasswordPage() {
  return <ForgotPWForm />;
}
