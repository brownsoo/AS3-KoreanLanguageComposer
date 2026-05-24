import { HangulUnicodeComposer, HangulTextEvent } from "../../ts-lib/src/index.js";

// Key definition interface
interface KeyDef {
  code: string;
  isFunc?: boolean;
  label?: string;
  widthClass?: string;
  kor: { normal: string; shift?: string };
  eng: { normal: string; shift?: string };
  sym: { normal: string; shift?: string };
}

// Unified Keyboard Layout Definition
const KEYBOARD_LAYOUT: KeyDef[][] = [
  // Row 1
  [
    { code: "Backquote", kor: { normal: "`", shift: "~" }, eng: { normal: "`", shift: "~" }, sym: { normal: "~", shift: "`" } },
    { code: "Digit1", kor: { normal: "1", shift: "!" }, eng: { normal: "1", shift: "!" }, sym: { normal: "!", shift: "1" } },
    { code: "Digit2", kor: { normal: "2", shift: "@" }, eng: { normal: "2", shift: "@" }, sym: { normal: "@", shift: "2" } },
    { code: "Digit3", kor: { normal: "3", shift: "#" }, eng: { normal: "3", shift: "#" }, sym: { normal: "#", shift: "3" } },
    { code: "Digit4", kor: { normal: "4", shift: "$" }, eng: { normal: "4", shift: "$" }, sym: { normal: "$", shift: "4" } },
    { code: "Digit5", kor: { normal: "5", shift: "%" }, eng: { normal: "5", shift: "%" }, sym: { normal: "%", shift: "5" } },
    { code: "Digit6", kor: { normal: "6", shift: "^" }, eng: { normal: "6", shift: "^" }, sym: { normal: "^", shift: "6" } },
    { code: "Digit7", kor: { normal: "7", shift: "&" }, eng: { normal: "7", shift: "&" }, sym: { normal: "&", shift: "7" } },
    { code: "Digit8", kor: { normal: "8", shift: "*" }, eng: { normal: "8", shift: "*" }, sym: { normal: "*", shift: "8" } },
    { code: "Digit9", kor: { normal: "9", shift: "(" }, eng: { normal: "9", shift: "(" }, sym: { normal: "(", shift: "9" } },
    { code: "Digit0", kor: { normal: "0", shift: ")" }, eng: { normal: "0", shift: ")" }, sym: { normal: ")", shift: "0" } },
    { code: "Minus", kor: { normal: "-", shift: "_" }, eng: { normal: "-", shift: "_" }, sym: { normal: "_", shift: "-" } },
    { code: "Equal", kor: { normal: "=", shift: "+" }, eng: { normal: "=", shift: "+" }, sym: { normal: "+", shift: "=" } },
    { code: "Backspace", isFunc: true, label: "←", widthClass: "key-backspace", kor: { normal: "" }, eng: { normal: "" }, sym: { normal: "" } }
  ],
  // Row 2
  [
    { code: "Tab", isFunc: true, label: "Tab", widthClass: "key-tab", kor: { normal: "" }, eng: { normal: "" }, sym: { normal: "" } },
    { code: "KeyQ", kor: { normal: "ㅂ", shift: "ㅃ" }, eng: { normal: "q", shift: "Q" }, sym: { normal: "[", shift: "{" } },
    { code: "KeyW", kor: { normal: "ㅈ", shift: "ㅉ" }, eng: { normal: "w", shift: "W" }, sym: { normal: "]", shift: "}" } },
    { code: "KeyE", kor: { normal: "ㄷ", shift: "ㄸ" }, eng: { normal: "e", shift: "E" }, sym: { normal: "{", shift: "[" } },
    { code: "KeyR", kor: { normal: "ㄱ", shift: "ㄲ" }, eng: { normal: "r", shift: "R" }, sym: { normal: "}", shift: "]" } },
    { code: "KeyT", kor: { normal: "ㅅ", shift: "ㅆ" }, eng: { normal: "t", shift: "T" }, sym: { normal: "_", shift: "\\" } },
    { code: "KeyY", kor: { normal: "ㅛ" }, eng: { normal: "y", shift: "Y" }, sym: { normal: "+", shift: "=" } },
    { code: "KeyU", kor: { normal: "ㅕ" }, eng: { normal: "u", shift: "U" }, sym: { normal: "*", shift: "&" } },
    { code: "KeyI", kor: { normal: "ㅑ" }, eng: { normal: "i", shift: "I" }, sym: { normal: "%", shift: "^" } },
    { code: "KeyO", kor: { normal: "ㅐ", shift: "ㅒ" }, eng: { normal: "o", shift: "O" }, sym: { normal: "!", shift: "@" } },
    { code: "KeyP", kor: { normal: "ㅔ", shift: "ㅖ" }, eng: { normal: "p", shift: "P" }, sym: { normal: "#", shift: "$" } },
    { code: "BracketLeft", kor: { normal: "[", shift: "{" }, eng: { normal: "[", shift: "{" }, sym: { normal: ";", shift: ":" } },
    { code: "BracketRight", kor: { normal: "]", shift: "}" }, eng: { normal: "]", shift: "}" }, sym: { normal: "'", shift: "\"" } },
    { code: "Backslash", kor: { normal: "\\", shift: "|" }, eng: { normal: "\\", shift: "|" }, sym: { normal: "|", shift: "\\" } }
  ],
  // Row 3
  [
    { code: "CapsLock", isFunc: true, label: "Caps Lock", widthClass: "key-capslock", kor: { normal: "" }, eng: { normal: "" }, sym: { normal: "" } },
    { code: "KeyA", kor: { normal: "ㅁ" }, eng: { normal: "a", shift: "A" }, sym: { normal: "&", shift: "*" } },
    { code: "KeyS", kor: { normal: "ㄴ" }, eng: { normal: "s", shift: "S" }, sym: { normal: "*", shift: "(" } },
    { code: "KeyD", kor: { normal: "ㅇ" }, eng: { normal: "d", shift: "D" }, sym: { normal: "(", shift: ")" } },
    { code: "KeyF", kor: { normal: "ㄹ" }, eng: { normal: "f", shift: "F" }, sym: { normal: "-", shift: "_" } },
    { code: "KeyG", kor: { normal: "ㅎ" }, eng: { normal: "g", shift: "G" }, sym: { normal: "=", shift: "+" } },
    { code: "KeyH", kor: { normal: "ㅗ" }, eng: { normal: "h", shift: "H" }, sym: { normal: "\"", shift: "'" } },
    { code: "KeyJ", kor: { normal: "ㅓ" }, eng: { normal: "j", shift: "J" }, sym: { normal: ":", shift: ";" } },
    { code: "KeyK", kor: { normal: "ㅏ" }, eng: { normal: "k", shift: "K" }, sym: { normal: "?", shift: "/" } },
    { code: "KeyL", kor: { normal: "ㅣ" }, eng: { normal: "l", shift: "L" }, sym: { normal: "/", shift: "?" } },
    { code: "Semicolon", kor: { normal: ";", shift: ":" }, eng: { normal: ";", shift: ":" }, sym: { normal: "<", shift: ">" } },
    { code: "Quote", kor: { normal: "'", shift: "\"" }, eng: { normal: "'", shift: "\"" }, sym: { normal: ">", shift: "<" } },
    { code: "Enter", isFunc: true, label: "Enter", widthClass: "key-enter", kor: { normal: "" }, eng: { normal: "" }, sym: { normal: "" } }
  ],
  // Row 4
  [
    { code: "ShiftLeft", isFunc: true, label: "Shift", widthClass: "key-shift", kor: { normal: "" }, eng: { normal: "" }, sym: { normal: "" } },
    { code: "KeyZ", kor: { normal: "ㅋ" }, eng: { normal: "z", shift: "Z" }, sym: { normal: "^", shift: "%" } },
    { code: "KeyX", kor: { normal: "ㅌ" }, eng: { normal: "x", shift: "X" }, sym: { normal: "$", shift: "#" } },
    { code: "KeyC", kor: { normal: "ㅊ" }, eng: { normal: "c", shift: "C" }, sym: { normal: "#", shift: "@" } },
    { code: "KeyV", kor: { normal: "ㅍ" }, eng: { normal: "v", shift: "V" }, sym: { normal: "@", shift: "!" } },
    { code: "KeyB", kor: { normal: "ㅠ" }, eng: { normal: "b", shift: "B" }, sym: { normal: "~", shift: "`" } },
    { code: "KeyN", kor: { normal: "ㅜ" }, eng: { normal: "n", shift: "N" }, sym: { normal: "\\", shift: "|" } },
    { code: "KeyM", kor: { normal: "ㅡ" }, eng: { normal: "m", shift: "M" }, sym: { normal: ".", shift: "," } },
    { code: "Comma", kor: { normal: ",", shift: "<" }, eng: { normal: ",", shift: "<" }, sym: { normal: ",", shift: "." } },
    { code: "Period", kor: { normal: ".", shift: ">" }, eng: { normal: ".", shift: ">" }, sym: { normal: ".", shift: "." } },
    { code: "Slash", kor: { normal: "/", shift: "?" }, eng: { normal: "/", shift: "?" }, sym: { normal: "?", shift: "/" } },
    { code: "ShiftRight", isFunc: true, label: "Shift", widthClass: "key-shift", kor: { normal: "" }, eng: { normal: "" }, sym: { normal: "" } }
  ],
  // Row 5
  [
    { code: "Space", label: "Space", widthClass: "key-space", kor: { normal: " " }, eng: { normal: " " }, sym: { normal: " " } }
  ]
];

