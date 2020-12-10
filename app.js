const moviesDB = require('./movies-data-small.json');
require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const app = express();

app.use(morgan('dev'));
app.use(helmet());
app.use(cors());

app.use(function validateBearerToken(req, res, next) {
    const apiToken = process.env.API_TOKEN
    const authToken = req.get('Authorization')
  
    if (!authToken || authToken.split(' ')[1] !== apiToken) {
      return res.status(401).json({ error: 'Unauthorized request' })
    }
    // move to the next middleware
    next()
})

function handleMovieSearch(req, res){
    const { genre, country, avg_vote } = req.query;

    if (!genre) {
        return res
        .status(400)
        .send('Value for genre is needed');
    }

    if (!country) {
        return res
        .status(400)
        .send('Value for country is needed');
    }

    if (!avg_vote) {
        return res
        .status(400)
        .send('Value for avg vote is needed');
    }

    let genreResults = moviesDB
        .filter(movie => movie
            .genre
            .toLowerCase()
            .includes(genre.toLowerCase()));

    let countryResults = genreResults
        .filter(movie => movie
            .country
            .toLowerCase()
            .includes(country.toLowerCase()));   
            
    let filterResults = countryResults
        .filter(movie => movie
            .avg_vote >== Number(avg_vote));
    
    res.json(filterResults);
}

app.get("/movie", handleMovieSearch);



app.listen(8000, () => {
  console.log(`Server listening at http://localhost:${8000}`)
})