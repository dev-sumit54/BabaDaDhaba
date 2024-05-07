//  accessing DOM elements for user interaction.
let searched_Meal = document.getElementById("search-bar");
let meals_Container = document.getElementById("meals-div");
let favourite_Meal = document.getElementById("favourite-meal");
let header = document.getElementById("header");
let homeBtn = document.getElementById("home-btn");

let all_Meal_URL;
let fav_meal_array = [];

// Function to add or remove meal from favorites.
function addtoFavourite(mealId) {
  let meal = localStorage.getItem("favourite_meal_Item");
  let element = document.getElementById("fav-" + mealId);
  mealId = mealId.toString();
  if (meal !== null) {
    meal = meal.split(",");
    if (meal.includes(mealId)) {
      let newMeal = meal.filter(function (item) {
        return item !== mealId;
      });
      fav_meal_array = newMeal;
      element.style.color = "#d6d5d5";
    } else {
      meal.push(mealId);
      fav_meal_array = meal;
      element.style.color = "red";
    }
  } else {
    fav_meal_array.push(mealId);
    element.style.color = "red";
  }
  localStorage.setItem("favourite_meal_Item", fav_meal_array);
}
//Adding and removing meal from more details page
function addtoFavouriteFromMoreDetails(mealId) {
  let btn = document.getElementById("AddfromMoreDetails");
  let meal = localStorage.getItem("favourite_meal_Item"); //1
  mealId = mealId.toString();
  if (meal !== null) {
    meal = meal.split(",");
    if (meal.includes(mealId)) {
      let newMeal = meal.filter(function (item) {
        return item !== mealId;
      });
      fav_meal_array = newMeal;
      btn.innerText = "Add to Favourite";
      btn.className = btn.className.replace("btn-danger", "btn-primary");
    } else {
      meal.push(mealId);
      fav_meal_array = meal;
      btn.innerText = "Remove from Favourite";
      btn.className = btn.className.replace("btn-primary", "btn-danger");
    }
  } else {
    fav_meal_array.push(mealId);
    btn.innerText = "Remove from Favourite";
    btn.className = btn.className.replace("btn-primary", "btn-danger");
  }
  localStorage.setItem("favourite_meal_Item", fav_meal_array);
}
// Fumction to get the all searched meal from api
function showSearchedmeal() {
  let keyword = searched_Meal.value;
  all_Meal_URL = `https://www.themealdb.com/api/json/v1/1/search.php?s=${keyword}`;
  showResult(all_Meal_URL);
}

//show all the meals fetched from an API
async function showResult(URL) {
  const response = await fetch(URL);
  if (!response.ok) {
    console.error("Failed to fetch data:", response.status);
    return; // Exit function if response is not OK
  }
  const data = await response.json();

  meals_Container.innerHTML = "";
  for (let meals of data.meals) {
    let favouriteMeal = localStorage.getItem("favourite_meal_Item");
    let color = "#d6d5d5";
    if (favouriteMeal !== null) {
      if (favouriteMeal.includes(meals.idMeal)) {
        color = "red";
      }
    }

    meals_Container.innerHTML += `
    <div class ="col-md-3 mb-3">
    <div class="card" style="width: 18rem;">
    <img src="${meals.strMealThumb}" class="card-img-top" alt="...">
    <div class="card-body">
      <h5 class="card-title">${meals.strMeal}</h5>
      <a href="Javascript:void(0)" class="btn btn-primary" onclick="showDetails(${meals.idMeal}) ">More Details</a>
      <span class="favourite-btn" onclick="addtoFavourite(${meals.idMeal})"> <i class="fa fa-heart" id="fav-${meals.idMeal}" style="cursor:pointer;font-size:40px;color:${color}"></i></span>
    </div>
    </div>
    </div>
    `;
  }
}

//Display detailed information about a selected meal
async function showDetails(mealId) {
  header.style.display = "none";
  homeBtn.style.display = "block";
  const response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`
  );
  const data = await response.json();
  const mealdata = data.meals[0];

  meals_Container.innerHTML = "";
  let favouriteMeal = localStorage.getItem("favourite_meal_Item");
  let isFavourite = false;
  if (favouriteMeal !== null) {
    if (favouriteMeal.includes(mealdata.idMeal)) {
      isFavourite = true;
    }
  }
  meals_Container.innerHTML += `
    <div class ="col-md-12 mb-3" style = "margin-left:25%">
    <div class="card w-50">
    <img src="${mealdata.strMealThumb}" class="card-img-top meal-img" alt="...">
    <div class="card-body">
      <h5 class="card-title">${mealdata.strMeal}</h5>
      <p class="card-text">${mealdata.strInstructions}</p>
      <a href="javascript:void(0)" onclick = "addtoFavouriteFromMoreDetails(${
        mealdata.idMeal
      })" id="AddfromMoreDetails" class="btn ${
    isFavourite ? "btn-danger" : "btn-primary"
  }">${isFavourite ? "Remove From Favourite" : "Add to favourite"}</a>
      
    </div>
    </div>
    </div>
    </div>
    `;
}
//fetching and showing all the favorite meal
async function allFavoriteMeal() {
  let arr = localStorage.getItem("favourite_meal_Item");
  meals_Container.innerHTML = "";

  if (arr !== null) {
    let idArr = arr.split(",");
    if (idArr.length > 0) {
      for (let mealId of idArr) {
        if (mealId !== "") {
          const response = await fetch(
            `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`
          );
          const data = await response.json();
          const meals = data.meals[0];
          meals_Container.innerHTML += `
      <div class ="col-md-3 mb-3">
      <div class="card" style="width: 18rem;">
      <img src="${meals.strMealThumb}" class="card-img-top" alt="...">
      <div class="card-body">
        <h5 class="card-title">${meals.strMeal}</h5>
        <a href="Javascript:void(0)" class="btn btn-primary" onclick="showDetails(${meals.idMeal})">More Details</a>
        <a href="Javascript:void(0)" class="btn btn-danger mt-2" onclick="removefromFavourite(${meals.idMeal})">Remove From Favourite</a>
      </div>
      </div>
      </div>
      `;
        }
      }
    } else {
      meals_Container.innerHTML =
        "<h3 class ='text-center'>No Data Found...</h3>";
    }
  } else {
    meals_Container.innerHTML =
      "<h3 class ='text-center' >No Data Found...</h3>";
  }
}
//Remove meal from favorites and update the displayed list of favorite meals
function removefromFavourite(mealId) {
  let allmeal = localStorage.getItem("favourite_meal_Item");
  let arr = allmeal.split(",");

  let newMeal = arr.filter(function (item) {
    return item !== mealId.toString();
  });
  localStorage.setItem("favourite_meal_Item", newMeal);
  allFavoriteMeal();
}
// Return to home screen, clearing search input and displayed meal cards
function home() {
  header.style.display = "block";
  homeBtn.style.display = "none";
  searched_Meal.value = "";
  meals_Container.innerHTML = "";
}
// Adding all the event Listner.
searched_Meal.addEventListener("keyup", showSearchedmeal);
homeBtn.addEventListener("click", home);
favourite_Meal.addEventListener("click", allFavoriteMeal);
