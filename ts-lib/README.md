# hangul-unicode-composer

> Modern TypeScript port of HUC (Hangul Unicode Composer). A lightweight, zero-dependency library to compose Korean Jamo characters into Unicode Hangul syllables in the browser and Node.js.

## Installation

```bash
npm install hangul-unicode-composer
```

## Features
* **Zero Dependencies**: Pure TypeScript/ESM module.
* **Standard Unicode Compliant**: Implements standard Hangul Syllable Composition rules (`0xAC00`).
* **Carry-over Composition**: Intuitively handles splitting complex consonants when new vowels are typed (e.g. `인` + `아` -> `이` + `나`).
* **Session Archives**: Save and restore typing buffers easily for multiple inputs.
* **Event & Callback hooks**: Simple native `EventTarget` listeners or direct callback functions (`onUpdate`, `onLimited`, `onError`).

## Usage

### 1. Basic Composition

```typescript
import { HangulUnicodeComposer, HangulTextEvent } from 'hangul-unicode-composer';

const composer = new HangulUnicodeComposer();

// Listen to update events
composer.addEventListener(HangulTextEvent.UPDATE, (e) => {
  const ev = e as HangulTextEvent;
  console.log('Composed text:', ev.string); 
});

// Or use a simple callback property
composer.onUpdate = (text) => {
  console.log('Current buffer:', text);
};

// Type some Korean characters
composer.addJamo('ㅎ'); // 'ㅎ'
composer.addJamo('ㅏ'); // '하'
composer.addJamo('ㄴ'); // '한'
composer.addJamo('ㄱ'); // '한', 'ㄱ' carries over to the next syllable
composer.addJamo('ㅜ'); // '한구'
composer.addJamo('ㄱ'); // '한국'

console.log(composer.compositionString); // "한"
console.log(composer.extra);             // "국"
console.log(composer.compositionString + composer.extra); // "한국"
```

### 2. Backspacing and Resetting

```typescript
composer.backSpace(); // '한구'
composer.backSpace(); // '한'
composer.space();     // '한 '
composer.reset();     // clears everything
```

### 3. State Archiving and Restoring
Ideal for applications swapping input focus across multiple inputs using the same virtual keyboard instance.

```typescript
// Type first field
composer.addJamo('ㄱ');
composer.addJamo('ㅏ'); // '가'
composer.archive('field1'); // Save state

// Switch to second field
composer.reset();
composer.addJamo('ㄴ');
composer.addJamo('ㅏ'); // '나'
composer.archive('field2'); // Save state

// Restore first field
composer.restore('field1'); 
console.log(composer.compositionString + composer.extra); // '가'
```

## API Reference

### Properties
* `compositionString: string` - Fully completed Hangul syllables.
* `extra: string` - Currently active/composing syllable.
* `restrict: number` - Max text length constraint (default: `3000`).
* `instantChars: string[]` - Access the raw Jamo characters array in the active buffer.

### Callbacks
* `onUpdate?: (text: string) => void` - Triggers whenever text changes.
* `onLimited?: (text: string) => void` - Triggers when text exceeds `restrict` length.
* `onError?: (text: string) => void` - Triggers on compilation error.

### Static Methods
* `HangulUnicodeComposer.isHangulJaeum(char: string): boolean`
* `HangulUnicodeComposer.isHangulMoeum(char: string): boolean`
* `HangulUnicodeComposer.isHangulJamo(char: string): boolean`
* `HangulUnicodeComposer.getString3Syllables(init: string, mid: string, fin: string): string`

## License

Apache License V2
