function show(id){
document.querySelectorAll('.section').forEach(s=>s.classList.remove('active'));
document.getElementById(id).classList.add('active');
}

function add(item){
alert(item + " added");
}

function checkout(){
alert("Payment Successful (Demo)");
}

function sendCode(){
alert("Code sent");
}

function verify(){
document.getElementById('msg').innerText="Verified ✔";
}

function fakeSearch(){
alert("Product found! (demo)");
}