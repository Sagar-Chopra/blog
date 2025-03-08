import Image from "next/image";
import Link from "next/link";
import { fetchBlogs } from "../(utils)/api";
import Welcomecompoent from "./component/Welcomecompoent";
import DeleteBlog from "./component/DeleteBlog";


const Page = async () => {
  const blogs = await fetchBlogs();

  return (
    <div className="w-[80%] mx-auto">
      {/* <div className="text-center">
        <Welcomecompoent /> 
      </div> */}
      <ul>
        {blogs.length > 0 ? (
          blogs.map((blog) => (
            <li key={blog._id} className="border p-4 rounded-md shadow-md mb-4">
              <Link href={`/blog/${blog._id}`}>
                <h2 className="text-lg font-semibold">{blog.title}</h2>
                <h2 className="text-lg font-semibold">{blog._id}</h2> 
              <p className="text-gray-600">{blog.description}</p>
              <div className="relative w-full h-60 mt-2">
                <Image
                  src={blog.image}
                  alt={blog.title}
                  layout="fill"
                  objectFit="cover"
                  priority={false}
                  className="rounded-md"
                />
              </div>
              </Link>
              <DeleteBlog blog={blog} />
            </li>
          ))
        ) : (
          <p>No blogs found.</p>
        )}
      </ul>
    </div>
  );
};

export default Page;
