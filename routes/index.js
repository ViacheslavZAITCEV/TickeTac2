var express = require('express');
var router = express.Router();
var journeyModel = require('../models/journey')
var usersModel = require('../models//users')

var city = ["Paris","Marseille","Nantes","Lyon","Rennes","Melun","Bordeaux","Lille"]
var date = ["2018-11-20","2018-11-21","2018-11-22","2018-11-23","2018-11-24"]



/* GET home page. */
router.get('/', function(req, res, next) {
  console.log(req.session.user);
  if (req.session.user == undefined){
    console.log('route pour index.ejs');
    res.render('index');
  }else{
    res.render('home', { });
  }
});

router.get('/home', async function(req, res, next) {
  if (req.session.user == undefined || req.session.user == NaN){  
    res.redirect('/');
  }else{
    await entrerUser(req);
    res.render('home', { });
  }
});

router.post('/sign-in', async function(req, res, next) {
  await entrerUser(req);
  if (req.session.user == undefined || req.session.user == NaN){  
    res.render('index');
  }else{
    res.render('home', { });
  }  
});

router.post('/sign-up', async function(req, res, next) {
  console.log('route sign-up');
  await newUser(req);
  console.log('route sign-up continue');
  if (req.session.user == undefined || req.session.user == NaN){  
    res.render('index');
  }else{
    res.render('home', { });
  } 
});

router.get('/deconexion', async function(req, res, next) {
  req.session.user =  NaN;
  res.redirect('/');
});





// Remplissage de la base de donnée, une fois suffit
router.get('/save', async function(req, res, next) {

  // How many journeys we want
  var count = 300

  // Save  ---------------------------------------------------
    for(var i = 0; i< count; i++){

    departureCity = city[Math.floor(Math.random() * Math.floor(city.length))]
    arrivalCity = city[Math.floor(Math.random() * Math.floor(city.length))]

    if(departureCity != arrivalCity){

      var newUser = new journeyModel ({
        departure: departureCity , 
        arrival: arrivalCity, 
        date: date[Math.floor(Math.random() * Math.floor(date.length))],
        departureTime:Math.floor(Math.random() * Math.floor(23)) + ":00",
        price: Math.floor(Math.random() * Math.floor(125)) + 25,
      });
       
       await newUser.save();

    }

  }
  res.render('index', { title: 'Express' });
});


// Cette route est juste une verification du Save.
// Vous pouvez choisir de la garder ou la supprimer.
router.post('/result', async function(req, res, next) {
  console.log(req.body);
  var journey = await journeyModel.find(
    {departure: req.body.dep,
      arrival: req.body.arr,
      date: req.body.date
    }
  );
  console.log(journey);
  // Permet de savoir combien de trajets il y a par ville en base
  for(i=0; i<city.length; i++){

    journeyModel.find( 
      { departure: city[i] } , //filtre
  
      function (err, journey) {

          console.log(`Nombre de trajets au départ de ${journey[0].departure} : `, journey.length);
      }
    )

  }


  res.render('result', {journey, date: req.body.date});
});

router.get('/mytickets', function(req, res, next) {
  res.render('mytickets', { });
});

router.get('/last-trips', function(req, res, next) {
  res.render('last-trips', { });
});



// -----------------------------------------------------------
//
//                       -= Functions =-
//
//*************************************************************

function entrerUser(req){
  var user = findUser(req.body.email);
  if (user.pass == req.body.pass){
    req.session.user = user;
  }
}


async function findUser(email){
  var user = await usersModel.findOne({email});
  return user;
}

async function newUser(req){
  console.log('creation new user');
  var testUser = await findUser(req.body.name);
  if (testUser != null){
    console.log('email existant');
  }else{
    var user = new usersModel({
      email : req.body.email,
      pass : req.body.pass,
      voyage : []
    });
    var idUser = await user.save();
    req.session.user = user;
  }
}


module.exports = router;
