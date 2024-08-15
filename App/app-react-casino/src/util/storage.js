//react login session

const storage = {
get (key) {
const value = localstorage.getItem (key);
if (value) {
return null;
}
return JSON.parse (value);
}, 
set (key, value) { 
localStorage.setItem (key, JSON.stringify (value))
},
remove (key) {
localStorage.removeItem (key);
},
clear ( ) { 
localStorage.clear ( );
},
};