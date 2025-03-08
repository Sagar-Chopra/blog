"use client";

import React from "react";
import { useMutation } from "@tanstack/react-query";
import useUserStore from "../../../../store/userStore";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

const DeleteBlog = ({ blog }) => {
  const router = useRouter();
  const { user } = useUserStore();
  const { mutate, isLoading } = useMutation({
    mutationFn: async () => {
      const token = localStorage.getItem("jwtoken").slice(1, -1);

      console.log("tojen", token);
      const res = await fetch(`/api/${blog._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to delete blog");
      }

      return res.json();
    },
    onSuccess: () => {
      toast.success("Blog deleted successfully");
      router.refresh();
    },
    onError: (error) => {
      toast.error(error.message, "random");
    },
  });
  return (
    <>
      {user?._id === blog?.creator && (
        <button
          className="bg-red-500 text-white px-4 py-2 rounded-md mt-2"
          onClick={() => mutate()}
          disabled={isLoading}
        >
          {isLoading ? "Deleting..." : "Delete"}
        </button>
      )}
    </>
  );
};

export default DeleteBlog;
