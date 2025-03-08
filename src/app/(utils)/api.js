const fetchBlogs = async () => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/bloglisting`, {
            cache: "no-store"
        });

        if (!response.ok) {
            throw new Error("Failed to fetch blogs");
        }

        const blogData = await response.json();
        return blogData.blogs; 
    } catch (err) {
        console.error("Error fetching blogs:", err);
        return []; 
    }
}

const signUp = async (data) => {
    try{
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/signup`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        });
        const result = await response.json(); 

        if (!response.ok) {
            throw new Error(result.error || "Something went wrong");
        }

        return result;
    }catch(error){
        throw error;
    }
}

const signIn = async (data) => {
    try{
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/signin`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        });
        const result = await response.json(); 
        if(response.ok){
            localStorage.setItem("user", JSON.stringify(result.user));
            localStorage.setItem("jwtoken", JSON.stringify(result.jwtoken));
        }

        if (!response.ok) {
            throw new Error(result.error || "Something went wrong");
        }

        return result;
    }catch(error){
        throw error;
    }
}

const logout = async (data) => {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/logout`, { method: "POST" });
        const data = await res.json();
        alert(data.message);
    } catch (error) {
        console.error("Logout Failed", error);
    }
}

const createblogs = async (data) => {
    try{
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/createblogs`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        });
        const result = await response.json(); 

        if (!response.ok) {
            throw new Error(result.error || "Something went wrong");
        }

        return result;
    }catch(error){
        throw error;
    }
}

const fetchBlogById = async (id) => {
    try {
        if (!id) {
            return null;
        }
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/${id}`, {
        cache: "no-store", 
      });
  
      if (!response.ok) {
        throw new Error("Failed to fetch blog details");
      }
  
      return await response.json();
    } catch (err) {
      console.error("Error fetching blog details:", err);
      return null;
    }
};

const deleteBlogById = async (del) => {
    try{
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/${del}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        });
        const result = await response.json(); 

        if (!response.ok) {
            throw new Error(result.error || "Something went wrong");
        }

        return result;
    }catch(error){
        throw error;
    }
}


export {fetchBlogs, signUp, signIn, logout, createblogs, fetchBlogById}