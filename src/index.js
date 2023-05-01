// write your code here

const ramenName = document.querySelector(".name");
const ramenMenu = document.getElementById("ramen-menu");
const detailImage = document.querySelector(".detail-image");
const restaurant = document.querySelector(".restaurant");
const ratingDisplay = document.getElementById("rating-display");
const commentDisplay = document.getElementById("comment-display");
const createRamenForm = document.getElementById("new-ramen");
const editRamenForm = document.getElementById("edit-ramen");

//DOM
document.addEventListener("DOMContentLoaded", () => {
  fetch("http://localhost:3000/ramens")
    .then((resp) => resp.json())
    .then((data) => data.forEach(createAndAttachRamenImages));

  fetch("http://localhost:3000/ramens")
    .then((resp) => resp.json())
    .then((firstRamen) => {
      detailImage.src = firstRamen[0].image;
      detailImage.id = firstRamen[0].id;
      detailImage.alt = firstRamen[0].name;
      ramenName.textContent = firstRamen[0].name;
      restaurant.textContent = firstRamen[0].restaurant;
      ratingDisplay.textContent = firstRamen[0].rating;
      commentDisplay.textContent = firstRamen[0].comment;
    });
});

//image creation
function createAndAttachRamenImages(ramen) {
  const image = document.createElement("img");
  image.setAttribute("src", ramen.image);
  image.setAttribute("id", ramen.id);
  ramenMenu.appendChild(image);

  image.addEventListener("click", imageEventHandler);

  image.addEventListener("dblclick", deleteEventHandler);

  function deleteEventHandler(e) {

    const confirmed = confirm("Are you sure you want to delete?");
    if (confirmed) {
      fetch(`http://localhost:3000/ramens/${ramen.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
    }
    e.target.remove();
    ramenName.textContent = "Insert Name Here";
    restaurant.textContent = "Insert Restaurant Here";
    detailImage.src = "assets/image-placeholder.jpg";
    ratingDisplay.textContent = "Insert rating here ";
    commentDisplay.textContent = "Insert comment here";
  }

  function imageEventHandler(e) {
    detailImage.src = ramen.image;
    detailImage.setAttribute("id", ramen.id);
    detailImage.alt = ramen.name;

    ramenName.textContent = ramen.name;

    restaurant.textContent = ramen.restaurant;

    ratingDisplay.textContent = ramen.rating;

    commentDisplay.textContent = ramen.comment;
  }
}

createRamenForm.addEventListener("submit", newRamenEventHandler);

editRamenForm.addEventListener("submit", editRamenEventHandler);

function newRamenEventHandler(e) {
  e.preventDefault();
  const configurationObject = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      name: e.target[0].value,
      restaurant: e.target[1].value,
      image: e.target[2].value,
      rating: e.target[3].value,
      comment: e.target[4].value,
    }),
  };
  fetch("http://localhost:3000/ramens", configurationObject)
    .then((resp) => resp.json())
    .then((data) => {
      const newImage = document.createElement("img");
      newImage.src = data.image;
      newImage.addEventListener("click", newRamenAddedEventHandler);
      newImage.addEventListener("dblclick", newRamenAddedDeleteEventHandler);
      ramenMenu.appendChild(newImage);


      function newRamenAddedEventHandler(e) {
        ratingDisplay.textContent = data.rating;
        commentDisplay.textContent = data.comment;
        detailImage.src = data.image;
        detailImage.alt = data.name;
        ramenName.textContent = data.name;
        restaurant.textContent = data.restaurant;
      }

      function newRamenAddedDeleteEventHandler(e) {
        const confirmed = confirm("Are you sure you want to delete?");
        if (confirmed) {
          fetch(`http://localhost:3000/ramens/${data.id}`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
          });
        }
        e.target.remove();
        ramenName.textContent = "Insert Name Here";
        restaurant.textContent = "Insert Restaurant Here";
        detailImage.src = "assets/image-placeholder.jpg";
        ratingDisplay.textContent = "Insert rating here ";
        commentDisplay.textContent = "Insert comment here";
      }
    });

  createRamenForm.reset();
}
function editRamenEventHandler(e) {
  e.preventDefault();
  fetch(`http://localhost:3000/ramens/${detailImage.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      rating: e.target[0].value,
      comment: e.target[1].value,
    }),
  })
  .then(resp=>resp.json())
  .then(data=>{
    console.log(data)
    ratingDisplay.textContent = data.rating
    commentDisplay.textContent = data.comment
  })
   editRamenForm.reset();
}