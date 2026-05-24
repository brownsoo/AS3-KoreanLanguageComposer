import { HangulTextEvent } from "./HangulTextEvent.js";

class ArchivePack {
  public key: string = "";
  public compositionString: string = "";
  public extra: string = "";
  private _instant: string[] = [];

  public get instant(): string[] {
    return this._instant;
  }

  public set instant(value: string[]) {
    this._instant = [...value];
  }
}

/**
 * HangulUnicodeComposer
 * Ports the AS3 한글 조합 라이브러리 to TypeScript.
 * Composes Korean Jamo characters into Unicode Hangul syllables.
 */
export class HangulUnicodeComposer extends EventTarget {
  /**
   * Initial consonant (초성) Unicode values
   */
  private static readonly INITIAL: number[] = [
    0x3131, 0x3132, 0x3134, 0x3137, 0x3138, 0x3139, 0x3141, 0x3142, 0x3143, 0x3145,
    0x3146, 0x3147, 0x3148, 0x3149, 0x314a, 0x314b, 0x314c, 0x314d, 0x314e
  ];

  /**
   * Medial vowel (중성) Unicode values
   */
  private static readonly MEDIAL: number[] = [
    0x314f, 0x3150, 0x3151, 0x3152, 0x3153, 0x3154, 0x3155, 0x3156, 0x3157, 0x3158,
    0x3159, 0x315a, 0x315b, 0x315c, 0x315d, 0x315e, 0x315f, 0x3160, 0x3161, 0x3162,
    0x3163
  ];

  /**
   * Final consonant (종성) Unicode values. Index 0 is empty (no final consonant).
   */
  private static readonly FINAL: (string | number)[] = [
    "", 0x3131, 0x3132, 0x3133, 0x3134, 0x3135, 0x3136, 0x3137, 0x3139, 0x313a,
    0x313b, 0x313c, 0x313d, 0x313e, 0x313f, 0x3140, 0x3141, 0x3142, 0x3144, 0x3145,
    0x3146, 0x3147, 0x3148, 0x314a, 0x314b, 0x314c, 0x314d, 0x314e
  ];

  private static used = false;

  /**
   * Helper to make one letter by composing 3 syllables.
   */
  public static getString3Syllables(init: string, mid: string, fin: string): string {
    const uni = new HangulUnicodeComposer();
    return uni.combine3Syllables(init, mid, fin);
  }

  /**
   * Returns true if the character is a Hangeul Jaeum (consonant) in the range 3131 ~ 314E.
   */
  public static isHangulJaeum(char: string): boolean {
    const uni = new HangulUnicodeComposer();
    return uni.compatibleJaeum(char);
  }

  /**
   * Returns true if the character is a Hangeul Jamo in the range 3130 ~ 318F.
   */
  public static isHangulJamo(char: string): boolean {
    const uni = new HangulUnicodeComposer();
    return uni.compatibleHangulJamo(char);
  }

  /**
   * Returns true if the character is a Hangeul Moeum (vowel) in the range 314F ~ 3163.
   */
  public static isHangulMoeum(char: string): boolean {
    const uni = new HangulUnicodeComposer();
    return uni.compatibleMoeum(char);
  }

  public compositionString: string = "";
  public extra: string = "";
  public restrict: number = 3000;
  
  private instant: string[] = [];
  private archives: ArchivePack[] = [];

  // Callbacks for easy JS integration
  public onUpdate?: (text: string) => void;
  public onLimited?: (text: string) => void;
  public onError?: (text: string) => void;

  constructor() {
    super();
    if (HangulUnicodeComposer.used) return;
    HangulUnicodeComposer.used = true;
    const re =
      "* hangul unicode composer for TS lib : ver- " + this.ver() + "\n" +
      "* homepage-blog.hansune.com : maker-han hyon soo\n";
    console.log(re);
  }

  public ver(): string {
    return "1.6";
  }

  public get instantChars(): string[] {
    return this.instant;
  }

  public set instantChars(value: string[]) {
    this.instant = [...value];
  }

  /**
   * Input Jaeum or Moeum to compose.
   */
  public addJamo(char: string): void {
    if (!this.compatibleHangulJamo(char)) return;
    this.instant.push(char);
    this.instantUpdate();
  }

