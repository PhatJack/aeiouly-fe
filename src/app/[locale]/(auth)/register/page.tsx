import { Metadata } from 'next';

import RegisterForm from '../_components/RegisterForm';

export const metadata: Metadata = {
  title: 'Đăng ký tài khoản',
};

export default function RegisterPage() {
  return <RegisterForm />;
}
