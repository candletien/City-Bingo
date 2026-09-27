(() => {
  "use strict";

  const STORAGE_KEY = "city-bingo:v1";
  const POINTS = { mission: 10, line: 50, blackout: 200 };

  const $ = (sel) => document.querySelector(sel);
  const els = {
    setup: $("#setup"), game: $("#game"), form: $("#setup-form"),
    player: $("#player"), cityList: $("#city-list"), custom: $("#custom"),
    board: $("#board"), title: $("#game-title"), sub: $("#game-sub"),
    done: $("#stat-done"), lines: $("#stat-lines"), score: $("#stat-score"),
    bar: $("#progress-bar"), toast: $("#toast"), confetti: $("#confetti"),
    cellDialog: $("#cell-dialog"), menuDialog: $("#menu-dialog"),
    albumDialog: $("#album-dialog"), album: $("#album"),
    cdEmoji: $("#cd-emoji"), cdTitle: $("#cd-title"), cdDetail: $("#cd-detail"),
    cdPhoto: $("#cd-photo"), cdFile: $("#cd-file"), cdPhotoRemove: $("#cd-photo-remove"),
    cdNote: $("#cd-note"), cdToggle: $("#cd-toggle"),
  };

  let state = load();
  let activeCell = -1;

  // ---------- Storage ----------
  function load() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)); } catch { return null; }
  }
  function save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      toast("พื้นที่เก็บข้อมูลเต็ม ลองลบรูปบางรูปออก");
    }
  }

  // ---------- Card generation ----------
  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function buildCells(cityKey, size, customLines) {
    const total = size * size;
    const hasFree = size === 5;
    const needed = hasFree ? total - 1 : total;

    const custom = customLines.map((t) => ["⭐", t, "ภารกิจที่คุณตั้งเอง"]);
    const city = shuffle(CITIES[cityKey].challenges);
    const generic = shuffle(GENERIC_CHALLENGES);
    // Custom first, then city-specific, then fill with generic ones.
    const pool = [...custom, ...city, ...generic].slice(0, needed);
    const picked = shuffle(pool).map(([emoji, title, detail]) => ({
      emoji, title, detail, done: false, note: "", photo: null,
    }));

    if (hasFree) {
      picked.splice(Math.floor(total / 2), 0, {
        emoji: "🧳", title: "FREE", detail: "ช่องฟรี! ได้มาตั้งแต่เริ่มออกเดินทาง",
        done: true, free: true, note: "", photo: null,
      });
    }
    return picked;
  }

  function newGame({ player, cityKey, size, customLines }) {
    state = {
      player, cityKey, size, customLines,
      cells: buildCells(cityKey, size, customLines),
      bingoLines: [],
      blackout: false,
      createdAt: Date.now(),
    };
    save();
  }

  // ---------- Game logic ----------
  function allLines(size) {
    const lines = [];
    for (let r = 0; r < size; r++) lines.push([...Array(size)].map((_, c) => r * size + c));
    for (let c = 0; c < size; c++) lines.push([...Array(size)].map((_, r) => r * size + c));
    lines.push([...Array(size)].map((_, i) => i * size + i));
    lines.push([...Array(size)].map((_, i) => i * size + (size - 1 - i)));
    return lines;
  }

  function completedLines() {
    return allLines(state.size)
      .map((line, idx) => ({ idx, line }))
      .filter(({ line }) => line.every((i) => state.cells[i].done));
  }

  function missionsDone() {
    return state.cells.filter((c) => c.done && !c.free).length;
  }

  function score() {
    const lines = completedLines().length;
    const blackout = state.cells.every((c) => c.done);
    return missionsDone() * POINTS.mission + lines * POINTS.line + (blackout ? POINTS.blackout : 0);
  }

  function checkNewBingos() {
    const current = completedLines().map((l) => l.idx);
    const fresh = current.filter((i) => !state.bingoLines.includes(i));
    state.bingoLines = current;
    const blackout = state.cells.every((c) => c.done);

    if (blackout && !state.blackout) {
      state.blackout = true;
      celebrate(260);
      toast("🏆 BLACKOUT! ทำครบทุกภารกิจแล้ว สุดยอดนักเดินทาง!");
    } else if (fresh.length) {
      celebrate(120);
      toast(fresh.length > 1 ? `🎉 ดับเบิลบิงโก! (+${fresh.length} แถว)` : "🎉 BINGO!");
    }
    if (!blackout) state.blackout = false;
  }

  // ---------- Rendering ----------
  function renderCityList() {
    els.cityList.innerHTML = "";
    Object.entries(CITIES).forEach(([key, city], i) => {
      const label = document.createElement("label");
      label.className = "city";
      label.innerHTML = `<input type="radio" name="city" value="${key}" ${i === 0 ? "checked" : ""}>
        <span><em>${city.flag}</em>${city.name}</span>`;
      els.cityList.appendChild(label);
    });
  }

  function renderBoard() {
    const { size, cells } = state;
    const winning = new Set(completedLines().flatMap((l) => l.line));
    els.board.style.setProperty("--size", size);
    els.board.dataset.size = size;
    els.board.innerHTML = "";

    cells.forEach((cell, i) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "cell";
      if (cell.done) btn.classList.add("done");
      if (cell.free) btn.classList.add("free");
      if (winning.has(i)) btn.classList.add("win");
      if (cell.photo) {
        btn.classList.add("has-photo");
        btn.style.backgroundImage = `url(${cell.photo})`;
      }
      btn.setAttribute("aria-pressed", String(cell.done));
      btn.setAttribute("aria-label", `${cell.title}${cell.done ? " (ทำแล้ว)" : ""}`);
      btn.innerHTML = `<span class="emoji">${cell.emoji}</span><span class="label"></span>`;
      btn.querySelector(".label").textContent = cell.title;
      btn.addEventListener("click", () => openCell(i));
      els.board.appendChild(btn);
    });

    const city = CITIES[state.cityKey];
    els.title.textContent = `${city.flag} ${city.name}`;
    els.sub.textContent = `${state.player} · ${size}×${size}`;

    const done = missionsDone();
    const total = cells.filter((c) => !c.free).length;
    els.done.textContent = `${done}/${total}`;
    els.lines.textContent = completedLines().length;
    els.score.textContent = score();
    els.bar.style.width = `${(done / total) * 100}%`;
  }

  function show(screen) {
    els.setup.hidden = screen !== "setup";
    els.game.hidden = screen !== "game";
    if (screen === "game") renderBoard();
    window.scrollTo(0, 0);
  }

  // ---------- Cell dialog ----------
  function openCell(i) {
    const cell = state.cells[i];
    if (cell.free) { toast("ช่องฟรี 🧳 ได้แล้วตั้งแต่เริ่ม!"); return; }
    activeCell = i;
    els.cdEmoji.textContent = cell.emoji;
    els.cdTitle.textContent = cell.title;
    els.cdDetail.textContent = cell.detail;
    els.cdNote.value = cell.note || "";
    els.cdToggle.textContent = cell.done ? "ยกเลิกการติ๊ก" : "✅ ทำแล้ว!";
    els.cdToggle.classList.toggle("primary", !cell.done);
    setDialogPhoto(cell.photo);
    els.cellDialog.showModal();
  }

  function setDialogPhoto(src) {
    els.cdPhoto.hidden = !src;
    els.cdPhotoRemove.hidden = !src;
    if (src) els.cdPhoto.src = src; else els.cdPhoto.removeAttribute("src");
  }

  els.cellDialog.addEventListener("close", () => {
    if (activeCell < 0) return;
    const cell = state.cells[activeCell];
    cell.note = els.cdNote.value.trim();
    if (els.cellDialog.returnValue === "toggle") {
      cell.done = !cell.done;
      cell.doneAt = cell.done ? Date.now() : null;
      checkNewBingos();
    }
    activeCell = -1;
    save();
    renderBoard();
  });

  els.cdFile.addEventListener("change", async () => {
    const file = els.cdFile.files[0];
    els.cdFile.value = "";
    if (!file || activeCell < 0) return;
    try {
      const dataUrl = await resizeImage(file, 480, 0.72);
      state.cells[activeCell].photo = dataUrl;
      setDialogPhoto(dataUrl);
      save();
    } catch {
      toast("อ่านรูปไม่สำเร็จ ลองรูปอื่น");
    }
  });

  els.cdPhotoRemove.addEventListener("click", () => {
    if (activeCell < 0) return;
    state.cells[activeCell].photo = null;
    setDialogPhoto(null);
    save();
  });

  // Downscale photos so several fit in localStorage.
  function resizeImage(file, maxSide, quality) {
    return new Promise((resolve, reject) => {
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, maxSide / Math.max(img.width, img.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
        URL.revokeObjectURL(url);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("bad image")); };
      img.src = url;
    });
  }

  // ---------- Menu / album / share ----------
  els.menuDialog.addEventListener("close", () => {
    switch (els.menuDialog.returnValue) {
      case "shuffle":
        if (confirm("สุ่มการ์ดใหม่? ความคืบหน้าและรูปในการ์ดนี้จะหายไป")) {
          newGame(state);
          renderBoard();
          toast("🔀 ได้การ์ดใหม่แล้ว");
        }
        break;
      case "reset":
        if (confirm("ล้างเครื่องหมายทั้งหมด? (รูปและบันทึกจะหายด้วย)")) {
          state.cells.forEach((c) => { if (!c.free) Object.assign(c, { done: false, note: "", photo: null }); });
          state.bingoLines = [];
          state.blackout = false;
          save();
          renderBoard();
        }
        break;
      case "new":
        prefillSetup();
        show("setup");
        break;
    }
  });

  function renderAlbum() {
    const items = state.cells.filter((c) => c.done && !c.free)
      .sort((a, b) => (a.doneAt || 0) - (b.doneAt || 0));
    els.album.innerHTML = items.length ? "" : `<p class="empty">ยังไม่มีภารกิจที่ทำ ออกไปเที่ยวกันเลย! 🚀</p>`;
    items.forEach((c) => {
      const fig = document.createElement("figure");
      fig.innerHTML = c.photo
        ? `<img alt="">`
        : `<div class="ph">${c.emoji}</div>`;
      if (c.photo) fig.querySelector("img").src = c.photo;
      const cap = document.createElement("figcaption");
      cap.innerHTML = "<b></b><span></span>";
      cap.querySelector("b").textContent = `${c.emoji} ${c.title}`;
      cap.querySelector("span").textContent = c.note || "";
      fig.appendChild(cap);
      els.album.appendChild(fig);
    });
  }

  function shareText() {
    const city = CITIES[state.cityKey];
    const { size, cells } = state;
    let grid = "";
    for (let r = 0; r < size; r++) {
      grid += cells.slice(r * size, r * size + size)
        .map((c) => (c.free ? "🧳" : c.done ? "🟧" : "⬜")).join("") + "\n";
    }
    return `City Bingo ${city.flag} ${city.name}\n` +
      `${state.player}: ${missionsDone()} ภารกิจ · ${completedLines().length} บิงโก · ${score()} คะแนน\n\n` +
      grid;
  }

  async function share() {
    const text = shareText();
    try {
      if (navigator.share) { await navigator.share({ text }); return; }
      await navigator.clipboard.writeText(text);
      toast("📋 คัดลอกผลแล้ว ไปวางแชร์ได้เลย");
    } catch (err) {
      if (err && err.name === "AbortError") return;
      prompt("คัดลอกข้อความนี้เพื่อแชร์", text);
    }
  }

  // ---------- Feedback ----------
  let toastTimer;
  function toast(msg) {
    els.toast.textContent = msg;
    els.toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => els.toast.classList.remove("show"), 2600);
  }

  function celebrate(count) {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const cv = els.confetti;
    const ctx = cv.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    cv.width = innerWidth * dpr; cv.height = innerHeight * dpr;
    ctx.scale(dpr, dpr);
    const colors = ["#ff6b4a", "#ffc93c", "#2ec4b6", "#6c63ff", "#ff8fab"];
    const parts = [...Array(count)].map(() => ({
      x: innerWidth / 2, y: innerHeight / 3,
      vx: (Math.random() - 0.5) * 14, vy: Math.random() * -12 - 4,
      r: Math.random() * 6 + 4, c: colors[Math.floor(Math.random() * colors.length)],
      rot: Math.random() * Math.PI, vr: (Math.random() - 0.5) * 0.3,
    }));
    const start = performance.now();
    (function frame(t) {
      ctx.clearRect(0, 0, innerWidth, innerHeight);
      parts.forEach((p) => {
        p.vy += 0.35; p.x += p.vx; p.y += p.vy; p.rot += p.vr;
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot);
        ctx.fillStyle = p.c; ctx.fillRect(-p.r / 2, -p.r / 2, p.r, p.r * 0.6);
        ctx.restore();
      });
      if (t - start < 2200) requestAnimationFrame(frame);
      else ctx.clearRect(0, 0, innerWidth, innerHeight);
    })(start);
  }

  // ---------- Setup ----------
  function prefillSetup() {
    if (!state) return;
    els.player.value = state.player || "";
    const city = els.form.querySelector(`input[name=city][value="${state.cityKey}"]`);
    if (city) city.checked = true;
    const size = els.form.querySelector(`input[name=size][value="${state.size}"]`);
    if (size) size.checked = true;
    els.custom.value = (state.customLines || []).join("\n");
  }

  els.form.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = new FormData(els.form);
    newGame({
      player: els.player.value.trim() || "นักเดินทาง",
      cityKey: data.get("city"),
      size: Number(data.get("size")),
      customLines: els.custom.value.split("\n").map((s) => s.trim()).filter(Boolean).slice(0, 24),
    });
    show("game");
  });

  $("#btn-home").addEventListener("click", () => { prefillSetup(); show("setup"); });
  $("#btn-menu").addEventListener("click", () => els.menuDialog.showModal());
  $("#btn-share").addEventListener("click", share);
  $("#btn-album").addEventListener("click", () => { renderAlbum(); els.albumDialog.showModal(); });

  // Close dialogs when tapping the backdrop.
  document.querySelectorAll("dialog").forEach((d) => {
    d.addEventListener("click", (e) => { if (e.target === d) d.close("cancel"); });
  });

  renderCityList();
  if (state && state.cells) show("game"); else show("setup");
})();
