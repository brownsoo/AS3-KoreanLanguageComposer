package hansune.events
{
	import flash.events.Event;

	/**
	 * HangleUnicodeComposer 에서 사용하는 이벤트<br/>
	 * HangleTextEvent class is used for HangleUnicodeComposer.
	 * @author hyonsoo han
	 * 
	 */
	public class HangleTextEvent extends Event
	{
		/**
		 * 조합된 문자열이 수정되었을 경우 알림<br/>
		 * Indicate composed string is changed.
		 */
		static public const UPDATE:String = "update";
		/**
		 * 글자수가 지정한(restrict) 수를 넘어설 경우 알림<br/>
		 * Indicate Composed string length is about to over restrict value.
		 */
		static public const LIMITED:String = "limited";
		/**
		 * 에러 발생시<br/>
		 * Error in composing
		 */
		static public const ERROR:String = "error";
		
		/**
		 * 완성된 문자열<br/> 
		 * Composed string
		 */
		public var string:String = "";
		
		/**
		 * 이벤트 생성자
		 * @param type
		 * @param stringData
		 * @param bubbles
		 * @param cancelable
		 * 
		 */
		public function HangleTextEvent(type:String,stringData:String, bubbles:Boolean=false, cancelable:Boolean=false)
		{
			super(type, bubbles, cancelable);
			string = stringData;
		}
		
		override public function clone():Event {
			return new HangleTextEvent(type, string, bubbles, cancelable);
		}
		
		override public function toString():String{
			return type + " " + string;
		}
		
	}
}