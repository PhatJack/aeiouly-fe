import React from "react";

interface UserPageProps {
  username: string;
}

const UserPage = ({ username }: UserPageProps) => {
  return <div>{username}</div>;
};

export default UserPage;