  /**
   * Save current composed strings by key.
   */
  public archive(key: string, txt: string | null = null): number {
    let match = false;
    for (const ap of this.archives) {
      if (ap.key === key) {
        if (txt !== null) {
          ap.compositionString = txt;
          ap.instant = [];
          ap.extra = "";
        } else {
          ap.compositionString = this.compositionString;
          ap.instant = this.instant;
          ap.extra = this.extra;
        }
        match = true;
      }
    }

    if (!match) {
      const newA = new ArchivePack();
      if (txt !== null) {
        newA.compositionString = txt;
        newA.instant = [];
        newA.extra = "";
      } else {
        newA.compositionString = this.compositionString;
        newA.instant = [...this.instant];
        newA.extra = this.extra;
      }
      newA.key = key;
      this.archives.push(newA);
    }

    return this.archives.length;
  }

  /**
   * Restore composed state from the saved key.
   */
  public restore(key: string): string {
    let match = false;
    for (const ap of this.archives) {
      if (ap.key === key) {
        this.compositionString = ap.compositionString;
        this.instant = [...ap.instant];
        this.extra = ap.extra;
        match = true;
        break;
      }
    }

    if (!match) {
      return "";
    } else {
      return this.compositionString + this.extra;
    }
  }

  /**
   * Logic engine to process the composition of characters in instant array.
   */
  private instantUpdate(): void {
    switch (this.instant.length) {
      case 0:
        this.extra = "";
        break;
      case 1:
        if (this.compatibleMoeum(this.instant[0])) {
          this.compositionString += this.instant[0];
          this.instant = [];
          this.extra = "";
        } else {
          this.extra = this.instant[0];
        }
        break;

      case 2:
        if (this.compatibleMoeum(this.instant[1])) {
          if (this.isMedialJamo(this.instant[1])) {
            this.extra = this.combine(this.instant[0], this.instant[1]);
          } else {
            this.compositionString += this.instant[0];
            this.extra = this.instant[1];
            this.instant.shift();
          }
        } else {
          this.compositionString += this.instant[0];
          this.extra = this.instant[1];
          this.instant.shift();
        }
        break;

      case 3:
        if (this.compatibleMoeum(this.instant[2])) {
          if (this.combine(this.instant[1], this.instant[2]) !== "") {
            this.instant[1] = this.combine(this.instant[1], this.instant[2]);
            this.instant.pop();
            this.extra = this.combine3Syllables(this.instant[0], this.instant[1], "");
          } else {
            this.compositionString += this.combine(this.instant[0], this.instant[1]);
            this.compositionString += this.instant[2];
            this.extra = "";
            this.instant = [];
          }
        } else {
          if (this.isFinalJamo(this.instant[2])) {
            if (this.isCombinableFinalJamo(this.instant[2]) || this.isInitialJamo(this.instant[2])) {
              this.extra = this.combine3Syllables(this.instant[0], this.instant[1], this.instant[2]);
            } else {
              this.compositionString += this.combine3Syllables(this.instant[0], this.instant[1], this.instant[2]);
              this.extra = "";
              this.instant = [];
            }
          } else {
            this.compositionString += this.combine(this.instant[0], this.instant[1]);
            this.extra = this.instant[2];
            this.instant.shift();
            this.instant.shift();
          }
        }
        break;

      case 4:
        if (this.compatibleMoeum(this.instant[3])) {
          if (this.compatibleMoeum(this.instant[2])) {
            this.compositionString += this.combine(this.instant[0], this.combine(this.instant[1], this.instant[2]));
            this.extra = this.instant[3];
            this.instant.shift();
            this.instant.shift();
            this.instant.shift();
          } else {
            if (this.isMedialJamo(this.instant[3])) {
              this.compositionString += this.combine(this.instant[0], this.instant[1]);
              this.extra = this.combine(this.instant[2], this.instant[3]);
              this.instant.shift();
              this.instant.shift();
            } else {
              this.compositionString += this.combine3Syllables(this.instant[0], this.instant[1], this.instant[2]);
              this.extra = this.instant[3];
              this.instant.shift();
              this.instant.shift();
              this.instant.shift();
            }
          }
        } else {
          if (this.compatibleMoeum(this.instant[2])) {
            if (this.isCombinableFinalJamo(this.instant[3]) || this.isInitialJamo(this.instant[3])) {
              this.extra = this.combine3Syllables(this.instant[0], this.combine(this.instant[1], this.instant[2]), this.instant[3]);
            } else {
              this.compositionString += this.combine3Syllables(this.instant[0], this.combine(this.instant[1], this.instant[2]), this.instant[3]);
              this.extra = "";
              this.instant = [];
            }
          } else {
            if (this.combine(this.instant[2], this.instant[3]) !== "") {
              if (this.isInitialJamo(this.instant[3])) {
                this.extra = this.combine3Syllables(this.instant[0], this.instant[1], this.combine(this.instant[2], this.instant[3]));
              } else {
                this.compositionString += this.combine3Syllables(this.instant[0], this.instant[1], this.combine(this.instant[2], this.instant[3]));
                this.extra = "";
                this.instant = [];
              }
            } else {
              this.compositionString += this.combine3Syllables(this.instant[0], this.instant[1], this.instant[2]);
              this.extra = this.instant[3];
              this.instant.shift();
              this.instant.shift();
              this.instant.shift();
            }
          }
        }
        break;

      case 5:
        if (this.compatibleMoeum(this.instant[4])) {
          if (this.combine(this.instant[1], this.instant[2]) !== "") {
            this.compositionString += this.combine3Syllables(this.instant[0], this.combine(this.instant[1], this.instant[2]), "");
          } else {
            this.compositionString += this.combine3Syllables(this.instant[0], this.instant[1], this.instant[2]);
          }

          this.extra = this.combine(this.instant[3], this.instant[4]);
          this.instant.shift();
          this.instant.shift();
          this.instant.shift();
        } else {
          if (this.compatibleJaeum(this.instant[4])) {
            if (this.isInitialJamo(this.instant[4])) {
              this.compositionString += this.extra;
              this.extra = this.instant[4];
              this.instant.shift();
              this.instant.shift();
              this.instant.shift();
              this.instant.shift();
            } else {
              this.compositionString += this.extra;
              this.compositionString += this.instant[3];
              this.extra = "";
              this.instant.shift();
              this.instant.shift();
              this.instant.shift();
              this.instant.shift();
              this.instant.shift();
            }
          } else {
            this.compositionString += this.combine3Syllables(this.instant[0], this.instant[1], this.combine(this.instant[2], this.instant[3]));
            this.compositionString += this.instant[4];
            this.extra = "";
            this.instant = [];
          }
        }
        break;

      case 6:
        if (this.combine(this.instant[4], this.instant[5]) !== "") {
          this.compositionString += this.combine3Syllables(this.instant[0], this.combine(this.instant[1], this.instant[2]), this.instant[3]);
          this.extra = this.combine(this.instant[4], this.instant[5]);
          this.instant.shift();
          this.instant.shift();
          this.instant.shift();
          this.instant.shift();
        } else {
          this.compositionString += this.combine3Syllables(this.instant[0], this.combine(this.instant[1], this.instant[2]), this.combine(this.instant[3], this.instant[4]));
          this.extra = this.instant[5];
          this.instant.shift();
          this.instant.shift();
          this.instant.shift();
          this.instant.shift();
          this.instant.shift();
        }
        break;
    }

    if (this.compositionString.length + this.extra.length > this.restrict) {
      this.backSpace();
      this.dispatchComposerEvent(HangulTextEvent.LIMITED, this.compositionString + this.extra);
    }
    // console.log("<instant : " + this.instant.join(",") + ">");
    this.dispatchComposerEvent(HangulTextEvent.UPDATE, this.compositionString + this.extra);
  }

