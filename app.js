
//getting reference to elemets
const inputAmt = document.querySelector("#inputAmt");
const inputDesc = document.querySelector("#inputDesc");
const btnAdd = document.querySelector("#button-addon2");
const expenseTable = document.querySelector("#expenseTable");
const total = document.querySelector("#headingTotal");
const btnToggle = document.querySelector('#toggle');

//initialize variables
let theme = "light";
let btnClass = "btn btn-outline-danger btn-sm"
let savedTheme = "";
let totalExpense = 0;

renderTotal(totalExpense);

let allExpenses = [];

let savedArr = [];

// Logic

// onButtonClick add inputAmount to totalExpense
function addExpenses(){
    const expenseItem = {};

    const textAmount = inputAmt.value;
    const textDesc = inputDesc.value;
    const expense = parseInt(textAmount, 10);
    totalExpense = totalExpense + expense;

    //display total in nav bar
    renderTotal(totalExpense);

    //put the data into an object
    expenseItem.desc = textDesc;
    expenseItem.amount = expense;
    expenseItem.moment = new Date();

    //store the object in a array
    allExpenses.push(expenseItem);

    //store the array in local storage
    storeData(expenseItem, totalExpense);

    //display added items in expenseTable
    renderList(allExpenses);
}

// Controller functions

// storing the data in local  storage
function storeData(expenseItem){
    savedArr.push(expenseItem);
    localStorage.setItem('saved', JSON.stringify(savedArr));
    localStorage.setItem('total', totalExpense);
}

// on load function called to restore the state of app on page
// refresh/reload or closed and reopened
window.onload = function(){
    if(localStorage.getItem('saved') === null){
        console.log('original state');
        setTheme();
        return;
    }
    let arr = JSON.parse(localStorage.getItem('saved'));
    arr.map(a => {
        let dt = new Date(a.moment);
        a.moment = dt;
        savedArr.push(a);
    });

    let totExp = parseInt(localStorage.getItem('total'));
    allExpenses = savedArr;
    setTheme();
    renderList(allExpenses);
    renderTotal(totExp);
}      

//listening to click events on Add button
btnAdd.addEventListener("click", addExpenses, false);

// get date string
function getDateString(moment){
   return moment.toLocaleDateString('en-US', {
       year: 'numeric', 
       month: 'long', 
       day: 'numeric'
    });
};

// delete items
function deleteItem(dateValue){
    savedArr = [];
    allExpenses = allExpenses.filter((expense) => {
    if(expense.moment.valueOf() !== dateValue){
        storeData(expense);
        return expense;
    }
    });
    if(savedArr.length === 0){
        localStorage.removeItem('saved');
        localStorage.removeItem('total');
    }
    renderList(allExpenses);
    newTotal(allExpenses);
}


// new total called to display new value of total on deletion of list items
function newTotal(expenses){
    let sum = 0;
    for(let i=0; i<expenses.length; i++){
        sum = sum + expenses[i].amount;
    }
    totalExpense = sum;
    localStorage.setItem('total', sum);
    renderTotal(sum);

}

//listening to click events on the moon-emoji
btnToggle.addEventListener('click', function(){
    changeTheme();
});

//toggles the theme of the site
function changeTheme(){
    if(theme === "light"){
        theme = "bg-dark";
        btnClass = "btn btn-danger btn-sm";
        localStorage.setItem('content-theme', theme);
        btnToggle.classList.remove("moon-emoji");
        btnToggle.classList.add("moon-emoji-reverse");
        document.querySelector("#main-content").classList.add("dark");
        document.querySelector("#jumbotronDiv").classList.add("bg-dark");
        document.querySelector("#button-addon2").classList.add("btn-primary");
        document.querySelector("#button-addon2").classList.remove("btn-outline-primary"); 
        renderList(allExpenses);
    }
    else{
        theme = "light";
        btnClass = "btn btn-outline-danger btn-sm";
        localStorage.setItem('content-theme', theme);
        btnToggle.classList.remove("moon-emoji-reverse");
        btnToggle.classList.add("moon-emoji");
        document.querySelector("#main-content").classList.remove("dark");
        document.querySelector("#jumbotronDiv").classList.remove("bg-dark");
        document.querySelector("#button-addon2").classList.add("btn-outline-primary");
        document.querySelector("#button-addon2").classList.remove("btn-primary");
        renderList(allExpenses);
    }
}

//function to open the site in the same theme set by user
function setTheme(){
    theme = localStorage.getItem('content-theme');
    if(theme === "bg-dark"){
        theme = "light";
    }else{
        theme = "bg-dark";
    }
    changeTheme();
}

// Views

//function to render total expense in the nav bar
function renderTotal(sumTotal){
    const someText = `Total: ${sumTotal}`;
    total.textContent = someText;
}

//function to reder list items when added
function renderList(arrOfList){
    const allExpensesHTML = arrOfList.map(expense => createListItem(expense));
    const joindAllExpenseHTML = allExpensesHTML.join("");
    expenseTable.innerHTML = joindAllExpenseHTML;
}

//function containing html template for creating individual list items
function createListItem({desc, amount, moment}){
    return `
    <li class="list-group-item d-flex justify-content-between ${theme}">
                    <div class="d-flex flex-column">
                        ${desc}
                        <small class="text-muted">${getDateString(moment)}</small>
                    </div>
                    <div>
                        <span class="px-5">
                            ${amount}
                        </span>
                        <button 
                            type="button" 
                            class="${btnClass}"
                            onclick="deleteItem(${moment.valueOf()})"
                            id="button-addon3"
                            >
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </div>
                </li>
    `
}
