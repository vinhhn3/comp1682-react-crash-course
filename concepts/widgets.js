/* Interactive simulators, embedded in the step page instead of living only on
   hooks.html / api.html / context.html. */

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/* ── state is a snapshot ───────────────────────────────────────────── */

function initSnapshot(root) {
  root.innerHTML = `
    <div class="spread" style="margin-bottom:10px">
      <span class="tag">render <span class="snap-render">1</span></span>
      <span class="snap-screen">0</span>
    </div>
    <div class="btns">
      <button class="btn pri" data-act="one">setCount(count + 1)</button>
      <button class="btn" data-act="twice">…twice</button>
      <button class="btn" data-act="fn">setCount(c =&gt; c + 1) ×2</button>
      <button class="btn" data-act="reset">reset</button>
    </div>
    <ul class="log" style="max-height:190px;margin-top:10px"></ul>
    <p class="note snap-verdict" style="margin-top:10px">Press “twice” and predict the result before you look.</p>
  `;

  const screen = root.querySelector('.snap-screen');
  const rn = root.querySelector('.snap-render');
  const list = root.querySelector('.log');
  const verdict = root.querySelector('.snap-verdict');

  let stored = 0;
  let render = 1;
  let rows = [{ left: 'R1', text: 'renders with count = 0', kind: 'ok' }];

  function draw() {
    screen.textContent = stored;
    rn.textContent = render;
    list.innerHTML = rows
      .map((r) => `<li><span class="t">${r.left}</span><span class="${r.kind || ''}">${r.text}</span></li>`)
      .join('');
  }

  function commit(modes) {
    const seen = stored;
    let draft = stored;
    const parts = [];

    for (const mode of modes) {
      if (mode === 'value') {
        draft = seen + 1;
        parts.push(`count is ${seen} → setCount(${seen + 1})`);
      } else {
        draft += 1;
        parts.push(`update(c => c + 1) → ${draft}`);
      }
    }

    stored = draft;
    render += 1;
    rows.unshift({ left: 'click', text: parts.join('  ·  '), kind: '' });
    rows.unshift({ left: `R${render}`, text: `renders with count = ${stored}`, kind: 'ok' });
    if (rows.length > 18) rows.pop();
    draw();

    if (modes.length === 2 && modes[0] === 'value') {
      verdict.innerHTML = '<b>Only +1.</b> Both updates read the same snapshot (0). A snapshot is not a live variable.';
    } else if (modes.length === 2) {
      verdict.innerHTML = '<b>+2.</b> The functional form hands each update the latest pending value, not the snapshot.';
    } else {
      verdict.textContent = 'One click, one new render, one new constant.';
    }
  }

  root.querySelectorAll('[data-act]').forEach((button) => {
    button.onclick = () => {
      const act = button.dataset.act;
      if (act === 'one') commit(['value']);
      if (act === 'twice') commit(['value', 'value']);
      if (act === 'fn') commit(['fn', 'fn']);
      if (act === 'reset') {
        stored = 0;
        render = 1;
        rows = [{ left: 'R1', text: 'renders with count = 0', kind: 'ok' }];
        verdict.textContent = 'Press “twice” and predict the result before you look.';
        draw();
      }
    };
  });

  draw();
}

/* ── effect dependencies ───────────────────────────────────────────── */

function initEffects(root) {
  root.innerHTML = `
    <div class="spread" style="margin-bottom:8px">
      <div class="btns">
        <button class="btn" data-fx="none">no array</button>
        <button class="btn on" data-fx="dep">[query]</button>
        <button class="btn" data-fx="array">[]</button>
      </div>
      <span class="tag fx-tag">[query]</span>
    </div>
    <pre class="code fx-code" style="margin:0 0 10px"></pre>
    <div class="btns">
      <button class="btn pri" data-fx-act="rerender">re-render (same deps)</button>
      <button class="btn" data-fx-act="change">type in search</button>
      <button class="btn" data-fx-act="unmount">unmount</button>
      <button class="btn" data-fx-act="reset">reset</button>
    </div>
    <ul class="log" style="max-height:220px;margin-top:10px"></ul>
    <p class="note fx-note" style="margin-top:10px">The log is the only truth. Watch cleanup before the next effect.</p>
  `;

  const CODE = {
    none: `useEffect(() => {
  fetch('/api/products?q=' + query)
    .then(setProducts);
})                  // no array`,
    dep: `useEffect(() => {
  fetch('/api/products?q=' + query)
    .then(setProducts);
}, [query])         // re-run when query changes`,
    array: `useEffect(() => {
  fetch('/api/products?q=' + query)
    .then(setProducts);
}, [])              // run once, on mount`,
  };

  const log = root.querySelector('.log');
  const code = root.querySelector('.fx-code');
  const tag = root.querySelector('.fx-tag');
  const note = root.querySelector('.fx-note');
  const fx = { mode: 'dep', query: '', active: false, mounted: true, rows: [] };

  function push(kind, text) {
    fx.rows.unshift({ kind, text });
    if (fx.rows.length > 24) fx.rows.pop();
    log.innerHTML = fx.rows
      .map((r) => `<li><span class="t">${r.kind}</span><span class="${r.kind === 'cleanup' ? 'warn' : r.kind === 'effect' ? 'ok' : ''}">${esc(r.text)}</span></li>`)
      .join('');
  }

  function draw() {
    code.textContent = CODE[fx.mode];
    tag.textContent = fx.mode === 'dep' ? '[query]' : fx.mode === 'array' ? '[]' : 'no array';
    root.querySelectorAll('[data-fx]').forEach((b) => b.classList.toggle('on', b.dataset.fx === fx.mode));
  }

  function cycle({ initial = false, depChanged = false } = {}) {
    if (!fx.mounted) return;
    push('render', 'component function runs');

    if (fx.mode === 'none') {
      if (fx.active) {
        push('cleanup', 'cleanup() runs before the next effect');
        fx.active = false;
      }
      push('effect', 'effect runs → fetch()');
      fx.active = true;
      return;
    }

    if (fx.mode === 'array') {
      if (!initial) {
        push('skip', 'nothing runs: the dependencies did not change');
        return;
      }
      push('effect', 'effect runs once → fetch()');
      fx.active = true;
      return;
    }

    if (!initial && !depChanged) {
      push('skip', 'nothing runs: query is unchanged');
      return;
    }
    if (fx.active) {
      push('cleanup', 'cleanup runs → abort the previous request');
      fx.active = false;
    }
    push('effect', `effect runs → fetch(query = "${fx.query}")`);
    fx.active = true;
  }

  function reset() {
    fx.mounted = true;
    fx.active = false;
    fx.query = '';
    fx.rows = [];
    push('mount', 'component mounts');
    cycle({ initial: true });
    note.textContent = 'The log is the only truth. Watch cleanup before the next effect.';
    draw();
  }

  root.querySelectorAll('[data-fx]').forEach((b) => {
    b.onclick = () => {
      fx.mode = b.dataset.fx;
      reset();
    };
  });

  root.querySelector('[data-fx-act="rerender"]').onclick = () => cycle({});
  root.querySelector('[data-fx-act="change"]').onclick = () => {
    fx.query = fx.query === '' ? 'mu' : fx.query === 'mu' ? 'mug' : '';
    cycle({ depChanged: true });
    draw();
  };
  root.querySelector('[data-fx-act="unmount"]').onclick = () => {
    if (fx.active) push('cleanup', 'cleanup runs on unmount → abort');
    else push('skip', 'nothing to clean up');
    fx.active = false;
    fx.mounted = false;
    push('unmount', 'the component is gone');
    note.textContent = 'Unmounted. A re-render or a query change now does nothing; the effect is gone with the component.';
    draw();
  };
  root.querySelector('[data-fx-act="reset"]').onclick = reset;

  reset();
}

