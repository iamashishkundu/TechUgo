
function validateStudentId(req, res, next) {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        return res.json({
            success: false,
            message: "Invalid student ID"
        });
    }

    next();
}

export default validateStudentId;