const artnetsrv = require('artnet-server');
const OPC  = require('./opc.js');
const argv = require('minimist')(process.argv.slice(2));

const client = new OPC(argv['ip'] || '127.0.0.1', 7890);

client.setPixelCount(27*40);

let wdt = false;

function update(msg) {
	for(let i=0; i < 80; i++){
		client.setPixel((msg.universe/256)*80 + i,
			msg.data[i*3 + 0],
			msg.data[i*3 + 1],
			msg.data[i*3 + 2]
		);
	}
	wdt = true;
	//client.writePixels();
}

setInterval(() => {
	client.writePixels();
}, 2);

let wdt_old = true;

setInterval(() => {
	if(wdt==false && wdt!=wdt_old){
		for(let i=0; i < 40*27; i++){
			client.setPixel(
				i,
				0,
				0,
				0
			);
		}
		console.log('OFF');
		wdt_old=false;
	}else if(wdt==true && wdt != wdt_old){
		console.log('ON');
		wdt_old=true;
	}
	wdt = false;
},100);

artnetsrv.listen(6454, (msg, peer) => {
	update(msg);
});
