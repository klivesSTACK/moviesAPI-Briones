const Movie = require("../models/Movie");


module.exports.addMovie = ( req, res) => {

    const { title, director, year, description, genre } = req.body;
    
    let newMovie = new Movie({
        title: title,
        director: director,
        year: year,
        description: description,
        genre: genre,
    })

    Movie.findOne({title: req.body.title }).then(result =>{

        if(result){
            return res.status(409).send({message: 'Movie already exist'})
        }else {
            return newMovie.save().then(saveMovie => {
                res.status(201).send( saveMovie )
            }).catch(err => errorHandler(err, req, res));
        }
    }).catch(err => errorHandler(err, req, res));

}

module.exports.getAllMovies = ( req, res ) => {

    Movie.find().then(result => {
        if(result.length > 0 ){
            return res.status(200).send({ movies: result})
        }else {
            return res.status(400).send({ message: 'No Movies found'})
        }
    }).catch(err => errorHandler(err, req, res));

}

module.exports.getMovieById = ( req, res )=> {

    const id = req.params.movieId;

    Movie.findById({ _id: id}).then(result => {
        if(result){
            return res.status(200).send(result)
        }else {
            return res.status(400).send({message: 'No movie found'})
        }
    }).catch(err => errorHandler(err, req, res));

}

module.exports.updateMovie = ( req, res ) => {

    const id = req.params.movieId;
    const { title, director, year, description, genre } = req.body;
     
    let updatedMovie = {
        title: title,
        director: director,
        year: year,
        description: description,
        genre: genre
    }

    Movie.findByIdAndUpdate( id, updatedMovie, { new: true }).then(result => {
        if(result){
            return res.status(200).send({ 
                message: 'Movie updated successfully',
                updatedMovie: result
            })
        }
    }).catch(err => errorHandler(err, req, res));
}

module.exports.deleteMovie = ( req, res ) => {

    const id = req.params.movieId;

    Movie.findByIdAndDelete( id ).then( deleted => {
        if(deleted){
            return res.status(200).send({message: 'Movie deleted successfully'})
        }else {
            return res.status(400).send({ message: 'Something went wrong!. delete movie failed'})
        }
    }).catch(err => errorHandler(err, req, res));

}

module.exports.addMovieComment = ( req, res ) => {

    const id = req.params.movieId;

    Movie.findById( id ).then( result => {

        if(result){

            result.comments =[
                {
                    userId: req.user.id,
                    comment: req.body.comment
                }
                
            ]
            
            result.save()
            return res.status(200).send({ 
                message: 'comment added successfully',
                updatedMovie: result
            
            })
        }else {
            return res.status(400).send({ message: 'failed to add comment'})
        }
        
    })

}

module.exports.getMovieComments = ( req, res ) => {

    const id = req.params.movieId;

    Movie.findById( id ).then( result => {

        if(result){
            return res.status(200).send({ comments: result.comments })
        }else {
            return res.status(400).send( { message: 'Somethin went wrong'})
        }
    })

}

