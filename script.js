let searched_Meal = document.querySelector("#search-bar");
let meals_Container = document.querySelector(".meals-div");
let favourite_Meal =document.querySelector(".favourite-meal");
let all_Meal_URL;
let meal_Array =[];

if(!localStorage.getItem("mealArray")){
  localStorage.setItem("mealArray",JSON.stringify(favourite_Meal));
}else{
  meal_Array=JSON.parse(localStorage.getItem(meal_Array));
}

searched_Meal.addEventListener('input', showSearchedmeal);
favourite_Meal.addEventListener('click', showFavouriteMeal);

function showSearchedmeal(){
  let keyword = searched_Meal.value;
  all_Meal_URL = `https://www.themealdb.com/api.php?s=${keyword}`;
  showResult(all_Meal_URL);
}

async function showResult(all_Meal_URL){
  try {
    const response = await fetch(all_Meal_URL);
    const data = await response.json();
    meals_Container.innerHTML='';
     
    let meals = data.meals[0];

    const div  = document.createElement('div');
    div.classList.add(details_page);
  } catch (error) {
    alert("404 ERROR");
  }
}