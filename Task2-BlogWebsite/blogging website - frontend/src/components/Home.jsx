import React from 'react';

const Home = () => {
  const blogs = [
    {
      id: 1,
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT-cKeAcyBegyI-2XzM9VLliJeSzeiHIpvV2w&s",
      title: "The Future of AI",
      description: "Exploring the impact of AI on various industries and the innovations driving the tech world forward."
    },
    {
      id: 2,
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTpEh0c0br7gbry3Z0G85GsYjSmcqg1NrtDPQ&s",
      title: "Sustainable Tech Innovations",
      description: "Learn about the latest developments in sustainable technology and eco-friendly solutions."
    },
    {
      id: 3,
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQRb-g4uZoOFW3MvVOOzkeOZJeh8BE2-PY04Q&s",
      title: "5G: What It Means for Us",
      description: "How 5G technology is shaping the future of connectivity and revolutionizing mobile communication."
    },
    {
      id: 4,
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR-jirheJ5fBAqwgDweNNk62PRl5M8pmRITyA&s",
      title: "Cybersecurity Trends",
      description: "Stay updated on the newest trends in cybersecurity and the tools protecting data privacy."
    },
    {
      id: 5,
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSRdd5E2pW9rrpllQ_CmyfxXztl8FSNA1Ybgg&s",
      title: "Blockchain Beyond Bitcoin",
      description: "Discover how blockchain is transforming industries beyond cryptocurrencies and finance."
    },
    {
        id: 6,
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR7V9FBNzQ_0ctZjJMK67tvLZkxAQe8_dxYiw&s",
        title: "The Rise of Electric Vehicles",
        description: "Exploring the rapid adoption of EVs and their impact on the environment."
      },
  ];

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Our Latest Blog Posts</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {blogs.map((blog) => (
          <div key={blog.id} className="bg-white shadow-md rounded-lg overflow-hidden">
            <img
              src={blog.image}
              alt={blog.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-2">{blog.title}</h2>
              <p className="text-gray-700">{blog.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
