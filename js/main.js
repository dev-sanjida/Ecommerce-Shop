// Shared header/footer + cart for every page
const PRODUCTS = [
  {id:'laptop',  name:'Aero Slim Laptop',  price:899, old:null, img:'images/laptop.svg',   badge:'New',  cat:'laptop'},
  {id:'watch',   name:'Rose Gold Watch',   price:120, old:160,  img:'images/watch.svg',    badge:'-25%', cat:'watch'},
  {id:'mouse',   name:'Silent Wireless Mouse', price:25, old:null, img:'images/mouse.svg', badge:'',     cat:'mouse'},
  {id:'keyboard',name:'Mechanical Keyboard', price:75, old:90,  img:'images/keyboard.svg', badge:'-17%', cat:'keyboard'}
];

const PAGES = [
  ['index.html','Home'],
  ['shop.html','Shop'],
  ['about.html','About Us'],
  ['contact.html','Contact Us'],
  ['cart.html','Cart']
];

function getCart(){ try{return JSON.parse(localStorage.getItem('kalles-cart'))||{}}catch(e){return {}} }
function saveCart(c){ try{localStorage.setItem('kalles-cart',JSON.stringify(c))}catch(e){} }
function cartCount(){ return Object.values(getCart()).reduce((a,b)=>a+b,0) }

function toast(msg){
  let t=document.querySelector('.toast');
  if(!t){t=document.createElement('div');t.className='toast';document.body.appendChild(t)}
  t.textContent=msg;t.classList.add('show');
  setTimeout(()=>t.classList.remove('show'),1800);
}

function addToCart(id){
  const c=getCart();c[id]=(c[id]||0)+1;saveCart(c);updateCount();
  const p=PRODUCTS.find(x=>x.id===id);toast((p?p.name:'Item')+' added to cart');
}

function updateCount(){
  document.querySelectorAll('.cart-count').forEach(e=>e.textContent=cartCount());
}

function priceHTML(p){
  return p.old ? `<del>$${p.old.toFixed(2)}</del><b>$${p.price.toFixed(2)}</b>` : `$${p.price.toFixed(2)}`;
}

function cardHTML(p){
  const badge = p.badge ? `<span class="badge ${p.badge==='New'?'new':''}">${p.badge}</span>` : '';
  return `<article class="card" data-cat="${p.cat}" data-price="${p.price}">
    ${badge}
    <div class="thumb"><img src="${p.img}" alt="${p.name}"></div>
    <div class="info">
      <h3>${p.name}</h3>
      <div class="price">${priceHTML(p)}</div>
      <div class="swatches"><i style="background:#222"></i><i style="background:#e8b7a0"></i><i style="background:#c9c9cf"></i></div>
      <button class="add-btn" onclick="addToCart('${p.id}')">Add to cart</button>
    </div>
  </article>`;
}