// App State
let activeLayout: 'kor' | 'eng' | 'sym' = 'kor';
let shiftActive = false;
let capsActive = false;
const savedArchives: { key: string; value: string }[] = [];

// Initialize Composer
const composer = new HangulUnicodeComposer();

// DOM Elements
const editorView = document.getElementById("composed-editor") as HTMLDivElement;
const composedTextSpan = document.getElementById("composed-text") as HTMLSpanElement;
const composingTextSpan = document.getElementById("composing-text") as HTMLSpanElement;
const placeholderDiv = document.getElementById("editor-placeholder") as HTMLDivElement;
const instantBufferCode = document.getElementById("instant-buffer") as HTMLElement;
const charCountCode = document.getElementById("char-count") as HTMLElement;

const themeToggleBtn = document.getElementById("theme-toggle") as HTMLButtonElement;
const layoutKorTab = document.getElementById("layout-kor") as HTMLButtonElement;
const layoutEngTab = document.getElementById("layout-eng") as HTMLButtonElement;
const layoutSymTab = document.getElementById("layout-sym") as HTMLButtonElement;
const shiftIndicator = document.getElementById("shift-indicator") as HTMLSpanElement;
const capsIndicator = document.getElementById("caps-indicator") as HTMLSpanElement;
const virtualKeyboardContainer = document.getElementById("virtual-keyboard") as HTMLDivElement;

