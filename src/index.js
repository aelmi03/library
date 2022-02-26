import "./reset.css";
import "./styles.css";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
} from "firebase/auth";
import {
  collection,
  addDoc,
  addDocs,
  serverTimestamp,
  getFirestore,
  query,
  getDocs,
  setDoc,
  doc,
  onSnapshot,
  deleteDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import uniqid from "uniqid";
const addButton = document.querySelector(`.addBook`);
const titleTextArea = document.querySelector(`input[name = "title"]`);
const authorTextArea = document.querySelector(`input[name = "author"]`);
const pagesTextArea = document.querySelector(`input[name = "pageNumber"]`);
const hasReadCheckBox = document.querySelector(`input[type = "checkbox"]`);
const form = document.querySelector("form");
const submitButton = document.querySelector("#submit");
const booksHolder = document.querySelector(".booksHolder");
submitButton.addEventListener("click", getInformationFromForm);
const warningText = document.querySelector("p");
form.style.cssText = "transform:scale(0);";
const blurs = document.querySelector(".blur");
const authButton = document.querySelector(".sign-up-or-login");
authButton.addEventListener("click", changeAuthStatus);
addButton.addEventListener("click", popUp);

const firebaseConfig = {
  apiKey: "AIzaSyDTcGl_vyPwYQnu8yPVZ-rHrmpoh0vrThQ",
  authDomain: "library-c396e.firebaseapp.com",
  projectId: "library-c396e",
  storageBucket: "library-c396e.appspot.com",
  messagingSenderId: "922191088626",
  appId: "1:922191088626:web:1ba16140209fe82b33396b",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
initFirebaseAuth();
initializeStorageIfEmpty();
let library;
initializeLibrary();
function initializeStorageIfEmpty() {
  if (localStorage.getItem("Books") == null) {
    localStorage.setItem("Books", JSON.stringify([]));
  }
}
function initFirebaseAuth() {
  onAuthStateChanged(getAuth(), handleAuthChanged);
}
function handleAuthChanged(user) {
  if (user) {
    authButton.textContent = "Sign Out";
  } else {
    authButton.textContent = "Log in";
  }
  initializeLibrary();
}
function changeAuthStatus() {
  if (!getAuth().currentUser) {
    const provider = new GoogleAuthProvider();
    signInWithPopup(getAuth(), provider);
  } else {
    signOut(getAuth());
  }
}
function displayBooks() {
  booksHolder.textContent = "";
  library.forEach((book) => displayNewBook(book));
}
class Book {
  constructor(titleOfBook, authorOfBook, pagesOfBook, hasReadBook) {
    this.title = titleOfBook;
    this.author = authorOfBook;
    this.pages = pagesOfBook;
    this.hasRead = hasReadBook;
  }
  info() {
    const hasReadString = this.hasRead ? "has read" : "not read yet";
    return `${this.title} by ${this.author}, ${this.pages} pages, ${hasReadString}`;
  }
}
async function initializeLibrary() {
  library = [];
  if (!getAuth().currentUser) {
    console.log("USER NOT LOGGIN IN");
    library = JSON.parse(localStorage.getItem("Books"));
    displayBooks();
  } else {
    console.log("LOGGGED INUSER ");
    await loadBooksDB();
  }
  displayBooks();
}
async function loadBooksDB() {
  const booksQuery = query(
    collection(getFirestore(), "books"),
    where("userId", "==", `${getAuth().currentUser.uid}`)
  );
  onSnapshot(booksQuery, function (snapshot) {
    library = snapshot.docs.map((doc) => doc.data());
    displayBooks();
  });
}
async function addBookDB(title, author, pages, hasRead) {
  const bookDoc = await addDoc(collection(getFirestore(), `books`), {
    title,
    author,
    pages,
    hasRead,
    userId: getAuth().currentUser.uid,
  });
  updateDoc(bookDoc, {
    bookID: bookDoc.id,
  });
}
async function changeReadStatusDB(bookObject) {
  const bookDoc = doc(getFirestore(), "books", `${bookObject.bookID}`);
  updateDoc(bookDoc, {
    hasRead: !bookObject.hasRead,
  });
}
function checkIfAnyFieldIsEmpty() {
  if (
    titleTextArea.checkValidity() &&
    authorTextArea.checkValidity() &&
    pagesTextArea.checkValidity()
  ) {
    return false;
  }
  return true;
}
function getInformationFromForm() {
  if (checkIfAnyFieldIsEmpty() === true || containsTitle(titleTextArea.value)) {
    warningText.style.cssText = "display: block";
    return;
  }
  if (getAuth().currentUser) {
    addBookDB(
      titleTextArea.value,
      authorTextArea.value,
      pagesTextArea.value,
      hasReadCheckBox.checked
    );
  } else {
    addBookToLibrary(
      titleTextArea.value,
      authorTextArea.value,
      pagesTextArea.value,
      hasReadCheckBox.checked
    );
  }

  warningText.style.cssText = "display:none";
  form.style.cssText = "transform: scale(0)";
  blurs.style.cssText = "opacity: 0";
  resetForm();
}
function resetForm() {
  titleTextArea.value = "";
  authorTextArea.value = "";
  pagesTextArea.value = "";
  hasReadCheckBox.checked = false;
}
function popUp() {
  if (form.style.cssText === "transform: scale(0);") {
    form.style.cssText = "transform: scale(1);";
    blurs.style.cssText = "opacity: 0.7";
  } else {
    form.style.cssText = "transform: scale(0);";
    blurs.style.cssText = "opacity: 0";
  }
}

function addBookToLibrary(title, author, pages, hasRead) {
  const newBook = new Book(title, author, pages, hasRead);
  library.push(newBook);
  localStorage.setItem("Books", JSON.stringify(library));
  displayNewBook(newBook);
}

function displayNewBook(book) {
  const bookDiv = document.createElement("div");
  bookDiv.classList.add("book");
  const titleHeader = document.createElement("h2");
  titleHeader.textContent = book.title;
  const authorHeader = document.createElement("h3");
  authorHeader.textContent = book.author;
  const pagesHeader = document.createElement("h3");
  pagesHeader.textContent = book.pages + " pages";
  const readButton = document.createElement("button");
  readButton.textContent = changeReadCheckBoxText(book.hasRead);
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
  bookDiv.addEventListener("click", editBook);
}
function removeFromDB(bookObject) {
  deleteDoc(doc(getFirestore(), `books/${bookObject.bookID}`));
}
function editBook(e) {
  if (e.target.classList.contains("book")) return;
  const parentDiv = e.target.parentNode;
  const bookObject = findObjectFromBookDiv(parentDiv);
  if (e.target.classList.contains("delete")) {
    if (getAuth().currentUser) {
      removeFromDB(bookObject);
    } else {
      removeFromLibrary(bookObject);
      e.target.parentNode.parentNode.removeChild(e.target.parentNode);
      localStorage.setItem("Books", JSON.stringify(library));
    }
  } else if (e.target.classList.contains("read")) {
    if (getAuth().currentUser) {
      changeReadStatusDB(bookObject);
    } else {
      changeReadStaus(bookObject);
      e.target.textContent = changeReadCheckBoxText(bookObject.hasRead);
      localStorage.setItem("Books", JSON.stringify(library));
    }
  }
}
function changeReadStaus(book) {
  if (book.hasRead) {
    book.hasRead = false;
    return;
  }
  book.hasRead = true;
}
function removeFromLibrary(book) {
  for (let i = 0; i < library.length; i++) {
    if (library[i] === book) {
      library.splice(i, 1);
    }
  }
}
function findObjectFromBookDiv(div) {
  const text = div.firstChild.textContent;
  for (let i = 0; i < library.length; i++) {
    if (library[i].title === text) {
      return library[i];
    }
  }
}
function containsTitle(name) {
  for (let i = 0; i < library.length; i++) {
    if (library[i].title === name) {
      return true;
    }
  }
  return false;
}
function changeReadCheckBoxText(result) {
  if (result === false) {
    return "Not Read";
  }
  return "Read";
}
