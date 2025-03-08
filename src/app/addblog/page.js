"use client";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import Spinner from "../(components)/spinner/page";
import { createblogs } from "../(utils)/api";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

const page = () => {
  const router = useRouter();
  const [imageBase64, setImageBase64] = useState("");

  const { mutate, isPending, isError, error, reset } = useMutation({
    mutationFn: createblogs,
    onSuccess: () => {
      toast.success("Blog created successfully");
      router.push("/blogs");
    },
    onError: (err) => {
      console.log(err.message);
      toast.error(err.message || "Something went wrong");
    },
  });

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = () => {
      setImageBase64(reader.result);
    };
  };

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      creator: "",
    },
    validationSchema: Yup.object({
      title: Yup.string().required("title is required"),
      description: Yup.string()
        .min(10, "description must be at least 10 characters")
        .max(100, "description must not be greator than 100 characters")
        .required("description is required"),
    }),
    onSubmit: async (values) => {
      if (!imageBase64) {
        toast.error("Please upload an image.");
        return;
      }
      // console.log(values);
      const user = JSON.parse(localStorage.getItem("user"));
      var creatorName = user ? user.name : null;
      var creatorId = user ? user._id : null;
      mutate({
        title: values.title,
        description: values.description,
        creator: creatorId,
        creatorName: creatorName,
        image: imageBase64,
      });
    },
  });

  return (
    <form className="max-w-md mx-auto bg-white p-6 shadow-lg rounded-lg border border-gray-200"
    onSubmit={formik.handleSubmit}>
      <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">Registration Form</h2>
      <div className="mb-4">
        <label htmlFor="title" className="block text-gray-600 font-medium mb-1">
          Title:
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formik.values.title}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-400"
        />
        {formik.touched.title && formik.errors.title && (
          <div className="text-red-500 text-sm mt-1">{formik.errors.title}</div>
        )}
      </div>
      <div className="mb-4">
        <label htmlFor="description" className="block text-gray-600 font-medium mb-1">
          Description:
        </label>
        <input
          type="text"
          id="description"
          name="description"
          value={formik.values.description}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-400"
        />
        {formik.touched.description && formik.errors.description && (
          <div className="text-red-500 text-sm mt-1">{formik.errors.description}</div>
        )}
      </div>
      <div className="mb-4">
        <label className="block text-gray-600 font-medium mb-1">Upload Image:</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="block w-full text-gray-700 border rounded-md p-2 cursor-pointer file:bg-blue-600 file:text-white file:border-none file:rounded-md file:py-2 file:px-4 file:cursor-pointer hover:file:bg-blue-700"
        />
      </div>
      {imageBase64 && (
        <div className="mb-4 flex justify-center">
          <img
            src={imageBase64}
            alt="Preview"
            className="w-32 h-32 object-cover rounded-md border"
          />
        </div>
      )}
      <button
        type="submit"
        disabled={isPending}
        className={`w-full bg-blue-600 text-white p-3 rounded-md font-semibold transition hover:bg-blue-700 flex justify-center items-center ${
          isPending ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {isPending ? <Spinner className="w-5 h-5 mr-2" /> : "Create"}
      </button>
    </form>
  );
};

export default page;



