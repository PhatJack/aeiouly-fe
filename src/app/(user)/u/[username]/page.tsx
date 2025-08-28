import React from "react";
import UserPage from "../_components/UserPage";

const Page = async ({ params }: { params: Promise<{ username: string }> }) => {
  const { username } = await params;
  return <UserPage username={username} />;
};

export default Page;