  /**
   * Helper to dispatch events and invoke corresponding callbacks.
   */
  private dispatchComposerEvent(type: string, text: string) {
    const event = new HangulTextEvent(type, text);
    this.dispatchEvent(event);
    if (type === HangulTextEvent.UPDATE && this.onUpdate) {
      this.onUpdate(text);
    } else if (type === HangulTextEvent.LIMITED && this.onLimited) {
      this.onLimited(text);
    } else if (type === HangulTextEvent.ERROR && this.onError) {
      this.onError(text);
    }
  }

  /**
   * Insert character that is not available to compose (e.g. English, numbers, symbols).
   */
  public addSpecialChar(char: string, at = -1): void {
    if (this.compositionString.length + this.extra.length + 1 > this.restrict) {
      this.dispatchComposerEvent(HangulTextEvent.LIMITED, this.compositionString + this.extra);
      return;
    }
    this.compositionString += this.extra;

    if (at === -1) at = this.compositionString.length;

    const strA = this.compositionString.slice(0, at);
    const strB = this.compositionString.slice(at);

    this.compositionString = strA + char + strB;
    this.extra = "";
    this.instant = [];

    this.dispatchComposerEvent(HangulTextEvent.UPDATE, this.compositionString);
  }

  /**
   * Add Jamo by Unicode character code.
   */
  public addJamoUnicode(code: number): void {
    this.addJamo(String.fromCharCode(code));
  }