function renderChrome(){
  const here = location.pathname.split('/').pop() || 'index.html';
  const links = PAGES.map(([h,t])=>`<a href="${h}" class="${h===here?'active':''}">${t}</a>`).join('');
  document.getElementById('site-header').innerHTML = `
    <div class="promo">Today deal sale off 70%. Hurry up! <a href="shop.html">Shop now &rarr;</a></div>
    <div class="topbar"><div class="container"><span>&#9742; +880 1234 567 890 &nbsp; &#9993; hello@kalles.com</span><span>Summer sale discount off 50%!</span></div></div>
    <div class="site-header"><div class="container">
      <a href="index.html" class="logo">kalles<span>.</span></a>
      <nav class="nav" id="nav">${links}</nav>
      <div class="header-icons">
        <a href="shop.html" aria-label="Search">&#128269;</a>
        <a href="cart.html" class="cart-link" aria-label="Cart">&#128722;<span class="cart-count">0</span></a>
        <button class="menu-btn" onclick="document.getElementById('nav').classList.toggle('open')" aria-label="Menu">&#9776;</button>
      </div>
    </div></div>`;

  document.getElementById('site-footer').innerHTML = `
    <div class="container footer-grid">
      <div><a href="index.html" class="logo">kalles<span>.</span></a>
        <p>Fashion, watches and everyday tech &mdash; clean design, honest prices.</p></div>
      <div><h4>Pages</h4><ul>${PAGES.map(([h,t])=>`<li><a href="${h}">${t}</a></li>`).join('')}</ul></div>
      <div><h4>Shop</h4><ul><li><a href="shop.html">Laptops</a></li><li><a href="shop.html">Watches</a></li><li><a href="shop.html">Mouse</a></li><li><a href="shop.html">Keyboards</a></li></ul></div>
      <div><h4>Contact</h4><ul><li>Dhaka, Bangladesh</li><li>+880 1234 567 890</li><li>hello@kalles.com</li></ul></div>
    </div>
    <div class="copyright">Copyright &copy; <span id="yr"></span> @sanjidapriya. All rights reserved.</div>`;
  document.getElementById('yr').textContent = new Date().getFullYear();
  updateCount();
}

document.addEventListener('DOMContentLoaded', ()=>{
  renderChrome();

  const trending=document.getElementById('trending');
  if(trending) trending.innerHTML = PRODUCTS.map(cardHTML).join('');

  // shop page
  const shop=document.getElementById('shop-grid');
  if(shop){
    let cat='all', sort='default';
    const draw=()=>{
      let list=PRODUCTS.filter(p=>cat==='all'||p.cat===cat);
      if(sort==='low') list=[...list].sort((a,b)=>a.price-b.price);
      if(sort==='high') list=[...list].sort((a,b)=>b.price-a.price);
      shop.innerHTML=list.map(cardHTML).join('');
    };
    document.querySelectorAll('.filters button').forEach(b=>b.addEventListener('click',()=>{
      document.querySelectorAll('.filters button').forEach(x=>x.classList.remove('on'));
      b.classList.add('on');cat=b.dataset.cat;draw();
    }));
    document.getElementById('sort').addEventListener('change',e=>{sort=e.target.value;draw()});
    draw();
  }

  // cart page
  const cartBox=document.getElementById('cart-box');
  if(cartBox){
    const draw=()=>{
      const c=getCart(), ids=Object.keys(c).filter(id=>c[id]>0);
      if(!ids.length){cartBox.innerHTML='<p class="empty">Your cart is empty. <a href="shop.html" style="color:#e0185c">Continue shopping</a></p>';return}
      let total=0;
      const rows=ids.map(id=>{
        const p=PRODUCTS.find(x=>x.id===id); if(!p) return '';
        const sub=p.price*c[id]; total+=sub;
        return `<tr><td><img src="${p.img}" alt=""></td><td>${p.name}</td><td>$${p.price.toFixed(2)}</td><td>${c[id]}</td><td>$${sub.toFixed(2)}</td><td><button class="rm" onclick="removeItem('${id}')" aria-label="Remove">&times;</button></td></tr>`;
      }).join('');
      cartBox.innerHTML=`<table class="cart"><thead><tr><th></th><th>Product</th><th>Price</th><th>Qty</th><th>Subtotal</th><th></th></tr></thead><tbody>${rows}</tbody></table>
        <div class="cart-total">Total: <b>$${total.toFixed(2)}</b></div>
        <div style="text-align:right;margin-top:16px"><button class="btn" onclick="toast('Demo store: checkout is not connected')">Checkout</button></div>`;
    };
    window.removeItem=id=>{const c=getCart();delete c[id];saveCart(c);updateCount();draw()};
    draw();
  }

  // contact form (demo only)
  const form=document.getElementById('contact-form');
  if(form) form.addEventListener('submit',e=>{
    e.preventDefault();
    document.getElementById('notice').style.display='block';
    form.reset();
  });
});
