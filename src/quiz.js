const mongoose = require('mongoose');

// Schema for storing quiz questions
const QuizSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true,
    },
    options: {
        type: [String],
        required: true,
    },
    correctAnswer: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    difficultyLevel: {
        type: String,
        required: true,
    },
});

// Schema for storing user responses
const UserResponseSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    quizId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Quiz',
        required: true,
    },
    selectedAnswer: {
        type: String,
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
    // Add more properties as needed
});

// Models
const Quiz = mongoose.model('Quiz', QuizSchema);
const UserResponse = mongoose.model('UserResponse', UserResponseSchema);

module.exports = {
    Quiz,
    UserResponse,
};
