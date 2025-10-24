import React, { useState } from "react";
import { FaSearch, FaMapMarkerAlt, FaCalendarAlt, FaUsers } from "react-icons/fa";
import DatePicker from "react-datepicker";
import axios from "axios";
import "react-datepicker/dist/react-datepicker.css";
import BannerImage from "../assets/Rectangle 2.png";
import { useSearch } from "../context/Serach";
import { useNavigate } from "react-router-dom";

const Banner = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useSearch();
  const [isLoading, setIsLoading] = useState(false);

  const handelSerach = async (e) => {
    e.preventDefault();
    if (!search.keyword) {
      console.error("Search keyword is missing");
      return;
    }
    setIsLoading(true);
    try {
      const url = `${import.meta.env.VITE_BASE_URL}/api/booking/search/${
        search.keyword
      }`;
      console.log("Requesting:", url);
      const { data } = await axios.get(url);
      setSearch({ ...search, results: data });
      navigate("/search");
    } catch (error) {
      console.error("Error during search API call:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="relative w-full h-[600px] bg-cover bg-center bg-fixed"
      style={{ backgroundImage: `url(${BannerImage})` }}
    >
      {/* Enhanced Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/60"></div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-white h-full px-4">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Discover Your
            <span className="block text-blue-400">Dream Destination</span>
          </h1>
          <p className="text-lg sm:text-xl mb-8 text-gray-200 max-w-2xl mx-auto leading-relaxed">
            Plan and book your perfect trip with expert advice, travel tips,
            destination information, and inspiration from us.
          </p>
        </div>

        {/* Enhanced Search Bar */}
        <div className="mt-8 w-full max-w-4xl mx-auto">
          <div className="bg-white/95 backdrop-blur-sm p-6 rounded-2xl shadow-2xl">
            <form onSubmit={handelSerach} className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Destination Search */}
              <div className="relative">
                <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Where are you going?"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={search.keyword}
                  onChange={(e) => setSearch({ ...search, keyword: e.target.value })}
                />
              </div>

              {/* Check-in Date */}
              <div className="relative">
                <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <DatePicker
                  selected={search.checkIn}
                  onChange={(date) => setSearch({ ...search, checkIn: date })}
                  placeholderText="Check-in"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Check-out Date */}
              <div className="relative">
                <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <DatePicker
                  selected={search.checkOut}
                  onChange={(date) => setSearch({ ...search, checkOut: date })}
                  placeholderText="Check-out"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Search Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    <FaSearch />
                    <span>Search</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Popular Destinations */}
        <div className="mt-12 text-center">
          <p className="text-gray-300 mb-4">Popular destinations:</p>
          <div className="flex flex-wrap justify-center gap-3">
            {["Paris", "Tokyo", "New York", "London", "Dubai"].map((destination) => (
              <button
                key={destination}
                onClick={() => {
                  setSearch({ ...search, keyword: destination });
                  handelSerach({ preventDefault: () => {} });
                }}
                className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-all duration-200 text-sm font-medium"
              >
                {destination}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
