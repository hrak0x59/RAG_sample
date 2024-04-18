"use client";
import { useState, ChangeEvent, FormEvent } from "react";
import Image from "next/image";

export default function Home() {
  const [query, setQuery] = useState("");
  const [data, setData] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const response = await fetch(`http://127.0.0.1:5000/api/${query}`);
    const responseData = await response.text();
    console.log(responseData);
    setLoading(false);
    setData(responseData);
  };

  return (
    <div className="h-screen">
    <div className="container mx-auto py-8 content-center h-5/6">
      {loading ? (
        <div className="flex justify-center items-center">
          <div className="animate-bounce">
            <img src="/jirou.png" width={150} />
          </div>
        </div>
      ) : data ? (
        <div>
          <p className="text-3xl font-bold text-gray-800 text-ceter">{data}</p>
        </div>
      ) : (
        <>
          <h1 className="text-7xl font-bold text-gray-800 flex justify-center mb-10 tracking-widest">
            JIROU
          </h1>
          <form onSubmit={handleSubmit} className="flex justify-center">
            <label
              htmlFor="default-search"
              className="mb-2 text-sm font-medium text-gray-900 sr-only"
            >
              Search
            </label>
            <div className="relative w-1/2">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                <svg
                  className="w-4 h-4 text-gray-500 dark:text-gray-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 20"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                  />
                </svg>
              </div>
              <input
                type="text"
                value={query}
                onChange={handleChange}
                id="default-search"
                className="block w-full p-4 ps-10 text-sm border-yellow-500 rounded-full bg-yellow-100 border focus:outline-none focus:border-yellow-500"
                autoComplete="off"
                required
              />

              {/* <button
                type="submit"
                className="text-white absolute end-2.5 bottom-2.5 bg-gray-900 hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-full text-sm px-4 py-2"
              >
                Search
              </button> */}
            </div>
          </form>
        </>
      )}
    </div>
    <footer className="text-gray-600 p-4 text-center mt-16">
    <p>© 2024 team jirou</p>
  </footer>
  </div>
  );
}
