import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import {ref, getDatabase, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const inputEl = document.getElementById("input-el");
const saveBtn = document.getElementById("save-btn");
const shopList = document.getElementById("shopping-list")
const appSettings = {
    databaseURL : "https://realtime-database-a2503-default-rtdb.asia-southeast1.firebasedatabase.app/"
}
const app = initializeApp(appSettings);
const database = getDatabase(app);
const shoppingListinDB = ref(database, "shoppingList");


saveBtn.addEventListener("click", function(){
    let inputValue = inputEl.value;
    // console.log(inputValue)
    push(shoppingListinDB, inputValue);
    
    // addItemToShoppingList(inputValue); -- now updated through database directly
    clearInputField();
})

onValue(shoppingListinDB, function(snapshot){
    if(snapshot.exists()){
        let listItems = Object.entries(snapshot.val())
        clearShopListItems()
        for (let i = 0; i < listItems.length; i++) {
            let currentItem = listItems[i]
            let currentItemID = currentItem[0]
            let currentItemValue = currentItem[1]
            // console.log(currentElement)
            addItemToShoppingList(currentItem)
        }
    }else{
        shopList.innerHTML = "No items here... yet"
    }
    
}) 

function clearInputField(){
    inputEl.value = "";
}
function addItemToShoppingList(item){
    // shopList.innerHTML += `<li> ${itemValue} </li> `;
    // now using the createElement method to create list items
    let newItem = document.createElement("li")
    let itemID = item[0]
    let itemValue = item[1]
    //changing item value as argument to item for deletion later
    newItem.textContent = itemValue
    shopList.append(newItem)
    // since all items are created from here the arrayList of values and IDs 
    //are maintained and so clicking on them would log out their ID using this func
    newItem.addEventListener("click" , function(){
        let exactLocationOfItemInDB = ref(database, `shoppingList/${itemID}`)
        remove(exactLocationOfItemInDB)
    })

}

function clearShopListItems(){
    shopList.innerHTML = ""
}