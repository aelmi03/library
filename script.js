const addButton = document.querySelector(`.addBook`);
const form = document.querySelector("form");
form.style.cssText = "transform:scale(0);";
addButton.addEventListener("click", popUp);
console.log(addButton);
let library = [];
function popUp(){
    if(form.style.cssText === "transform: scale(0);"){
        form.style.cssText = "transform: scale(1);";
    }
    else{
        form.style.cssText = "transform: scale(0);"
    }
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
