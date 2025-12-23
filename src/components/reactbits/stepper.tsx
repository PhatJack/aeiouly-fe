'use client';

import React, {
  Children,
  HTMLAttributes,
  ReactNode,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';

import { cn } from '@/lib/utils';

import { AnimatePresence, Variants, motion } from 'motion/react';

import { Button } from '../ui/button';
import { Progress } from '../ui/progress';

interface StepperProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  initialStep?: number;
  onStepChange?: (step: number) => void;
  onFinalStepCompleted?: () => void;
  stepCircleContainerClassName?: string;
  stepContainerClassName?: string;
  contentClassName?: string;
  footerClassName?: string;
  backButtonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;
  nextButtonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;
  backButtonText?: string;
  nextButtonText?: string;
  disableStepIndicators?: boolean;
  stepIndicatorStyle?: 'ball' | 'progress';
  renderStepIndicator?: (props: {
    step: number;
    currentStep: number;
    onStepClick: (clicked: number) => void;
  }) => ReactNode;
}

export default function Stepper({
  children,
  initialStep = 1,
  onStepChange = () => {},
  onFinalStepCompleted = () => {},
  stepCircleContainerClassName = '',
  stepContainerClassName = '',
  contentClassName = '',
  footerClassName = '',
  backButtonProps = {},
  nextButtonProps = {},
  backButtonText = 'Quay lại',
  nextButtonText = 'Tiếp tục',
  disableStepIndicators = false,
  renderStepIndicator,
  stepIndicatorStyle = 'ball',
  ...rest
}: StepperProps) {
  const [currentStep, setCurrentStep] = useState<number>(initialStep);
  const [direction, setDirection] = useState<number>(0);
  const stepsArray = Children.toArray(children);
  const totalSteps = stepsArray.length;
  const isCompleted = currentStep > totalSteps;
  const isLastStep = currentStep === totalSteps;

  const updateStep = (newStep: number) => {
    setCurrentStep(newStep);
    if (newStep > totalSteps) {
      onFinalStepCompleted();
    } else {
      onStepChange(newStep);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setDirection(-1);
      updateStep(currentStep - 1);
    }
  };

  const handleNext = () => {
    if (!isLastStep) {
      setDirection(1);
      updateStep(currentStep + 1);
    }
  };

  const handleComplete = () => {
    setDirection(1);
    updateStep(totalSteps + 1);
  };

  return (
    <div className="flex min-h-full flex-1 flex-col items-center justify-center" {...rest}>
      <div className={cn(`mx-auto w-full rounded-4xl`, stepCircleContainerClassName)}>
        <div
          className={cn(
            `flex w-full items-center`,
            stepContainerClassName,
            stepIndicatorStyle === 'progress' ? 'p-4' : 'p-8'
          )}
        >
          {stepIndicatorStyle === 'progress' ? (
            <div className="relative flex w-full items-center gap-2">
              <Progress className="flex-1" value={((currentStep - 1) / (totalSteps - 1)) * 100} />
              <p className="w-[10%] text-right text-lg font-medium">
                {Math.min(currentStep, totalSteps)} / {totalSteps}
              </p>
            </div>
          ) : (
            stepsArray.map((_, index) => {
              const stepNumber = index + 1;
              const isNotLastStep = index < totalSteps - 1;
              return (
                <React.Fragment key={stepNumber}>
                  {renderStepIndicator ? (
                    renderStepIndicator({
                      step: stepNumber,
                      currentStep,
                      onStepClick: (clicked) => {
                        setDirection(clicked > currentStep ? 1 : -1);
                        updateStep(clicked);
                      },
                    })
                  ) : (
                    <StepIndicator
                      step={stepNumber}
                      disableStepIndicators={disableStepIndicators}
                      currentStep={currentStep}
                      onClickStep={(clicked) => {
                        setDirection(clicked > currentStep ? 1 : -1);
                        updateStep(clicked);
                      }}
                    />
                  )}
                  {isNotLastStep && <StepConnector isComplete={currentStep > stepNumber} />}
                </React.Fragment>
              );
            })
          )}
        </div>

        <StepContentWrapper
          isCompleted={isCompleted}
          currentStep={currentStep}
          direction={direction}
          className={cn(
            `space-y-2`,
            contentClassName,
            stepIndicatorStyle === 'progress' ? 'px-4' : 'px-8'
          )}
        >
          {stepsArray[currentStep - 1]}
        </StepContentWrapper>

        {!isCompleted && (
          <div className={`px-8 pb-8 ${footerClassName}`}>
            <div
              className={`mt-10 flex w-full ${currentStep !== 1 ? 'justify-between' : 'justify-end'}`}
            >
              {currentStep !== 1 && (
                <Button
                  variant={'ghost'}
                  onClick={handleBack}
                  size={'lg'}
                  className={`w-1/2 rounded-full px-2 py-1 transition duration-350 ${
                    currentStep === 1
                      ? 'pointer-events-none text-neutral-400 opacity-50'
                      : 'text-neutral-400 hover:text-neutral-700'
                  }`}
                  {...backButtonProps}
                >
                  {backButtonText}
                </Button>
              )}
              <Button
                className={'w-1/2 rounded-full transition-[width]'}
                size={'lg'}
                onClick={isLastStep ? handleComplete : handleNext}
                {...nextButtonProps}
              >
                {isLastStep ? 'Hoàn Thành' : nextButtonText}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

interface StepContentWrapperProps {
  isCompleted: boolean;
  currentStep: number;
  direction: number;
  children: ReactNode;
  className?: string;
}

function StepContentWrapper({
  isCompleted,
  currentStep,
  direction,
  children,
  className = '',
}: StepContentWrapperProps) {
  const [parentHeight, setParentHeight] = useState<number>(0);

  return (
    <motion.div
      style={{ position: 'relative', overflow: 'hidden' }}
      animate={{ height: isCompleted ? 0 : parentHeight }}
      transition={{ type: 'spring', duration: 0.4 }}
      className={className}
    >
      <AnimatePresence initial={false} mode="sync" custom={direction}>
        {!isCompleted && (
          <SlideTransition
            key={currentStep}
            direction={direction}
            onHeightReady={(h) => setParentHeight(h)}
          >
            {children}
          </SlideTransition>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

interface SlideTransitionProps {
  children: ReactNode;
  direction: number;
  onHeightReady: (height: number) => void;
}

function SlideTransition({ children, direction, onHeightReady }: SlideTransitionProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    if (containerRef.current) {
      onHeightReady(containerRef.current.offsetHeight);
    }
  }, [children, onHeightReady]);

  return (
    <motion.div
      ref={containerRef}
      custom={direction}
      variants={stepVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.4 }}
      style={{ position: 'absolute', left: 0, right: 0, top: 0 }}
    >
      {children}
    </motion.div>
  );
}

const stepVariants: Variants = {
  enter: (dir: number) => ({
    x: dir >= 0 ? '-100%' : '100%',
    opacity: 0,
  }),
  center: {
    x: '0%',
    opacity: 1,
  },
  exit: (dir: number) => ({
    x: dir >= 0 ? '50%' : '-50%',
    opacity: 0,
  }),
};

interface StepProps {
  children: ReactNode;
}

export function Step({ children }: StepProps) {
  return <div className="px-4">{children}</div>;
}

interface StepIndicatorProps {
  step: number;
  currentStep: number;
  onClickStep: (clicked: number) => void;
  disableStepIndicators?: boolean;
}

function StepIndicator({
  step,
  currentStep,
  onClickStep,
  disableStepIndicators = false,
}: StepIndicatorProps) {
  const status = currentStep === step ? 'active' : currentStep < step ? 'inactive' : 'complete';

  const handleClick = () => {
    if (step !== currentStep && !disableStepIndicators) {
      onClickStep(step);
    }
  };

  const circleClass = cn(
    'flex h-8 w-8 items-center justify-center rounded-full font-semibold transition-colors',
    status === 'active'
      ? 'bg-primary text-white shadow-md'
      : status === 'complete'
        ? 'bg-primary text-white shadow'
        : 'bg-transparent border border-neutral-300 text-neutral-700 dark:border-neutral-600 dark:text-neutral-300'
  );

  return (
    <motion.div
      onClick={handleClick}
      className="relative cursor-pointer outline-none focus:outline-none"
      animate={{ scale: status === 'active' ? 1.05 : 1 }}
      initial={false}
    >
      <div className={circleClass}>
        {status === 'complete' ? (
          <CheckIcon className="h-4 w-4" />
        ) : status === 'active' ? (
          <div className="h-3 w-3 rounded-full bg-white" />
        ) : (
          <span className="text-sm">{step}</span>
        )}
      </div>
    </motion.div>
  );
}

interface StepConnectorProps {
  isComplete: boolean;
}

function StepConnector({ isComplete }: StepConnectorProps) {
  const lineVariants: Variants = {
    incomplete: { width: 0 },
    complete: { width: '100%' },
  };

  return (
    <div className="relative mx-2 h-0.5 flex-1 overflow-hidden rounded bg-neutral-200 dark:bg-neutral-700">
      <motion.div
        className="bg-primary/80 absolute top-0 left-0 h-full"
        variants={lineVariants}
        initial={false}
        animate={isComplete ? 'complete' : 'incomplete'}
        transition={{ duration: 0.4 }}
      />
    </div>
  );
}

interface CheckIconProps extends React.SVGProps<SVGSVGElement> {}

function CheckIcon(props: CheckIconProps) {
  return (
    <svg {...props} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <motion.path
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{
          delay: 0.1,
          type: 'tween',
          ease: 'easeOut',
          duration: 0.3,
        }}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 13l4 4L19 7"
      />
    </svg>
  );
}
