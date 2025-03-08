"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import Spinner from "../(components)/spinner/page";
import { signUp } from "../(utils)/api";
import { useMutation } from "@tanstack/react-query";

const page = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { mutate, isPending, isError, error, reset } = useMutation({
    mutationFn: signUp,
    onSuccess: () => {
      toast.success("Registration Successful");
      router.push("/signin");
    },
    onError: (err) => {
      toast.error(err.message || "Something went wrong");
    },
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      password: Yup.string()
        .min(5, "Password must be at least 5 characters")
        .required("Password is required"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "Passwords must match")
        .required("Confirm Password is required"),
    }),
    onSubmit: async (values) => {
      mutate({
        name: values.name,
        email: values.email,
        password: values.password,
        cpassword: values.confirmPassword,
      });
    },
  });

  return (
    <form
      className="registration-form border-2 border-gray-200 rounded-lg p-6 shadow-lg max-w-md mx-auto bg-white"
      onSubmit={formik.handleSubmit}
    >
      <h2 className="text-2xl font-semibold text-gray-700 text-center mb-6">
        Registration Form
      </h2>
      <div className="form-group mb-4">
        <label htmlFor="name" className="block text-gray-600 font-medium mb-1">
          Name:
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formik.values.name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        {formik.touched.name && formik.errors.name && (
          <div className="text-red-500 text-sm mt-1">{formik.errors.name}</div>
        )}
      </div>
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
      <div className="form-group mb-4">
        <label
          htmlFor="confirmPassword"
          className="block text-gray-600 font-medium mb-1"
        >
          Confirm Password:
        </label>
        <input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          value={formik.values.confirmPassword}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        {formik.touched.confirmPassword && formik.errors.confirmPassword && (
          <div className="text-red-500 text-sm mt-1">
            {formik.errors.confirmPassword}
          </div>
        )}
      </div>
      <button
        type="submit"
        disabled={loading}
        className={`w-full bg-blue-600 text-white p-3 rounded-md font-semibold transition hover:bg-blue-700 flex justify-center items-center ${
          loading ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {loading ? <Spinner className="w-5 h-5 mr-2" /> : "Register"}
      </button>
    </form>
  );
};

export default page;