/* ── request race and abort ────────────────────────────────────────── */

function initRace(root) {
  root.innerHTML = `
    <div class="btns" style="margin-bottom:10px">
      <button class="btn pri" data-race="none">Run without cleanup</button>
      <button class="btn" data-race="abort">Run with abort</button>
      <button class="btn" data-race="clear">clear</button>
    </div>
    <div class="stack" style="gap:8px">
      <div class="row"><span class="tag" style="width:76px">q = “m”</span><div class="track" style="flex:1"><div class="bar a race-a" style="left:0;width:0">GET ?q=m</div></div></div>
      <div class="row"><span class="tag" style="width:76px">q = “mu”</span><div class="track" style="flex:1"><div class="bar b race-b" style="left:8%;width:0">GET ?q=mu</div></div></div>
    </div>
    <div class="grid2" style="margin-top:12px">
      <ul class="log race-log" style="max-height:150px"></ul>
      <div class="race-result card" style="display:grid;place-items:center;text-align:center;min-height:110px;font-weight:600">
        <span style="color:var(--muted);font-weight:400">Result goes here.</span>
      </div>
    </div>
  `;

  const barA = root.querySelector('.race-a');
  const barB = root.querySelector('.race-b');
  const log = root.querySelector('.race-log');
  const result = root.querySelector('.race-result');
  let gen = 0;

  function clearBars() {
    for (const b of [barA, barB]) {
      b.style.transition = 'none';
      b.style.width = '0%';
      b.classList.remove('dead');
    }
  }

  function note(at, text, kind) {
    const li = document.createElement('li');
    li.innerHTML = `<span class="t">${at.toFixed(1)}s</span><span class="${kind || ''}">${text}</span>`;
    log.append(li);
    log.scrollTop = log.scrollHeight;
  }

  function startBar(el, ms, done) {
    el.style.transition = 'none';
    el.style.width = '0%';
    void el.offsetWidth;
    el.style.transition = `width ${ms}ms linear`;
    el.style.width = '100%';
    setTimeout(done, ms);
  }

  function freeze(el) {
    const w = el.getBoundingClientRect().width;
    el.style.transition = 'none';
    el.style.width = `${w}px`;
    el.classList.add('dead');
  }

  function run({ abort }) {
    gen += 1;
    const my = gen;
    clearBars();
    log.innerHTML = '';
    result.innerHTML = '<span style="color:var(--muted);font-weight:400">…</span>';

    note(0, abort ? 'mode: cleanup + abort' : 'mode: no cleanup', 'warn');
    note(0, 'type “m” → effect runs → GET ?q=m');

    startBar(barA, 2800, () => {
      if (my !== gen || abort) return;
      note(2.8, '“m” responds with 3 items — the stale result wins', 'err');
      result.innerHTML = '<div><b style="color:#b4302a">3 results for “m”</b><br><span style="font-size:12.5px;color:var(--muted)">stale — the box says “mu”</span></div>';
    });

    setTimeout(() => {
      if (my !== gen) return;
      note(0.5, 'type “mu” → cleanup runs, then a new effect');
      if (abort) {
        freeze(barA);
        note(0.5, 'abort() — the “m” request is cancelled', 'ok');
      }
      startBar(barB, 1000, () => {
        if (my !== gen) return;
        note(1.5, '“mu” responds with 1 item', 'ok');
        result.innerHTML = abort
          ? '<div><b style="color:#1b7a3d">1 result for “mu”</b><br><span style="font-size:12.5px;color:var(--muted)">and nothing overwrites it</span></div>'
          : '<div><b style="color:#1b7a3d">1 result for “mu”</b><br><span style="font-size:12.5px;color:var(--muted)">until the slow one lands…</span></div>';
      });
    }, 500);
  }

  root.querySelectorAll('[data-race]').forEach((b) => {
    b.onclick = () => {
      if (b.dataset.race === 'clear') {
        gen += 1;
        clearBars();
        log.innerHTML = '';
        result.innerHTML = '<span style="color:var(--muted);font-weight:400">Result goes here.</span>';
        return;
      }
      run({ abort: b.dataset.race === 'abort' });
    };
  });
}

