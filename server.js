/** 
 * @author Hank
 * @phone 15501259989
*/
var shell = require("shelljs");     //执行shell
var watch = require('watch');       //监测目录变化

watch.watchTree('./js', function (f, curr, prev) {
    if(typeof f === 'string') {
      console.log(f, `npx babel ${f} --out-file dist/${f}`)
      shell.exec(`npx babel ${f} --out-file dist/${f}`);
      console.log(`${f} => dist/${f}`)
    } else {
      shell.exec(`npx babel js --out-dir ./dist/js`);
    }
    
});