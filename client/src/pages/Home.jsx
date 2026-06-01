import { useState, useRef } from "react";
import api from "../api/api";
import jpg from "../assets/images/jpg.jpg";
import {toast} from "react-toastify";
import "../App.css";

const Home = () => {
  const [files, setFiles] = useState([]);
  const [jobDescription, setJobDescription] =
    useState("");
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef(null);

  const handleFiles = (e) => {
    const selectedFiles = Array.from(
      e.target.files
    );

    setFiles(selectedFiles);
  };

  const handleUpload = async () => {
  try {
    setLoading(true);

    if (files.length === 0) {
      toast.error(
        "Please select at least one resume"
      );
      return;
    }

    if (!jobDescription.trim()) {
      toast.error(
        "Please enter a Job Description"
      );
      return;
    }

    const formData = new FormData();

    files.forEach((file) => {
      formData.append("resumes", file);
    });

    formData.append(
      "jobDescription",
      jobDescription
    );

    const uploadPromise = api.post(
      "/resumes/upload",
      formData
    );

    const { data } = await toast.promise(
      uploadPromise,
      {
        pending: "Uploading resumes...",
        success:
          "Resumes uploaded successfully!",
        error: "Failed to upload resumes",
      }
    );

    console.log(data);

    setFiles([]);
    setJobDescription("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

  } catch (error) {
    console.error(error);

    toast.error(
      error.response?.data?.message ||
      "Something went wrong"
    );
  } finally {
    setLoading(false);
  }
};
  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mx-8 mb-5">
        Resume Screening App
      </h1>

      <textarea
        placeholder="Enter Job Description"
        className="border p-3 w-full h-60 rounded"
        value={jobDescription}
        onChange={(e) =>
          setJobDescription(e.target.value)
        }
      />

      <input
        type="file"
        id="resume"
        multiple
        accept=".pdf"
        ref={fileInputRef}
        onChange={handleFiles}
        hidden
      />

      <label
        htmlFor="resume"
        className="flex justify-center border-2 border-dashed items-center gap-3 border rounded-lg cursor-pointer"
        style={{padding:"20px",margin:"10px 0px",minHeight:"75px"}}
      >
        <img
          src={jpg}
          alt="Upload"
          width="75"
          className="upload_image"
        />
        <span>Add Your Resumes</span>
      </label>

      {files.length > 0 && (
        <div className="flex flex-wrap gap-4 mt-5">
          {files.map((file, index) => (
            <div
              key={index}
              className=" bg-white flex flex-col justify-center items-center rounded-lg p-3 text-center"
            >
              <img
                src={jpg}
                alt="PDF"
                width="75"
                className="mx-auto upload_image"
              />

              <p className="text-sm mt-2 break-words">
                {file.name}
              </p>

              <p className="text-xs text-gray-500">
                {(file.size / 1024).toFixed(1)} KB
              </p>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={handleUpload}
        className={`min-w-30 upload_button rounded p-2 mt-5 text-white ${
          loading
            ? "bg-gray-500 cursor-not-allowed"
            : "bg-black cursor-pointer"
          }`}
        disabled={loading}
      >
       {loading?"Uploading...":"Upload"}
      </button>
    </div>
  );
};

export default Home;