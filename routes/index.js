var express = require('express');
var router = express.Router();
var journeyModel = require('../models/journey')
var usersModel = require('../models//users')

var city = ["Paris","Marseille","Nantes","Lyon","Rennes","Melun","Bordeaux","Lille"]
var date = ["2018-11-20","2018-11-21","2018-11-22","2018-11-23","2018-11-24"]



/* GET home page. */
router.get('/', function(req, res, next) {
  console.log(req.session.user);
  if (req.session.user == undefined || req.session.user == NaN){
    console.log('route pour index.ejs');
    res.render('index');
  }else{
    res.render('home', { name : req.session.user.login });
  }
});

router.get('/home', async function(req, res, next) {
  if (req.session.user == undefined || req.session.user == NaN){  
    res.redirect('/');
  }else{
    await entrerUser(req);
    res.render('home', {name : req.session.user.login });
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

router.get('/lasttrip', async function(req, res, next) {
  if (req.session.user == undefined || req.session.user == NaN){  
    res.render('index');
  }else{
    console.log('voyage: ', req.session.user.voyage);
    res.render('last-trip', {
      name : req.session.user.login, 
      listvoyage : req.session.user.voyage});
  }
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

  var journey = await journeyModel.find(
    {departure: req.body.dep,
      arrival: req.body.arr,
      date: req.body.date
    }
  );
 
  res.render('result', {journey, date: req.body.date});
});

router.get('/mytickets', async function(req, res, next) {
  await usersModel.updateOne(
    {$push: {voyage: req.query}}
    );
  var journey = await usersModel.findOne({
    email: req.session.user.email
  });
  console.log(journey);
  res.render('mytickets', {ticket:req.query});
});

router.get('/last-trips', function(req, res, next) {
  res.render('last-trips', { });
});



// -----------------------------------------------------------
//
//                       -= Functions =-
//
//*************************************************************

async function entrerUser(req){
  console.log('verification of user :', req.body.email);
  var user = await usersModel.findOne({email : req.body.email});
  console.log('user: ', user);
  if (user.pass == req.body.pass){
    req.session.user = user;
    console.log('user is connected');
  }else{
    console.log('error of verification password');
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
