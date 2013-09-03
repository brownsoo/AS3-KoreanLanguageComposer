//------------------------------------------------------------------------------
//
//   Copyright 2010 
//   hansune.com All rights reserved. 
//   CC : Attribution-Noncommercial-Share Alike 2.0 Korea 
// 
//   I would like to thank every one of you for helping me out. 
//
//------------------------------------------------------------------------------
//refer to 
//------------------------------------------------------------------------------
//as3corelib : https://github.com/mikechambers/as3corelib
//
// to do List

/**
 * 
 * ## 미비한 것
 * vision package - 기본적인 카메라 센싱 모듈 작성
 * Vec2, VFactor - vectorForFlash 공부 정리 -> 활용예제 작성 
 * 
 * ## 발전시킬 것
 * GLBitmap class - 이해도를 높일 것, 속도 개선, 활용예제 작성
 * 
 * */

//version

/**
 * 100828
 * JSON RPC 삭제
 * 
 * */

package hansune
{
	public class Hansune
	{
		public static const AUTHOR:String = "han hyon soo";
		public static const HOME:String = "blog.hansune.com";
		public static const VERSION:String = "1.2.1";
		public static const encoding:String = "utf-8";
		
		private static var ins:Hansune;
		private static var used:Boolean = false;
		public static function copyright():void {
			if(used) return;
			used = true;
			trace(ver());
		}
		public static function get instance():Hansune {
			if(Hansune.ins == null){
				Hansune.ins = new Hansune(new Single());
			}
			
			return Hansune.ins;
		}
		
		public function Hansune(single:Single):void {}
		
        public static function ver():String{
			var re:String =
				"* hansune AS3 lib : ver- " + VERSION + "\n" 
				+ "* homepage- " + HOME + " : maker- " + AUTHOR + "\n";
			
			return re;
		}
	}
}

internal class Single{}