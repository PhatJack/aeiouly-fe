import SettingNav from './_components/SettingNav';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container mx-auto grid w-full max-w-7xl grid-cols-1 md:grid-cols-12">
      <div className="col-span-12 md:col-span-4">
        <SettingNav />
      </div>
      <div className="col-span-12 md:col-span-8">{children}</div>
    </div>
  );
}
