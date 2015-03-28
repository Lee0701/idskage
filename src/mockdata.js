//IDS　組字式
var decompose={ "萌":"⿱艹明" , "明":"⿰日月" };

//末級部件:筆劃path　, from Glyphwiki
var glypheme={
	"月":"7:12:7:58:29:58:114:58:162:27:188$1:2:2:58:29:147:29$1:22:4:147:29:147:181$1:2:2:58:73:147:73$1:2:2:58:116:147:116"
	,"日":"1:12:13:46:32:46:168$1:2:2:46:32:154:32$1:22:23:154:32:154:168$1:2:2:46:98:154:98$1:2:2:46:168:154:168"
	,"艹":"1:0:0:13:39:187:39$1:0:0:72:13:72:64$1:0:0:128:13:128:64"
	,"大":"1:0:0:38:44:160:44$2:0:7:100:16:83:68:14:104$2:7:0:112:44:140:78:180:98"

//unremark for better glyph
	,"u65e5":"1:12:13:46:32:46:168$1:2:2:46:32:154:32$1:22:23:154:32:154:168$1:2:2:46:98:154:98$1:2:2:46:168:154:168"
	,"u65e5-01":"99:0:0:10:11:87:177:u65e5"
	,"u6708-02":"7:12:7:115:29:115:104:115:172:64:188$1:2:2:115:29:172:29$1:22:4:172:29:172:182$1:2:2:114:74:172:74$1:2:2:114:119:172:119"
	,"明":"99:0:0:-2:-1:234:177:u65e5-01$99:0:0:-3:0:197:200:u6708-02"
}

window.glypheme=glypheme;
window.decompose=decompose;
