(function(){
  const apiPrefix = '/api';
  // Admin controllers are mounted under the global API prefix: /api/admin
  const adminPrefix = apiPrefix + '/admin';
  let token = '';

  function setToken(t){ token = t }

  function authHeaders(){ return token ? { 'Authorization': 'Bearer ' + token } : {} }

  function qs(el){ return document.querySelector(el) }

  function el(tag, attrs){ const e = document.createElement(tag); for(const k in attrs) e[k]=attrs[k]; return e }

  async function fetchJson(url, opts={}){
    opts.headers = Object.assign({}, opts.headers || {}, authHeaders());
    if(opts.body && typeof opts.body === 'object'){ opts.body = JSON.stringify(opts.body); opts.headers['Content-Type']='application/json' }
    const res = await fetch(url, opts);
    const text = await res.text();
    try { return { ok: res.ok, status: res.status, body: JSON.parse(text) } } catch(e){ return { ok: res.ok, status: res.status, body: text } }
  }
  
  // Pagination & search state
  const state = { view: 'users', page: 1, limit: 10, search: '' };

  function buildUrl(base){
    const parts = [];
    if (state.page) parts.push('page=' + encodeURIComponent(state.page));
    if (state.limit) parts.push('limit=' + encodeURIComponent(state.limit));
    if (state.search) parts.push('search=' + encodeURIComponent(state.search));
    return parts.length ? (base + '?' + parts.join('&')) : base;
  }

  function normalizeListResponse(r){
    let items = [];
    let total = null;
    let pages = null;
    if (!r || !r.ok) return { items, total, pages };
    const body = r.body;
    if (Array.isArray(body)) {
      items = body.slice();
      total = items.length;
    } else if (body && typeof body === 'object'){
      // server may return structured response
      if (Array.isArray(body.items)) { items = body.items.slice(); total = body.total ?? body.items.length; }
      else if (Array.isArray(body.products)) { items = body.products.slice(); total = body.total ?? body.products.length; }
      else if (Array.isArray(body.users)) { items = body.users.slice(); total = body.total ?? body.users.length; }
      else if (Array.isArray(body.brands)) { items = body.brands.slice(); total = body.total ?? body.brands.length; }
      else if (Array.isArray(body.categories)) { items = body.categories.slice(); total = body.total ?? body.categories.length; }
      else if (Array.isArray(body.attributes)) { items = body.attributes.slice(); total = body.total ?? body.attributes.length; }
      else if (Array.isArray(body.variants)) { items = body.variants.slice(); total = body.total ?? body.variants.length; }
      else if (Array.isArray(body.orders)) { items = body.orders.slice(); total = body.total ?? body.orders.length; }
      else if (Array.isArray(body.coupons)) { items = body.coupons.slice(); total = body.total ?? body.coupons.length; }
      else if (Array.isArray(body)) { items = body.slice(); total = items.length; }
      // allow server-side paging metadata
      if (typeof body.total === 'number') total = body.total;
      if (typeof body.pages === 'number') pages = body.pages;
    }

    // client-side search (for endpoints that don't support search)
    if (state.search && items.length){
      const q = state.search.toLowerCase();
      items = items.filter(i => JSON.stringify(i).toLowerCase().includes(q));
      if (total !== null) total = items.length;
    }

    // client-side pagination if server returned a full array
    if (Array.isArray(r.body) || (total !== null && !pages)){
      const start = (state.page - 1) * state.limit;
      const sliced = items.slice(start, start + state.limit);
      pages = pages ?? (total !== null ? Math.max(1, Math.ceil(total / state.limit)) : null);
      return { items: sliced, total, pages };
    }

    return { items, total, pages };
  }

  function updatePaginationControls(total, pages, shown){
    const pageInfo = qs('#page-info');
    if (!pageInfo) return;
    if (typeof total === 'number' && typeof pages === 'number'){
      pageInfo.textContent = `Page ${state.page} / ${pages} — showing ${shown} of ${total}`;
    } else {
      pageInfo.textContent = `Page ${state.page} — showing ${shown}`;
    }
    const prev = qs('#prev-page'); if(prev) prev.disabled = state.page <= 1;
    const next = qs('#next-page'); if(next){
      if (typeof pages === 'number') next.disabled = state.page >= pages; else next.disabled = shown < state.limit;
    }
  }

  async function loadCurrentView(){
    switch(state.view){
      case 'users': return loadUsers();
      case 'products': return loadProducts();
      case 'brands': return loadBrands();
      case 'categories': return loadCategories();
      case 'attributes': return loadAttributes();
      case 'attribute-variants': return loadAttributeVariants();
      case 'addresses': return loadAddresses();
      case 'reviews': return loadReviews();
      case 'orders': return loadOrders();
      case 'coupons': return loadCoupons();
      case 'coupon-usages': return loadCouponUsages();
      case 'carts': return loadCarts();
      case 'cart-items': return loadCartItems();
      case 'payments': return loadPayments();
      case 'payment-methods': return loadPaymentMethods();
      case 'order-status': return loadOrderStatus();
      case 'order-items': return loadOrderItems();
      case 'refunds': return loadRefunds();
      case 'review-images': return loadReviewImages();
      case 'user-sessions': return loadUserSessions();
      default: return loadUsers();
    }
  }

  // Views: users, products, orders
  async function loadUsers(){
    const r = await fetchJson(buildUrl(adminPrefix + '/users'));
    const list = qs('#list'); list.innerHTML=''; qs('#detail').style.display='none';
    if(!r.ok){ list.innerHTML = '<p>Error loading users: '+r.status+'</p>'; return }
    const table = el('table',{className:'table'});
    const header = el('div');
    const newBtn = el('button',{className:'button'}); newBtn.textContent='New User'; newBtn.onclick = ()=> showUser(null);
    header.appendChild(newBtn);
    list.appendChild(header);
    const thead = el('thead'); thead.innerHTML='<tr><th>ID</th><th>Email</th><th>First Name</th><th>Last Name</th><th>Birth Date</th><th>Phone</th><th>Admin</th><th>Status</th><th>Created</th><th></th></tr>'; table.appendChild(thead);
    const tbody = el('tbody');
    const { items: users, total, pages } = normalizeListResponse(r);
    users.forEach(u=>{
      const tr = el('tr');
      tr.innerHTML = `<td>${u.id}</td><td>${u.email||''}</td><td>${u.first_name||''}</td><td>${u.last_name||''}</td><td>${u.birth_date? (new Date(u.birth_date)).toISOString().split('T')[0]:''}</td><td>${u.phone||''}</td><td>${u.is_admin? 'yes':''}</td><td>${u.status||''}</td><td>${u.created_at? new Date(u.created_at).toLocaleString():''}</td><td></td>`;
      const btn = el('button',{className:'button'}); btn.textContent='Edit'; btn.onclick = ()=> showUser(u.id);
      tr.children[4].appendChild(btn);
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    list.appendChild(table);
    updatePaginationControls(total, pages, users.length);
  }

  async function loadProducts(){
    const r = await fetchJson(buildUrl(adminPrefix + '/products'));
    const list = qs('#list'); list.innerHTML=''; qs('#detail').style.display='none';
    if(!r.ok){ list.innerHTML = '<p>Error loading products: '+r.status+'</p>'; return }
    const table = el('table',{className:'table'});
    const header = el('div');
    const newBtn = el('button',{className:'button'}); newBtn.textContent='New Product'; newBtn.onclick = ()=> showProduct(null);
    header.appendChild(newBtn);
    list.appendChild(header);
    const thead = el('thead'); thead.innerHTML='<tr><th>ID</th><th>Name</th><th>Brand</th><th>Category</th><th>Active</th><th></th></tr>'; table.appendChild(thead);
    const tbody = el('tbody');
    const { items: products, total, pages } = normalizeListResponse(r);
    products.forEach(p=>{
      const tr = el('tr');
      tr.innerHTML = `<td>${p.id}</td><td>${p.name||''}</td><td>${p.brand?.name||p.brand_id||''}</td><td>${p.category?.name||p.category_id||''}</td><td>${p.active? 'yes':''}</td><td></td>`;
      const btn = el('button',{className:'button'}); btn.textContent='Edit'; btn.onclick = ()=> showProduct(p.id);
      tr.children[5].appendChild(btn);
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    list.appendChild(table);
    updatePaginationControls(total, pages, products.length);
  }

  async function loadOrders(){
    const r = await fetchJson(buildUrl(adminPrefix + '/orders'));
    const list = qs('#list'); list.innerHTML=''; qs('#detail').style.display='none';
    if(!r.ok){ list.innerHTML = '<p>Error loading orders: '+r.status+'</p>'; return }
    const table = el('table',{className:'table'});
    const header = el('div');
    const newBtn = el('button',{className:'button'}); newBtn.textContent='New Order'; newBtn.onclick = ()=> showOrder(null);
    header.appendChild(newBtn);
    list.appendChild(header);
    const thead = el('thead'); thead.innerHTML='<tr><th>ID</th><th>User</th><th>Total</th><th>Status</th><th>Created</th><th></th></tr>'; table.appendChild(thead);
    const tbody = el('tbody');
    const { items: orders, total, pages } = normalizeListResponse(r);
    orders.forEach(o=>{
      const tr = el('tr');
      tr.innerHTML = `<td>${o.id}</td><td>${o.user?.email||o.user_id||''}</td><td>${o.total_price||''}</td><td>${o.status||''}</td><td>${o.created_at||''}</td><td></td>`;
      const btn = el('button',{className:'button'}); btn.textContent='Edit'; btn.onclick = ()=> showOrder(o.id);
      tr.children[5].appendChild(btn);
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    list.appendChild(table);
    updatePaginationControls(total, pages, orders.length);
  }

  async function loadBrands(){
    const r = await fetchJson(buildUrl(adminPrefix + '/brands'));
    const list = qs('#list'); list.innerHTML=''; qs('#detail').style.display='none';
    if(!r.ok){ list.innerHTML = '<p>Error loading brands: '+r.status+'</p>'; return }
    const table = el('table',{className:'table'});
    const header = el('div');
    const newBtn = el('button',{className:'button'}); newBtn.textContent='New Brand'; newBtn.onclick = ()=> showBrand(null);
    header.appendChild(newBtn);
    list.appendChild(header);
    const thead = el('thead'); thead.innerHTML='<tr><th>ID</th><th>Name</th><th>Country</th><th></th></tr>'; table.appendChild(thead);
    const tbody = el('tbody');
    const { items: brands, total, pages } = normalizeListResponse(r);
    brands.forEach(b=>{
      const tr = el('tr');
      tr.innerHTML = `<td>${b.id}</td><td>${b.name||''}</td><td>${b.country||''}</td><td></td>`;
      const btn = el('button',{className:'button'}); btn.textContent='Edit'; btn.onclick = ()=> showBrand(b.id);
      tr.children[3].appendChild(btn);
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    list.appendChild(table);
    updatePaginationControls(total, pages, brands.length);
  }

  async function showBrand(id){
    const d = qs('#detail'); d.style.display='block'; d.innerHTML='';
    let b = { name: '', country: '' };
    let creating = false;
    if (id){
      const r = await fetchJson(adminPrefix + '/brands/' + id);
      if(!r.ok){ d.innerHTML='<p>Error</p>'; return }
      b = r.body;
    } else creating = true;
    d.appendChild(el('h3',{textContent: creating ? 'New Brand' : ('Edit Brand #'+(b.id||'')) }));
    const form = el('div');
    const fields = ['name','country'];
    fields.forEach(k=>{
      const row = el('div',{className:'form-row'});
      row.appendChild(el('label',{textContent:k}));
      const input = el('input',{id:'field-'+k, value: b[k]||''});
      row.appendChild(input);
      form.appendChild(row);
    });
    const save = el('button',{className:'button'}); save.textContent='Save'; save.onclick = async ()=>{
      const body = {};
      fields.forEach(k=> body[k]=qs('#field-'+k).value);
      let res;
      if (creating) res = await fetchJson(adminPrefix + '/brands', { method: 'POST', body }); else res = await fetchJson(adminPrefix + '/brands/' + id,{ method:'PATCH', body });
      if (res.ok) { alert('Saved'); loadBrands(); } else { alert('Error '+res.status+' - '+JSON.stringify(res.body)); }
    };
    form.appendChild(save);
    if (!creating){
      const del = el('button',{className:'button'}); del.textContent='Delete'; del.onclick = async ()=>{
        const res = await fetchJson(adminPrefix + '/brands/' + id, { method: 'DELETE' });
        if (res.ok) { alert('Deleted'); loadBrands(); } else { alert('Error '+res.status+' - '+JSON.stringify(res.body)); }
      };
      form.appendChild(del);
    }
    d.appendChild(form);
  }

  async function loadCategories(){
    const r = await fetchJson(buildUrl(adminPrefix + '/categories'));
    const list = qs('#list'); list.innerHTML=''; qs('#detail').style.display='none';
    if(!r.ok){ list.innerHTML = '<p>Error loading categories: '+r.status+'</p>'; return }
    const table = el('table',{className:'table'});
    const header = el('div');
    const newBtn = el('button',{className:'button'}); newBtn.textContent='New Category'; newBtn.onclick = ()=> showCategory(null);
    header.appendChild(newBtn);
    list.appendChild(header);
    const thead = el('thead'); thead.innerHTML='<tr><th>ID</th><th>Name</th><th>Parent ID</th><th></th></tr>'; table.appendChild(thead);
    const tbody = el('tbody');
    const { items: cats, total, pages } = normalizeListResponse(r);
    cats.forEach(c=>{
      const tr = el('tr');
      tr.innerHTML = `<td>${c.id}</td><td>${c.name||''}</td><td>${c.parent_id||''}</td><td></td>`;
      const btn = el('button',{className:'button'}); btn.textContent='Edit'; btn.onclick = ()=> showCategory(c.id);
      tr.children[3].appendChild(btn);
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    list.appendChild(table);
    updatePaginationControls(total, pages, cats.length);
  }

  async function loadCoupons(){
    const r = await fetchJson(buildUrl(adminPrefix + '/coupons'));
    const list = qs('#list'); list.innerHTML=''; qs('#detail').style.display='none';
    if(!r.ok){ list.innerHTML = '<p>Error loading coupons: '+r.status+'</p>'; return }
    const table = el('table',{className:'table'});
    const header = el('div');
    const newBtn = el('button',{className:'button'}); newBtn.textContent='New Coupon'; newBtn.onclick = ()=> showCoupon(null);
    header.appendChild(newBtn);
    list.appendChild(header);
    const thead = el('thead'); thead.innerHTML='<tr><th>ID</th><th>Code</th><th>Type</th><th>Expires</th><th></th></tr>'; table.appendChild(thead);
    const tbody = el('tbody');
    const { items, total, pages } = normalizeListResponse(r);
    items.forEach(c=>{
      const tr = el('tr');
      tr.innerHTML = `<td>${c.id}</td><td>${c.code||''}</td><td>${c.discount_type||''}</td><td>${c.expires_at? (new Date(c.expires_at)).toISOString().split('T')[0]:''}</td><td></td>`;
      const btn = el('button',{className:'button'}); btn.textContent='Edit'; btn.onclick = ()=> showCoupon(c.id);
      tr.children[4].appendChild(btn);
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    list.appendChild(table);
    updatePaginationControls(total, pages, items.length);
  }

  async function loadAddresses(){
    const r = await fetchJson(buildUrl(adminPrefix + '/addresses'));
    const list = qs('#list'); list.innerHTML=''; qs('#detail').style.display='none';
    if(!r.ok){ list.innerHTML = '<p>Error loading addresses: '+r.status+'</p>'; return }
    const table = el('table',{className:'table'});
    const header = el('div');
    const newBtn = el('button',{className:'button'}); newBtn.textContent='New Address'; newBtn.onclick = ()=> showAddress(null);
    header.appendChild(newBtn);
    list.appendChild(header);
    const thead = el('thead'); thead.innerHTML='<tr><th>ID</th><th>User ID</th><th>Country</th><th>City</th><th>Address</th><th>Postal</th><th></th></tr>'; table.appendChild(thead);
    const tbody = el('tbody');
    const { items, total, pages } = normalizeListResponse(r);
    items.forEach(a=>{
      const tr = el('tr');
      tr.innerHTML = `<td>${a.id}</td><td>${a.user_id||''}</td><td>${a.country||''}</td><td>${a.city||''}</td><td>${a.address_line_1||''}</td><td>${a.postal_code||''}</td><td></td>`;
      const btn = el('button',{className:'button'}); btn.textContent='Edit'; btn.onclick = ()=> showAddress(a.id);
      tr.children[6].appendChild(btn);
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    list.appendChild(table);
    updatePaginationControls(total, pages, items.length);
  }

  async function showAddress(id){
    const d = qs('#detail'); d.style.display='block'; d.innerHTML='';
    let a = { country:'', city:'', address_line_1:'', address_line_2:'', postal_code:'', user_id: null };
    let creating = false;
    if (id){ const r = await fetchJson(adminPrefix + '/addresses/' + id); if(!r.ok){ d.innerHTML='<p>Error</p>'; return } a = r.body; } else creating = true;
    d.appendChild(el('h3',{textContent: creating ? 'New Address' : ('Edit Address #'+(a.id||'')) }));
    const form = el('div');
    const fields = ['user_id','country','city','address_line_1','address_line_2','postal_code'];
    fields.forEach(k=>{ const row = el('div',{className:'form-row'}); row.appendChild(el('label',{textContent:k})); const input = el('input',{id:'field-'+k, value: a[k]||''}); row.appendChild(input); form.appendChild(row); });
    const save = el('button',{className:'button'}); save.textContent='Save'; save.onclick = async ()=>{
      const body = {}; fields.forEach(k=> body[k]=qs('#field-'+k).value); if(body.user_id) body.user_id = Number(body.user_id);
      let res; if (creating) res = await fetchJson(adminPrefix + '/addresses', { method: 'POST', body }); else res = await fetchJson(adminPrefix + '/addresses/' + id,{ method:'PATCH', body });
      if (res.ok) { alert('Saved'); loadAddresses(); } else { alert('Error '+res.status+' - '+JSON.stringify(res.body)); }
    };
    form.appendChild(save);
    if (!creating){ const del = el('button',{className:'button'}); del.textContent='Delete'; del.onclick = async ()=>{ const res = await fetchJson(adminPrefix + '/addresses/' + id, { method: 'DELETE' }); if (res.ok) { alert('Deleted'); loadAddresses(); } else { alert('Error '+res.status+' - '+JSON.stringify(res.body)); } }; form.appendChild(del); }
    d.appendChild(form);
  }

  async function loadReviews(){
    const r = await fetchJson(buildUrl(adminPrefix + '/reviews'));
    const list = qs('#list'); list.innerHTML=''; qs('#detail').style.display='none';
    if(!r.ok){ list.innerHTML = '<p>Error loading reviews: '+r.status+'</p>'; return }
    const table = el('table',{className:'table'});
    const header = el('div');
    const thead = el('thead'); thead.innerHTML='<tr><th>ID</th><th>Product</th><th>User</th><th>Rating</th><th>Comment</th><th></th></tr>'; table.appendChild(thead);
    const tbody = el('tbody');
    const { items, total, pages } = normalizeListResponse(r);
    items.forEach(rv=>{
      const tr = el('tr');
      tr.innerHTML = `<td>${rv.id}</td><td>${rv.product_id||''}</td><td>${rv.user?.email||rv.user_id||''}</td><td>${rv.rating||''}</td><td>${(rv.comment||'').slice(0,60)}</td><td></td>`;
      const btn = el('button',{className:'button'}); btn.textContent='Edit'; btn.onclick = ()=> showReview(rv.id);
      tr.children[5].appendChild(btn);
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    list.appendChild(table);
    updatePaginationControls(total, pages, items.length);
  }

  async function showReview(id){
    const d = qs('#detail'); d.style.display='block'; d.innerHTML='';
    const r = await fetchJson(adminPrefix + '/reviews/' + id);
    if(!r.ok){ d.innerHTML='<p>Error loading review</p>'; return }
    const rv = r.body;
    d.appendChild(el('h3',{textContent:'Edit Review #'+(rv.id||'')}));
    const form = el('div');
    const f1 = el('div',{className:'form-row'}); f1.appendChild(el('label',{textContent:'rating'})); f1.appendChild(el('input',{id:'field-rating', value: rv.rating||''})); form.appendChild(f1);
    const f2 = el('div',{className:'form-row'}); f2.appendChild(el('label',{textContent:'comment'})); f2.appendChild(el('textarea',{id:'field-comment', textContent: rv.comment||''})); form.appendChild(f2);
    const save = el('button',{className:'button'}); save.textContent='Save'; save.onclick = async ()=>{ const body = { rating: Number(qs('#field-rating').value), comment: qs('#field-comment').value }; const res = await fetchJson(adminPrefix + '/reviews/' + id, { method: 'PATCH', body }); if(res.ok){ alert('Saved'); loadReviews(); } else { alert('Error '+res.status+' - '+JSON.stringify(res.body)); } };
    form.appendChild(save);
    const del = el('button',{className:'button'}); del.textContent='Delete'; del.onclick = async ()=>{ const res = await fetchJson(adminPrefix + '/reviews/' + id, { method: 'DELETE' }); if(res.ok){ alert('Deleted'); loadReviews(); } else { alert('Error '+res.status+' - '+JSON.stringify(res.body)); } };
    form.appendChild(del);
    d.appendChild(form);
  }

  // Generic simple list/detail editor for smaller tables added recently
  async function loadGenericList(endpoint, cols){
    const r = await fetchJson(buildUrl(adminPrefix + '/' + endpoint));
    const list = qs('#list'); list.innerHTML=''; qs('#detail').style.display='none';
    if(!r.ok){ list.innerHTML = `<p>Error loading ${endpoint}: ${r.status}</p>`; return }
    const table = el('table',{className:'table'});
    const thead = el('thead');
    const headRow = '<tr><th>ID</th>' + cols.map(c=>`<th>${c}</th>`).join('') + '<th></th></tr>';
    thead.innerHTML = headRow; table.appendChild(thead);
    const tbody = el('tbody');
    const { items, total, pages } = normalizeListResponse(r);
    items.forEach(it=>{
      const tr = el('tr');
      const cells = ['<td>'+ (it.id||'') +'</td>'];
      cols.forEach(c=>{ let v = it[c]; if (v===undefined) v = it[c.replace(/\-/g,'_')]||''; cells.push('<td>'+ (v===null? '': (Array.isArray(v)? JSON.stringify(v): String(v))) +'</td>'); });
      tr.innerHTML = cells.join('') + '<td></td>';
      const btn = el('button',{className:'button'}); btn.textContent='Edit'; btn.onclick = ()=> showGeneric(endpoint, it.id);
      tr.children[tr.children.length-1].appendChild(btn);
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    list.appendChild(table);
    updatePaginationControls(total, pages, items.length);
  }

  async function showGeneric(endpoint, id){
    const d = qs('#detail'); d.style.display='block'; d.innerHTML='';
    const r = await fetchJson(adminPrefix + '/' + endpoint + '/' + id);
    if(!r.ok){ d.innerHTML = '<p>Error loading record</p>'; return }
    const obj = r.body;
    d.appendChild(el('h3',{textContent: 'Edit '+ endpoint + ' #' + (obj.id||'')}));
    const pre = el('textarea',{id:'json-body', style: 'width:100%;height:300px'});
    pre.value = JSON.stringify(obj, null, 2);
    d.appendChild(pre);
    const save = el('button',{className:'button'}); save.textContent='Save JSON'; save.onclick = async ()=>{
      let parsed; try{ parsed = JSON.parse(qs('#json-body').value); }catch(e){ alert('Invalid JSON'); return }
      const res = await fetchJson(adminPrefix + '/' + endpoint + '/' + id, { method: 'PATCH', body: parsed });
      if(res.ok){ alert('Saved'); loadCurrentView(); } else { alert('Error '+res.status+' - '+JSON.stringify(res.body)); }
    };
    d.appendChild(save);
    const del = el('button',{className:'button'}); del.textContent='Delete'; del.onclick = async ()=>{ const res = await fetchJson(adminPrefix + '/' + endpoint + '/' + id, { method: 'DELETE' }); if(res.ok){ alert('Deleted'); loadCurrentView(); } else { alert('Error '+res.status+' - '+JSON.stringify(res.body)); } };
    d.appendChild(del);
  }

  // Specific loaders that use the generic renderer
  async function loadCouponUsages(){ return loadGenericList('coupon-usages', ['coupon_id','user_id','used_at']); }
  async function loadCarts(){ return loadGenericList('carts', ['user_id','status','total_price']); }
  async function loadCartItems(){ return loadGenericList('cart-items', ['cart_id','product_item_id','quantity','price']); }
  async function loadPayments(){ return loadGenericList('payments', ['order_id','amount','status','method_id']); }
  async function loadPaymentMethods(){
    await loadGenericList('payment-methods', ['name','provider','config']);
    const list = qs('#list');
    const header = el('div');
    const newBtn = el('button',{className:'button'}); newBtn.textContent='New Payment Method';
    newBtn.onclick = ()=> showCreateGeneric('payment-methods', { name: '', provider: '', config: {} });
    header.appendChild(newBtn);
    if (list.firstChild) list.insertBefore(header, list.firstChild); else list.appendChild(header);
  }

  async function showCreateGeneric(endpoint, template){
    const d = qs('#detail'); d.style.display='block'; d.innerHTML='';
    d.appendChild(el('h3',{textContent: 'Create new ' + endpoint}));
    const ta = el('textarea',{id:'json-body-create', style: 'width:100%;height:300px'});
    ta.value = JSON.stringify(template, null, 2);
    d.appendChild(ta);
    const save = el('button',{className:'button'}); save.textContent='Create'; save.onclick = async ()=>{
      let parsed; try{ parsed = JSON.parse(qs('#json-body-create').value); }catch(e){ alert('Invalid JSON'); return }
      const res = await fetchJson(adminPrefix + '/' + endpoint, { method: 'POST', body: parsed });
      if(res.ok){ alert('Created'); loadCurrentView(); } else { alert('Error '+res.status+' - '+JSON.stringify(res.body)); }
    };
    d.appendChild(save);
  }
  async function loadOrderStatus(){ return loadGenericList('order-status-history', ['order_id','status','created_at']); }
  async function loadOrderItems(){ return loadGenericList('order-items', ['order_id','product_item_id','quantity','price']); }
  async function loadRefunds(){ return loadGenericList('refunds', ['payment_id','amount','status','reason']); }
  async function loadReviewImages(){ return loadGenericList('review-images', ['review_id','image_url']); }
  async function loadUserSessions(){ return loadGenericList('user-sessions', ['user_id','created_at','expires_at']); }

  async function showCoupon(id){
    const d = qs('#detail'); d.style.display='block'; d.innerHTML='';
    let c = { code: '', discount_type: '', discount_desc: '', expires_at: '' };
    let creating = false;
    if (id){
      const r = await fetchJson(adminPrefix + '/coupons/' + id);
      if(!r.ok){ d.innerHTML='<p>Error</p>'; return }
      c = r.body;
    } else creating = true;
    d.appendChild(el('h3',{textContent: creating ? 'New Coupon' : ('Edit Coupon #'+(c.id||'')) }));
    const form = el('div');
    const fields = ['code','discount_type','discount_desc','expires_at'];
    fields.forEach(k=>{
      const row = el('div',{className:'form-row'});
      row.appendChild(el('label',{textContent:k}));
      const input = k === 'discount_desc' ? el('textarea',{id:'field-'+k, textContent:c[k]||''}) : el('input',{id:'field-'+k, value: c[k]||''});
      if(k === 'expires_at') input.type='date';
      row.appendChild(input);
      form.appendChild(row);
    });
    const save = el('button',{className:'button'}); save.textContent='Save'; save.onclick = async ()=>{
      const body = {};
      fields.forEach(k=> body[k]=qs('#field-'+k).value);
      if (body.expires_at === '') body.expires_at = null;
      let res;
      if (creating) res = await fetchJson(adminPrefix + '/coupons', { method: 'POST', body }); else res = await fetchJson(adminPrefix + '/coupons/' + id,{ method:'PATCH', body });
      if (res.ok) { alert('Saved'); loadCoupons(); } else { alert('Error '+res.status+' - '+JSON.stringify(res.body)); }
    };
    form.appendChild(save);
    if (!creating){
      const del = el('button',{className:'button'}); del.textContent='Delete'; del.onclick = async ()=>{
        const res = await fetchJson(adminPrefix + '/coupons/' + id, { method: 'DELETE' });
        if (res.ok) { alert('Deleted'); loadCoupons(); } else { alert('Error '+res.status+' - '+JSON.stringify(res.body)); }
      };
      form.appendChild(del);
    }
    d.appendChild(form);
  }

  async function showCategory(id){
    const d = qs('#detail'); d.style.display='block'; d.innerHTML='';
    let c = { name: '', parent_id: null };
    let creating = false;
    if (id){
      const r = await fetchJson(adminPrefix + '/categories/' + id);
      if(!r.ok){ d.innerHTML='<p>Error</p>'; return }
      c = r.body;
    } else creating = true;
    d.appendChild(el('h3',{textContent: creating ? 'New Category' : ('Edit Category #'+(c.id||'')) }));
    const form = el('div');
    const fields = ['name','parent_id'];
    fields.forEach(k=>{
      const row = el('div',{className:'form-row'});
      row.appendChild(el('label',{textContent:k}));
      const input = el('input',{id:'field-'+k, value: c[k]||''});
      row.appendChild(input);
      form.appendChild(row);
    });
    const save = el('button',{className:'button'}); save.textContent='Save'; save.onclick = async ()=>{
      const body = {};
      fields.forEach(k=> body[k]=qs('#field-'+k).value);
      if (body.parent_id === '') delete body.parent_id; else if (body.parent_id) body.parent_id = Number(body.parent_id);
      let res;
      if (creating) res = await fetchJson(adminPrefix + '/categories', { method: 'POST', body }); else res = await fetchJson(adminPrefix + '/categories/' + id,{ method:'PATCH', body });
      if (res.ok) { alert('Saved'); loadCategories(); } else { alert('Error '+res.status+' - '+JSON.stringify(res.body)); }
    };
    form.appendChild(save);
    if (!creating){
      const del = el('button',{className:'button'}); del.textContent='Delete'; del.onclick = async ()=>{
        const res = await fetchJson(adminPrefix + '/categories/' + id, { method: 'DELETE' });
        if (res.ok) { alert('Deleted'); loadCategories(); } else { alert('Error '+res.status+' - '+JSON.stringify(res.body)); }
      };
      form.appendChild(del);
    }
    d.appendChild(form);
  }

  async function loadAttributes(){
    const r = await fetchJson(buildUrl(adminPrefix + '/attributes'));
    const list = qs('#list'); list.innerHTML=''; qs('#detail').style.display='none';
    if(!r.ok){ list.innerHTML = '<p>Error loading attributes: '+r.status+'</p>'; return }
    const table = el('table',{className:'table'});
    const header = el('div');
    const newBtn = el('button',{className:'button'}); newBtn.textContent='New Attribute'; newBtn.onclick = ()=> showAttribute(null);
    header.appendChild(newBtn);
    list.appendChild(header);
    const thead = el('thead'); thead.innerHTML='<tr><th>ID</th><th>Name</th><th></th></tr>'; table.appendChild(thead);
    const tbody = el('tbody');
    const { items: attrs, total, pages } = normalizeListResponse(r);
    attrs.forEach(a=>{
      const tr = el('tr');
      tr.innerHTML = `<td>${a.id}</td><td>${a.name||''}</td><td></td>`;
      const btn = el('button',{className:'button'}); btn.textContent='Edit'; btn.onclick = ()=> showAttribute(a.id);
      tr.children[2].appendChild(btn);
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    list.appendChild(table);
    updatePaginationControls(total, pages, attrs.length);
  }

  async function showAttribute(id){
    const d = qs('#detail'); d.style.display='block'; d.innerHTML='';
    let a = { name: '' };
    let creating = false;
    if (id){
      const r = await fetchJson(adminPrefix + '/attributes/' + id);
      if(!r.ok){ d.innerHTML='<p>Error</p>'; return }
      a = r.body;
    } else creating = true;
    d.appendChild(el('h3',{textContent: creating ? 'New Attribute' : ('Edit Attribute #'+(a.id||'')) }));
    const form = el('div');
    const row = el('div',{className:'form-row'});
    row.appendChild(el('label',{textContent:'name'}));
    row.appendChild(el('input',{id:'field-name', value: a.name||''}));
    form.appendChild(row);
    const save = el('button',{className:'button'}); save.textContent='Save'; save.onclick = async ()=>{
      const body = { name: qs('#field-name').value };
      let res;
      if (creating) res = await fetchJson(adminPrefix + '/attributes', { method: 'POST', body }); else res = await fetchJson(adminPrefix + '/attributes/' + id, { method:'PATCH', body });
      if (res.ok) { alert('Saved'); loadAttributes(); } else { alert('Error '+res.status+' - '+JSON.stringify(res.body)); }
    };
    form.appendChild(save);
    if (!creating){ const del = el('button',{className:'button'}); del.textContent='Delete'; del.onclick = async ()=>{ const res = await fetchJson(adminPrefix + '/attributes/' + id, { method: 'DELETE' }); if(res.ok){ alert('Deleted'); loadAttributes(); } else { alert('Error '+res.status+' - '+JSON.stringify(res.body)); } }; form.appendChild(del); }
    d.appendChild(form);
  }

  async function loadAttributeVariants(){
    const r = await fetchJson(buildUrl(adminPrefix + '/attribute-variants'));
    const list = qs('#list'); list.innerHTML=''; qs('#detail').style.display='none';
    if(!r.ok){ list.innerHTML = '<p>Error loading attribute variants: '+r.status+'</p>'; return }
    const table = el('table',{className:'table'});
    const header = el('div');
    const newBtn = el('button',{className:'button'}); newBtn.textContent='New Variant'; newBtn.onclick = ()=> showAttributeVariant(null);
    header.appendChild(newBtn);
    list.appendChild(header);
    const thead = el('thead'); thead.innerHTML='<tr><th>ID</th><th>Attribute ID</th><th>Name</th><th></th></tr>'; table.appendChild(thead);
    const tbody = el('tbody');
    const { items: vars, total, pages } = normalizeListResponse(r);
    vars.forEach(v=>{
      const tr = el('tr');
      tr.innerHTML = `<td>${v.id}</td><td>${v.attribute_id||''}</td><td>${v.name||''}</td><td></td>`;
      const btn = el('button',{className:'button'}); btn.textContent='Edit'; btn.onclick = ()=> showAttributeVariant(v.id);
      tr.children[3].appendChild(btn);
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    list.appendChild(table);
    updatePaginationControls(total, pages, vars.length);
  }

  async function showAttributeVariant(id){
    const d = qs('#detail'); d.style.display='block'; d.innerHTML='';
    let v = { attribute_id: null, name: '' };
    let creating = false;
    if (id){
      const r = await fetchJson(adminPrefix + '/attribute-variants/' + id);
      if(!r.ok){ d.innerHTML='<p>Error</p>'; return }
      v = r.body;
    } else creating = true;
    d.appendChild(el('h3',{textContent: creating ? 'New Variant' : ('Edit Variant #'+(v.id||'')) }));
    const form = el('div');
    const f1 = el('div',{className:'form-row'}); f1.appendChild(el('label',{textContent:'attribute_id'})); f1.appendChild(el('input',{id:'field-attribute_id', value: v.attribute_id||''})); form.appendChild(f1);
    const f2 = el('div',{className:'form-row'}); f2.appendChild(el('label',{textContent:'name'})); f2.appendChild(el('input',{id:'field-name', value: v.name||''})); form.appendChild(f2);
    const save = el('button',{className:'button'}); save.textContent='Save'; save.onclick = async ()=>{
      const body = { attribute_id: qs('#field-attribute_id').value ? Number(qs('#field-attribute_id').value) : null, name: qs('#field-name').value };
      let res;
      if (creating) res = await fetchJson(adminPrefix + '/attribute-variants', { method: 'POST', body }); else res = await fetchJson(adminPrefix + '/attribute-variants/' + id, { method:'PATCH', body });
      if (res.ok) { alert('Saved'); loadAttributeVariants(); } else { alert('Error '+res.status+' - '+JSON.stringify(res.body)); }
    };
    form.appendChild(save);
    if (!creating){ const del = el('button',{className:'button'}); del.textContent='Delete'; del.onclick = async ()=>{ const res = await fetchJson(adminPrefix + '/attribute-variants/' + id, { method: 'DELETE' }); if(res.ok){ alert('Deleted'); loadAttributeVariants(); } else { alert('Error '+res.status+' - '+JSON.stringify(res.body)); } }; form.appendChild(del); }
    d.appendChild(form);
  }

  async function showUser(id){
    const d = qs('#detail'); d.style.display='block'; d.innerHTML='';
    let u = { email: '', first_name: '', last_name: '', phone: '', status: '', is_admin: false };
    let creating = false;
    if (id){
      const r = await fetchJson(adminPrefix + '/users/' + id);
      if(!r.ok){ d.innerHTML='<p>Error</p>'; return }
      u = r.body;
    } else {
      creating = true;
    }
    d.appendChild(el('h3',{textContent: creating ? 'New User' : ('Edit User #'+(u.id||'')) }));
    const form = el('div');
    const fields = ['email','first_name','last_name','birth_date','phone','status','is_admin'];
    fields.forEach(k=>{
      const row = el('div',{className:'form-row'});
      row.appendChild(el('label',{textContent:k}));
      let input;
      if(k === 'birth_date'){
        input = el('input',{type:'date', id:'field-'+k, value: u[k] ? (new Date(u[k]).toISOString().split('T')[0]) : ''});
      } else if (k === 'is_admin'){
        input = el('input',{type:'checkbox', id:'field-'+k}); input.checked = !!u.is_admin;
      } else {
        input = el('input',{value:u[k]||'', id:'field-'+k});
      }
      row.appendChild(input);
      form.appendChild(row);
    });
    const save = el('button',{className:'button'}); save.textContent='Save'; save.onclick = async ()=>{
      const body = {};
      fields.forEach(k=> {
        if(k === 'is_admin') body[k] = !!qs('#field-'+k).checked;
        else body[k]=qs('#field-'+k).value;
      });
      let res;
      if (creating) res = await fetchJson(adminPrefix + '/users',{ method:'POST', body }); else res = await fetchJson(adminPrefix + '/users/' + id,{ method:'PATCH', body });
      if (res.ok) { alert('Saved'); loadUsers(); } else { alert('Error '+res.status+' - '+JSON.stringify(res.body)); }
    };
    form.appendChild(save);
    if (!creating){
      const del = el('button',{className:'button'}); del.textContent='Delete'; del.onclick = async ()=>{
        const res = await fetchJson(adminPrefix + '/users/' + id, { method: 'DELETE' });
        if (res.ok) { alert('Deleted'); loadUsers(); } else { alert('Error '+res.status+' - '+JSON.stringify(res.body)); }
      };
      form.appendChild(del);
    }
    d.appendChild(form);
  }

  async function showProduct(id){
    const d = qs('#detail'); d.style.display='block'; d.innerHTML='';
    let p = { name: '', description: '', currency: '', active: true };
    let creating = false;
    if (id){
      const r = await fetchJson(adminPrefix + '/products/' + id);
      if(!r.ok){ d.innerHTML='<p>Error</p>'; return }
      p = r.body;
    } else {
      creating = true;
    }
    d.appendChild(el('h3',{textContent: creating ? 'New Product' : ('Edit Product #'+(p.id||'')) }));
    const form = el('div');
    const fields = ['name','description','currency','active'];
    fields.forEach(k=>{
      const row = el('div',{className:'form-row'});
      row.appendChild(el('label',{textContent:k}));
      const input = k === 'description' ? el('textarea',{id:'field-'+k, textContent:p[k]||''}) : el('input',{id:'field-'+k, value:p[k]||''});
      row.appendChild(input);
      form.appendChild(row);
    });
    const save = el('button',{className:'button'}); save.textContent='Save'; save.onclick = async ()=>{
      const body = {};
      fields.forEach(k=> body[k]= (qs('#field-'+k).value || qs('#field-'+k).textContent));
      let res;
      // coerce booleans/numbers
      if (body.active !== undefined) body.active = (body.active === 'true' || body.active === true);
      if (body.brand_id !== undefined) body.brand_id = body.brand_id ? Number(body.brand_id) : undefined;
      if (body.category_id !== undefined) body.category_id = body.category_id ? Number(body.category_id) : undefined;
      if (creating) res = await fetchJson(adminPrefix + '/products', { method: 'POST', body }); else res = await fetchJson(adminPrefix + '/products/' + id,{ method:'PATCH', body });
      if (res.ok) { alert('Saved'); loadProducts(); } else { alert('Error '+res.status+' - '+JSON.stringify(res.body)); }
    };
    form.appendChild(save);
    if (!creating){
      const del = el('button',{className:'button'}); del.textContent='Delete'; del.onclick = async ()=>{
        const res = await fetchJson(adminPrefix + '/products/' + id, { method: 'DELETE' });
        if (res.ok) { alert('Deleted'); loadProducts(); } else { alert('Error '+res.status+' - '+JSON.stringify(res.body)); }
      };
      form.appendChild(del);
    }
    d.appendChild(form);

    if (!creating){
      // Images section
      const imgSection = el('div');
      imgSection.appendChild(el('h4',{textContent:'Images'}));
      const imgList = el('div');
      (p.images||[]).forEach(img=>{
        const row = el('div',{className:'img-row'});
        const thumb = el('img'); thumb.src = img.image_url; thumb.style.maxWidth='120px';
        row.appendChild(thumb);
        const del = el('button',{className:'button'}); del.textContent='Delete'; del.onclick = async ()=>{
          const res = await fetchJson(adminPrefix + '/products/' + id + '/images/' + img.id, { method: 'DELETE' });
          if (res.ok) { alert('Deleted'); showProduct(id); } else { alert('Error '+res.status+' - '+JSON.stringify(res.body)); }
        };
        row.appendChild(del);
        imgList.appendChild(row);
      });
      imgSection.appendChild(imgList);
      const uploadRow = el('div',{className:'form-row'});
      const fileInput = el('input'); fileInput.type='file'; fileInput.id='field-image-file';
      const uploadBtn = el('button',{className:'button'}); uploadBtn.textContent='Upload';
      uploadBtn.onclick = async ()=>{
        const f = qs('#field-image-file').files[0];
        if(!f) { alert('Select a file'); return }
        const fd = new FormData(); fd.append('file', f);
        const res = await fetch(adminPrefix + '/products/' + id + '/images/upload', { method: 'POST', body: fd, headers: authHeaders() });
        const text = await res.text(); let body; try{ body=JSON.parse(text) }catch(e){ body=text }
        if(res.ok){ alert('Uploaded'); showProduct(id); } else { alert('Error '+res.status+' - '+JSON.stringify(body)); }
      };
      uploadRow.appendChild(fileInput); uploadRow.appendChild(uploadBtn);
      imgSection.appendChild(uploadRow);
      d.appendChild(imgSection);

      // Items section
      const itemsSection = el('div');
      itemsSection.appendChild(el('h4',{textContent:'Items / Variants'}));
      const itemsList = el('div');
      (p.product_items||[]).forEach(it=>{
        const row = el('div',{className:'item-row'});
        row.appendChild(el('span',{textContent:`#${it.id} SKU:${it.sku||''} Price:${it.price||''} Weight:${it.weight||''}`}));
        const edit = el('button',{className:'button'}); edit.textContent='Edit'; edit.onclick = ()=> showItem(id, it.id);
        const del = el('button',{className:'button'}); del.textContent='Delete'; del.onclick = async ()=>{
          const res = await fetchJson(adminPrefix + '/products/' + id + '/items/' + it.id, { method: 'DELETE' });
          if(res.ok){ alert('Deleted'); showProduct(id); } else { alert('Error '+res.status+' - '+JSON.stringify(res.body)); }
        };
        row.appendChild(edit); row.appendChild(del);
        itemsList.appendChild(row);
      });
      itemsSection.appendChild(itemsList);
      const addItemBtn = el('button',{className:'button'}); addItemBtn.textContent='New Item'; addItemBtn.onclick = ()=> showItem(id, null);
      itemsSection.appendChild(addItemBtn);
      d.appendChild(itemsSection);
    }
  }

  async function showOrder(id){
    const d = qs('#detail'); d.style.display='block'; d.innerHTML='';
    let creating = false;
    let o = { status: '', total_price: 0, currency: 'USD', user_id: null };
    if (id){
      const r = await fetchJson(adminPrefix + '/orders/' + id);
      if(!r.ok){ d.innerHTML='<p>Error</p>'; return }
      o = r.body;
    } else {
      creating = true;
    }
    d.appendChild(el('h3',{textContent: creating ? 'New Order' : ('Edit Order #'+(o.id||'')) }));
    const form = el('div');
    const row = el('div',{className:'form-row'});
    row.appendChild(el('label',{textContent:'status'}));
    const input = el('input',{id:'field-status', value:o.status||''});
    row.appendChild(input);
    form.appendChild(row);
    const save = el('button',{className:'button'}); save.textContent='Save'; save.onclick = async ()=>{
      const body = { status: qs('#field-status').value };
      let res;
      if (creating) res = await fetchJson(adminPrefix + '/orders', { method: 'POST', body }); else res = await fetchJson(adminPrefix + '/orders/' + id,{ method:'PATCH', body });
      if (res.ok) { alert('Saved'); loadOrders(); } else { alert('Error '+res.status+' - '+JSON.stringify(res.body)); }
    };
    form.appendChild(save);
    if (!creating){
      const del = el('button',{className:'button'}); del.textContent='Delete'; del.onclick = async ()=>{
        const res = await fetchJson(adminPrefix + '/orders/' + id, { method: 'DELETE' });
        if (res.ok) { alert('Deleted'); loadOrders(); } else { alert('Error '+res.status+' - '+JSON.stringify(res.body)); }
      };
      form.appendChild(del);
    }
    d.appendChild(form);
  }

  async function showItem(productId, itemId){
    const d = qs('#detail'); d.style.display='block'; d.innerHTML='';
    let item = { sku: '', price: '', weight: '' };
    let creating = false;
    if (itemId){
      const r = await fetchJson(adminPrefix + '/products/' + productId + '/items');
      if(!r.ok){ d.innerHTML='<p>Error loading items</p>'; return }
      const found = (Array.isArray(r.body)? r.body : (r.body.items||r.body)).find(x=>x.id==itemId);
      if(!found){ d.innerHTML='<p>Item not found</p>'; return }
      item = found;
    } else creating = true;
    d.appendChild(el('h3',{textContent: creating ? 'New Item' : ('Edit Item #'+(item.id||'')) }));
    const form = el('div');
    const fields = ['sku','price','weight'];
    fields.forEach(k=>{
      const row = el('div',{className:'form-row'});
      row.appendChild(el('label',{textContent:k}));
      const input = el('input',{id:'field-'+k, value: item[k]||''});
      row.appendChild(input);
      form.appendChild(row);
    });
    const save = el('button',{className:'button'}); save.textContent='Save'; save.onclick = async ()=>{
      const body = {};
      fields.forEach(k=> body[k]=qs('#field-'+k).value);
      if (body.price) body.price = Number(body.price);
      if (body.weight) body.weight = Number(body.weight);
      let res;
      if (creating) res = await fetchJson(adminPrefix + '/products/' + productId + '/items', { method: 'POST', body }); else res = await fetchJson(adminPrefix + '/products/' + productId + '/items/' + itemId, { method:'PATCH', body });
      if (res.ok) { alert('Saved'); showProduct(productId); } else { alert('Error '+res.status+' - '+JSON.stringify(res.body)); }
    };
    form.appendChild(save);
    if (!creating){
      const del = el('button',{className:'button'}); del.textContent='Delete'; del.onclick = async ()=>{
        const res = await fetchJson(adminPrefix + '/products/' + productId + '/items/' + itemId, { method: 'DELETE' });
        if (res.ok) { alert('Deleted'); showProduct(productId); } else { alert('Error '+res.status+' - '+JSON.stringify(res.body)); }
      };
      form.appendChild(del);
    }
    d.appendChild(form);
  }

  // Wire nav
  function init(){
    qs('#set-token').onclick = ()=>{ setToken(qs('#token').value); alert('Token set') };

    document.querySelectorAll('nav button').forEach(b=> b.onclick = async (ev)=>{
      document.querySelectorAll('nav button').forEach(x=>x.classList.remove('active'));
      ev.target.classList.add('active');
      const view = ev.target.getAttribute('data-view');
      state.view = view;
      state.page = 1;
      await loadCurrentView();
      updatePageInfo();
    });

    // search input
    let _searchTimer = null;
    const searchEl = qs('#search');
    if (searchEl){
      searchEl.oninput = (e)=>{
        state.search = e.target.value;
        state.page = 1;
        clearTimeout(_searchTimer);
        _searchTimer = setTimeout(()=>{ loadCurrentView().then(updatePageInfo); }, 300);
      };
    }

    // Search button triggers immediately (useful on mobile/keyboard)
    const searchBtn = qs('#search-btn');
    if (searchBtn){
      searchBtn.onclick = async ()=>{
        state.search = qs('#search').value;
        state.page = 1;
        await loadCurrentView();
        updatePageInfo();
      };
    }

    // Page size selector
    const pageSizeEl = qs('#page-size');
    if (pageSizeEl){
      pageSizeEl.value = String(state.limit || 10);
      pageSizeEl.onchange = async (e)=>{
        state.limit = Number(e.target.value || 10);
        state.page = 1;
        await loadCurrentView();
        updatePageInfo();
      };
    }

    // pagination
    qs('#prev-page').onclick = async ()=>{ if(state.page>1) { state.page--; await loadCurrentView(); updatePageInfo(); } };
    qs('#next-page').onclick = async ()=>{ state.page++; await loadCurrentView(); updatePageInfo(); };

    function updatePageInfo(){ const el = qs('#page-info'); if(el) el.textContent = String(state.page); }

    // initial
    loadCurrentView().then(updatePageInfo);
  }

  window.addEventListener('DOMContentLoaded', init);
})();
