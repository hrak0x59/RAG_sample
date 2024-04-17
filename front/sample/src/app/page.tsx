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
    <div className="container mx-auto py-8 content-center h-screen">
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
        <form onSubmit={handleSubmit} className="flex justify-center mb-4">
          <input
            type="text"
            value={query}
            onChange={handleChange}
            className="w-1/2 border border-yellow-500 rounded bg-yellow-100 px-4 py-2 mr-2 focus:outline-none focus:border-yellow-500"
            placeholder="にょにょにょん"
          />
          <button
            type="submit"
            className="bg-gray-900 text-white rounded px-4 py-2 hover:bg-gray-600 focus:outline-none focus:bg-gray-600"
          >
            質問
          </button>
        </form>
      )}
    </div>
  );
}
