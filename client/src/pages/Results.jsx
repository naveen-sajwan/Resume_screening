import { useEffect, useState } from "react";
import api from "../api/api";
import { FaQuestion } from "react-icons/fa";

const Results = () => {
  const [candidates, setCandidates] =
    useState([]);

  const [search, setSearch] = useState("");

    const fetchCandidates = async () => {
      try {
        const { data } = await api.get("/resumes");
        setCandidates(data);
      } catch (error) {
        console.error("Failed to fetch candidates", error);
      }
    };

    const filtered = candidates.filter((c) =>
      (c.candidateName || "")
        .toLowerCase()
        .includes(search.toLowerCase())
    );


const handleDelete = async () => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete all candidates?"
  );

  if (!confirmDelete) return;

  try {
    const { data } = await api.delete(
      "/resumes/deleteAll"
    );

    console.log(data);

    setCandidates([]);
  } catch (error) {
    console.error(error);
  }
};

  const handleIndividualDeletion = async(id)=>{
    const confirmation = window.confirm("Are you Sure want to Delete it ?");
    if(!confirmation) return ;

    try {
      const {data} = await api.delete(`/resumes/delete-single/${id}`)
      console.log(data);
      const updateCandidate = candidates.filter(
        (candidate)=> candidate._id !== id
      ); 
      setCandidates(updateCandidate)
    } catch (error) {
      console.log("Error deleting")
    }
  }

  useEffect(() => {
    fetchCandidates();
  },[]);

  
  return (
    <div className="p-10">
      <div className="flex justify-between mb-5">
        <input
          type="text"
          placeholder="Search Candidate"
          className="border rounded-lg bg-white"
          style={{padding:"5px 10px"}}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />
        <div className="flex gap-3 flex-wrap">
            <a
              href="https://resume-screening-puix.onrender.com/api/resumes/export/csv"
              className="bg-black rounded text-white px-4 py-2"
            >
            Export CSV
            </a>
            <button
              onClick={handleDelete}
              className="bg-red-500 cursor-pointer rounded text-white px-4 py-2"
            >
            Delete-All
            </button>
         </div>   
      </div>

      <div className="grid gap-5">
        {filtered.length <= 0 ? ( <div className="h-[450px] flex justify-center items-center"><h1>No Candidates Available</h1></div>):
         filtered.map((candidate) => (
          <div
            key={candidate._id}
            className="border bg-white rounded"
            style={{padding:"20px 10px"}}
          >
          <h2 className="text-xl font-bold uppercase">
            {candidate.candidateName || "Unknown"}
          </h2>
          <p>Experience: <span className="text-blue-600">{candidate.experience || "Please View Resume"}</span></p>
          <p>
            Email: <a className="text-blue-600" href={`mailto:${candidate.email || ""}`}>{candidate.email || "NIL"}</a>
          </p>

          <p>
            Phone: <a className="text-blue-600" href={`tel:${candidate.phone || ""}`}>{candidate.phone || "NIL"}</a>
          </p>

          <p>Match Score: <span className="text-blue-600">{candidate.matchScore || 0}%</span></p>

          <p>Rank: #{candidate.rank || "N/A"}</p>

          <div className="mt-3">
            <strong>Matched Skills ✅ :</strong>
            <div className="text-green-600 font-bold ">
              {candidate.matchedSkills?.join(", ") || "NIL"}
            </div>
          </div>

          <div className="mt-3">
            <strong>Missing Skills ❌ :</strong>
            <div className="text-red-600 font-bold">
              {candidate.missingSkills?.join(", ") || "NIL"}
            </div>
          </div>  

            <a
              href={candidate.resumeUrl}
              target="_blank"
              className="bg-green-500 text-white"
               style={{marginLeft:"10px",padding:"10px 10px"}}
            >
              View Resume
            </a>
             <button
             onClick={(e)=>handleIndividualDeletion(candidate._id)}
              target="_blank"
              className="bg-red-500 text-white"
              style={{marginLeft:"10px",padding:"10px 10px"}}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Results;