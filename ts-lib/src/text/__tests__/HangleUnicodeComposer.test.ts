import { describe, it, expect } from "vitest";
import { HangleUnicodeComposer } from "../HangleUnicodeComposer.js";

describe("HangleUnicodeComposer", () => {
  it("should compose basic syllables", () => {
    const composer = new HangleUnicodeComposer();
    
    // Test '가' (ㄱ + ㅏ)
    composer.addJamo("ㄱ");
    expect(composer.extra).toBe("ㄱ");
    composer.addJamo("ㅏ");
    expect(composer.extra).toBe("가");
    expect(composer.compositionString).toBe("");
    
    // Clear and test '한' (ㅎ + ㅏ + ㄴ)
    composer.reset();
    composer.addJamo("ㅎ");
    composer.addJamo("ㅏ");
    composer.addJamo("ㄴ");
    expect(composer.extra).toBe("한");
    expect(composer.compositionString).toBe("");
    
    // Test '한국' (ㅎ + ㅏ + ㄴ + ㄱ + ㅜ + ㄱ)
    composer.reset();
    composer.addJamo("ㅎ");
    composer.addJamo("ㅏ");
    composer.addJamo("ㄴ"); // 한
    composer.addJamo("ㄱ"); // 한 -> ㄱ moves to next character
    expect(composer.compositionString).toBe("한");
    expect(composer.extra).toBe("ㄱ");
    
    composer.addJamo("ㅜ"); // 한구
    expect(composer.compositionString).toBe("한");
    expect(composer.extra).toBe("구");
    
    composer.addJamo("ㄱ"); // 한국
    expect(composer.compositionString).toBe("한");
    expect(composer.extra).toBe("국");
  });

  it("should compose complex vowels (diphthongs)", () => {
    const composer = new HangleUnicodeComposer();

    // Test '과' (ㄱ + ㅗ + ㅏ)
    composer.addJamo("ㄱ");
    composer.addJamo("ㅗ");
    composer.addJamo("ㅏ");
    expect(composer.extra).toBe("과");

    // Test '관' (ㄱ + ㅗ + ㅏ + ㄴ)
    composer.addJamo("ㄴ");
    expect(composer.extra).toBe("관");
  });

  it("should handle double final consonants", () => {
    const composer = new HangleUnicodeComposer();

    // Test '닭' (ㄷ + ㅏ + ㄹ + ㄱ)
    composer.addJamo("ㄷ");
    composer.addJamo("ㅏ");
    composer.addJamo("ㄹ");
    composer.addJamo("ㄱ");
    expect(composer.extra).toBe("닭"); // ㄹ + ㄱ combines to ㄺ
  });

  it("should process carry-over of final consonant to next syllable's initial", () => {
    const composer = new HangleUnicodeComposer();

    // Test '가마' typing (ㄱ + ㅏ + ㅁ + ㅏ)
    composer.addJamo("ㄱ");
    composer.addJamo("ㅏ");
    composer.addJamo("ㅁ"); // 감
    expect(composer.extra).toBe("감");
    
    composer.addJamo("ㅏ"); // 'ㅁ' moves to initial of next syllable -> 가마
    expect(composer.compositionString).toBe("가");
    expect(composer.extra).toBe("마");
  });

  it("should process double consonant carry-over to next syllable's initial", () => {
    const composer = new HangleUnicodeComposer();

    // Test '앉아' typing (ㅇ + ㅏ + ㄴ + ㅈ + ㅏ)
    composer.addJamo("ㅇ");
    composer.addJamo("ㅏ");
    composer.addJamo("ㄴ");
    composer.addJamo("ㅈ"); // 앉
    expect(composer.extra).toBe("앉");

    composer.addJamo("ㅏ"); // 'ㅈ' moves to next syllable -> 안자
    expect(composer.compositionString).toBe("안");
    expect(composer.extra).toBe("자");
  });

  it("should handle backspace correctly", () => {
    const composer = new HangleUnicodeComposer();

    // Type '강' (ㄱ + ㅏ + ㅇ)
    composer.addJamo("ㄱ");
    composer.addJamo("ㅏ");
    composer.addJamo("ㅇ");
    expect(composer.extra).toBe("강");

    // Backspace once -> '가'
    composer.backSpace();
    expect(composer.extra).toBe("가");

    // Backspace twice -> 'ㄱ'
    composer.backSpace();
    expect(composer.extra).toBe("ㄱ");

    // Backspace thrice -> ""
    composer.backSpace();
    expect(composer.extra).toBe("");
  });

  it("should handle space and special characters", () => {
    const composer = new HangleUnicodeComposer();

    // Type '한'
    composer.addJamo("ㅎ");
    composer.addJamo("ㅏ");
    composer.addJamo("ㄴ");
    
    // Add space
    composer.space();
    expect(composer.compositionString).toBe("한 ");
    expect(composer.extra).toBe("");

    // Add special character
    composer.addSpecialChar("!");
    expect(composer.compositionString).toBe("한 !");
  });

  it("should support archive and restore", () => {
    const composer = new HangleUnicodeComposer();

    // Type '한' in composer
    composer.addJamo("ㅎ");
    composer.addJamo("ㅏ");
    composer.addJamo("ㄴ");

    // Archive as 'field1'
    composer.archive("field1");

    // Clear typing state manually (reset() clears archives)
    composer.compositionString = "";
    composer.extra = "";
    composer.instantChars = [];
    
    // Type something else '글'
    composer.addJamo("ㄱ");
    composer.addJamo("ㅡ");
    composer.addJamo("ㄹ");
    expect(composer.compositionString + composer.extra).toBe("글");

    // Restore 'field1'
    const restored = composer.restore("field1");
    expect(restored).toBe("한");
    expect(composer.compositionString + composer.extra).toBe("한");
  });
});