  /**
   * Delete character by backspace.
   */
  public backSpace(at = -1): void {
    if (this.instant.length > 0) {
      this.instant.pop();
    } else {
      this.compositionString += this.extra;
      if (at === -1) at = this.compositionString.length;
      this.compositionString =
        this.compositionString.slice(0, at - 1) + this.compositionString.slice(at);
      this.extra = "";
      this.instant = [];
    }

    this.instantUpdate();
  }

  /**
   * Composes two Jamos and returns array with composed character or split ones.
   */
  public compare2Jamo(charA: string, charB: string): string[] {
    const re: string[] = [];
    if (this.combine(charA, charB) !== "") {
      re.push(this.combine(charA, charB));
    } else {
      re.push(charA);
      re.push(charB);
    }
    return re;
  }

  /**
   * Composes three Jamos.
   */
  public compare3Syllables(init: string, mid: string, fin: string): string[] {
    let re: string[] = [];
    if (this.isInitialJamo(init) && this.isMedialJamo(mid) && this.isFinalJamo(fin)) {
      re.push(this.combine3Syllables(init, mid, fin));
    } else if (this.isInitialJamo(init) && this.isMedialJamo(mid) && !this.isFinalJamo(fin)) {
      re.push(this.combine3Syllables(init, mid, ""));
      re.push(fin);
    } else {
      re = [init, mid, fin];
    }
    return re;
  }

  /**
   * Checks if string is a valid Hangul syllable or Jamo.
   */
  public compatibleHangulJamo(char: string): boolean {
    if (char.length !== 1) {
      throw new Error("1개의 글자가 필요합니다. only one character is available.");
    }
    const code = char.charCodeAt(0);
    return code >= 0x3131 && code <= 0x3163;
  }

  /**
   * Checks if character is a Jaeum.
   */
  public compatibleJaeum(char: string): boolean {
    const code = char.charCodeAt(0);
    return code > 0x3130 && code < 0x314f;
  }

  /**
   * Checks if character is a Moeum.
   */
  public compatibleMoeum(char: string): boolean {
    const code = char.charCodeAt(0);
    return code > 0x314e && code < 0x3164;
  }

  /**
   * Deletes characters at target index.
   */
  public del(at = -1): void {
    this.compositionString += this.extra;
    const str = this.compositionString;

    if (at === -1) at = this.compositionString.length;

    this.compositionString = str.slice(0, at) + str.slice(at + 2);
    this.extra = "";
    this.instant = [];
    this.dispatchComposerEvent(HangulTextEvent.UPDATE, this.compositionString);
  }

  /**
   * Resets composer state.
   */
  public reset(): void {
    this.compositionString = "";
    this.extra = "";
    this.instant = [];
    this.archives = [];
  }

  /**
   * Checks if character is in FINAL.
   */
  public isFinalJamo(char: string): boolean {
    const code = char.charCodeAt(0);
    return HangulUnicodeComposer.FINAL.indexOf(code) >= 0;
  }

  /**
   * Checks if character is in INITIAL.
   */
  public isInitialJamo(char: string): boolean {
    const code = char.charCodeAt(0);
    return HangulUnicodeComposer.INITIAL.indexOf(code) >= 0;
  }

  /**
   * Checks if character is in MEDIAL.
   */
  public isMedialJamo(char: string): boolean {
    const code = char.charCodeAt(0);
    return HangulUnicodeComposer.MEDIAL.indexOf(code) >= 0;
  }