/* ── context re-renders ───────────────────────────────────────────── */

function initContext(root) {
  root.innerHTML = `
    <div class="spread" style="margin-bottom:10px">
      <div class="btns">
        <button class="btn on" data-ctx="context">with context</button>
        <button class="btn" data-ctx="props">with props</button>
      </div>
      <div class="btns">
        <button class="btn pri" data-ctx-add>add to cart</button>
        <span class="tag ctx-count">0 re-rendered</span>
      </div>
    </div>
    <div class="grid2">
      <div class="node ctx-node" data-node="app">App <small>owns page</small></div>
      <div class="node ctx-node" data-node="header">Header <small>useCart()</small></div>
      <div class="node ctx-node" data-node="shop">ShopPage <small>useCart()</small></div>
      <div class="node ctx-node" data-node="cart">CartPage <small>useCart()</small></div>
    </div>
    <p class="note ctx-text" style="margin-top:12px">With context, App does not re-render at all — the provider owns the state. Only the three consumers do.</p>
  `;

  const ALL = ['app', 'header', 'shop', 'cart'];
  const nodes = Object.fromEntries(ALL.map((key) => [key, root.querySelector(`[data-node="${key}"]`)]));
  const count = root.querySelector('.ctx-count');
  const text = root.querySelector('.ctx-text');
  let mode = 'context';

  function reset() {
    ALL.forEach((key) => nodes[key].classList.remove('hot', 'off'));
    count.textContent = '0 re-rendered';
    text.innerHTML = mode === 'context'
      ? 'With context, App does not re-render at all — the provider owns the state. Only the three consumers do.'
      : 'With props, App re-renders and hands new values to all three children.';
  }

  root.querySelectorAll('[data-ctx]').forEach((button) => {
    button.onclick = () => {
      mode = button.dataset.ctx;
      root.querySelectorAll('[data-ctx]').forEach((b) => b.classList.toggle('on', b === button));
      reset();
    };
  });

  root.querySelector('[data-ctx-add]').onclick = () => {
    const hot = mode === 'context' ? ALL.slice(1) : ALL;
    ALL.forEach((key) => {
      nodes[key].classList.remove('hot');
      nodes[key].classList.toggle('off', !hot.includes(key));
    });
    hot.forEach((key) => nodes[key].classList.add('hot'));
    count.textContent = `${hot.length} re-rendered`;
    text.innerHTML = mode === 'context'
      ? 'The provider’s value changed. Every consumer re-renders; App stays quiet.'
      : 'The cart lives in App. App re-renders and sends new props to all three children.';
  };

  reset();
}


/* ── context: the provider wraps the app ──────────────────────────── */

