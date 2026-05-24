/**
 * Event class used in HangulUnicodeComposer.
 * Replicates the AS3 HangulTextEvent behaviour.
 */
export class HangulTextEvent extends Event {
  /**
   * Dispatched when the composed string changes.
   */
  public static readonly UPDATE = "update";

  /**
   * Dispatched when the composed string length reaches the restricted limit.
   */
  public static readonly LIMITED = "limited";

  /**
   * Dispatched when composition errors occur.
   */
  public static readonly ERROR = "error";

  /**
   * Composed string data at the time of the event.
   */
  public string: string;

  constructor(type: string, stringData: string, bubbles = false, cancelable = false) {
    super(type, { bubbles, cancelable });
    this.string = stringData;
  }

  public override toString(): string {
    return `${this.type} ${this.string}`;
  }
}
