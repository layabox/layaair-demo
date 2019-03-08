package common {
	import laya.d3.component.Script3D;
	import zTest.PickTexture;
	
	/**
	 * ...
	 * @author
	 */
	public class BrushTextureScript extends Script3D {
		private static var _pick:PickTexture;
		public function BrushTextureScript() {
			
		}
		
		/**
		 * @inheritDoc
		 */
		override public function onAwake():void {
			
		}
		
		/**
		 * @inheritDoc
		 */
		override public function onUpdate():void {
			_pick.submitData();
		}
		
		/**
		 * @inheritDoc
		 */
		override public function onDestroy():void {
		}
		public static function setPick(pick:PickTexture){
			_pick = pick;
		}
	}

}