function initContextWrap(root) {
  root.innerHTML = `
    <div class="ctx-head">
      <div class="btns">
        <button class="btn pri" data-ctx-add>add to cart</button>
        <button class="btn" data-ctx-reset>reset</button>
      </div>
      <span class="tag ctx-status">0 lines in the cart</span>
    </div>
    <div class="ctx-scene">
      <div class="ctx-provider">
        <div class="ctx-provider-head">
          <b>CartProvider</b>
          <small>context/CartContext.jsx · wraps the whole app</small>
        </div>
        <div class="ctx-value">
          <span>value</span>
          <code>{ cart, addToCart, count, total }</code>
        </div>

        <div class="ctx-app">
          <div class="ctx-app-head"><b>App</b><small>navigation only — no cart state</small></div>
          <div class="ctx-children">
            <div class="ctx-consumer" data-ctx-consumer="header">
              <span class="ctx-flow down">value ↓</span>
              <b>Header</b><small>useCart() → count</small><em>0</em>
            </div>

            <div class="ctx-branch">
              <div class="ctx-consumer" data-ctx-consumer="shop">
                <span class="ctx-flow down">value ↓</span>
                <b>ShopPage</b><small>useCart() → addToCart</small>
              </div>
              <div class="ctx-event" data-ctx-event="card">
                <span class="ctx-flow up">action ↑</span>
                <b>ProductCard</b><small>onAdd(product) — a prop</small>
              </div>
            </div>

            <div class="ctx-consumer" data-ctx-consumer="cart">
              <span class="ctx-flow down">value ↓</span>
              <b>CartPage</b><small>useCart() → cart, total</small><em>$0</em>
            </div>
          </div>
        </div>
      </div>
      <div class="ctx-packet"></div>
    </div>
    <div class="ctx-log note">Press <b>add to cart</b>: the event goes up to the provider, then the value goes down to each reader.</div>
  `;

  const scene = root.querySelector('.ctx-scene');
  const provider = root.querySelector('.ctx-provider');
  const value = root.querySelector('.ctx-value');
  const packet = root.querySelector('.ctx-packet');
  const log = root.querySelector('.ctx-log');
  const status = root.querySelector('.ctx-status');
  const header = root.querySelector('[data-ctx-consumer="header"]');
  const shop = root.querySelector('[data-ctx-consumer="shop"]');
  const cart = root.querySelector('[data-ctx-consumer="cart"]');
  const card = root.querySelector('[data-ctx-event="card"]');
  let busy = false;

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  function reset() {
    busy = false;
    header.classList.remove('pulse', 'hot');
    shop.classList.remove('pulse', 'hot');
    cart.classList.remove('pulse', 'hot');
    card.classList.remove('pulse');
    provider.classList.remove('pulse');
    packet.style.opacity = '0';
    header.querySelector('em').textContent = '0';
    cart.querySelector('em').textContent = '$0';
    value.querySelector('code').textContent = '{ cart, addToCart, count, total }';
    status.textContent = '0 lines in the cart';
    log.innerHTML = 'Press <b>add to cart</b>: the event goes up to the provider, then the value goes down to each reader.';
  }

  function point(el) {
    const s = scene.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    return { x: r.left - s.left + r.width / 2, y: r.top - s.top + r.height / 2 };
  }

  async function move(from, to, kind = 'value') {
    const a = point(from);
    const b = point(to);
    packet.style.transition = 'none';
    packet.style.left = `${a.x}px`;
    packet.style.top = `${a.y}px`;
    packet.style.opacity = '1';
    packet.className = `ctx-packet ${kind}`;
    void packet.offsetWidth;
    packet.style.transition = 'left 800ms cubic-bezier(.4,0,.2,1), top 800ms cubic-bezier(.4,0,.2,1)';
    packet.style.left = `${b.x}px`;
    packet.style.top = `${b.y}px`;
    await sleep(880);
  }

  async function add() {
    if (busy) return;
    busy = true;

    await move(card, provider, 'action');
    log.innerHTML = '<b>1 · ProductCard</b> calls <code>onAdd(product)</code>. That is a normal prop callback — the card does not call context itself.';
    await sleep(600);

    provider.classList.add('pulse');
    value.querySelector('code').textContent = '{ cart: 1 line, addToCart, count: 1, total: $24 }';
    status.textContent = '1 line in the cart';
    log.innerHTML = '<b>2 · ShopPage</b> got <code>addToCart</code> from <code>useCart()</code> and called it. The provider updated its own <code>useState(cart)</code>.';
    await sleep(900);
    provider.classList.remove('pulse');

    for (const [consumer, name, text] of [
      [header, 'Header', 'count = 1'],
      [shop, 'ShopPage', 'the value changed, so it re-renders'],
      [cart, 'CartPage', '1 line · total $24'],
    ]) {
      await move(value, consumer, 'value');
      consumer.classList.add('pulse', 'hot');
      if (consumer === header) consumer.querySelector('em').textContent = '1';
      if (consumer === cart) consumer.querySelector('em').textContent = '$24';
      log.innerHTML = `<b>3 · ${name}</b> reads the new value through <code>useCart()</code>: ${text}.`;
      await sleep(700);
      consumer.classList.remove('pulse');
    }

    log.innerHTML = '<b>Same provider, three readers.</b> App never re-rendered; Header, ShopPage and CartPage did. The provider is still an ancestor — context did not remove the tree.';
    packet.style.opacity = '0';
    busy = false;
  }

  root.querySelector('[data-ctx-add]').onclick = add;
  root.querySelector('[data-ctx-reset]').onclick = () => {
    reset();
    packet.style.opacity = '0';
  };

  reset();
}


/* ── props: data goes down, read-only ─────────────────────────────── */

