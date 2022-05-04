var mealData;

var meal_name = document.querySelector('.meal_name');
var meal_recipe_image = document.querySelector('.meal_recipe--image');
var meal_details = document.querySelector('.meal_details');
var meal_recipe_text = document.querySelector('.meal_recipe--text');
var meal_ingredients = document.querySelector('.meal_ingredients');
var meal_video = document.querySelector('.meal_video');

var normal__category = document.querySelector('.normal--category');
var normal__area = document.querySelector('.normal--area');
var normal__tags = document.querySelector('.normal--tags');
var normal__drinks = document.querySelector('.normal--drinks');
var ingredient__list = document.querySelector('.ingredient-list');
var loader = document.querySelector('.lds-hourglass');

document.addEventListener('DOMContentLoaded', function () {
    // Fetch random meal on click
    document.querySelector('#get_meal').addEventListener('click', function () {
        // Changing Loader State for display while loading
        loader.style.opacity = 1;
        loader.style.zIndex = 2;
        document.querySelector('#display_meal').style.display = 'none';
        setTimeout(
            () => {
                resetDOM();
                fetchMeal();
                loader.style.display = 'none';
            }, 2000
        )
    });

    document.querySelector('#search_meal').addEventListener('click', function () {
        // Fetching user entered string
        var searchString = document.querySelector('#recipe_name').value;

        // Changing Loader State for display while loading
        loader.style.opacity = 1;
        loader.style.zIndex = 2;
        document.querySelector('#display_meal').style.display = 'none';
        setTimeout(
            () => {
                resetDOM();
                fetchMealByName(searchString);
                loader.style.display = 'none';
            }, 2000
        )
    });
});

function resetDOM() {
    meal_name.innerHTML = null;
    meal_recipe_image.innerHTML = null;
    meal_recipe_text.innerHTML = null;
    meal_name.innerHTML = null;
    ingredient__list.innerHTML = null;

    normal__category.innerHTML = null;
    normal__area.innerHTML = null;
    normal__tags.innerHTML = null;
    normal__drinks.innerHTML = null;
}

function fetchMeal() {
    var promise = fetch('https://www.themealdb.com/api/json/v1/1/random.php');

    promise
        .then(response => response.json())
        .then(data => {
            mealData = data.meals[0];
            if (mealData.idMeal !== undefined) {
                displayMeal();
                fetching = false;
            }
        })
        .catch(error => {
            alert('Our servers are down. Right now!');
        })
}

function fetchMealByName(name){
    var promise = fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${name}`);

    promise
        .then(response => response.json())
        .then(data => {
            console.log(data);
            mealData = data.meals[0];
            if (mealData.idMeal !== undefined) {
                displayMeal();
                fetching = false;
            }
        })
        .catch(error => {
            alert('Could not find recipe with the name entered. Please enter another name');
        })
}

function displayMeal() {
    loader.style.zIndex = -2;
    loader.style.opacity = 0;

    document.querySelector('#display_meal').style.display = 'block';

    //Add the name
    meal_name.textContent = mealData.strMeal;

    //Add the image
    const image = document.createElement('img');
    image.setAttribute('src', mealData.strMealThumb);
    image.setAttribute('alt', mealData.strMeal);
    meal_recipe_image.appendChild(image);

    //Add recipe
    var para = document.createElement('p');
    var textNode = document.createTextNode(mealData.strInstructions);
    para.appendChild(textNode);
    meal_recipe_text.appendChild(para);

    //Add Details
    normal__category.textContent = mealData.strCategory;
    normal__area.textContent = mealData.strArea;
    normal__tags.textContent = mealData.strTags;
    normal__drinks.textContent = mealData.strDrinkAlternate;

    //Add ingredients to list
    for (var i = 1; i <= 20; i++) {
        let IngredientId = "strIngredient" + i;
        if (mealData[IngredientId] !== "" && mealData[IngredientId] !== null) {
            var ingredientName = mealData[IngredientId];
            var li = document.createElement('li');
            let image = document.createElement('img');
            image.setAttribute('src','mealdb_assets/food.png')
            li.appendChild(image);
            li.innerHTML += ingredientName;
            ingredient__list.appendChild(li);
        }
    }

    //Add video to DOM
    var embedLink = mealData.strYoutube.split("/")[3].split("=")[1];
    meal_video.innerHTML = `<iframe width="100%" height="500px" src="https://www.youtube.com/embed/${embedLink}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
}
