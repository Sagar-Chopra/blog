import React from 'react'
import { fetchBlogById } from '@/app/(utils)/api';
import Image from 'next/image';

const page = async ({ params }) => {
  const { id } = await params || { id: '' };
  const blog = await fetchBlogById(id);

  if (!blog) {
    return <p>Blog not found</p>;
  }

  if (!id) {
    return <p>Blog not found</p>;
  }
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">{blog.title}</h1>
      <p className="text-gray-600">{blog.description}</p>
      <div className="relative w-full h-80 mt-4">
        <Image
          src={`${blog.image}`}
          alt={blog.title}
          width={30}
          height={30}
          // layout="fill"
          // objectFit="cover"
          className="rounded-md"
        />
      </div>
    </div>
  );
}

export default page