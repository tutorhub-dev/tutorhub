const mongoose = require('mongoose');

class TutorSchemas {
    /**
     * NOTE: Mongoose autmatically injects an _id field into all schemas
     */

    static get authTokenSchema() {
        return {
            user_id: { type: String, required: true },
            auth_token: { type: String, required: true }
        }
    }

    static get userSchema() {
        return {
            email: { type: String, required: true, unique: true },
            hash_password: { type: String, required: true },
            username: { type: String, required: true },
            is_tutor: {type: Boolean, required: false, default: false },
            profile_picture: { type: String, required: false, default: "" }
        }
    }

    static get tutorSchema() {
        return {
            user_id: { type: String, required: true },
            hourly_rate: { type: Number, required: true }
        }
    }

    static get appointmentSchema() {
        return {
            tutor_id: { type: String, required: true },
            student_id: { type: String, required: true },
            start_time: { type: Date, required: true },
            end_time: { type: Date, required: true }
        }
    }
}

module.exports = TutorSchemas