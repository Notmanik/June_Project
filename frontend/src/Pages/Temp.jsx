import React, { useState, useEffect } from 'react';
import Navbar from "../Components/Navbar";

const Temp = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [activeFilter, setActiveFilter] = useState('all');
    const [isFocused, setIsFocused] = useState(false);

    // Mock user data for demonstration
    const mockUsers = [
        {
            _id: '1',
            firstName: 'Alex',
            lastName: 'Johnson',
            username: 'alexj',
            bio: 'Travel enthusiast and photographer. Exploring the world one photo at a time.',
            interests: ['travel', 'photography', 'nature'],
            age: 28,
            profilePic: {
                filename: 'alex.jpg'
            }
        },
        {
            _id: '2',
            firstName: 'Sarah',
            lastName: 'Williams',
            username: 'sarahw',
            bio: 'Food blogger and chef. Creating delicious recipes for everyday cooking.',
            interests: ['cooking', 'food', 'recipes'],
            age: 32,
            profilePic: {
                filename: 'sarah.jpg'
            }
        },
        {
            _id: '3',
            firstName: 'Michael',
            lastName: 'Chen',
            username: 'michaelc',
            bio: 'Software engineer and tech enthusiast. Building the future one line of code at a time.',
            interests: ['technology', 'coding', 'gaming'],
            age: 26,
            profilePic: {
                filename: 'michael.jpg'
            }
        },
        {
            _id: '4',
            firstName: 'Emily',
            lastName: 'Rodriguez',
            username: 'emilyr',
            bio: 'Fitness trainer and nutrition coach. Helping people transform their lives through health.',
            interests: ['fitness', 'health', 'nutrition'],
            age: 30,
            profilePic: {
                filename: 'emily.jpg'
            }
        },
        {
            _id: '5',
            firstName: 'David',
            lastName: 'Kim',
            username: 'davidk',
            bio: 'Musician and composer. Creating melodies that touch the soul.',
            interests: ['music', 'piano', 'composition'],
            age: 29,
            profilePic: {
                filename: 'david.jpg'
            }
        },
        {
            _id: '6',
            firstName: 'Jessica',
            lastName: 'Taylor',
            username: 'jessicat',
            bio: 'Book lover and writer. Lost in stories and creating new worlds.',
            interests: ['reading', 'writing', 'literature'],
            age: 27,
            profilePic: {
                filename: 'jessica.jpg'
            }
        }
    ];

    const handleSearch = async () => {
        if (!searchQuery.trim()) {
            setError("Search query cannot be empty");
            return;
        }
        
        setLoading(true);
        setError(null);
        
        try {
            // Simulate API call with mock data
            setTimeout(() => {
                const filteredResults = mockUsers.filter(user => 
                    user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    user.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    user.bio.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    user.interests.some(interest => 
                        interest.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                );
                
                setSearchResults(filteredResults);
                setLoading(false);
            }, 800);
        } catch (err) {
            setError("Failed to fetch results");
            setLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    // Function to get profile pic URL for each user
    const getProfilePicUrl = (user) => {
        if (user.profilePic && user.profilePic.filename) {
            return `https://images.unsplash.com/photo-${user._id === '1' ? '1534528741775-53994a69daeb' : 
                     user._id === '2' ? '1494790108377-be9c29b29330' : 
                     user._id === '3' ? '1507003211169-0a1dd7228f2d' : 
                     user._id === '4' ? '1544005313-94ddf0286df2' : 
                     user._id === '5' ? '1510227272981-87123e259b17' : 
                     '1548142813-c348350df52b'}?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&h=200&q=80`;
        }
        return 'https://via.placeholder.com/150';
    };

    // Filter by interests
    const filterByInterest = (interest) => {
        setActiveFilter(interest);
        if (interest === 'all') {
            setSearchResults(mockUsers);
        } else {
            const filtered = mockUsers.filter(user => 
                user.interests.map(i => i.toLowerCase()).includes(interest.toLowerCase())
            );
            setSearchResults(filtered);
        }
    };

    // Popular interests for quick filtering
    const popularInterests = ['travel', 'food', 'technology', 'fitness', 'music', 'art'];

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100">
            <Navbar />
            
            <div className="max-w-6xl mx-auto px-4 py-8">
                {/* Hero Section */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-indigo-800 mb-4">Discover Amazing People</h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Connect with people who share your interests and passions
                    </p>
                </div>
                
                {/* Search Section */}
                <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
                    <div className={`relative rounded-xl border-2 transition-all ${
                        isFocused ? 'border-indigo-500' : 'border-gray-200'
                    }`}>
                        <div className="flex">
                            <input
                                type="text"
                                placeholder="Search by name, username, or interests..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyPress={handleKeyPress}
                                onFocus={() => setIsFocused(true)}
                                onBlur={() => setIsFocused(false)}
                                className="w-full px-6 py-4 rounded-l-xl focus:outline-none text-lg"
                            />
                            <button 
                                onClick={handleSearch}
                                className="bg-indigo-600 text-white px-8 rounded-r-xl hover:bg-indigo-700 transition-colors flex items-center"
                            >
                                <svg className="w-6 h-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                Search
                            </button>
                        </div>
                    </div>
                    
                    {/* Popular Interests */}
                    <div className="mt-6">
                        <h3 className="text-gray-700 mb-3">Popular Interests:</h3>
                        <div className="flex flex-wrap gap-2">
                            <button 
                                onClick={() => filterByInterest('all')}
                                className={`px-4 py-2 rounded-full transition-all ${
                                    activeFilter === 'all' 
                                        ? 'bg-indigo-600 text-white' 
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                Show All
                            </button>
                            {popularInterests.map((interest, index) => (
                                <button 
                                    key={index}
                                    onClick={() => filterByInterest(interest)}
                                    className={`px-4 py-2 rounded-full transition-all ${
                                        activeFilter === interest 
                                            ? 'bg-indigo-600 text-white' 
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    #{interest}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
                
                {/* Results Section */}
                <div className="mb-8">
                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600"></div>
                        </div>
                    ) : error ? (
                        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                            <div className="mx-auto w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
                                <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-medium text-gray-800 mb-2">Search Error</h3>
                            <p className="text-gray-600 mb-4">{error}</p>
                            <button 
                                className="text-indigo-600 hover:text-indigo-800 font-medium"
                                onClick={() => setError(null)}
                            >
                                Try Again
                            </button>
                        </div>
                    ) : searchResults.length > 0 ? (
                        <div>
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-800">
                                    {searchResults.length} {searchResults.length === 1 ? 'Result' : 'Results'} Found
                                </h2>
                                <div className="text-gray-600">
                                    Showing all results
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {searchResults.map(user => (
                                    <div key={user._id} className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1">
                                        <div className="p-6">
                                            <div className="flex items-center mb-4">
                                                <img 
                                                    src={getProfilePicUrl(user)} 
                                                    alt={user.username} 
                                                    className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md" 
                                                />
                                                <div className="ml-4">
                                                    <h3 className="font-bold text-lg text-gray-900">
                                                        {user.firstName} {user.lastName}
                                                    </h3>
                                                    <p className="text-indigo-600">@{user.username}</p>
                                                </div>
                                            </div>
                                            
                                            <div className="mb-4">
                                                <p className="text-gray-600 text-sm line-clamp-2">
                                                    {user.bio}
                                                </p>
                                            </div>
                                            
                                            <div className="mb-4">
                                                <div className="flex flex-wrap gap-2">
                                                    {user.interests.slice(0, 3).map((interest, index) => (
                                                        <span 
                                                            key={index} 
                                                            className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-xs font-medium"
                                                        >
                                                            #{interest}
                                                        </span>
                                                    ))}
                                                    {user.interests.length > 3 && (
                                                        <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs">
                                                            +{user.interests.length - 3} more
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            
                                            <div className="flex justify-between items-center">
                                                <div className="text-sm text-gray-500">
                                                    {user.age} years
                                                </div>
                                                <div className="flex space-x-3">
                                                    <button className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
                                                        <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                                        </svg>
                                                    </button>
                                                    <button className="px-4 py-2 bg-indigo-600 text-white rounded-full text-sm font-medium hover:bg-indigo-700 transition-colors">
                                                        Add Friend
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : searchQuery ? (
                        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                            <div className="mx-auto w-24 h-24 rounded-full bg-indigo-100 flex items-center justify-center mb-6">
                                <svg className="w-12 h-12 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-3">No Results Found</h3>
                            <p className="text-gray-600 max-w-md mx-auto mb-6">
                                We couldn't find any users matching "{searchQuery}". Try another search term or browse popular interests.
                            </p>
                            <button 
                                className="text-indigo-600 hover:text-indigo-800 font-medium"
                                onClick={() => {
                                    setSearchQuery('');
                                    setSearchResults(mockUsers);
                                }}
                            >
                                Browse All Users
                            </button>
                        </div>
                    ) : (
                        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                            <div className="mx-auto w-24 h-24 rounded-full bg-indigo-100 flex items-center justify-center mb-6">
                                <svg className="w-12 h-12 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-3">Start Exploring</h3>
                            <p className="text-gray-600 max-w-md mx-auto">
                                Search for people by name, username, or interests to discover new connections.
                            </p>
                        </div>
                    )}
                </div>
                
                {/* Suggestions Section */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">People You May Know</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {mockUsers.slice(0, 3).map(user => (
                            <div key={user._id} className="flex items-center p-4 border border-gray-100 rounded-xl hover:bg-indigo-50 transition-colors">
                                <img 
                                    src={getProfilePicUrl(user)} 
                                    alt={user.username} 
                                    className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-md" 
                                />
                                <div className="ml-4">
                                    <h3 className="font-bold text-gray-900">
                                        {user.firstName} {user.lastName}
                                    </h3>
                                    <p className="text-sm text-gray-600">@{user.username}</p>
                                    <div className="flex mt-2">
                                        {user.interests.slice(0, 2).map((interest, index) => (
                                            <span 
                                                key={index} 
                                                className="mr-2 bg-indigo-50 text-indigo-700 px-2 py-1 rounded-full text-xs"
                                            >
                                                #{interest}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <button className="ml-auto bg-white border border-indigo-600 text-indigo-600 hover:bg-indigo-50 px-3 py-1 rounded-full text-sm transition-colors">
                                    Connect
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Temp;