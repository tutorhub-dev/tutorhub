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
            first_name: { type: String, required: true },
            last_name: { type: String, required: true },
            email: { type: String, required: true, unique: true },
            hash_password: { type: String, required: true },
            username: { type: String, required: true }
        }
    }

    static get tutorSchema() {
        return {
            first_name: { type: String, required: true },
            last_name: { type: String, required: true },
            email: { type: String, required: true, unique: true },
            hash_password: { type: String, required: true },
            username: { type: String, required: true },
            hourly_rate: { type: Number, required: true },
            ratingSum: { type: Number, required: false, default: 0 },
            ratingCount: { type: Number, required: false, default: 0 }
        }
    }

    static get appointmentSchema() {
        return {
            tutor_id: { type: String, required: true },
            user_id: { type: String, required: true },
            start_time: { type: String, required: true },
            end_time: { type: String, required: true },
            subject: { type: String, required: true },
            is_confirmed: { type: Boolean, required: false, default: false },
            is_rated : { type: Boolean, required: false, default: false }
        }
    }

    static get availabilitySchema() {
        return {
            tutor_id: { type: String, required: true },
            days: { type: [String], required: true },
            start_hour: { type: Number, required: true },
            end_hour: { type: Number, required: true },
            subject: { type: String, required: true }
        }
    }
}

module.exports = TutorSchemas