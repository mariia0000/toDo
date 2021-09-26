const userInput = document.querySelector("input")
const button = document.querySelector(".form-button")
const toDoList = document.querySelector(".to-do-list")

const themeButtons = document.querySelectorAll(".theme-selector")

for (let index = 0; index < themeButtons.length; index++) {
    const element = themeButtons[index];
    
    element.addEventListener("click", function (event) {
        if(event.target.dataset.theme){
            const root = document.documentElement
            root.setAttribute("data-theme", event.target.dataset.theme)
        }
    })
}


button.addEventListener("click", addToDo)
toDoList.addEventListener("click", function (event) {
   deleteToDo(event)
   checkToDo(event)
} )

document.addEventListener("DOMContentLoaded", getToDos)


function addToDo(event) {
    event.preventDefault()

    const toDoValue = userInput.value

    if (toDoValue === ""){
        alert("enter something")
} else {
    saveLocalStorage(toDoValue)
    userInput.value = ""


    fetch("https://jungle-todo-list.herokuapp.com/", {method:"POST", body: JSON.stringify({title: toDoValue, is_done: false}) , credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },} )
    .then( (response)=>{return response.json() } )
    .then( (data)=>{render(data.title, data._id, data.is_done) } )
}
}

function render(toDoValue, toDoID, isDone){
    const toDoDiv = document.createElement( "div" )
    toDoDiv.classList.add( "to-do" )
toDoDiv.setAttribute("data-id", toDoID)

if(isDone){
    toDoDiv.classList.add("checked")
}
    const toDoLi = document.createElement( "li" )

    toDoLi.innerText = toDoValue
    toDoLi.classList.add( "to-do-item" )
    toDoDiv.appendChild(toDoLi)

    const toDoDelete = document.createElement( "button" )
    toDoDelete.classList.add("delete-btn", "standart-theme-button")
    toDoDelete.setAttribute("data-delete_ID", toDoID)
    toDoDelete.innerHTML = '<i class="fas fa-trash"></i>'
    toDoDiv.appendChild(toDoDelete)

    const toDoCheck = document.createElement( "button" )
    toDoCheck.setAttribute("data-check_ID", toDoID)
    toDoCheck.classList.add("check-btn", "standart-theme-button")
    toDoCheck.innerHTML = `<i class="fas fa-check"></i>`
    toDoDiv.appendChild(toDoCheck)


    toDoList.appendChild(toDoDiv)
}


function saveLocalStorage(toDo){
    let toDos;

    if ( !localStorage.getItem("toDoItems") ){
        toDos = []

    } else {
        toDos = JSON.parse( localStorage.getItem("toDoItems") ) 
    }

    toDos.push(toDo)
    localStorage.setItem("toDoItems", JSON.stringify(toDos) )
}


function getToDos(){
    // let toDos;

    fetch("https://jungle-todo-list.herokuapp.com/")
    .then( (response)=>{return response.json()} )
    .then( (data)=>{ 
        data.forEach(element => {
            render(element.title, element._id, element.is_done)
        });
    } )

//     if ( !localStorage.getItem("toDoItems") ){
//         toDos = []

//     } else {
//         toDos = JSON.parse( localStorage.getItem("toDoItems") ) 
//     }

//     toDos.forEach(element => {
//         render(element)
//     });
 }



function deleteToDo(event){
    const item = event.target
    const IdFromButton = item.dataset.delete_id || item.parentElement.dataset.delete_id
    console.log(IdFromButton)

if(IdFromButton){
    const toDoItems = document.querySelectorAll(".to-do")
    for (let index = 0; index < toDoItems.length; index++) {
        const toDo = toDoItems[index];
        if (toDo.dataset.id === IdFromButton){
            fetch(`https://jungle-todo-list.herokuapp.com/${IdFromButton}`, {method:"DELETE" , credentials: "same-origin",
            headers: {
              "Content-Type": "application/json",
            },} )
            .then( ()=>{
                 toDo.classList.add("fall")
                 toDo.remove()
            } 
            )
        }
    }

}

    // if (item.classList.contains("delete-btn")){
    //     item.parentElement.classList.add("fall")
    //     item.parentElement.remove()

    //     removeLocalStorage(item.parentElement)
    // }
} 

function removeLocalStorage(toDo){
    let toDos

    if ( !localStorage.getItem("toDoItems") ){
        toDos = []

    } else {
        toDos = JSON.parse( localStorage.getItem("toDoItems") ) 
    }

    const toDoIndex = toDos.indexOf( toDo.children[0].innerText )

    toDos.splice(toDoIndex, 1)
    localStorage.setItem("toDoItems", JSON.stringify(toDos) )

}



function checkToDo(event) {
    // const{target} = event
    // if(target.classList.contains("check-btn") ){
    //     target.parentElement.classList.toggle("checked")
    // } 

    const item = event.target
    const IdFromButton = item.dataset.check_id || item.parentElement.dataset.check_id
    console.log(IdFromButton)

if(IdFromButton){
    const toDoItems = document.getElementsByClassName("to-do")

    for (let index = 0; index < toDoItems.length; index++) {
        const toDo = toDoItems[index];
        if (toDo.dataset.id === IdFromButton){
            let is_done = true
            if(toDo.classList.contains("checked")){
                is_done = false
            }

            fetch(`https://jungle-todo-list.herokuapp.com/${IdFromButton}`, {method:"PATCH", body: JSON.stringify( {is_done: is_done} ) , credentials: "same-origin",
            headers: {
              "Content-Type": "application/json",
            },} )
            .then( ()=>{
                 toDo.classList.toggle("checked")
            

            } 
            )
        }
    }
} }