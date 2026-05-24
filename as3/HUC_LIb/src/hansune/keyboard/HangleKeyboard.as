package hansune.keyboard
{
	import flash.display.Sprite;
	
	import hansune.keyboard.key.KeyButton;
	import hansune.keyboard.textField.HangleTextField;

	public class HangleKeyboard extends Sprite
	{
		
		protected var _language:String = "";
		protected var _tf:HangleTextField;
		protected var keys:Vector.<KeyButton>;
		protected var keyXml:XML;
		
		public function HangleKeyboard()
		{
			super();
			keys = new Vector.<KeyButton>();
		}
		
		public function get hangleTextField():HangleTextField
		{
			return _tf;
		}

		public function set hangleTextField(value:HangleTextField):void
		{
			_tf = value;
		}

		public function get language():String
		{
			return _language;
		}

		public function set language(value:String):void
		{
			if(_language != value){
				_language = value;
				for (var i:int = 0; i < keys.length; i++) 
				{
					keys[i].language = value;
				}
			}
		}

		public function build(xml:XML = null):void {
			
		}
		
		public function show(motionType:int = -1):void {
			
		}
		
		public function getKeyById(id:int):KeyButton {
			for (var i:int = 0; i < keys.length; i++) 
			{
				if(keys[i].ID == id)
				{
					return keys[i];
				}
			}
			return null;
			
		}
	}
}