const btnCopy = document.getElementById("btn-copy") as HTMLButtonElement;
const btnClear = document.getElementById("btn-clear") as HTMLButtonElement;

const archiveKeyInput = document.getElementById("archive-key") as HTMLInputElement;
const btnArchive = document.getElementById("btn-archive") as HTMLButtonElement;
const archiveListUl = document.getElementById("archive-list") as HTMLUListElement;

// Create and Render Keyboard layout
function initKeyboard() {
  virtualKeyboardContainer.innerHTML = "";
  
  KEYBOARD_LAYOUT.forEach(row => {
    const rowDiv = document.createElement("div");
    rowDiv.className = "keyboard-row";
    
    row.forEach(keyDef => {
      const keyBtn = document.createElement("button");
      keyBtn.className = "key";
      keyBtn.setAttribute("id", `key-${keyDef.code}`);
      keyBtn.setAttribute("data-code", keyDef.code);
      
      if (keyDef.widthClass) {
        keyBtn.classList.add(keyDef.widthClass);
      }
      
      if (keyDef.isFunc) {
        keyBtn.classList.add("func-key");
      }
      
      rowDiv.appendChild(keyBtn);
    });
    
    virtualKeyboardContainer.appendChild(rowDiv);
  });
  
  updateKeyLabels();
}

