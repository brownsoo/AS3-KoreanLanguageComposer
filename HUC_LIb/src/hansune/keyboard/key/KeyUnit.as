package hansune.keyboard.key
{
	import flash.display.Bitmap;
	import flash.display.BitmapData;
	import flash.display.Sprite;
	import flash.text.TextField;
	import flash.text.TextFieldAutoSize;
	import flash.text.TextFormat;
	
	import hansune.keyboard.keyMeta.KeyInfo;

	public class KeyUnit extends Sprite
	{
		public function KeyUnit(keyInfo:KeyInfo=null)
		{
            _status = KeyStatus.DEFAULT;
            _keyInfo = keyInfo;
            statusImages = new Vector.<StatusBitmap>();
		}
        internal var language:String = "";
		private var _status:String = "";
		private var _keyInfo:KeyInfo = null;
        private var statusImages:Vector.<StatusBitmap>;

		public function get keyInfo():KeyInfo
		{
			return _keyInfo;
		}

		public function set keyInfo(value:KeyInfo):void
		{
			_keyInfo = value;
		}

		public function get status():String
		{
			return _status;
		}

		public function set status(value:String):void
		{
            if(_status != value)
            {
			    _status = value;
                var i:int;
                for(i=0; i<statusImages.length; i++){
                    if(statusImages[i].status == status)
                    {
                        statusImages[i].bitmap.visible = true;
                    }
                    else
                    {
                        statusImages[i].bitmap.visible = false;
                    }
                }
            }
            
		}

		        
        public function setLabelForStatus(label:String, status:String):void {
            var fm:TextFormat = new TextFormat("Arial", 16, 0x000000, true);
            var t:TextField = new TextField();
            t.text = label;
            t.border = true;
            t.borderColor = 0;
            t.autoSize = TextFieldAutoSize.CENTER;
            t.defaultTextFormat = fm;
            
            var bmd:BitmapData = new BitmapData(t.width, t.height, false, 0xffffffff);
            bmd.draw(t);
            
            setBitmapForStatus(new Bitmap(bmd), status);
        }
		
		public function setBitmapForStatus(image:Bitmap, status:String):void {
			var i:int;
            for(i=0; i<statusImages.length; i++){
                if(statusImages[i].status == status)
                {
                    if(this.contains(statusImages[i].bitmap)) this.removeChild(statusImages[i].bitmap);
                    statusImages[i] = null;
                    statusImages[i] = new StatusBitmap(image, status);
                    if(this._status != status) statusImages[i].bitmap.visible = false;
                    statusImages[i].bitmap.x = statusImages[i].bitmap.width * (-0.5);
                    statusImages[i].bitmap.y = statusImages[i].bitmap.height * (-0.5);
                    this.addChild(statusImages[i].bitmap);
                    break;
                }
            }
		}
        
        public function release():void {
            var i:int;
            for(i=0; i<statusImages.length; i++){
                if(this.contains(statusImages[i].bitmap)) this.removeChild(statusImages[i].bitmap);
                statusImages[i].bitmap.bitmapData.dispose();
                statusImages[i] = null;
            }
            
            statusImages = null;
        }
	}
}
import flash.display.Bitmap;

internal class StatusBitmap {
    public function StatusBitmap(bitmap:Bitmap, status:String){}
    private var _bitmap:Bitmap;
    private var _status:String;

    public function get status():String
    {
        return _status;
    }

    public function get bitmap():Bitmap
    {
        return _bitmap;
    }
}