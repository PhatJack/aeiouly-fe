'use client';

import React from 'react';

import Image from 'next/image';

import { Marquee } from '@/components/magicui/marquee';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ROUTE } from '@/configs/route';
import { reviews, reviews2, reviews3 } from '@/constants/home';
import { Link } from '@/i18n/routing';
import { cn } from '@/lib/utils';

import {
  ArrowRight,
  Award,
  BookMarked,
  BookOpen,
  Brain,
  CheckCircle,
  GraduationCap,
  Headphones,
  Mic,
  PenTool,
  Sparkles,
  Star,
  Users,
} from 'lucide-react';
import { motion, useScroll, useTransform } from 'motion/react';
import { useTranslations } from 'next-intl';

export default function Home() {
  const t = useTranslations('home');
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);

  const features = [
    {
      icon: GraduationCap,
      title: t('features.selfStudy.title'),
      description: t('features.selfStudy.description'),
      href: ROUTE.SPACE,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Mic,
      title: t('features.speaking.title'),
      description: t('features.speaking.description'),
      href: ROUTE.ONION,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      icon: PenTool,
      title: t('features.writing.title'),
      description: t('features.writing.description'),
      href: ROUTE.TOPIC,
      color: 'text-pink-500',
      bgColor: 'bg-pink-500/10',
      gradient: 'from-pink-500 to-rose-500',
    },
    {
      icon: Headphones,
      title: t('features.listening.title'),
      description: t('features.listening.description'),
      href: ROUTE.GYM,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
      gradient: 'from-orange-500 to-red-500',
    },
    {
      icon: BookOpen,
      title: t('features.reading.title'),
      description: t('features.reading.description'),
      href: ROUTE.READING,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
      gradient: 'from-green-500 to-emerald-500',
    },
    {
      icon: BookMarked,
      title: t('features.vocabulary.title'),
      description: t('features.vocabulary.description'),
      href: ROUTE.VOCABULARY,
      color: 'text-cyan-500',
      bgColor: 'bg-cyan-500/10',
      gradient: 'from-cyan-500 to-blue-500',
    },
  ];

  const stats = [
    { icon: Users, value: '10,000+', label: t('stats.students'), color: 'from-blue-500 to-cyan-500' },
    { icon: BookOpen, value: '5,000+', label: t('stats.lessons'), color: 'from-green-500 to-emerald-500' },
    { icon: Star, value: '4.9/5', label: t('stats.rating'), color: 'from-yellow-500 to-orange-500' },
    { icon: Award, value: '99%', label: t('stats.satisfaction'), color: 'from-pink-500 to-rose-500' },
  ];

  return (
    <div className="min-h-screen w-full overflow-hidden bg-white dark:bg-[#121212]">
      <div className="container mx-auto space-y-16 px-4 py-10 sm:px-0 sm:py-16">
        <section className="relative overflow-hidden">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <motion.div
              className="space-y-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Badge className="border-primary/20 bg-primary/5 w-fit" variant="outline">
                  <Sparkles className="mr-1 h-3 w-3" />
                  {t('hero.badge')}
                </Badge>
              </motion.div>

              <motion.h1
                className="text-foreground text-3xl leading-tight font-bold md:text-6xl dark:text-white"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                {t('hero.title')}{' '}
                <span className="from-primary bg-gradient-to-r via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {t('hero.titleBrand')}
                </span>
              </motion.h1>

              <motion.p
                className="text-muted-foreground leading-relaxed md:text-xl dark:text-gray-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                {t('hero.description')}
              </motion.p>

              <motion.div
                className="flex flex-wrap gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Link href={ROUTE.AUTH.LOGIN}>
                  <Button size="lg" className="group shadow-primary/25">
                    {t('hero.cta')}
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="relative flex justify-center lg:justify-end"
            >
              <div className="relative aspect-square size-3/4 overflow-hidden rounded-3xl">
                <Image
                  src="/mockup/hero-banner.png"
                  alt="Aeiouly Platform"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </motion.div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="relative overflow-hidden">
          {/* Animated background elements */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              className="bg-primary/5 absolute top-1/4 -left-1/4 h-96 w-96 rounded-full blur-3xl"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
            <motion.div
              className="absolute -right-1/4 bottom-1/4 h-96 w-96 rounded-full bg-purple-500/5 blur-3xl"
              animate={{
                scale: [1.2, 1, 1.2],
                opacity: [0.5, 0.3, 0.5],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          </div>

          <div className="relative">
            {/* Stats Grid */}
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-100px' }}
                  transition={{
                    delay: index * 0.15,
                    duration: 0.5,
                    ease: [0.21, 0.47, 0.32, 0.98],
                  }}
                >
                  <motion.div className="group relative h-full">
                    {/* Card glow effect */}
                    <motion.div
                      className={`bg-background absolute -inset-0.5 rounded-2xl opacity-0 blur transition-opacity duration-500 group-hover:opacity-30`}
                      initial={false}
                    />

                    {/* Card content */}
                    <div className="bg-accent border-border/50 group-hover:border-border group-hover:bg-card/90 relative flex h-full flex-col items-center justify-center gap-4 rounded-2xl border p-8 transition-all duration-300">
                      {/* Icon with gradient background */}
                      <motion.div
                        whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
                        transition={{ duration: 0.5 }}
                        className="relative"
                      >
                        <motion.div
                          className={`absolute inset-0 rounded-xl bg-gradient-to-br ${stat.color} blur-md`}
                          animate={{
                            opacity: [0.5, 0.8, 0.5],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: 'easeInOut',
                          }}
                        />
                        <div className={`relative rounded-xl bg-gradient-to-br ${stat.color} p-3`}>
                          <stat.icon className="h-8 w-8 text-white" />
                        </div>
                      </motion.div>

                      {/* Value with counter animation */}
                      <div className="text-center">
                        <motion.p
                          className="from-foreground to-foreground/70 mb-2 bg-gradient-to-br bg-clip-text text-5xl font-bold text-transparent"
                          initial={{ scale: 0, opacity: 0 }}
                          whileInView={{ scale: 1, opacity: 1 }}
                          viewport={{ once: true }}
                          transition={{
                            delay: index * 0.15 + 0.3,
                            type: 'spring',
                            stiffness: 200,
                            damping: 15,
                          }}
                        >
                          {stat.value}
                        </motion.p>
                        <motion.p
                          className="text-muted-foreground group-hover:text-foreground text-sm font-medium transition-colors duration-300"
                          initial={{ opacity: 0 }}
                          whileInView={{ opacity: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: index * 0.15 + 0.5 }}
                        >
                          {stat.label}
                        </motion.p>
                      </div>

                      {/* Bottom accent line */}
                      <motion.div
                        className={`absolute bottom-0 left-1/2 h-1 w-0 -translate-x-1/2 rounded-full bg-gradient-to-r ${stat.color}`}
                        whileHover={{ width: '80%' }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <div key={index} className="group relative">
                <div
                  className={`relative h-full cursor-pointer rounded-2xl border-2 bg-white p-8 shadow-md transition-all duration-300 ease-out dark:bg-gray-900`}
                >
                  {/* Gradient overlay on hover */}
                  <div
                    className={`absolute inset-0 rounded-2xl bg-gradient-to-br opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${feature.bgColor} `}
                  />

                  {/* Content */}
                  <div className="relative z-10">
                    {/* Icon */}
                    <div
                      className={`mb-6 inline-flex rounded-xl p-3 ${feature.bgColor} transform transition-transform duration-300`}
                    >
                      <Icon className={`h-8 w-8 ${feature.color}`} />
                    </div>

                    {/* Title */}
                    <h3 className="mb-3 text-2xl font-bold text-gray-900 dark:text-white">
                      {feature.title}
                    </h3>

                    {/* Description */}
                    <p className="mb-6 leading-relaxed text-gray-600 dark:text-gray-400">
                      {feature.description}
                    </p>

                    {/* CTA */}
                    <div
                      className={`flex items-center gap-2 text-sm font-semibold ${feature.color} transition-all duration-300`}
                    >
                      <span>{t('features.cta')}</span>
                      <ArrowRight className={`h-4 w-4 transition-transform duration-300`} />
                    </div>
                  </div>

                  {/* Corner decoration */}
                  <div
                    className={`absolute top-0 right-0 h-32 w-32 bg-gradient-to-br ${feature.bgColor} rounded-bl-full opacity-0 transition-opacity duration-300 group-hover:opacity-20`}
                  />
                </div>
              </div>
            );
          })}
        </section>

        {/* Benefits Section */}
        <section>
          <div className="">
            <div className="grid items-center gap-16 lg:grid-cols-2">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <Badge className="mb-4" variant="outline">
                  <Brain className="mr-1 h-3 w-3" />
                  {t('benefits.badge')}
                </Badge>
                <h2 className="text-foreground mb-8 text-4xl font-bold md:text-5xl dark:text-white">
                  {t('benefits.title')}
                </h2>
                <div className="space-y-5">
                  {t.raw('benefits.list').map((benefit: string, index: number) => (
                    <motion.div
                      key={index}
                      className="flex items-start gap-4"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <CheckCircle className="text-primary mt-1 h-6 w-6 shrink-0" />
                      <p className="text-muted-foreground text-lg dark:text-gray-300">{benefit}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <Card className="shadow-2xl">
                  <CardContent className="p-10">
                    <h3 className="text-foreground mb-4 text-3xl font-bold dark:text-white">
                      {t('benefits.cardTitle')}
                    </h3>
                    <p className="text-muted-foreground mb-8 text-lg leading-relaxed dark:text-gray-400">
                      {t('benefits.cardDescription')}
                    </p>
                    <Link href={ROUTE.AUTH.REGISTER}>
                      <Button size="lg" className="shadow-primary/25 w-full text-lg shadow-lg">
                        {t('benefits.cardCta')}
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Reviews Section (Chat-style) */}
        <section>
          <div className="mx-auto w-full">
            <motion.div
              className="mb-16 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Badge className="mb-4" variant="outline">
                <Star className="mr-1 h-3 w-3" />
                {t('reviews.badge')}
              </Badge>
              <h2 className="text-foreground mb-6 text-4xl font-bold md:text-5xl dark:text-white">
                {t('reviews.title')}
              </h2>
              <p className="text-muted-foreground mx-auto max-w-2xl text-lg dark:text-gray-300">
                {t('reviews.description')}
              </p>
            </motion.div>
            <div className="relative flex max-h-[600px] w-full flex-col items-center justify-center gap-4 overflow-hidden sm:flex-row">
              <Marquee vertical>
                {reviews.map((review, index) => {
                  const isRight = index % 2 === 1;
                  return (
                    <div
                      key={index}
                      className={cn(
                        'flex w-full items-start gap-5',
                        isRight ? 'justify-end' : 'justify-start'
                      )}
                    >
                      {/* Avatar */}
                      {!isRight && (
                        <div className="ring-primary/30 relative size-14 shrink-0 overflow-hidden rounded-full ring-2">
                          <Image
                            src={review.avatar}
                            alt={review.name}
                            sizes="56px"
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}

                      {/* Bubble */}
                      <div
                        className={cn(
                          'border-border relative max-w-[70%] rounded-2xl border bg-white p-4 shadow-sm dark:border-neutral-700 dark:bg-neutral-900',
                          'after:absolute after:top-5 after:h-4 after:w-4 after:rotate-45 after:bg-white dark:after:bg-neutral-900',
                          !isRight
                            ? 'after:border-border after:-left-[9px] after:border-b after:border-l dark:after:border-neutral-700'
                            : 'after:border-border after:-right-[9px] after:border-t after:border-r dark:after:border-neutral-700'
                        )}
                      >
                        <div className="mb-3 flex items-center justify-between gap-4">
                          <div>
                            <p className="text-foreground text-base font-bold dark:text-white">
                              {review.name}
                            </p>
                            <p className="text-muted-foreground text-xs dark:text-gray-400">
                              {review.role}
                            </p>
                          </div>
                          <div className="flex gap-0.5">
                            {Array.from({ length: review.rating }).map((_, i) => (
                              <Star
                                key={i}
                                className="h-4 w-4 fill-yellow-400 text-yellow-400 drop-shadow-sm"
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-muted-foreground text-sm leading-relaxed dark:text-gray-300">
                          {review.comment}
                        </p>
                      </div>

                      {isRight && (
                        <div className="ring-primary/30 relative size-14 shrink-0 overflow-hidden rounded-full ring-2">
                          <Image
                            src={review.avatar}
                            alt={review.name}
                            sizes="56px"
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </Marquee>
              <Marquee reverse className="hidden [--duration:20s] md:block" vertical>
                {reviews2.map((review, index) => {
                  const isRight = index % 2 === 1;
                  return (
                    <div
                      key={index}
                      className={cn(
                        'flex w-full items-start gap-5',
                        isRight ? 'justify-end' : 'justify-start'
                      )}
                    >
                      {/* Avatar */}
                      {!isRight && (
                        <div className="ring-primary/30 relative size-14 shrink-0 overflow-hidden rounded-full ring-2">
                          <Image
                            src={review.avatar}
                            alt={review.name}
                            fill
                            sizes="56px"
                            className="object-cover"
                          />
                        </div>
                      )}

                      {/* Bubble */}
                      <div
                        className={cn(
                          'border-border relative max-w-[70%] rounded-2xl border bg-white p-4 shadow-sm dark:border-neutral-700 dark:bg-neutral-900',
                          'after:absolute after:top-5 after:h-4 after:w-4 after:rotate-45 after:bg-white dark:after:bg-neutral-900',
                          !isRight
                            ? 'after:border-border after:-left-[9px] after:border-b after:border-l dark:after:border-neutral-700'
                            : 'after:border-border after:-right-[9px] after:border-t after:border-r dark:after:border-neutral-700'
                        )}
                      >
                        <div className="mb-3 flex items-center justify-between gap-4">
                          <div>
                            <p className="text-foreground text-base font-bold dark:text-white">
                              {review.name}
                            </p>
                            <p className="text-muted-foreground text-xs dark:text-gray-400">
                              {review.role}
                            </p>
                          </div>
                          <div className="flex gap-0.5">
                            {Array.from({ length: review.rating }).map((_, i) => (
                              <Star
                                key={i}
                                className="h-4 w-4 fill-yellow-400 text-yellow-400 drop-shadow-sm"
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-muted-foreground text-sm leading-relaxed dark:text-gray-300">
                          {review.comment}
                        </p>
                      </div>

                      {isRight && (
                        <div className="ring-primary/30 relative size-14 shrink-0 overflow-hidden rounded-full ring-2">
                          <Image
                            src={review.avatar}
                            alt={review.name}
                            fill
                            sizes="56px"
                            className="object-cover"
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </Marquee>
              <Marquee vertical className="hidden md:block">
                {reviews3.map((review, index) => {
                  const isRight = index % 2 === 1;
                  return (
                    <div
                      key={index}
                      className={cn(
                        'flex w-full items-start gap-5',
                        isRight ? 'justify-end' : 'justify-start'
                      )}
                    >
                      {/* Avatar */}
                      {!isRight && (
                        <div className="ring-primary/30 relative size-14 shrink-0 overflow-hidden rounded-full ring-2">
                          <Image
                            src={review.avatar}
                            alt={review.name}
                            fill
                            sizes="56px"
                            className="object-cover"
                          />
                        </div>
                      )}

                      {/* Bubble */}
                      <div
                        className={cn(
                          'border-border relative max-w-[70%] rounded-2xl border bg-white p-4 shadow-sm dark:border-neutral-700 dark:bg-neutral-900',
                          'after:absolute after:top-5 after:h-4 after:w-4 after:rotate-45 after:bg-white dark:after:bg-neutral-900',
                          !isRight
                            ? 'after:border-border after:-left-[9px] after:border-b after:border-l dark:after:border-neutral-700'
                            : 'after:border-border after:-right-[9px] after:border-t after:border-r dark:after:border-neutral-700'
                        )}
                      >
                        <div className="mb-3 flex items-center justify-between gap-4">
                          <div>
                            <p className="text-foreground text-base font-bold dark:text-white">
                              {review.name}
                            </p>
                            <p className="text-muted-foreground text-xs dark:text-gray-400">
                              {review.role}
                            </p>
                          </div>
                          <div className="flex gap-0.5">
                            {Array.from({ length: review.rating }).map((_, i) => (
                              <Star
                                key={i}
                                className="h-4 w-4 fill-yellow-400 text-yellow-400 drop-shadow-sm"
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-muted-foreground text-sm leading-relaxed dark:text-gray-300">
                          {review.comment}
                        </p>
                      </div>

                      {isRight && (
                        <div className="ring-primary/30 relative size-14 shrink-0 overflow-hidden rounded-full ring-2">
                          <Image
                            src={review.avatar}
                            alt={review.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </Marquee>
              <div className="pointer-events-none absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-white dark:from-[#121212]"></div>
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-white dark:from-[#121212]"></div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
