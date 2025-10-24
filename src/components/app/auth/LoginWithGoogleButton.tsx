'use client';

import { useEffect, useRef } from 'react';

import { useLoginWithGoogleMutation } from '@/services/auth/login-with-google.api';

import { toast } from 'sonner';

interface LoginWithGoogleButtonProps {
  onSuccess: () => void;
  text?: 'signin_with' | 'signup_with' | 'continue_with' | 'signin' | undefined;
}

export function LoginWithGoogleButton({
  onSuccess,
  text = 'signin_with',
}: LoginWithGoogleButtonProps) {
  const googleRef = useRef<HTMLDivElement | null>(null);
  const loginGoogle = useLoginWithGoogleMutation();

  useEffect(() => {
    const id = 'google-identity';
    if (document.getElementById(id)) return init();

    const s = document.createElement('script');
    s.src = 'https://accounts.google.com/gsi/client';
    s.async = true;
    s.defer = true;
    s.id = id;
    s.onload = init;
    document.head.appendChild(s);
  }, []);

  function init() {
    if (!window.google || !googleRef.current) return;
    window.google.accounts.id.initialize({
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
      callback: handleCredential,
    });
    window.google.accounts.id.renderButton(googleRef.current, {
      theme: 'outline',
      size: 'large',
      text,
      shape: 'pill',
      logo_alignment: 'center',
      type: 'standard',
    });
  }

  function handleCredential(resp: { credential: string }) {
    toast.promise(
      loginGoogle.mutateAsync(resp.credential).then(() => {
        onSuccess(); // side effect AFTER success
      }),

      {
        loading: 'Đang đăng nhập với Google...',
        success: 'Đăng nhập với Google thành công!',
        error: (e: any) => e?.detail || 'Đăng nhập với Google thất bại!',
      }
    );
  }

  return <div ref={googleRef} />;
}
