"use client";
import { useState, ChangeEvent, FormEvent } from "react";
import Image from "next/image";

interface Data {
  RAG: string;
  ROW: string[];
}
// 初期データ
const initialData: Data = {
  RAG: "",
  ROW: [],
};

export default function Home() {
  const [query, setQuery] = useState("");
  const [data, setData] = useState<Data>(initialData);
  const [loading, setLoading] = useState(false);
  const [row, setRow] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const response = await fetch(`http://127.0.0.1:5000/api/${query}`);
    const responseData = await response.json();
    console.log(responseData);
    setLoading(false);
    setData(responseData);
  };

  return (
    <div className="">
      <div className="mt-60 container mx-auto py-8 content-center h-5/6">
        {loading ? (
          <div className="flex justify-center items-center">
            <div className="animate-bounce">
              <img src="/jirou.png" width={150} />
            </div>
          </div>
        ) : data.RAG ? (
          <div>
            <div className="mt-16 flex justify-center items-center">
              <p className="md:text-3xl text-xl font-bold text-gray-600 text-center">
                {data.RAG}
              </p>
            </div>
            <div className="mt-16 flex justify-center items-center">
              <button
                type="button"
                className="text-gray-400 bg-yellow-200 hover:bg-yellow-100 focus:outline-none font-bold rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 "
                onClick={() => setRow(!row)}
              >
                {row ? <>CLOSE</> : <>OPEN</>}
              </button>
            </div>
            {row ? (
              <>
                <h1 className="m-10 md:text-3xl text-xl font-bold text-gray-600 text-center">
                  参考にした箇所
                </h1>
                <ul className="mb-20">
                  {data.ROW.map((item, index) => (
                    <li
                      className="mt-5 rounded-xl p-5 m-2 bg-gray-600 text-yellow-200"
                      key={index}
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <></>
            )}
          </div>
        ) : (
          <>
            <h1 className="md:text-7xl text-5xl font-bold text-gray-600 flex justify-center mb-10 tracking-widest">
              JIROU
            </h1>
            <form onSubmit={handleSubmit} className="flex justify-center">
              <label
                htmlFor="default-search"
                className="mb-2 text-sm font-medium text-gray-900 sr-only"
              >
                Search
              </label>
              <div className="relative md:w-1/2 w-3/4">
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

      <div className="flex justify-center">
        <footer
          style={{ position: "fixed", bottom: 0 }}
          className="w-3/4 bg-yellow-200 rounded-lg shadow m-4 dark:bg-gray-800"
        >
          <div className="w-full mx-auto max-w-screen-xl p-4 md:flex md:items-center md:justify-between">
            <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">
              © 2024 jirolianz.
            </span>
            <ul className="flex flex-wrap items-center mt-3 text-sm font-medium text-gray-500 dark:text-gray-400 sm:mt-0">
              <li>
                <a href="/" className="hover:underline me-4 md:me-6">
                  home
                </a>
              </li>
            </ul>
          </div>
        </footer>
      </div>
    </div>
  );
}
