class Person {
  fullName
  email
  password
  id
  constructor(fullName, email, password, id) {
    this.fullName = fullName;
    this.email = email;
    this.password = password;
    this.id = id;
  }
}
    
function incrementId(){
  let currentId= localStorage.getItem("nextId");
  
  if (!currentId){
      localStorage.setItem("nextId" , 1 );
      return 1;
    }else {
      let newId = +currentId + 1;
      localStorage.setItem("nextId", newId);
      return newId;
    }
  }

let loggedInUser = localStorage.getItem("loggedinUser");
// if (loggedInUser) {
//   window.location.href = "../index.html";
// } 



function showRegisterForm() {
  document.getElementById("registerPopup").style.display = "block";
}

function closeRegisterForm() {
  document.getElementById("registerPopup").style.display = "none";
}

function registerUser(event) {
  event.preventDefault();

  let fullName = document.getElementById("fullName").value;
  let email = document.getElementById("email").value;
  let password = document.getElementById("password").value;

  let users = JSON.parse(localStorage.getItem("users")) || [];
  

  let userExists = users.find((u) => u.email === email);
  if (userExists) {
    swal("User already exists.");
    return;
  }

  let id = incrementId();
  let newUser = new Person(fullName, email, password , id);
  users.push(newUser);


  console.log("Users array after registration:", users);
  localStorage.setItem("users", JSON.stringify(users));

  document.getElementById("registerPopup").style.display = "none";

  swal("Account created! Now log in")
  fullName.value.innerHtml = ""
}

function loginUser(event) {
  event.preventDefault();
  let email = document.getElementById("loginEmail");
  let password = document.getElementById("loginPassword");

  let users = JSON.parse(localStorage.getItem("users")) || [];
console.log(users);
  let match = users.find((u) => u.email === email.value && u.password === password.value);

  if (match) {
    localStorage.setItem("loggedinUser", JSON.stringify(match));
// window.location.href = "./facebook-page/index.html";
    swal("Congratulations! Login Succesfully").then(() => {
      window.location.href = "./dashboard-page/index.html";
    });
  } 
  else{
    swal("Invalid credentials.");
  }
}
