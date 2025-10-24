import React, { useEffect, useState } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaStar, FaMapMarkerAlt, FaHeart } from "react-icons/fa";
import { HiOutlineHeart } from "react-icons/hi";

const Hotels = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState(new Set());

  // Fetch all posts
  const getAllPosts = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/post/get-all-post`
      );
      setPosts(res.data.posts);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllPosts();
  }, []);

  // Image rotation logic
  const [imageIndexes, setImageIndexes] = useState({});

  useEffect(() => {
    const interval = setInterval(() => {
      setImageIndexes((prevIndexes) => {
        const newIndexes = { ...prevIndexes };
        posts.forEach((post) => {
          if (post.images && post.images.length > 1) {
            const currentIndex = newIndexes[post._id] || 0;
            newIndexes[post._id] = (currentIndex + 1) % post.images.length;
          }
        });
        return newIndexes;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [posts]);

  const toggleFavorite = (hotelId) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(hotelId)) {
        newFavorites.delete(hotelId);
      } else {
        newFavorites.add(hotelId);
      }
      return newFavorites;
    });
  };

  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 3000 },
      items: 5,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };

  if (loading) {
    return (
      <div className="container mx-auto mt-16 px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading amazing hotels...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto mt-16 px-4">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">Popular Hotels</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Discover the most popular destinations and book your perfect stay
        </p>
      </div>
      
      <Carousel
        responsive={responsive}
        removeArrowOnDeviceType={["tablet", "mobile"]}
        infinite={true}
        autoPlay={false}
        customButtonGroup={<div />}
        arrows={true}
        className="hotel-carousel"
      >
        {posts.map((hotel) => (
          <div
            key={hotel._id}
            className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 mx-2"
          >
            {/* Image Container */}
            <div className="relative">
              <img
                src={hotel.images?.[imageIndexes[hotel._id] || 0] || '/placeholder-hotel.jpg'}
                alt={hotel.title}
                className="w-full h-64 object-cover"
              />
              
              {/* Favorite Button */}
              <button
                onClick={() => toggleFavorite(hotel._id)}
                className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-all duration-200"
              >
                {favorites.has(hotel._id) ? (
                  <FaHeart className="text-red-500" size={16} />
                ) : (
                  <HiOutlineHeart className="text-gray-600" size={16} />
                )}
              </button>

              {/* Price Badge */}
              <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                <span className="text-sm font-semibold text-gray-900">
                  ${hotel.price || 'N/A'}/night
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <Link
                to={`product/${hotel.slug}`}
                className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors duration-200 block mb-2"
              >
                {hotel.title}
              </Link>
              
              {/* Location */}
              <div className="flex items-center text-gray-600 mb-3">
                <FaMapMarkerAlt size={14} className="mr-2" />
                <span className="text-sm">{hotel.hotelLocation || 'Location not specified'}</span>
              </div>

              {/* Rating */}
              <div className="flex items-center mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className={`text-sm ${
                        i < (hotel.rating || 4) ? 'text-yellow-400' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="ml-2 text-sm text-gray-600">
                  {hotel.rating || 4.0} ({hotel.reviews || 0} reviews)
                </span>
              </div>

              {/* Description */}
              <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                {hotel.description || 'Experience luxury and comfort in this amazing destination.'}
              </p>

              {/* View Details Button */}
              <Link
                to={`product/${hotel.slug}`}
                className="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center py-2 px-4 rounded-lg font-semibold transition-all duration-200"
              >
                View Details
              </Link>
            </div>
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default Hotels;