  /**
   * Adds space.
   */
  public space(at = -1): void {
    if (this.compositionString.length + this.extra.length + 1 > this.restrict) {
      this.dispatchComposerEvent(HangulTextEvent.LIMITED, this.compositionString + this.extra);
      return;
    }
    this.compositionString += this.extra;

    if (at === -1) at = this.compositionString.length;

    const strA = this.compositionString.slice(0, at);
    const strB = this.compositionString.slice(at);

    this.compositionString = strA + " " + strB;
    this.extra = "";
    this.instant = [];

    this.dispatchComposerEvent(HangulTextEvent.UPDATE, this.compositionString);
  }

  /**
   * Combines initial, medial, and final into a single Hangul syllable.
   */
  public combine3Syllables(init: string, mid: string, fin: string): string {
    const initCode = HangulUnicodeComposer.INITIAL.indexOf(init.charCodeAt(0));
    const midCode = HangulUnicodeComposer.MEDIAL.indexOf(mid.charCodeAt(0));
    const finCode = fin === "" ? 0 : HangulUnicodeComposer.FINAL.indexOf(fin.charCodeAt(0));

    return String.fromCharCode((initCode * 588 + midCode * 28 + finCode) + 44032);
  }

  /**
   * Combine two characters (Jaeum + Jaeum, Moeum + Moeum, or Initial + Medial)
   */
  private combine(charA: string, charB: string): string {
    let re = "";
    let compCode = 0;
    const charCodeA = charA.charCodeAt(0);
    const charCodeB = charB.charCodeAt(0);

    if (this.compatibleJaeum(charA) && this.compatibleJaeum(charB)) {
      switch (charCodeA) {
        case 0x3131: // ㄱ
          if (charCodeB === 0x3145) compCode = 0x3133; // ㄳ
          break;
        case 0x3134: // ㄴ
          if (charCodeB === 0x3148) compCode = 0x3135; // ㄵ
          if (charCodeB === 0x314e) compCode = 0x3136; // ㄶ
          break;
        case 0x3139: // ㄹ
          if (charCodeB === 0x3131) compCode = 0x313a; // ㄺ
          if (charCodeB === 0x3141) compCode = 0x313b; // ㄻ
          if (charCodeB === 0x3142) compCode = 0x313c; // ㄼ
          if (charCodeB === 0x3145) compCode = 0x313d; // ㄽ
          if (charCodeB === 0x314c) compCode = 0x313e; // ㄾ
          if (charCodeB === 0x314d) compCode = 0x313f; // ㄿ
          if (charCodeB === 0x314e) compCode = 0x3140; // ㅀ
          break;
        case 0x3142: // ㅂ
          if (charCodeB === 0x3145) compCode = 0x3144; // ㅄ
          break;
      }
    } else if (this.compatibleMoeum(charA) && this.compatibleMoeum(charB)) {
      switch (charCodeA) {
        case 0x3157: // ㅗ
          if (charCodeB === 0x314f) compCode = 0x3158; // ㅘ
          if (charCodeB === 0x3150) compCode = 0x3159; // ㅙ
          if (charCodeB === 0x3163) compCode = 0x315a; // ㅚ
          break;
        case 0x315c: // ㅜ
          if (charCodeB === 0x3153) compCode = 0x315d; // ㅝ
          if (charCodeB === 0x3154) compCode = 0x315e; // ㅞ
          if (charCodeB === 0x3163) compCode = 0x315f; // ㅟ
          break;
        case 0x3161: // ㅡ
          if (charCodeB === 0x3163) compCode = 0x3162; // ㅢ
          break;
      }
    } else if (this.isInitialJamo(charA) && this.isMedialJamo(charB)) {
      re = this.combine3Syllables(charA, charB, "");
    }

    if (compCode !== 0) {
      return String.fromCharCode(compCode);
    }

    return re;
  }

  private isCombinableFinalJamo(char: string): boolean {
    let re = false;
    switch (char.charCodeAt(0)) {
      case 0x3131: // ㄱ
      case 0x3134: // ㄴ
      case 0x3139: // ㄹ
      case 0x3142: // ㅂ
        re = true;
        break;
    }
    return re;
  }
}
