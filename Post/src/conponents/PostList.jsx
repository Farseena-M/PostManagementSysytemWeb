import React, { useEffect, useState } from 'react';
import { deletePost, fetchPosts } from '../api/apis';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { FaPlus, FaTrash, FaEdit, FaSignOutAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const PostList = () => {
    const [posts, setPosts] = useState([]);
    const [expanded, setExpanded] = useState({});
    const Nvgt = useNavigate()

    useEffect(() => {
        fetchPosts().then((response) => setPosts(response.data));
    }, []);

    const handleDelete = async (id) => {
        await deletePost(id);
        setPosts(posts.filter(post => post._id !== id));
    };

    const handleCreatePost = () => {
        Nvgt('/create')
    };

    const handleLogout = () => {
        localStorage.removeItem('token')
        Nvgt('/');
    };

    const toggleReadMore = (id) => {
        setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    return (
        <div className="bg-gray-900 text-yellow-400 min-h-screen py-10 relative">
            <div className="container mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {posts.map(post => (
                    <div key={post._id} className="bg-gray-800 rounded-lg shadow-md p-4 mb-6 flex flex-col w-full h-auto">
                        <h2 className="text-lg font-medium text-yellow-300 mb-3 truncate text-center font-serif">{post.title}</h2>

                        <Carousel showThumbs={false} autoPlay infiniteLoop>
                            {post.images && post.images.map((image, index) => (
                                <div key={index} className="flex justify-center">
                                    <img
                                        src={image}
                                        alt={`Room Image ${index + 1}`}
                                        className="h-[300px] w-[250px] object-cover rounded-lg shadow-lg"
                                    />
                                </div>
                            ))}
                        </Carousel>
                        <div className="text-sm text-gray-300 mb-4 flex-grow font-mono p-1 text-center mt-3">
                            {expanded[post._id] ? (
                                <>{post.description}</>
                            ) : (
                                <>
                                    {post.description.length > 100
                                        ? `${post.description.substring(0, 100)}...`
                                        : post.description}
                                </>
                            )}
                            {post.description.length > 100 && (
                                <button
                                    onClick={() => toggleReadMore(post._id)}
                                    className="text-yellow-400 ml-1 hover:underline"
                                >
                                    {expanded[post._id] ? 'Read Less' : 'Read More'}
                                </button>
                            )}
                        </div>
                        <div className="flex justify-end mt-2">
                            <FaEdit className="mr-5 cursor-pointer" size={18} onClick={() => Nvgt(`/edit/${post._id}`)} />
                            <FaTrash className="mr-2 cursor-pointer" size={18} onClick={() => handleDelete(post._id)} />
                        </div>
                    </div>
                ))}
            </div>

            <button
                onClick={handleCreatePost}
                className="fixed bottom-32 right-10 bg-yellow-500 text-black rounded-full p-4 shadow-lg hover:bg-yellow-400 transition duration-300 transform hover:scale-110 z-50"
            >
                <FaPlus size={24} />
            </button>

            <button
                onClick={handleLogout}
                className="fixed bottom-10 right-10 bg-red-500 text-white rounded-full p-4 shadow-lg hover:bg-red-400 transition duration-300 transform hover:scale-110 z-50"
            >
                <FaSignOutAlt size={24} />
            </button>
        </div>
    );
};

export default PostList;