function initPropsFlow(root) {
  root.innerHTML = `
    <div class="props-head">
      <div class="btns">
        <button class="btn pri" data-props="0">pass product 1</button>
        <button class="btn" data-props="1">pass product 2</button>
        <button class="btn warn" data-props-edit>try to edit the prop</button>
        <button class="btn" data-props-reset>reset</button>
      </div>
      <span class="tag props-status">waiting for a prop</span>
    </div>

    <div class="props-scene">
      <div class="props-parent">
        <div class="props-parent-head">
          <b>&lt;App /&gt;</b>
          <small>owns the products array</small>
        </div>
        <div class="props-data">
          <span>products</span>
          <code>[ { title: 'Aero Mug', … }, { title: 'Halo Headphones', … } ]</code>
        </div>

        <div class="props-children">
          <div class="props-child">
            <div class="props-child-head">
              <b>&lt;ProductCard /&gt;</b>
              <span class="props-lock">props · read-only</span>
            </div>
            <div class="props-card">
              <b class="props-title">waiting for a prop</b>
              <span class="props-cat">—</span>
              <span class="props-price">—</span>
              <button class="btn" data-props-add>Add to cart</button>
            </div>
          </div>
        </div>
      </div>
      <div class="props-packet"></div>
    </div>
    <p class="note props-log">Press <b>pass product 1</b>: App sends one object down as a prop. The child only displays it.</p>
  `;

  const PRODUCTS = [
    { title: 'Aero Mug', category: 'Kitchen', price: 24 },
    { title: 'Halo Headphones', category: 'Audio', price: 89 },
  ];

  const scene = root.querySelector('.props-scene');
  const parentData = root.querySelector('.props-data');
  const child = root.querySelector('.props-child');
  const card = root.querySelector('.props-card');
  const packet = root.querySelector('.props-packet');
  const status = root.querySelector('.props-status');
  const log = root.querySelector('.props-log');
  let busy = false;

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  function setFields(product) {
    root.querySelector('.props-title').textContent = product.title;
    root.querySelector('.props-cat').textContent = product.category;
    root.querySelector('.props-price').textContent = `$${product.price}`;
  }

  function reset() {
    busy = false;
    setFields({ title: 'waiting for a prop', category: '—', price: '' });
    root.querySelector('.props-price').textContent = '—';
    card.classList.remove('shake', 'locked');
    packet.style.opacity = '0';
    status.textContent = 'waiting for a prop';
    log.innerHTML = 'Press <b>pass product 1</b>: App sends one object down as a prop. The child only displays it.';
  }

  function point(el) {
    const s = scene.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    return { x: r.left - s.left + r.width / 2, y: r.top - s.top + r.height / 2 };
  }

  async function pass(index) {
    if (busy) return;
    busy = true;
    const product = PRODUCTS[index];
    card.classList.remove('shake', 'locked');

    const a = point(parentData);
    const b = point(child);
    /* land just outside the child’s top-right edge, clear of the read-only badge */
    const rect = child.getBoundingClientRect();
    const sceneRect = scene.getBoundingClientRect();
    b.x = rect.right - sceneRect.left + 64;
    b.y = rect.top - sceneRect.top + 14;
    packet.textContent = `product={p${index + 1}}`;
    packet.style.transition = 'none';
    packet.style.left = `${a.x}px`;
    packet.style.top = `${a.y}px`;
    packet.style.opacity = '1';
    void packet.offsetWidth;
    packet.style.transition = 'left 900ms cubic-bezier(.4,0,.2,1), top 900ms cubic-bezier(.4,0,.2,1)';
    packet.style.left = `${b.x}px`;
    packet.style.top = `${b.y}px`;

    status.textContent = `App → ProductCard · product={p${index + 1}}`;
    log.innerHTML = `<b>1 · App</b> renders <code>&lt;ProductCard product={product${index + 1}} /&gt;</code>. The data is the prop.`;
    await sleep(980);

    setFields(product);
    child.classList.add('pulse');
    status.textContent = `ProductCard displays ${product.title}`;
    log.innerHTML = `<b>2 · ProductCard</b> reads <code>props.product</code> and renders the title, category and price. It did not fetch, copy or change the data.`;
    await sleep(700);
    child.classList.remove('pulse');
    packet.style.opacity = '0';
    busy = false;
  }

  root.querySelectorAll('[data-props]').forEach((button) => {
    button.onclick = () => pass(Number(button.dataset.props));
  });

  root.querySelector('[data-props-edit]').onclick = () => {
    card.classList.remove('shake');
    void card.offsetWidth;
    card.classList.add('shake', 'locked');
    status.textContent = 'blocked: props are read-only';
    log.innerHTML = '<b>No.</b> A child may read <code>props.product</code>; it may not assign to it. If the title must change, App owns the change and passes a new object.';
    setTimeout(() => card.classList.remove('shake'), 500);
  };

  root.querySelector('[data-props-add]').onclick = () => {
    log.innerHTML = '<b>The button needs a function prop.</b> At step 5 the parent passes <code>onAdd</code>; the child calls it. That is an event going up, not the child editing the data.';
    status.textContent = 'event would go up through a function prop';
  };

  root.querySelector('[data-props-reset]').onclick = reset;
  reset();
}

/* ── keys and reconciliation ──────────────────────────────────────── */

function initKeys(root) {
  root.innerHTML = `
    <div class="spread" style="margin-bottom:10px">
      <div class="btns">
        <button class="btn on" data-key-mode="key">key = id</button>
        <button class="btn" data-key-mode="index">key = index</button>
      </div>
      <div class="btns">
        <button class="btn" data-key-act="remove">remove middle</button>
        <button class="btn" data-key-act="reverse">reverse</button>
        <button class="btn" data-key-act="reset">reset</button>
      </div>
    </div>
    <div class="key-row"></div>
    <p class="note key-text" style="margin-top:10px">Keyed: A and C keep their DOM nodes. Indexed: the nodes stay in place and are rewritten.</p>
  `;

  const row = root.querySelector('.key-row');
  const text = root.querySelector('.key-text');
  let mode = 'key';
  const start = ['A', 'B', 'C'];
  let items = [...start];
  let previous = [...start];

  function draw(removed = []) {
    const chips = items.map((id, i) => {
      let cls = 'ok';
      if (mode === 'key') {
        if (!previous.includes(id)) cls = 'new';
      } else if (previous[i] !== id) {
        cls = 'bad';
      }
      return `<span class="fig-chip ${cls}">${mode === 'key' ? `${id} · id ${start.indexOf(id) + 1}` : `slot ${i} · ${id}`}</span>`;
    });

    if (removed.length) {
      chips.push(...removed.map((id) => `<span class="fig-chip bad">${id} removed</span>`));
    }
    row.innerHTML = `<div class="fig-chips">${chips.join('')}</div>`;
    text.innerHTML = mode === 'key'
      ? 'Keyed: React matches by identity, so A and C keep their DOM nodes and any local state inside them.'
      : 'Indexed: React matches by position, reuses the same three nodes, and rewrites their contents. State stays in the wrong row.';
  }

  root.querySelectorAll('[data-key-mode]').forEach((button) => {
    button.onclick = () => {
      mode = button.dataset.keyMode;
      root.querySelectorAll('[data-key-mode]').forEach((b) => b.classList.toggle('on', b === button));
      previous = [...items];
      draw();
    };
  });

  root.querySelectorAll('[data-key-act]').forEach((button) => {
    button.onclick = () => {
      const act = button.dataset.keyAct;
      previous = [...items];
      if (act === 'remove' && items.length > 1) {
        const removed = items[1];
        items = items.filter((_, i) => i !== 1);
        draw([removed]);
        return;
      }
      if (act === 'reverse') {
        items = [...items].reverse();
        draw();
        return;
      }
      items = [...start];
      previous = [...start];
      draw();
    };
  });

  draw();
}



/* ── router: the URL wraps the app ────────────────────────────────── */

