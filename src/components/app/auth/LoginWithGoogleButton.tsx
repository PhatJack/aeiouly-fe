'use client';

import { useEffect, useRef } from 'react';

import { useLocale, useTranslations } from 'next-intl';

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
  const locale = useLocale();
  const t = useTranslations('auth');
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
      locale: locale.replace('-', '_'),
      type: 'standard',
    });
  }

  function handleCredential(resp: { credential: string }) {
    toast.promise(
      loginGoogle.mutateAsync(resp.credential).then(() => {
        onSuccess(); // side effect AFTER success
      }),

      {
        loading: t('api.auth.LOGGING_IN_WITH_GOOGLE'),
        success: t('api.auth.GOOGLE_LOGIN_SUCCESSFULLY'),
        error: (e: any) => t(`${e?.detail?.code}`) || t('api.auth.GOOGLE_LOGIN_FAILED'),
      }
    );
  }

  return <div ref={googleRef} />;
}
