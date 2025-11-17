'use client';

import React from 'react';

import Image from 'next/image';
import Link from 'next/link';

import { Marquee } from '@/components/magicui/marquee';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ROUTE } from '@/configs/route';
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
  Play,
  Sparkles,
  Star,
  Target,
  Trophy,
  Users,
  Zap,
} from 'lucide-react';
import { motion, useScroll, useTransform } from 'motion/react';

const features = [
  {
    icon: GraduationCap,
    title: 'Không gian tự học',
    description: 'Học tập linh hoạt với nội dung được cá nhân hóa theo trình độ của bạn',
    href: ROUTE.SPACE,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Mic,
    title: 'Luyện phát âm',
    description: 'Cải thiện kỹ năng nói với AI phản hồi thời gian thực',
    href: ROUTE.ONION,
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    icon: PenTool,
    title: 'Luyện viết',
    description: 'Nâng cao kỹ năng viết với các chủ đề đa dạng và phản hồi chi tiết',
    href: ROUTE.TOPIC,
    color: 'text-pink-500',
    bgColor: 'bg-pink-500/10',
    gradient: 'from-pink-500 to-rose-500',
  },
  {
    icon: Headphones,
    title: 'Luyện nghe',
    description: 'Rèn luyện khả năng nghe hiểu qua các bài học phong phú',
    href: ROUTE.GYM,
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/10',
    gradient: 'from-orange-500 to-red-500',
  },
  {
    icon: BookOpen,
    title: 'Luyện đọc',
    description: 'Mở rộng vốn từ và khả năng đọc hiểu với các bài đọc thú vị',
    href: ROUTE.READING,
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
    gradient: 'from-green-500 to-emerald-500',
  },
  {
    icon: BookMarked,
    title: 'Từ vựng cá nhân',
    description: 'Quản lý và học từ vựng hiệu quả với flashcard và quiz',
    href: ROUTE.VOCABULARY,
    color: 'text-cyan-500',
    bgColor: 'bg-cyan-500/10',
    gradient: 'from-cyan-500 to-blue-500',
  },
];

const reviews = [
  {
    name: 'Nguyễn Minh Anh',
    avatar: '/logo.png',
    rating: 5,
    comment: 'Aeiouly đã giúp mình cải thiện tiếng Anh rất nhiều! Giao diện đẹp, dễ sử dụng.',
    role: 'Sinh viên',
  },
  {
    name: 'Trần Hoàng Long',
    avatar: '/logo.png',
    rating: 5,
    comment: 'Tính năng luyện nói với AI thật tuyệt vời. Mình tự tin hơn rất nhiều khi giao tiếp.',
    role: 'Nhân viên văn phòng',
  },
  {
    name: 'Phạm Thu Hà',
    avatar: '/logo.png',
    rating: 5,
    comment: 'Cách học linh hoạt, phù hợp với lịch trình bận rộn. Highly recommended!',
    role: 'Giáo viên',
  },
  {
    name: 'Lê Quang Huy',
    avatar: '/logo.png',
    rating: 5,
    comment: 'Bài học được cá nhân hóa theo trình độ rất tốt. Học hiệu quả hơn nhiều.',
    role: 'Học sinh',
  },
  {
    name: 'Võ Thị Mai',
    avatar: '/logo.png',
    rating: 5,
    comment: 'Flashcard và quiz rất hữu ích cho việc ghi nhớ từ vựng. Love it!',
    role: 'Freelancer',
  },
  {
    name: 'Đặng Văn Nam',
    avatar: '/logo.png',
    rating: 5,
    comment: 'Tính năng luyện viết với phản hồi chi tiết giúp mình tiến bộ nhanh chóng.',
    role: 'Developer',
  },
];

const stats = [
  { icon: Users, value: '10,000+', label: 'Học viên', color: 'from-blue-500 to-cyan-500' },
  { icon: BookOpen, value: '5,000+', label: 'Bài học', color: 'from-green-500 to-emerald-500' },
  { icon: Star, value: '4.9/5', label: 'Đánh giá', color: 'from-yellow-500 to-orange-500' },
  { icon: Award, value: '99%', label: 'Hài lòng', color: 'from-pink-500 to-rose-500' },
];

const benefits = [
  'Học mọi lúc, mọi nơi với ứng dụng web',
  'Nội dung được cá nhân hóa theo trình độ',
  'Phản hồi thời gian thực từ AI',
  'Theo dõi tiến độ học tập chi tiết',
  'Kho tài liệu đa dạng và phong phú',
  'Cộng đồng học viên năng động',
];

