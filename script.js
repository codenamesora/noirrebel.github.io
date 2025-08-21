document.addEventListener('DOMContentLoaded', ()=>{
  // Navbar scroll style
  const topbar = document.getElementById('topbar');
  const onscroll = ()=> topbar.classList.toggle('scrolled', window.scrollY > 10);
  window.addEventListener('scroll', onscroll); onscroll();

  // Audio controls (Walkman style)
  const audio = document.getElementById('bgAudio');
  const aBtn = document.getElementById('audioToggle');
  aBtn.addEventListener('click', ()=>{
    if(audio.paused){ audio.play().catch(()=>{}); aBtn.textContent='❚❚'; }
    else { audio.pause(); aBtn.textContent='►'; }
  });

  // Cart logic
  const cartBtn = document.getElementById('cartBtn');
  const cartModal = document.getElementById('cartModal');
  const closeCart = document.getElementById('closeCart');
  const cartList = document.getElementById('cartList');
  const cartTotal = document.getElementById('cartTotal');
  const cartCount = document.getElementById('cartCount');
  const checkoutBtn = document.getElementById('checkoutBtn');
  const checkoutModal = document.getElementById('checkoutModal');
  const closeCheckout = document.getElementById('closeCheckout');
  const toast = document.getElementById('toast');

  const load = ()=> JSON.parse(localStorage.getItem('nr_cart')||'[]');
  const save = (c)=>{ localStorage.setItem('nr_cart', JSON.stringify(c)); update(); };
  const update = ()=>{
    const c = load();
    cartCount.textContent = c.reduce((s,i)=>s+i.qty,0);
    cartList.innerHTML = c.length ? c.map((it, idx)=>
      `<div class="row"><b>${it.name}</b> x ${it.qty} — ¥${(it.price*it.qty).toFixed(2)} <button data-i="${idx}" class="rm">remove</button></div>`
    ).join('') : '<p>Cart empty.</p>';
    cartList.querySelectorAll('.rm').forEach(btn=>btn.onclick=(e)=>{
      const i = +e.target.dataset.i; const arr = load(); arr.splice(i,1); save(arr);
    });
    cartTotal.textContent = load().reduce((s,i)=>s+i.price*i.qty,0).toFixed(2);
  }

  // Add to cart
  document.querySelectorAll('.card .add').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const card = btn.closest('.card');
      const item = {name: card.dataset.name, price: Number(card.dataset.price), qty:1};
      const arr = load();
      const f = arr.find(x=>x.name===item.name);
      if(f) f.qty++; else arr.push(item);
      save(arr);
      // cart animation
      cartBtn.style.animation='shake .5s'; setTimeout(()=>cartBtn.style.animation='', 500);
      // toast
      toast.style.opacity=1; toast.style.transform='translateX(-50%) scale(1)';
      setTimeout(()=>{ toast.style.opacity=0; toast.style.transform='translateX(-50%) scale(.9)'; }, 1000);
    });
  });

  cartBtn.addEventListener('click', ()=>{ cartModal.setAttribute('aria-hidden','false'); update(); });
  closeCart.addEventListener('click', ()=> cartModal.setAttribute('aria-hidden','true'));

  checkoutBtn.addEventListener('click', ()=>{ cartModal.setAttribute('aria-hidden','true'); checkoutModal.setAttribute('aria-hidden','false'); });

  closeCheckout.addEventListener('click', ()=> checkoutModal.setAttribute('aria-hidden','true'));

  document.getElementById('checkoutForm').addEventListener('submit', e=>{
    e.preventDefault();
    localStorage.removeItem('nr_cart'); update();
    document.getElementById('orderSuccess').style.display='block';
    e.target.style.display='none';
  });

  // Page-load VHS intro (brief noise flash)
  const hero = document.querySelector('.vhs-noise');
  hero.animate([{opacity:0.7},{opacity:0.1}],{duration:900, easing:'ease-out'});
});