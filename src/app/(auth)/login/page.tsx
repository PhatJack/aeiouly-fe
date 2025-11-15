import { Metadata } from 'next';

import { LoginForm } from '../_components/LoginForm';

export const metadata: Metadata = {
  title: 'Đăng nhập tài khoản',
};
export default function LoginPage() {
  return <LoginForm />;
}
