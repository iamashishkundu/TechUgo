
function validate(req,res,next){
    const {title, description, priority} = req.body;
    let errors = [];

    if (!title) {
        errors.push("Title is required");
    } else if (typeof title !== "string") {
        errors.push("Title must be a string");
    } else if (title.length < 5) {
        errors.push("Title must be at least 5 characters");
    }

    if (!description) {
        errors.push("Description is required");
    } else if (typeof description !== "string") {
        errors.push("Description must be a string");
    } else if (description.length < 10) {
        errors.push("Description must be at least 10 characters");
    }

    const validPriorities = ["LOW", "MEDIUM", "HIGH", "CRITICAL"];

    if (priority && !validPriorities.includes(priority)) {
        errors.push("Priority must be LOW, MEDIUM, HIGH, or CRITICAL");
    }

    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            errors: errors
        });
    }

    next();
}


export default validate;