function initRouterWrap(root) {
  root.innerHTML = `
    <div class="router-head">
      <div class="btns">
        <button class="btn" data-router="/cart">go to /cart</button>
        <button class="btn" data-router="/">back to /</button>
        <button class="btn" data-router-refresh>refresh</button>
      </div>
      <span class="tag router-status">at /</span>
    </div>
    <div class="router-scene">
      <div class="router-url">
        <span>window.location</span>
        <code class="router-path">/</code>
      </div>
      <div class="router-provider">
        <div class="router-provider-head">
          <b>BrowserRouter</b>
          <small>main.jsx · reads the URL and provides the location</small>
        </div>
        <div class="router-app">
          <div class="router-app-head"><b>App</b><small>the layout stays across pages</small></div>
          <div class="router-header"><b>Header</b><small>NavLink to / and /cart — outside the Routes</small></div>
          <div class="router-routes">
            <div class="router-routes-head"><b>Routes</b><small>exactly one branch renders</small></div>
            <div class="router-branches">
              <div class="router-route" data-router-route="/">
                <div class="router-route-head"><b>Route "/"</b><small>&lt;ShopPage /&gt;</small></div>
                <div class="router-page" data-router-page="shop"><b>ShopPage</b><small>mounted</small></div>
              </div>
              <div class="router-route" data-router-route="/cart">
                <div class="router-route-head"><b>Route "/cart"</b><small>&lt;CartPage /&gt;</small></div>
                <div class="router-page" data-router-page="cart"><b>CartPage</b><small>not rendered</small></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="router-packet"></div>
    </div>
    <div class="router-log note">Press <b>go to /cart</b>: the URL changes outside React, the router provides it, and one branch is chosen.</div>
  `;

  const scene = root.querySelector('.router-scene');
  const pathEl = root.querySelector('.router-path');
  const provider = root.querySelector('.router-provider');
  const packet = root.querySelector('.router-packet');
  const log = root.querySelector('.router-log');
  const status = root.querySelector('.router-status');
  const routes = Object.fromEntries(
    [...root.querySelectorAll('[data-router-route]')].map((el) => [el.dataset.routerRoute, el]),
  );
  const pages = Object.fromEntries(
    [...root.querySelectorAll('[data-router-page]')].map((el) => [el.dataset.routerPage, el]),
  );
  let busy = false;

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  function setActive(path) {
    Object.entries(routes).forEach(([routePath, el]) => {
      el.classList.toggle('on', routePath === path);
      el.classList.toggle('off', routePath !== path);
    });
    Object.entries(pages).forEach(([page, el]) => {
      const active = (path === '/' && page === 'shop') || (path === '/cart' && page === 'cart');
      el.classList.toggle('on', active);
      el.classList.toggle('off', !active);
      el.innerHTML = `<b>${page === 'shop' ? 'ShopPage' : 'CartPage'}</b><small>${active ? 'mounted' : 'not rendered'}</small>`;
    });
    status.textContent = `at ${path}`;
  }

  function point(el) {
    const s = scene.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    return { x: r.left - s.left + r.width / 2, y: r.top - s.top + r.height / 2 };
  }

  async function move(from, to) {
    const a = point(from);
    const b = point(to);
    packet.style.transition = 'none';
    packet.style.left = `${a.x}px`;
    packet.style.top = `${a.y}px`;
    packet.style.opacity = '1';
    void packet.offsetWidth;
    packet.style.transition = 'left 750ms cubic-bezier(.4,0,.2,1), top 750ms cubic-bezier(.4,0,.2,1)';
    packet.style.left = `${b.x}px`;
    packet.style.top = `${b.y}px`;
    await sleep(820);
  }

  async function navigate(path) {
    if (busy) return;
    busy = true;
    pathEl.textContent = path;
    log.innerHTML = `<b>1 · the URL changes</b> to <code>${path}</code>. This happens outside React — a link, the back button or <code>history.push</code>.`;
    status.textContent = `window.location = ${path}`;
    await move(pathEl, provider);
    provider.classList.add('pulse');
    log.innerHTML = '<b>2 · BrowserRouter</b> provides the new location to every descendant. It does not render a page itself.';
    await sleep(700);
    provider.classList.remove('pulse');
    await move(provider, routes[path]);
    setActive(path);
    log.innerHTML = path === '/cart'
      ? '<b>3 · Routes matches "/cart"</b>. ShopPage unmounts; CartPage mounts. Header stayed because it is outside <code>&lt;Routes&gt;</code>.'
      : '<b>3 · Routes matches "/"</b>. CartPage unmounts; ShopPage mounts. The URL is the source of truth.';
    packet.style.opacity = '0';
    busy = false;
  }

  root.querySelectorAll('[data-router]').forEach((button) => {
    button.onclick = () => navigate(button.dataset.router);
  });

  root.querySelector('[data-router-refresh]').onclick = async () => {
    if (busy) return;
    const path = pathEl.textContent;
    log.innerHTML = `<b>Refresh.</b> The browser asks for <code>${path}</code> again. The server returns the app, and the router reads the same URL.`;
    await move(pathEl, routes[path]);
    setActive(path);
    packet.style.opacity = '0';
  };

  setActive('/');
}

/* ── request / response through the layers ─────────────────────────── */

const FOLDER_MAP = [
  { key: 'pages', label: 'pages/', files: 'ShopPage, CartPage' },
  { key: 'components', label: 'components/', files: 'Header, ProductCard' },
  { key: 'hooks', label: 'hooks/', files: 'useProducts' },
  { key: 'services', label: 'services/', files: 'api.js — the only URL' },
  { key: 'context', label: 'context/', files: 'CartContext' },
  { key: 'network', label: 'browser', files: 'fetch + Vite proxy' },
  { key: 'api', label: 'API', files: 'json-server' },
];

