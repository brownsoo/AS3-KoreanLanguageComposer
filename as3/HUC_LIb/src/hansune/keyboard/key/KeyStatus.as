package hansune.keyboard.key
{
	/**
	 * 키 버튼의 상태값
	 * @author hyonsoohan
	 * 
	 */
	public class KeyStatus
	{
		/**
		 * 기본 상태
		 */
		static public const DEFAULT:String = "default";
		/**
		 * 마우스 오버 상태
		 */
		static public const OVER:String = "over";
		/**
		 * 마우스 다운 상태
		 */
		static public const DOWN:String = "down";
		/**
		 * 포커스된 상태
		 */
		static public const FOCUS:String = "focus";
		
		public function KeyStatus()
		{
		}
	}
}