
// simple frontend backend using localStorage
const PRODUCTS = [
  {id:1,name:'AirFlex Runner',price:4999,category:'Men',img:'images/shoe1.jpg'},
  {id:2,name:'StreetWalk Pro',price:6499,category:'Men',img:'images/shoe2.jpg'},
  {id:3,name:'UrbanEdge 360',price:3999,category:'Men',img:'images/shoe3.jpg'},
  {id:4,name:'VelvetSlip',price:2999,category:'Women',img:'images/shoe4.jpg'},
  {id:5,name:'GlamStep',price:5499,category:'Women',img:'images/shoe5.jpg'},
  {id:6,name:'LunaWalk',price:4599,category:'Women',img:'images/shoe6.jpg'},
  {id:7,name:'TinyTread',price:1299,category:'Kids',img:'images/shoe7.jpg'},
  {id:8,name:'MiniRunner',price:1499,category:'Kids',img:'images/shoe8.jpg'},
  {id:9,name:'PlayStep',price:999,category:'Kids',img:'images/shoe9.jpg'},
  {id:10,name:'ClassicLoafer',price:3599,category:'Men',img:'images/shoe10.jpg'}
];
const ADMIN_PASS = 'admin123';

function readUsers(){return JSON.parse(localStorage.getItem('users')||'[]');}
function writeUsers(u){localStorage.setItem('users',JSON.stringify(u));}
function setCurrent(u){ if(u) localStorage.setItem('currentUser',u); else localStorage.removeItem('currentUser');}
function getCurrent(){ return localStorage.getItem('currentUser') || null; }
function cartKey(user){ return 'cart_'+user; }
function getCart(user){ return JSON.parse(localStorage.getItem(cartKey(user))||'[]'); }
function saveCart(user,cart){ localStorage.setItem(cartKey(user), JSON.stringify(cart)); }
function getSales(){ return JSON.parse(localStorage.getItem('sales')||'[]'); }
function saveSales(s){ localStorage.setItem('sales', JSON.stringify(s)); }

function register(username,password){
  if(!username||!password) return {ok:false,msg:'Fill all fields'};
  const u = readUsers();
  if(u.find(x=>x.username===username)) return {ok:false,msg:'Username taken'};
  u.push({username,password});
  writeUsers(u);
  return {ok:true,msg:'Account created'};
}
function login(username,password){
  const u = readUsers();
  if(u.find(x=>x.username===username && x.password===password)){ setCurrent(username); return {ok:true}; }
  return {ok:false,msg:'Invalid username or password'};
}
function addToCart(id){
  const user = getCurrent();
  if(!user){ alert('Please login first'); location.href='login.html'; return; }
  const p = PRODUCTS.find(x=>x.id===id);
  if(!p) return;
  const cart = getCart(user);
  cart.push(p);
  saveCart(user,cart);
  alert(p.name + ' added to cart');
  updateNavCount();
}
function cartTotal(cart){ return cart.reduce((s,i)=>s+i.price,0); }
function checkout(){
  const user = getCurrent(); if(!user){alert('Login first'); location.href='login.html'; return;}
  const cart = getCart(user); if(cart.length===0){alert('Cart empty'); return;}
  const total = cartTotal(cart);
  const sales = getSales(); sales.push({user,items:cart,total,date:new Date().toLocaleString()}); saveSales(sales);
  saveCart(user,[]); alert('Order placed. Total: ₹'+total); location.href='sales.html';
}
function updateNavCount(){ const el = document.getElementById('nav-cart-count'); if(!el) return; const u=getCurrent(); el.innerText = u?getCart(u).length:0; const acc=document.getElementById('nav-account'); if(acc) acc.innerText = u?u:'Profile'; }
function requireAdmin(){ const p=prompt('Admin password:'); if(p===ADMIN_PASS) return true; alert('Wrong password'); return false; }
window.app={PRODUCTS,register,login,addToCart,getCart,saveCart,cartTotal,checkout,getSales,updateNavCount,requireAdmin,getCurrent};

document.addEventListener('DOMContentLoaded', updateNavCount);
