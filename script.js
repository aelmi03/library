const addButton = document.querySelector(`.addBook`);
const titleTextArea = document.querySelector(`input[name = "title"]`);
const authorTextArea = document.querySelector(`input[name = "author"]`);
const pagesTextArea = document.querySelector(`input[name = "pageNumber"]`);
const hasReadCheckBox = document.querySelector(`input[type = "checkbox"]`);
const form = document.querySelector("form");
const submitButton = document.querySelector("#submit");
const booksHolder = document.querySelector(".booksHolder");
console.log(booksHolder);
submitButton.addEventListener("click", getInformationFromForm);
form.style.cssText = "transform:scale(0);";
addButton.addEventListener("click", popUp);
console.log(addButton);
let library = [];
console.log(checkIfAnyFieldIsEmpty())
function checkIfAnyFieldIsEmpty(){
    if(titleTextArea.checkValidity() && authorTextArea.checkValidity() && pagesTextArea.checkValidity()){
        return false;
    }
    return true;
}
function getInformationFromForm(){
    if(checkIfAnyFieldIsEmpty() === true){
       return;
    }  
    addBookToLibrary(titleTextArea.value, authorTextArea.value, pagesTextArea.value, hasReadCheckBox.checked);
    form.style.cssText = "transform: scale(0)";
    resetForm();
    console.table(library);  
}
function resetForm(){
    titleTextArea.value = "";
    authorTextArea.value = "";
    pagesTextArea.value = "";
    hasReadCheckBox.checked = false;
}
function popUp(){
    if(form.style.cssText === "transform: scale(0);"){
        form.style.cssText = "transform: scale(1);";
    }
    else{
        form.style.cssText = "transform: scale(0);"
    }
}

function addBookToLibrary(title,author,pages,hasRead){
    const newBook = new Book(title,author,pages,hasRead);
    library.push(newBook);
    displayNewBook(newBook);
}

function displayNewBook(book){
    const bookDiv = document.createElement("div");
    bookDiv.classList.add("book");
    const titleHeader = document.createElement("h2");
    titleHeader.textContent = book.title;
    const authorHeader = document.createElement("h3");
    authorHeader.textContent = book.author;
    const pagesHeader = document.createElement("h3");
    pagesHeader.textContent = book.pages + " pages";
    const readButton = document.createElement("button");
    readButton.textContent = changeReadCheckBoxText(hasReadCheckBox.checked);
    readButton.classList.add("cardButton");
    readButton.classList.add("read");
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.classList.add("cardButton");
    deleteButton.classList.add("delete");
    bookDiv.appendChild(titleHeader);
    bookDiv.appendChild(authorHeader);
    bookDiv.appendChild(pagesHeader);
    bookDiv.appendChild(readButton);
    bookDiv.appendChild(deleteButton);
    booksHolder.appendChild(bookDiv);

}
function changeReadCheckBoxText(result){
    if(result === false){
        return "Not Read";
    }
    return "Read";
}
function Book(title, author, pages, hasRead){
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.hasRead = hasRead;
    this.info = function(){
        const hasReadString = (this.hasRead)? "has read" :  "not read yet";
        return `${this.title} by ${this.author}, ${this.pages} pages, ${hasReadString}`;
    }
}
