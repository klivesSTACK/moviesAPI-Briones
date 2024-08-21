const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title field is required to fill']
    },
    director: {
        type: String,
        required: [true, 'Director field is required to fill']
    },
    year: {
        type: Number,
        required: [true, 'Year field is required to fill']
    },
    description: {
        type: String,
        required: [true, 'Description is required to fill']
    },
    genre: {
        type: String,
        required: [true, 'Genre field is required to fill']
    },
    comments: [
        {
            userId: {
                type: String,
                required: [true, 'User Id is required']
            },
            comment: {
                type: String,
                required: [true, 'Comment is required']
            }
        }
    ]
})

module.exports = mongoose.model('Movie', movieSchema);