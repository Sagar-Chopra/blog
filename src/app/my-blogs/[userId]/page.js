import React from "react";
import { redirect } from "next/dist/server/api-utils";

const page = async ({ params }) => {
  const { userId } = await params;

  if (!userId) {
    redirect("/blogs");
  }

  return <div>Welcome to profile</div>;
};

export default page;