const FloatingElement = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <motion.div
    className={cn('absolute', className)}
    animate={{
      y: [0, -20, 0],
      rotate: [0, 5, 0],
    }}
    transition={{
      duration: 6,
      repeat: Infinity,
      ease: 'easeInOut',
    }}
  >
    {children}
  </motion.div>
);

export default function Home() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);

  return (
    <div className="mx-auto min-h-screen w-full overflow-hidden">
      <section className="relative overflow-hidden px-6 py-20 md:py-32">
        <motion.div className="absolute inset-0 -z-10" style={{ y }}>
          <div className="from-primary/5 absolute inset-0 bg-gradient-to-br via-purple-500/5 to-pink-500/5" />
          <motion.div
            className="bg-primary/10 absolute top-1/4 left-1/4 h-96 w-96 rounded-full blur-3xl"
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
            className="absolute right-1/4 bottom-1/4 h-96 w-96 rounded-full bg-purple-500/10 blur-3xl"
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
          {/* Floating Elements */}
          <FloatingElement className="top-20 left-10">
            <div className="h-4 w-4 rounded-full bg-blue-500/20 blur-sm" />
          </FloatingElement>
          <FloatingElement className="top-40 right-20">
            <div className="h-6 w-6 rounded-full bg-purple-500/20 blur-sm" />
          </FloatingElement>
          <FloatingElement className="bottom-32 left-1/3">
            <div className="h-3 w-3 rounded-full bg-pink-500/20 blur-sm" />
          </FloatingElement>
        </motion.div>

        <div className="container mx-auto max-w-7xl">
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
                  Nền tảng học tiếng Anh thông minh
                </Badge>
              </motion.div>

              <motion.h1
                className="text-foreground text-5xl leading-tight font-bold md:text-6xl lg:text-7xl dark:text-white"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                Chinh phục tiếng Anh cùng{' '}
                <span className="from-primary bg-gradient-to-r via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Aeiouly
                </span>
              </motion.h1>

              <motion.p
                className="text-muted-foreground text-lg leading-relaxed md:text-xl dark:text-gray-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                Học tiếng Anh hiệu quả với công nghệ AI, nội dung cá nhân hóa và phương pháp học tập
                khoa học. Tự tin giao tiếp chỉ sau vài tuần!
              </motion.p>

              <motion.div
                className="flex flex-wrap gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Link href={ROUTE.AUTH.LOGIN}>
                  <Button size="lg" className="group shadow-primary/25 text-base shadow-lg">
                    Bắt đầu học ngay
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </motion.div>
            </motion.div>

            <div className="relative">
              <div className="relative aspect-square overflow-hidden rounded-3xl shadow-2xl">
                <Image
                  src="/logo.png"
                  alt="Aeiouly Platform"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <motion.div
                className="from-primary/20 absolute -right-6 -bottom-6 -z-10 h-full w-full rounded-3xl bg-gradient-to-br to-purple-600/20 blur-3xl"
                animate={{
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="from-background via-muted/20 to-background relative overflow-hidden bg-gradient-to-b px-6 py-24">
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

        <div className="relative container mx-auto max-w-7xl">
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
                    className={`absolute -inset-0.5 rounded-2xl bg-gradient-to-r ${stat.color} opacity-0 blur transition-opacity duration-500 group-hover:opacity-30`}
                    initial={false}
                  />

                  {/* Card content */}
                  <div className="border-border/50 bg-card/80 group-hover:border-border group-hover:bg-card/90 relative flex h-full flex-col items-center justify-center gap-6 rounded-2xl border p-8 backdrop-blur-sm transition-all duration-300 group-hover:shadow-2xl">
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
      <section className="px-6 py-20">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            className="mb-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Badge className="mb-4" variant="outline">
              Tính năng nổi bật
            </Badge>
            <h2 className="text-foreground mb-6 text-4xl font-bold md:text-5xl dark:text-white">
              Học tiếng Anh toàn diện
            </h2>
            <p className="text-muted-foreground mx-auto max-w-2xl text-lg dark:text-gray-300">
              Phát triển đồng đều 4 kỹ năng với công nghệ AI tiên tiến
            </p>
          </motion.div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link href={feature.href}>
                  <Card className="group h-full shadow-lg transition-all hover:-translate-y-2 hover:shadow-2xl">
                    <CardContent className="flex flex-col items-start gap-4 p-6">
                      <motion.div
                        className={cn('rounded-xl p-4 shadow-md', feature.bgColor)}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                      >
                        <feature.icon className={cn('h-7 w-7', feature.color)} />
                      </motion.div>
                      <div>
                        <h3 className="text-foreground mb-3 text-xl font-bold dark:text-white">
                          {feature.title}
                        </h3>
                        <p className="text-muted-foreground leading-relaxed dark:text-gray-400">
                          {feature.description}
                        </p>
                      </div>
                      <motion.div
                        className="flex items-center gap-2"
                        initial={{ opacity: 0 }}
                        whileHover={{ opacity: 1 }}
                      >
                        <span className="text-primary text-sm font-medium">Khám phá ngay</span>
                        <ArrowRight className="text-primary h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </motion.div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="px-6 py-20">
        <div className="container mx-auto max-w-7xl">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Badge className="mb-4" variant="outline">
                <Brain className="mr-1 h-3 w-3" />
                Phương pháp học thông minh
              </Badge>
              <h2 className="text-foreground mb-8 text-4xl font-bold md:text-5xl dark:text-white">
                Tại sao chọn Aeiouly?
              </h2>
              <div className="space-y-5">
                {benefits.map((benefit, index) => (
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
                    Bắt đầu hành trình của bạn
                  </h3>
                  <p className="text-muted-foreground mb-8 text-lg leading-relaxed dark:text-gray-400">
                    Tham gia cùng hàng nghìn học viên đã cải thiện tiếng Anh với Aeiouly. Hoàn toàn
                    miễn phí!
                  </p>
                  <Link href={ROUTE.AUTH.REGISTER}>
                    <Button size="lg" className="shadow-primary/25 w-full text-lg shadow-lg">
                      Đăng ký ngay
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="overflow-hidden px-6 py-20">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            className="mb-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Badge className="mb-4" variant="outline">
              <Star className="mr-1 h-3 w-3" />
              Học viên nói gì
            </Badge>
            <h2 className="text-foreground mb-6 text-4xl font-bold md:text-5xl dark:text-white">
              Được yêu thích bởi cộng đồng
            </h2>
            <p className="text-muted-foreground mx-auto max-w-2xl text-lg dark:text-gray-300">
              Hàng nghìn học viên đã tin tưởng và đạt được mục tiêu với Aeiouly
            </p>
          </motion.div>
          <Marquee pauseOnHover className="[--duration:40s]">
            {reviews.map((review, index) => (
              <Card
                key={index}
                className="w-[380px] border-none shadow-lg transition-all hover:shadow-2xl"
              >
                <CardContent className="p-7">
                  <div className="mb-5 flex items-center gap-4">
                    <div className="ring-primary/20 relative h-14 w-14 overflow-hidden rounded-full ring-2">
                      <Image src={review.avatar} alt={review.name} fill className="object-cover" />
                    </div>
                    <div>
                      <p className="text-foreground text-lg font-bold dark:text-white">
                        {review.name}
                      </p>
                      <p className="text-muted-foreground text-sm dark:text-gray-400">
                        {review.role}
                      </p>
                    </div>
                  </div>
                  <div className="mb-4 flex gap-1">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-muted-foreground leading-relaxed dark:text-gray-300">
                    {review.comment}
                  </p>
                </CardContent>
              </Card>
            ))}
          </Marquee>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Card className="from-primary/10 border-none bg-gradient-to-br via-purple-500/10 to-pink-500/10 shadow-2xl">
              <CardContent className="p-16 text-center">
                <motion.h2
                  className="text-foreground mb-6 text-4xl font-bold md:text-5xl dark:text-white"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                >
                  Sẵn sàng bắt đầu chưa?
                </motion.h2>
                <motion.p
                  className="text-muted-foreground mb-10 text-xl dark:text-gray-300"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                >
                  Tham gia Aeiouly ngay hôm nay và trải nghiệm phương pháp học tiếng Anh hiện đại
                  nhất
                </motion.p>
                <motion.div
                  className="flex flex-wrap justify-center gap-4"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                >
                  <Link href={ROUTE.AUTH.REGISTER}>
                    <Button size="lg" className="group shadow-primary/25 text-lg shadow-lg">
                      Đăng ký miễn phí
                      <Sparkles className="ml-2 h-5 w-5 transition-transform group-hover:rotate-12" />
                    </Button>
                  </Link>
                  <Link href={ROUTE.AUTH.LOGIN}>
                    <Button size="lg" variant="outline" className="text-lg">
                      Đã có tài khoản
                    </Button>
                  </Link>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
