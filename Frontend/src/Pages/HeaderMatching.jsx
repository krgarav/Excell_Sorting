import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useLocation } from "react-router";
const HeaderMatching = () => {
  const [predefinedHeader, setPreDefinedHeader] = useState([
    "SR_NO",
    "NAME",
    "FATHER_NAME",
    "CLASS_CODE",
    "SECTION",
    "SCHOOL_CODE",
    "SCHOOL",
    "TEHSIL",
    "CITY_NAME",
    "STATE_NAME",
    "IMAGE",
    "TOTAL_MARKS",
    "YEAR",
  ]);
  const [uploadedHeader, setUploadedHeader] = useState([]);
  const [selectedHeaders, setSelectedHeaders] = useState({});

  const location = useLocation();
  const [submitLoading, setSubmitLoading] = useState(false);
  const { state } = location;

  useEffect(() => {
    const { csvHeaders } = state;
    setUploadedHeader(csvHeaders);
  }, []);
  console.log(state);
  // Handle change event for each select
  const handleCsvHeaderChange = (key, value) => {
    console.log(key,value)
    setSelectedHeaders((prev) => ({
      ...prev,
      [key]: value, // Update only the relevant key
    }));
  };
console.log(selectedHeaders)
  return (
    <div className="  overflow-y-auto overflow-x-auto flex justify-center bg-gradient-to-r from-blue-400 to-blue-600 items-center templatemapping pt-10 pb-5 ">
      <div className="w-[900px] bg-white p-6 rounded-lg shadow-md relative">
        <h1 className="text-blue-800 text-4xl text-center mb-10">Mapping</h1>
        <div className="relative">
          <div>
            <div className="flex w-full justify-around mb-4">
              <div className="w-1/3 text-center">
                <label className="block text-xl text-black font-semibold">
                  Result CSV/Excel Header
                </label>
              </div>
              <div className="w-1/3 text-center">
                <label className="block text-xl text-black font-semibold">
                  Uploaded CSV/Excel Header
                </label>
              </div>
            </div>
            <div className="h-[50vh] overflow-y-auto">
              {Array.from({ length: 13 }).map((csvHeader, index) => {
                return (
                  <div key={index} className="flex w-full justify-around mb-3">
                    <div className="block w-1/3 py-1 me-10 text-xl font-semibold text-center border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500">
                      <span>{predefinedHeader[index]}</span>
                    </div>
                    <div>----&gt;</div>
                    <select
                      className="block w-1/3 py-1 ms-10 text-xl font-semibold text-center border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                      aria-label="Template Header"
                      onChange={(e) =>
                        handleCsvHeaderChange(index, e.target.value)
                      }
                      value={selectedHeaders[index] || ""}
                    >
                      <option disabled value="">
                        Select CSV Header Name
                      </option>
                      {uploadedHeader &&
                        uploadedHeader.map((template, idx) => (
                          <option key={idx} value={template}>
                            {template}
                          </option>
                        ))}
                    </select>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse items-center justify-center ">
          <button
            // onClick={() => {
            //   onMapSubmitHandler();
            // }}
            type="button"
            className={`my-3 ml-3 w-full sm:w-auto inline-flex items-center justify-center rounded-xl border border-transparent px-4 py-2 bg-teal-600 text-base leading-6 font-semibold text-white shadow-sm hover:bg-teal-500 focus:outline-none focus:border-teal-700 focus:shadow-outline-teal transition ease-in-out duration-150 sm:text-sm sm:leading-5 ${
              submitLoading ? "cursor-not-allowed" : ""
            }`}
            disabled={submitLoading}
          >
            {submitLoading ? (
              <div className="flex items-center space-x-2">
                {/* Tailwind CSS spinner */}
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Loading...</span>
              </div>
            ) : (
              "Submit and Process"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeaderMatching;
