"use client";
import { logout } from "@/app/(utils)/api";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { toast } from "react-toastify";
import useUserStore from "../../../../store/userStore";

const Navbar = () => {
  const { user, clearUser } = useUserStore();
  const { mutate, isPending, isError, error, reset } = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      toast.success("Logout Successfull");
      clearUser();
      localStorage.clear()
    },
    onError: (err) => {
      toast.error(err.message || "Something went wrong");
    },
  });

  const handleLogout = async () => {
    mutate();
  };

  return (
    <div className={"flex items-center justify-between p-5"}>
      <div className="font-black text-2xl">
        <Link href={"/blogs"}>Blogs</Link>
      </div>
      <div className="flex">
        {user?._id && (
          <div className="mr-3">
            {/* <Link href={`/my-blogs/${user?._id}`} className={"mr-2 cursor-pointer"}>My Blogs</Link> */}
            <Link href={`/addblog`} className="cursor-pointer">Create</Link>
          </div>
        )}
        {
          user?._id ? 
          <div onClick={handleLogout} className="cursor-pointer">Logout</div>:
          <Link href={`/signin`}> 
            <div className="cursor-pointer">login</div>
          </Link>
        }
      </div>
    </div>
  );
};

export default Navbar;
