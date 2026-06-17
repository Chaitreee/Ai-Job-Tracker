// @desc Upload resume
// @route POST /api/v1/ai/upload-resume

export const uploadResume = async (req, res) => {
    try {

        // Check if file exists
        if (!req.file) {
            return res.status(400).json({
                message: "No resume uploaded",
            });
        }

        return res.status(200).json({
            message: "Resume uploaded successfully",
            file: req.file,
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Internal Server Error",
        });

    }
};