const LAYER_ACTORS = [
  { name: 'pages/', sub: 'ShopPage.jsx', folder: 'pages' },
  { name: 'hooks/', sub: 'useProducts.js', folder: 'hooks' },
  { name: 'services/', sub: 'api.js', folder: 'services' },
  { name: 'fetch', sub: 'Vite proxy', folder: 'network' },
  { name: 'API', sub: 'json-server', folder: 'api' },
  { name: 'components/', sub: 'ProductCard.jsx', folder: 'components' },
];

const CONTEXT_ACTORS = [
  { name: 'components/', sub: 'ProductCard', folder: 'components' },
  { name: 'context/', sub: 'CartContext', folder: 'context' },
  { name: 'components/', sub: 'Header', folder: 'components' },
  { name: 'pages/', sub: 'CartPage', folder: 'pages' },
];

const LAYERS = {
  success: {
    title: 'One product request: down the layers, then back up',
    steps: [
      { from: 0, to: 1, label: 'useProducts("mug")', data: 'query = "mug"' },
      { from: 1, to: 2, label: 'getProducts("mug", signal)', data: 'query + an AbortSignal' },
      { from: 2, to: 3, label: 'fetch("/api/products?q=mug")', data: 'the only URL in src' },
      { from: 3, to: 4, label: 'GET /api/products?q=mug', data: 'through the Vite proxy' },
      { from: 4, to: 3, label: '200 + JSON', kind: 'return', data: '[{ id, title, … }]' },
      { from: 3, to: 2, label: 'res.json()', kind: 'return', data: 'a JavaScript array' },
      { from: 2, to: 1, label: 'products', kind: 'return', data: 'the array' },
      { from: 1, to: 0, label: '{ products, loading, error }', kind: 'return', data: 'loading = false' },
      { from: 0, to: 5, label: 'map(product => <ProductCard/>)', data: 'one prop per card' },
    ],
  },
  context: {
    title: 'Add to cart: one value, three folders',
    actors: CONTEXT_ACTORS,
    steps: [
      { from: 0, to: 1, label: 'addToCart(product)', data: '{ id, title, price }' },
      { from: 2, to: 1, label: 'useCart()', data: 'Header asks for count' },
      { from: 3, to: 1, label: 'useCart()', data: 'CartPage asks for cart + total' },
      { from: 1, to: 2, label: 'count', kind: 'return', data: 'cart.length' },
      { from: 1, to: 3, label: 'cart, total', kind: 'return', data: 'every line + the derived total' },
      { from: 1, to: 0, label: 'cart', kind: 'return', data: 'the new line is in the value' },
    ],
  },
  abort: {
    title: 'The cleanup stops the old request at the layer boundary',
    steps: [
      { from: 0, to: 1, label: 'useProducts("m")', data: 'query = "m"' },
      { from: 1, to: 2, label: 'getProducts("m", signalA)', data: 'request A starts' },
      { from: 2, to: 3, label: 'fetch("?q=m", signalA)', data: 'A is slow' },
      { from: 3, to: 4, label: 'GET ?q=m' },
      { from: 0, to: 1, label: 'useProducts("mu")', data: 'a new render starts' },
      { from: 1, to: 3, label: 'cleanup: abort A', kind: 'warn', data: 'controller.abort()' },
      { from: 3, to: 4, label: 'A is cancelled', kind: 'dead', data: 'its response can never call setState' },
      { from: 1, to: 2, label: 'getProducts("mu", signalB)', data: 'request B starts' },
      { from: 2, to: 3, label: 'fetch("?q=mu", signalB)' },
      { from: 3, to: 4, label: 'GET ?q=mu' },
      { from: 4, to: 3, label: '200 + JSON for mu', kind: 'return' },
      { from: 3, to: 1, label: 'products for mu', kind: 'return', data: 'A and B never mix' },
      { from: 1, to: 0, label: 'setProducts(mu)', kind: 'return', data: 'loading = false' },
      { from: 0, to: 5, label: 'render mu cards' },
    ],
  },
};