// Update key labels dynamically based on layout, caps lock, and shift states
function updateKeyLabels() {
  KEYBOARD_LAYOUT.forEach(row => {
    row.forEach(keyDef => {
      const keyBtn = document.getElementById(`key-${keyDef.code}`) as HTMLButtonElement;
      if (!keyBtn) return;
      
      // If it's a function key, just display the standard label
      if (keyDef.isFunc) {
        keyBtn.textContent = keyDef.label || keyDef.code;
        
        // Active visual toggles for function keys
        if (keyDef.code.startsWith("Shift")) {
          if (shiftActive) keyBtn.classList.add("pressed");
          else keyBtn.classList.remove("pressed");
        }
        if (keyDef.code === "CapsLock") {
          if (capsActive) keyBtn.classList.add("pressed");
          else keyBtn.classList.remove("pressed");
        }
        return;
      }
      
      // Clear inside content
      keyBtn.innerHTML = "";
      
      const layoutData = keyDef[activeLayout];
      const hasShiftChar = !!layoutData.shift;
      
      // Determine what character is active
      let displayChar = layoutData.normal;
      let secondaryChar = layoutData.shift || "";
      
      // Apply CapsLock/Shift transformation for letters in English layout
      if (activeLayout === 'eng') {
        const isLetter = /^[a-zA-Z]$/.test(layoutData.normal);
        if (isLetter) {
          const uppercase = (capsActive && !shiftActive) || (!capsActive && shiftActive);
          displayChar = uppercase ? layoutData.shift || layoutData.normal.toUpperCase() : layoutData.normal;
          secondaryChar = uppercase ? layoutData.normal : layoutData.shift || layoutData.normal.toUpperCase();
        } else if (shiftActive) {
          displayChar = layoutData.shift || layoutData.normal;
        }
      } else if (shiftActive) {
        displayChar = layoutData.shift || layoutData.normal;
      }
      
      // Main character container
      const primarySpan = document.createElement("span");
      primarySpan.className = "key-char-primary";
      primarySpan.textContent = displayChar;
      keyBtn.appendChild(primarySpan);
      
      // Shifted character indicator (small label at top-right)
      if (hasShiftChar && !shiftActive) {
        const secondarySpan = document.createElement("span");
        secondarySpan.className = "key-char-secondary";
        secondarySpan.textContent = secondaryChar;
        keyBtn.appendChild(secondarySpan);
      }
    });
  });

  // Update layout tab active styles
  layoutKorTab.classList.toggle("active", activeLayout === 'kor');
  layoutEngTab.classList.toggle("active", activeLayout === 'eng');
  layoutSymTab.classList.toggle("active", activeLayout === 'sym');

  // Update top status indicator badges
  shiftIndicator.classList.toggle("active", shiftActive);
  capsIndicator.classList.toggle("active", capsActive);
}

// Process Keyboard Inputs
function handleKeyInput(code: string) {
  // Find key definition
  let foundKey: KeyDef | null = null;
  for (const row of KEYBOARD_LAYOUT) {
    const k = row.find(kd => kd.code === code);
    if (k) {
      foundKey = k;
      break;
    }
  }
  
  if (!foundKey) return;
  
  // Play minor micro-scale tap effect on DOM key
  const keyBtn = document.getElementById(`key-${code}`);
  if (keyBtn) {
    keyBtn.classList.remove("glowing");
    void keyBtn.offsetWidth; // Trigger reflow to restart animation
    keyBtn.classList.add("glowing");
  }
  
  if (foundKey.isFunc) {
    switch (code) {
      case "Backspace":
        composer.backSpace();
        break;
      case "Enter":
        composer.addSpecialChar("\n");
        break;
      case "Tab":
        composer.addSpecialChar("\t");
        break;
      case "ShiftLeft":
      case "ShiftRight":
        shiftActive = !shiftActive;
        updateKeyLabels();
        break;
      case "CapsLock":
        capsActive = !capsActive;
        updateKeyLabels();
        break;
    }
    return;
  }
  
  // Normal typing logic
  const layoutData = foundKey[activeLayout];
  
  let char = layoutData.normal;
  
  if (activeLayout === 'eng') {
    const isLetter = /^[a-zA-Z]$/.test(layoutData.normal);
    if (isLetter) {
      const uppercase = (capsActive && !shiftActive) || (!capsActive && shiftActive);
      char = uppercase ? layoutData.shift || layoutData.normal.toUpperCase() : layoutData.normal;
    } else if (shiftActive) {
      char = layoutData.shift || layoutData.normal;
    }
  } else if (shiftActive) {
    char = layoutData.shift || layoutData.normal;
  }
  
  // Add to composer
  if (activeLayout === 'kor') {
    // If it's a valid Hangul character
    if (composer.compatibleHangulJamo(char)) {
      composer.addJamo(char);
    } else {
      composer.addSpecialChar(char);
    }
  } else {
    // English or Symbol layout
    composer.addSpecialChar(char);
  }
  
  // Auto-reset Shift key after a single letter click (typical virtual keyboard behavior)
  if (shiftActive && !code.startsWith("Shift")) {
    shiftActive = false;
    updateKeyLabels();
  }
}

