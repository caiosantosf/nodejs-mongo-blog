/*var fs = require('fs');
var path = require('path');

var moveFrom = "./public/images/uploads/";
var moveTo = "./public/images/posts/"

exports.moveImages = function(id) {
    fs.readdir( moveFrom, function( err, files ) {
        if(err) {
            return
        } 

        files.forEach( function( file, index ) {
            var newFile = id + file;
            var fromPath = path.join( moveFrom, file);
            var toPath = path.join( moveTo, newFile);
            fs.writeFileSync(toPath, fs.readFileSync(fromPath));
        } );
    } );
}*/

exports.titlePath = function(newStringComAcento) {
    var string = newStringComAcento;
      var mapaAcentosHex 	= {
          a : /[\xE0-\xE6]/g,
          e : /[\xE8-\xEB]/g,
          i : /[\xEC-\xEF]/g,
          o : /[\xF2-\xF6]/g,
          u : /[\xF9-\xFC]/g,
          c : /\xE7/g,
          n : /\xF1/g
      };
  
      for ( var letra in mapaAcentosHex ) {
          var expressaoRegular = mapaAcentosHex[letra];
          string = string.replace( expressaoRegular, letra );
      }
  
      return string.toLowerCase().split(' ').join('-');
}