function initLayers(root) {
  let scenario = root.dataset.scenario || 'success';
  let timer = null;
  let playing = false;

  root.innerHTML = `
    <div class="layer-head">
      <div class="btns">
        <button class="btn" data-layer="success">products request</button>
        <button class="btn" data-layer="abort">abort</button>
        <button class="btn" data-layer="context">add to cart</button>
      </div>
      <button class="btn pri" data-layer-play>Play</button>
    </div>
    <p class="layer-title"></p>
    <div class="layer-layout">
      <aside class="folder-map">
        ${FOLDER_MAP.map((folder) => `<div class="folder-row" data-folder="${folder.key}"><b>${folder.label}</b><small>${folder.files}</small></div>`).join('')}
      </aside>
      <div class="layer-main">
        <div class="layer-wrap"><div class="layer-seq"></div></div>
        <div class="layer-status"></div>
        <div class="layer-data"></div>
      </div>
    </div>
    <p class="layer-note">Down is the request. Up, dashed, is the response. The active folder is highlighted as the value moves.</p>
    ${root.dataset.note ? `<p class="note" style="margin-top:8px">${esc(root.dataset.note)}</p>` : ''}
  `;

  const seq = root.querySelector('.layer-seq');
  const title = root.querySelector('.layer-title');
  const status = root.querySelector('.layer-status');
  const data = root.querySelector('.layer-data');
  const play = root.querySelector('[data-layer-play]');
  let n = LAYER_ACTORS.length;

  const pct = (i) => `calc((${i} + 0.5) * 100% / ${n})`;

  function build() {
    const spec = LAYERS[scenario];
    const actors = spec.actors || LAYER_ACTORS;
    n = actors.length;
    title.textContent = spec.title;
    seq.style.setProperty('--n', n);
    seq.innerHTML = `
      <div class="layer-actors">
        ${actors.map((actor) => `<div class="layer-actor"><b>${esc(actor.name)}</b><small>${esc(actor.sub)}</small></div>`).join('')}
      </div>
      <div class="layer-body">
        ${actors.map((_, i) => `<i class="layer-life" style="left:${pct(i)}"></i>`).join('')}
        ${spec.steps.map((step, index) => {
          const inc = step.kind === 'return' ? 'return' : '';
          const warn = step.kind === 'warn' ? 'warn' : step.kind === 'dead' ? 'dead' : '';
          const rev = step.to < step.from;
          const left = pct(Math.min(step.from, step.to));
          const width = `calc(${Math.abs(step.to - step.from)} * 100% / ${n})`;
          const mid = `calc((${step.from + step.to + 1} / 2) * 100% / ${n})`;
          return `<div class="layer-row ${inc} ${warn} ${rev ? 'rev' : ''}" data-i="${index}" data-from="${step.from}" data-to="${step.to}">
            <span class="layer-num" style="left:${pct(step.from)}">${index + 1}</span>
            <span class="layer-line" style="left:${left};width:${width}"></span>
            <span class="layer-label" style="left:${mid}">
              <b>${esc(step.label)}</b>
              ${step.data ? `<small>${esc(step.data)}</small>` : ''}
            </span>
            <span class="layer-packet" style="left:${pct(step.from)}">${esc(step.data || step.label)}</span>
          </div>`;
        }).join('')}
      </div>
    `;
    status.innerHTML = 'Press <b>Play</b>: follow the request down the layers, then the response back up.';
    data.textContent = '';
    root.querySelectorAll('[data-layer]').forEach((button) => {
      button.classList.toggle('on', button.dataset.layer === scenario);
    });
  }

  function stop() {
    playing = false;
    clearTimeout(timer);
    timer = null;
    play.textContent = 'Play';
  }

  function reset() {
    stop();
    root.querySelectorAll('.layer-row').forEach((row) => row.classList.remove('on', 'dim'));
    root.querySelectorAll('.folder-row').forEach((folder) => folder.classList.remove('on'));
    status.innerHTML = 'Press <b>Play</b>: follow the request down the layers, then the response back up.';
    data.textContent = '';
  }

  async function run() {
    reset();
    const spec = LAYERS[scenario];
    const rows = [...root.querySelectorAll('.layer-row')];
    playing = true;
    play.textContent = 'Stop';

    for (let i = 0; i < rows.length; i += 1) {
      if (!playing) return;
      const row = rows[i];
      const step = spec.steps[i];

      rows.forEach((other, index) => {
        other.classList.toggle('on', index === i);
        other.classList.toggle('dim', index < i);
      });

      const actors = spec.actors || LAYER_ACTORS;
      status.innerHTML = `<span class="layer-count">${i + 1} / ${rows.length}</span>
        <b>${esc(actors[step.from].name)} → ${esc(actors[step.to].name)}</b>
        · ${esc(step.label)}`;
      data.innerHTML = `<span class="dg-cap">data at this hop</span><code>${esc(step.data || step.label)}</code>`;

      const activeFolders = new Set([actors[step.from].folder, actors[step.to].folder]);
      root.querySelectorAll('.folder-row').forEach((folder) => {
        folder.classList.toggle('on', activeFolders.has(folder.dataset.folder));
      });

      const packet = row.querySelector('.layer-packet');
      const width = row.getBoundingClientRect().width;
      const start = ((step.from + 0.5) / n) * width;
      const end = ((step.to + 0.5) / n) * width;
      packet.style.left = `${start}px`;
      packet.style.transition = 'none';
      packet.style.transform = 'translate(-50%, -50%)';
      packet.style.opacity = '1';
      void packet.offsetWidth;
      packet.style.transition = 'transform 1200ms cubic-bezier(.4, 0, .2, 1)';
      packet.style.transform = `translate(-50%, -50%) translateX(${end - start}px)`;

      await new Promise((resolve) => {
        timer = setTimeout(resolve, 1650);
      });
      if (!playing) return;
    }

    rows.forEach((row) => row.classList.remove('on'));
    status.innerHTML = '<b>Done.</b> The page never saw a URL, the hook never saw a DOM node, and the service never saw React. That is the layer boundary.';
    playing = false;
    play.textContent = 'Play';
  }

  root.querySelectorAll('[data-layer]').forEach((button) => {
    button.onclick = () => {
      if (playing) stop();
      scenario = button.dataset.layer;
      build();
    };
  });

  play.onclick = () => {
    if (playing) {
      stop();
      reset();
      return;
    }
    run();
  };

  build();
}

/* ── mount ─────────────────────────────────────────────────────────── */

export function initWidgets(scope) {
  scope.querySelectorAll('[data-widget]').forEach((root) => {
    switch (root.dataset.widget) {
      case 'snapshot':
        initSnapshot(root);
        break;
      case 'effects':
        initEffects(root);
        break;
      case 'race':
        initRace(root);
        break;
      case 'context':
        initContext(root);
        break;
      case 'contextWrap':
        initContextWrap(root);
        break;
      case 'routerWrap':
        initRouterWrap(root);
        break;
      case 'keys':
        initKeys(root);
        break;
      case 'propsFlow':
        initPropsFlow(root);
        break;
      case 'layers':
        initLayers(root);
        break;
      default:
        break;
    }
  });
}
