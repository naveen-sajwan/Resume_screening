import Resume from "../models/ResumeSchema.js";

// Delete All Document
export const deleteAllDocs = async(req,res)=>{
    try {
       const result = await Resume.deleteMany({});
        return res.status(200).json({
            success: true,
            deletedCount: result.deletedCount,
            message: "All resumes deleted successfully",
        });
    } catch (error) {
        return res.status(500).json({message: error});
        console.error("Error deleting documents:", error);
    }
}

// Delete Single resume
export const deleteSingleResume = async(req,res)=>{
    try {
        const {id} = req.params;
        const result = await Resume.findByIdAndDelete(id)
        return res.status(200).json({
            message: "SuccessFully Deleted",
            status: "success"
        })
    } catch (error) {
        return res.status(500).json({message: error});
        console.error("Error deleting documents:", error);
    }
}