// Hook Composer Event
composer.addEventListener(HangulTextEvent.UPDATE, (e: Event) => {
  const ev = e as HangulTextEvent;
  const fullText = ev.string;
  
  // Render visual content
  composedTextSpan.textContent = composer.compositionString;
  composingTextSpan.textContent = composer.extra;
  
  // Set toggle styling on composing section
  if (composer.extra) {
    composingTextSpan.style.display = "inline";
  } else {
    composingTextSpan.style.display = "none";
  }
  
  // Handle editor view class (for placeholder hiding)
  if (fullText) {
    editorView.classList.add("has-content");
  } else {
    editorView.classList.remove("has-content");
  }
  
  // Update state displays
  instantBufferCode.textContent = JSON.stringify(composer.instantChars);
  charCountCode.textContent = `${fullText.length}/${composer.restrict}`;
});

// Sync physical keyboard input
document.addEventListener("keydown", (e: KeyboardEvent) => {
  // Prevent browser shortcuts or defaults interfering (e.g. backspace back, tab switching)
  // But let copy/paste/reload pass
  if (e.key === "Backspace" || e.key === "Tab") {
    e.preventDefault();
  }
  
  // Map physical shift / caps states
  if (e.key === "Shift") {
    shiftActive = true;
    updateKeyLabels();
  }
  
  // Resolve mapping
  let resolvedCode = e.code;
  
  // Find key button and add pressed class
  const keyBtn = document.getElementById(`key-${resolvedCode}`);
  if (keyBtn) {
    keyBtn.classList.add("pressed");
    handleKeyInput(resolvedCode);
    e.preventDefault();
  }
});

document.addEventListener("keyup", (e: KeyboardEvent) => {
  if (e.key === "Shift") {
    shiftActive = false;
    updateKeyLabels();
  }
  
  const keyBtn = document.getElementById(`key-${e.code}`);
  if (keyBtn) {
    keyBtn.classList.remove("pressed");
  }
});

// Mouse/Touch click events on virtual keyboard
virtualKeyboardContainer.addEventListener("click", (e) => {
  const target = (e.target as HTMLElement).closest(".key") as HTMLButtonElement | null;
  if (!target) return;
  
  const code = target.getAttribute("data-code");
  if (code) {
    handleKeyInput(code);
  }
});

// Layout Tabs Change
layoutKorTab.addEventListener("click", () => {
  activeLayout = 'kor';
  updateKeyLabels();
});
layoutEngTab.addEventListener("click", () => {
  activeLayout = 'eng';
  updateKeyLabels();
});
layoutSymTab.addEventListener("click", () => {
  activeLayout = 'sym';
  updateKeyLabels();
});

// Copy / Clear buttons
btnCopy.addEventListener("click", () => {
  const text = composer.compositionString + composer.extra;
  if (text) {
    navigator.clipboard.writeText(text)
      .then(() => {
        btnCopy.textContent = "복사 완료!";
        btnCopy.style.background = "hsl(142, 70%, 45%)";
        setTimeout(() => {
          btnCopy.textContent = "복사";
          btnCopy.style.background = "";
        }, 1500);
      })
      .catch(err => {
        console.error("복사 실패:", err);
      });
  }
});

