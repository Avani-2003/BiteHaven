require('../models/database');
const Category = require('../models/Category');
const Recipe = require('../models/Recipe');

/**
 * GET
 * Homepage
 */
exports.homepage = async (req, res) => {
  try {
    const limitNumber = 4;
    const categories = await Category.find({}).limit(5);
    const latest = await Recipe.find({}).sort({ _id: -1 }).limit(limitNumber);
    const thai = await Recipe.find({ 'category': 'Thai' }).limit(limitNumber);
    const american = await Recipe.find({ 'category': 'American' }).limit(limitNumber);
    const chinese = await Recipe.find({ 'category': 'Chinese' }).limit(limitNumber);
    
    const food = { latest , thai , american , chinese };    
   
    res.render('index', { title: 'PickUs - HomePage', categories, food  });
  } catch (error) {
    res.satus(500).send({ message: error.message || "Error Occured" });
  }
}

/**
 * GET/categories
 * Categories
 */
exports.exploreCategories = async (req, res) => {
  try {
    const limitNumber = 20;
    const categories = await Category.find({}).limit(limitNumber);
    res.render('categories', { title: 'PickUs - Categories', categories });
  } catch (error) {
    res.satus(500).send({ message: error.message || "Error Occured" });
  }
}


/**
 * GET/categories/:id
 * Categories
 */
exports.exploreCategoriesById = async (req, res) => {
  try {
    let categoryId = req.params.id;
    const limitNumber = 20;
    const categoryById = await Recipe.find({'category' : categoryId}).limit(limitNumber);
    res.render('categories', { title: 'PickUs- Categories', categoryById });
  } catch (error) {
    res.satus(500).send({ message: error.message || "Error Occured" });
  }
}


/**
 * GET/recipe/:id
 * Recipe
 */
exports.exploreRecipe = async (req, res) => {
  try {
    const recipeId = req.params.id;
    const recipe = await Recipe.findById(recipeId);
    res.render('recipe', { title: 'PickUs - Recipe', recipe });
  } catch (error) {
    res.satus(500).send({ message: error.message || "Error Occured" });
  }
}

/**
 * GET/About/:id
 * Recipe
 */
exports.about = async(req,res) =>{    
  res.render('about',{title:'PickUs- About Us'});
}

/**
 * GET/Contact
 * Recipe
 */
exports.contact = async(req,res) =>{    
  res.render('contact',{title:'PickUs- Contact Us'});
}


/**
 * POST/search
 * Search
 */

exports.searchRecipe = async (req, res) => {

try {
  let searchTerm = req.body.searchTerm;
  let recipe = await Recipe.find({ $text: {$search: searchTerm, $diacriticSensitive: true}});
  res.render('search', { title: 'PickUs - Search' , recipe });
} catch (error) {
  res.satus(500).send({ message: error.message || "Error Occured" });  
}
}


/**
 * GET/explore-latest
 * Explore Latest
 */
exports.exploreLatest = async (req, res) => {
  try {
    const limitNumber = 20;
    const recipe = await Recipe.find({}).sort({ _id: -1}).limit(limitNumber);
    res.render('explore-latest', { title: 'PickUs - Latest Recipes', recipe });
  } catch (error) {
    res.satus(500).send({ message: error.message || "Error Occured" });
  }
}

/**
 * GET/explore-random
 * Explore Random
 */
exports.exploreRandom = async (req, res) => {
  try {
    let count = await Recipe.find().countDocuments();
    let random = Math.floor(Math.random() * count);
    let recipe = await Recipe.findOne().skip(random).exec();
    // res.json(recipe);
    res.render('explore-random', { title: 'PickUs - Random Recipes', recipe });
  } catch (error) {
    res.satus(500).send({ message: error.message || "Error Occured" });
  }
}

/**
 * GET/submit-recipe
 * Submit Recipe
 */
exports.submitRecipe = async (req, res) => {
  const infoErrorsObj = req.flash('infoErrors');
  const infoSubmitObj = req.flash('infoSubmit');
  res.render('submit-recipe', { title: 'PickUs - Submit Recipes' , infoErrorsObj, infoSubmitObj });
}

/**
 * POST /submit-recipe
 * Submit Recipe
 */
exports.submitRecipeOnPost = async (req, res) => {
  try {
    
    let imageUploadFile;
    let uploadPath;
    let newImageName;

    if(!req.files || Object.keys(req.files).length===0)
    {
      console.log('No Files Where Uploaded.');
    }else{
      imageUploadFile = req.files.image;
      newImageName = Date.now() + imageUploadFile.name;
      
      uploadPath = require('path').resolve('./') + '/public/uploads/' + newImageName;

      imageUploadFile.mv(uploadPath , function(err){
        if(err) return res.satus(500).send(err);
      })
    }

    const newRecipe = new Recipe({
      name: req.body.name,
      description: req.body.description,
      email: req.body.email,
      ingredients: req.body.ingredients,
      category: req.body.category,
      image: newImageName
    });
    await newRecipe.save();
    req.flash('infoSubmit' , 'Recipe has been added.')
    res.redirect('/submit-recipe');
  } catch (error) {
    req.flash('infoErrors',error);
    res.redirect('/submit-recipe');    
  }
}

// async function insertDymmyRecipeData(){
//   try {
//     await Recipe.insertMany([
//       {
//         "name": "Recipe Name Goes Here",
//         "description": `Recipe Description Goes Here`,
//         "email": "recipeemail@raddy.co.uk",
//         "ingredients": [
//           "1 level teaspoon baking powder",
//           "1 level teaspoon cayenne pepper",
//           "1 level teaspoon hot smoked paprika",
//         ],
//         "category": "American",
//         "image": "southern-friend-chicken.jpeg"
//       },
//       {
//         "name": "Recipe Name Goes Here",
//         "description": `Recipe Description Goes Here`,
//         "email": "recipeemail@raddy.co.uk",
//         "ingredients": [
//           "1 level teaspoon baking powder",
//           "1 level teaspoon cayenne pepper",
//           "1 level teaspoon hot smoked paprika",
//         ],
//         "category": "American",
//         "image": "southern-friend-chicken.jpeg"
//       },
//     ]);
//   } catch (error) {
//     console.log('err', + error)
//   }
// }

// insertDymmyRecipeData();





// async function insertDymmyCategoryData(){
//   try{
//     await Category.insertMany([
//       {
//         "name": "Thai",
//         "image": "thai-food.jpeg"
//       },
//       {
//         "name": "American",
//         "image": "burger.jpg"
//       },
//       {
//         "name": "Chinese",
//         "image": "chinese.jpeg"
//       },
//       {
//         "name": "Mexican",
//         "image": "mexican.jpeg"
//       },
//       {
//         "name": "Indian",
//         "image": "indian.jpeg"
//       },
//       {
//         "name": "Spanish",
//         "image": "spanish.jpeg"
//       }
//     ]);
//   }catch (error){
//     console.log('err', + error)
//   }
// }

// insertDymmyCategoryData();