// change currency - default euro
const currency = "€";

// import lowdb
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync("db.json")
const db = low(adapter)

// Getters :

// get dark mode status
function getDarkMode()
{
    return db.get('darkmode').value()
}

// get balance value
function getBalance() {
    return db.get('balance').value()
}

// get income value
function getIncome() {
    return parseInt(db.get('income').value())
}

// get expenses by category name
function getExpenseByName(name) {
    return db.get("expense[0]").get(name).value()
}

// get all expenses from * category
function getExpenses() {
    var total = 0
    var expenses = ['home', 'phone', 'car', 'health', 'food', 'others']
    expenses.forEach(item => {
        total += db.get('expense[0]').get(item).value()
    });
    return total;
}

// settters

//set darkmode status
function setDarkMode(boolean)
{
    db.set('darkmode', boolean).write()
}

// set balance
function setBalance(value) {
    db.set('balance', value).write()
}

// set income
function setIncome(value) {
    db.set('income', value).write()
}

// set expense category value by name & value
function setExpenseByName(name, value) {
    return db.get("expense[0]").set(name, value).write()
}

// reset database
function resetDatabase(balanceValue) {
    // set default value to 0
    if (balanceValue === "") { value = 0 } else { value = balanceValue }

    // reset database
    setBalance(value)
    setIncome(0)
    setExpenseByName('home', 0)
    setExpenseByName('phone', 0)
    setExpenseByName('car', 0)
    setExpenseByName('health', 0)
    setExpenseByName('food', 0)
    setExpenseByName('others', 0)
}

// Initialisation function
function initialisation() {
    // init success
    console.log('Default initialized !')

    // database defaults
    db.defaults({
        "darkmode": false,
        "balance": 0,
        "income": 0,
        "expense": [
            {
                "home": 0,
                "phone": 0,
                "car": 0,
                "health": 0,
                "food": 0,
                "others": 0
            }
        ]
    }).write()

    // update balance value
    balance_value = document.getElementById('balance_value')
    balance_value.innerText = `${currency} ` + getBalance();

    // update income value
    income_value = document.getElementById('income_value')
    income_value.innerText = `${currency} ` + getIncome();

    // update expense value
    expense_value = document.getElementById('expense_value')
    expense_value.innerText = `-${currency}` + getExpenses();

    // pourcentage
    allExpenses = parseInt(getExpenses());

    pourcentage_home = parseFloat(parseFloat((parseInt(getExpenseByName('home')) / allExpenses) * 100).toFixed(2));
    pourcentage_phone = parseFloat(parseFloat((parseInt(getExpenseByName('phone')) / allExpenses) * 100).toFixed(2));
    pourcentage_car = parseFloat(parseFloat((parseInt(getExpenseByName('car')) / allExpenses) * 100).toFixed(2));
    pourcentage_health = parseFloat(parseFloat((parseInt(getExpenseByName('health')) / allExpenses) * 100).toFixed(2));
    pourcentage_food = parseFloat(parseFloat((parseInt(getExpenseByName('food')) / allExpenses) * 100).toFixed(2));
    pourcentage_others = parseFloat(parseFloat((parseInt(getExpenseByName('others')) / allExpenses) * 100).toFixed(2));

    arrayPourcentages = [pourcentage_home, pourcentage_phone, pourcentage_car, pourcentage_health, pourcentage_food, pourcentage_others]

    //set bar

    //home
    ratio = (pourcentage_home / 100) * 400
    document.getElementById("home").style.width = `${ratio}px`;
    document.getElementById("home").innerHTML = `home - ${getExpenseByName('home')}${currency}`

    //phone
    ratio = (pourcentage_phone / 100) * 400
    document.getElementById("phone").style.width = `${ratio}px`;
    document.getElementById("phone").innerHTML = `phone - ${getExpenseByName('phone')}${currency}`

    //car
    ratio = (pourcentage_car / 100) * 400
    document.getElementById("car").style.width = `${ratio}px`;
    document.getElementById("car").innerHTML = `car - ${getExpenseByName('car')}${currency}`

    //health
    ratio = (pourcentage_health / 100) * 400
    document.getElementById("health").style.width = `${ratio}px`;
    document.getElementById("health").innerHTML = `health - ${getExpenseByName('health')}${currency}`

    //food
    ratio = (pourcentage_food / 100) * 400
    document.getElementById("food").style.width = `${ratio}px`;
    document.getElementById("food").innerHTML = `food - ${getExpenseByName('food')}${currency}`

    //others
    ratio = (pourcentage_others / 100) * 400
    document.getElementById("others").style.width = `${ratio}px`;
    document.getElementById("others").innerHTML = `others - ${getExpenseByName('others')}${currency}`

}

function processFormEntries() {
    // get entry type
    var a = document.getElementById('form_entry_type');
    var entry_type = a.options[a.selectedIndex].text;

    // get category type
    var b = document.getElementById('choose_category');
    var category_type = b.options[b.selectedIndex].text;

    // get value
    var value = document.getElementById('form_value').value;

    // check if value null
    if (value === "") {
        return;
    }

    // income 
    if (entry_type === "income") {
        setIncome(getIncome() + parseInt(value))
        setBalance(parseInt(getBalance()) + parseInt(value))
    }

    // expense
    if (entry_type === "expense") {
        setExpenseByName(category_type, parseInt(getExpenseByName(category_type)) + parseInt(value))
        setBalance(parseInt(getBalance()) - parseInt(value))
    }
}

// Dark Mode  
function toggleDarkMode() {
    if (getDarkMode() === false)
    {
        setDarkMode(true)
        document.body.classList.toggle("dark-mode");
    }
    else{
        setDarkMode(false)
        document.body.classList.toggle("dark-mode");
    }
}

function applyDarkMode()
{
    if (getDarkMode() === false)
    {
        document.body.style.backgroundColor('smokewhite')
    }
    else{
        document.body.classList.toggle("dark-mode");
    }
}