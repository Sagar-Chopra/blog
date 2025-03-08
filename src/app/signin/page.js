"use client";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import Spinner from "../(components)/spinner/page";
import { signIn } from "../(utils)/api";
import { useMutation } from "@tanstack/react-query";
import useUserStore from "../../../store/userStore";
import Link from "next/link";

const page = () => {
  const router = useRouter();
  const { setUser } = useUserStore();

  const { mutate, isPending, isError, error, reset } = useMutation({
    mutationFn: signIn,
    onSuccess: (data) => {
      toast.success("Login Successful");
      setUser(data.user);
      router.push("/blogs");
    },
    onError: (err) => {
      toast.error(err.message || "Something went wrong");
    },
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      password: Yup.string()
        .min(5, "Password must be at least 5 characters")
        .required("Password is required"),
    }),
    onSubmit: async (values) => {
      mutate({
        email: values.email,
        password: values.password,
      });
    },
  });

  return (
    <form
      className="registration-form border-2 border-gray-200 rounded-lg p-6 shadow-lg max-w-md mx-auto bg-white"
      onSubmit={formik.handleSubmit}
    >
      <h2 className="text-2xl font-semibold text-gray-700 text-center mb-6">
        Login
      </h2>
      <div className="form-group mb-4">
        <label htmlFor="email" className="block text-gray-600 font-medium mb-1">
          Email:
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        {formik.touched.email && formik.errors.email && (
          <div className="text-red-500 text-sm mt-1">{formik.errors.email}</div>
        )}
      </div>
      <div className="form-group mb-4">
        <label
          htmlFor="password"
          className="block text-gray-600 font-medium mb-1"
        >
          Password:
        </label>
        <input
          type="password"
          id="password"
          name="password"
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        {formik.touched.password && formik.errors.password && (
          <div className="text-red-500 text-sm mt-1">
            {formik.errors.password}
          </div>
        )}
      </div>
      <button
        type="submit"
        disabled={isPending}
        className={`w-full bg-blue-600 text-white p-3 rounded-md font-semibold transition hover:bg-blue-700 ${
          isPending ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {isPending ? <Spinner /> : "Login"}
      </button>
      <p className="mt-2">
        Not Have Accout 
        <Link href={`/signup`} className="ml-2 text-green-950">
          SignUP
        </Link>
      </p>
    </form>
  );
};

export default page;
