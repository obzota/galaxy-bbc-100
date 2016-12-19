# Fast setup

* Clone the repository
```
cd ~/workspace/
git clone git@github.com:obzota/galaxy-bbc-100.git
```

* Go to the repository and launch a python server
```
cd ~/workspace/galaxy-bbc-100
python -m SimpleHTTPServer
```

* Open your browser on the [local webpage](http://127.0.0.1:8000/app/template/galaxy.html)
```
firefox http://127.0.0.1:8000/app/template/galaxy.html &
```

* Open the console in the browser and verify you can access the **db** object. Here are some examples:
```javascript
db.movies[14].title
db.critics[99].name
db.meta[99].Genre
```

* Use the following function **onDbLoaded** and the two globals **movies** and **critics** and start exploring through the data
```javascript
onDbLoaded(db)
movies
critics
```

# Architecture of the project

## test.js

*test.js* is the MVP for the 'main' of our app. It loads the database from the csv files and give a function to convert the data into models.


## Models

Contain all the data of the app.

* The database is only a raw representation of the csv files.
* The other models *Movie*, *Critic* and *Ranking* will contain some computed values.
* They also build references between them so we can navigate through the data easily while programming. Each *Movie* contain a list of all the *Ranking* it received (a *Ranking* link a critic and a number from 1 to 10). Each *Critic* has an array of 10 *Movie* representing his top ten best movies.

**IMPORTANT** The list of critics must be instanciated before the list of movies, and given as an argument to the *Movie* constructor. Short way: use the function **onDbLoaded** as presented above.

## Libs

### D3
Please check out the [D3 website](https://d3js.org/) to find all the documentation.
And take a look at the [Tutorials](https://github.com/d3/d3/wiki/Tutorials) !

Interesting tutorials:
* Introduction
* Let's make bar charts
* How selection works (if you don't know jQuery)
* General Update Pattern (fist step towards animation !)

### Underscore

A bunch of helpful tools for Javascript, as described [here](http://underscorejs.org/)