btnClear.addEventListener("click", () => {
  composer.reset();
  // Clear layout variables too
  shiftActive = false;
  capsActive = false;
  updateKeyLabels();
});

// Editor click focuses visual editor
editorView.addEventListener("click", () => {
  editorView.focus();
});

// Theme Toggle Action
themeToggleBtn.addEventListener("click", () => {
  const isDark = document.body.classList.toggle("dark-theme");
  document.body.classList.toggle("light-theme", !isDark);
});

// Archive and Restore Session Handling
function updateArchiveList() {
  archiveListUl.innerHTML = "";
  
  if (savedArchives.length === 0) {
    const emptyLi = document.createElement("li");
    emptyLi.className = "empty-archive";
    emptyLi.textContent = "저장된 세션이 없습니다.";
    archiveListUl.appendChild(emptyLi);
    return;
  }
  
  savedArchives.forEach((item, index) => {
    const li = document.createElement("li");
    li.className = "archive-item";
    
    const metaDiv = document.createElement("div");
    metaDiv.className = "archive-meta";
    metaDiv.addEventListener("click", () => {
      // Restore this key
      const result = composer.restore(item.key);
      // Dispatch update to sync display
      composer.dispatchEvent(new HangulTextEvent(HangulTextEvent.UPDATE, result));
    });
    
    const keySpan = document.createElement("span");
    keySpan.className = "archive-item-key";
    keySpan.textContent = item.key;
    
    const valSpan = document.createElement("span");
    valSpan.className = "archive-item-val";
    valSpan.textContent = item.value;
    
    metaDiv.appendChild(keySpan);
    metaDiv.appendChild(valSpan);
    
    const actionsDiv = document.createElement("div");
    actionsDiv.className = "archive-actions";
    
    // Restore button
    const restoreBtn = document.createElement("button");
    restoreBtn.className = "archive-btn restore-btn";
    restoreBtn.title = "복원";
    restoreBtn.innerHTML = `<svg viewBox="0 0 24 24"><path d="M19 12c0 3.87-3.13 7-7 7s-7-3.13-7-7 3.13-7 7-7c1.93 0 3.68.79 4.95 2.05L14 10h7V3l-2.54 2.54C16.89 3.93 14.58 3 12 3 7.03 3 3 7.03 3 12s4.03 9 9 9 9-4.03 9-9h-2z"/></svg>`;
    restoreBtn.addEventListener("click", () => {
      const result = composer.restore(item.key);
      composer.dispatchEvent(new HangulTextEvent(HangulTextEvent.UPDATE, result));
    });
    
    // Delete button
    const deleteBtn = document.createElement("button");
    deleteBtn.className = "archive-btn delete-btn";
    deleteBtn.title = "삭제";
    deleteBtn.innerHTML = `<svg viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>`;
    deleteBtn.addEventListener("click", () => {
      // Remove from archives and UI
      savedArchives.splice(index, 1);
      updateArchiveList();
    });
    
    actionsDiv.appendChild(restoreBtn);
    actionsDiv.appendChild(deleteBtn);
    
    li.appendChild(metaDiv);
    li.appendChild(actionsDiv);
    archiveListUl.appendChild(li);
  });
}

btnArchive.addEventListener("click", () => {
  const key = archiveKeyInput.value.trim();
  if (!key) {
    alert("저장할 세션 키 이름을 입력하세요.");
    return;
  }
  
  const text = composer.compositionString + composer.extra;
  composer.archive(key);
  
  // Add to local tracker
  const existingIdx = savedArchives.findIndex(item => item.key === key);
  if (existingIdx >= 0) {
    savedArchives[existingIdx].value = text;
  } else {
    savedArchives.push({ key, value: text });
  }
  
  archiveKeyInput.value = "";
  updateArchiveList();
});

// Boot Application
initKeyboard();
editorView.focus();
