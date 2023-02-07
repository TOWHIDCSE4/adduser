import Route from '@core/Routes';
const multer  = require('multer')
import { v4 as uuidv4 } from "uuid";
/**
 * Route:
 * Function:
 *    Method: get, post, put, delete, resource
 *    Route.<method>(path, Action).middleware([middleware1, middleware2])
 *    Ex: Route.get("/user", "UserController.index").middleware([auth])
 *    Route.resource("/user", "UserController")
 *
 *    Route.group(() =>{...}).prefix(path).middleware([middleware1, middleware2])
 *    Ex: Route.group(() =>{
 *        Route.get("/user", "UserController.index")
 *        Route.group("/user", "UserController.index")
 *        require("./setting") //load all router in ./setting.js
 *    }).prefix("/api/v1").middleware([auth])
 */


//  var upload = multer({ dest: '@root/../public/upload/' })
const DIR = './public/upload/';
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, DIR);
    },
    filename: (req, file, cb) => {
        const fileName = file.originalname.toLowerCase().split(' ').join('-');
        cb(null, uuidv4() + '-' + fileName)
    }
});
var upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
        }
    }
});
 Route.router.post('/upload', upload.single('profileImg'), function (req, res, next) {
  // req.file is the `avatar` file
  // req.body will hold the text fields, if there were any
  const url = req.protocol + '://' + req.get('host');
  //url + '/public/' + req.file.filename
  res.status(201).json({
    message: "User profile image upload successfully!",
    profileImg: url + '/public/upload/' + req.file.filename
  })
})
Route.router.get('/upload/test', function (req, res, next) {
  // req.file is the `avatar` file
  // req.body will hold the text fields, if there were any
  
  res.status(200).send("OK");
})
require("./arena")
require("./api")

require("./admin")
Route.get("/", function ({ request, response, next }) {
  response.redirect("/admin");
})
Route.get("/health", function ({ request, response, next }) {
  response.status(200).send("OK");
})

Route.router.use("/", require("express").static('@root/../public'));
Route.router.use("/public", require("express").static('@root/../public'));
