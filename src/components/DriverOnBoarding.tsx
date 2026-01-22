'use client';

import { useEffect } from 'react';

import { useTranslations } from 'next-intl';

import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';

export default function DriverOnboarding() {
  const t = useTranslations('Onboarding');

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const hasSeenTour = localStorage.getItem('onboarding_done');
    if (hasSeenTour) return;

    const driverObj = driver({
      nextBtnText: t('nextBtnText'),
      prevBtnText: t('prevBtnText'),
      doneBtnText: t('doneBtnText'),
      animate: true,
      smoothScroll: true,
      stagePadding: 4,
      stageRadius: 20,
      popoverClass: 'aeiouly-custom',
      onDestroyed: () => {
        // Save to prevent tour from running again
        localStorage.setItem('onboarding_done', 'true');
      },
      steps: [
        {
          popover: {
            title: t('steps.welcome.title'),
            description: t('steps.welcome.description'),
            side: 'over',
            align: 'center',
          },
        },
        {
          element: '#app',
          popover: {
            title: t('steps.home.title'),
            description: t('steps.home.description'),
            side: 'right',
            align: 'start',
          },
        },
        {
          element: '#study-route',
          popover: {
            title: t('steps.studyRoute.title'),
            description: t('steps.studyRoute.description'),
            side: 'right',
            align: 'start',
          },
        },
        {
          element: '#self-study-space',
          popover: {
            title: t('steps.selfStudySpace.title'),
            description: t('steps.selfStudySpace.description'),
            side: 'right',
            align: 'start',
          },
        },
        {
          element: '#speaking-practice',
          popover: {
            title: t('steps.speakingPractice.title'),
            description: t('steps.speakingPractice.description'),
            side: 'right',
            align: 'start',
          },
        },
        {
          element: '#writing-practice',
          popover: {
            title: t('steps.writingPractice.title'),
            description: t('steps.writingPractice.description'),
            side: 'right',
            align: 'start',
          },
        },
        {
          element: '#listening-practice',
          popover: {
            title: t('steps.listeningPractice.title'),
            description: t('steps.listeningPractice.description'),
            side: 'right',
            align: 'start',
          },
        },
        {
          element: '#reading-practice',
          popover: {
            title: t('steps.readingPractice.title'),
            description: t('steps.readingPractice.description'),
            side: 'right',
            align: 'start',
          },
        },
        {
          element: '#saved-vocabulary',
          popover: {
            title: t('steps.savedVocabulary.title'),
            description: t('steps.savedVocabulary.description'),
            side: 'left',
            align: 'start',
          },
        },
        {
          element: '#profile',
          popover: {
            title: t('steps.profile.title'),
            description: t('steps.profile.description'),
            side: 'left',
            align: 'start',
          },
        },
        {
          element: '#settings',
          popover: {
            title: t('steps.settings.title'),
            description: t('steps.settings.description'),
            side: 'left',
            align: 'start',
          },
        },
        {
          popover: {
            title: t('steps.final.title'),
            description: t('steps.final.description'),
            side: 'over',
            align: 'center',
          },
        },
      ],
    });

    driverObj.drive();
  }, []);

  return null;
}
