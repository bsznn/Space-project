const messageContainer = document.getElementById("message-container");
const message = localStorage.getItem("message");
const messageType = localStorage.getItem("messageType");

if (message && messageType) {
  messageContainer.innerHTML = `<p class="${messageType}">${message}</p>`;
  localStorage.removeItem("message");
  localStorage.removeItem("messageType");

  setTimeout(() => {
    messageContainer.innerHTML = "";
  }, 3000);
}

function displayMessage(message, isSuccess) {
  localStorage.setItem("message", message);
  localStorage.setItem("messageType", isSuccess ? "success" : "error");
}

async function createArticle(event) {
  event.preventDefault();

  try {
    displayMessage("L'article a été posté avec succès !", true);
    window.location.href = "blog.html";
  } catch {
    console.error("Erreur lors de la création de l'article !");
    displayMessage("L'article n'a pas été posté. Veuillez réessayer !", false);
  }
}

async function editArticle(event) {
  event.preventDefault();

  try {
    displayMessage("L'article a été modifié avec succès !", true);
    window.location.href = "blog.html";
  } catch {
    console.error("Erreur lors de la modification de l'article !");
    displayMessage(
      "L'article n'a pas été modifié. Veuillez réessayer !",
      false
    );
  }
}

async function deleteArticle() {
  try {
    displayMessage("L'article a été supprimé avec succès !", true);
    window.location.href = "blog.html";
  } catch {
    console.error("Erreur lors de la suppression de l'article !");
    displayMessage(
      "L'article n'a pas été supprimé. Veuillez réessayer !",
      false
    );
  }
}

const createForm = document.querySelector(".form--add-post");
if (createForm) {
  createForm.addEventListener("submit", createArticle);
}

const editForm = document.querySelector(".form--edit-post");
if (editForm) {
  editForm.addEventListener("submit", editArticle);
}

const deleteButtons = document.querySelectorAll(".button-red");
deleteButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const articleId = button.dataset.articleId;
    deleteArticle(articleId);
  });
});
