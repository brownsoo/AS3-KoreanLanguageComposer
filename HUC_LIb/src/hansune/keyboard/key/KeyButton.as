package hansune.keyboard.key
{
    import flash.display.Sprite;

	public class KeyButton extends Sprite implements IKeyFocusable
	{
		public function KeyButton()
		{
            units = new Vector.<KeyUnit>();
		}
		
		internal var id:uint = 0;
		private var _language:String = "";
		private var _status:String = "";
        private var units:Vector.<KeyUnit>;
		
		public function get status():String
		{
			return _status;
		}

		public function set status(value:String):void
		{
            if(_status != value){
                _status = value;
                
                var i:int;
                for(i=0; i<units.length; i++){
                    units[i].status = value;
                }
            }
		}

		public function get language():String
		{
			return _language;
		}

		public function set language(value:String):void
		{
            if(_language != value){
                _language = value;
                var i:int;
                for(i=0; i<units.length; i++){
                    units[i].status = KeyStatus.DEFAULT;
                    if(units[i].language == language)
                    {
                        units[i].visible = true;
                    }
                    else
                    {
                        units[i].visible = false;
                    }
                }
            }
		}

		public function get ID():uint {
			return id;
		}
		
		public function setKeyUnitForLanguage(keyUnit:KeyUnit, language:String):void {
            
			var i:int;
            var chk:Boolean = false;
            for(i=0; i<units.length; i++){
                if(units[i].language == language)
                {
                    chk = true;
                    if(contains(units[i])) removeChild(units[i]);
                    units[i].release();
                    units[i] = keyUnit;
                    units[i].language = language;
                    if(units[i].language != this.language) units[i].visible = false;
                    addChild(units[i]);
                }
            }
		}
		
        public function focus():void {
            var i:int;
            for(i=0; i<units.length; i++){
                units[i].status = KeyStatus.FOCUS;
            }
        }
        
        public function unfocus():void {
            var i:int;
            for(i=0; i<units.length; i++){
                units[i].status = KeyStatus.DEFAULT;
            }
        }
		
	}
}