import { Meteor } from 'meteor/meteor';
import { ipRangeCheck } from './ipInRange';


export const checkIp = function(ip) {

	ip = ip.trim().toUpperCase(); // 轉大寫
	
	// 正則
	const IPv4AndMask = /^((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)(\/(\d|[1-2]\d|3[0-2]))?$/;
	const IPv6AndMask = /^([\da-fA-F]{1,4}:){6}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)(\/([1-9]?\d|(1([0-1]\d|2[0-8]))))?$|^::([\da-fA-F]{1,4}:){0,4}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)(\/([1-9]?\d|(1([0-1]\d|2[0-8]))))?$|^([\da-fA-F]{1,4}:):([\da-fA-F]{1,4}:){0,3}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)(\/([1-9]?\d|(1([0-1]\d|2[0-8]))))?$|^([\da-fA-F]{1,4}:){2}:([\da-fA-F]{1,4}:){0,2}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)(\/([1-9]?\d|(1([0-1]\d|2[0-8]))))?$|^([\da-fA-F]{1,4}:){3}:([\da-fA-F]{1,4}:){0,1}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)(\/([1-9]?\d|(1([0-1]\d|2[0-8]))))?$|^([\da-fA-F]{1,4}:){4}:((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)(\/([1-9]?\d|(1([0-1]\d|2[0-8]))))?$|^([\da-fA-F]{1,4}:){7}[\da-fA-F]{1,4}(\/([1-9]?\d|(1([0-1]\d|2[0-8]))))?$|^:((:[\da-fA-F]{1,4}){1,6}|:)(\/([1-9]?\d|(1([0-1]\d|2[0-8]))))?$|^[\da-fA-F]{1,4}:((:[\da-fA-F]{1,4}){1,5}|:)(\/([1-9]?\d|(1([0-1]\d|2[0-8]))))?$|^([\da-fA-F]{1,4}:){2}((:[\da-fA-F]{1,4}){1,4}|:)(\/([1-9]?\d|(1([0-1]\d|2[0-8]))))?$|^([\da-fA-F]{1,4}:){3}((:[\da-fA-F]{1,4}){1,3}|:)(\/([1-9]?\d|(1([0-1]\d|2[0-8]))))?$|^([\da-fA-F]{1,4}:){4}((:[\da-fA-F]{1,4}){1,2}|:)(\/([1-9]?\d|(1([0-1]\d|2[0-8]))))?$|^([\da-fA-F]{1,4}:){5}:([\da-fA-F]{1,4})?(\/([1-9]?\d|(1([0-1]\d|2[0-8]))))?$|^([\da-fA-F]{1,4}:){6}:(\/([1-9]?\d|(1([0-1]\d|2[0-8]))))?$/;

	let ipType = getIpType(ip);

	ipValidation = new RegExp(eval(`${ipType}AndMask`));
	if (ip && !ipValidation.test(ip)) {
		console.log(`白名單錯誤： ${ip} 未符合${ipType}`)
		throw new Meteor.Error('驗證失敗', `未符合${ipType}，請查看日誌`);
	}
		
	// 網段遮罩驗證
	const netmaskArray = ip.split('/');
	if (netmaskArray.length == 2) {
		let inputIp = netmaskArray[0]; // IP
		const mask = netmaskArray[1]; // 遮罩

		const binarIp = ipToBinary(inputIp); // 轉2進制
		const maskBinarIp = calcMask(binarIp, mask); // 計算遮罩IP Range

		if (binarIp != maskBinarIp.start) {
		 	const maskIp = binaryToIp(maskBinarIp.start); // 遮罩首位IP 2進制轉IP
			console.log(`白名單錯誤： /${mask} 首位IP為 ${maskIp}`) 	
		 	throw new Meteor.Error('驗證失敗', `/${mask} 遮罩錯誤，請查看日誌`);
		}
	}
};

export const getIpRange = function(ip) {
	let ipRange = null;
	ip = ip.trim().toUpperCase(); // 轉大寫
	const netmaskArray = ip.split('/');
	if (netmaskArray.length == 2) {
		let inputIp = netmaskArray[0]; // IP
		const mask = netmaskArray[1]; // 遮罩
		const binarIp = ipToBinary(inputIp); // 轉2進制
		const maskBinarIp = calcMask(binarIp, mask); // 計算遮罩IP Range
		ipRange = {
			type : 2,
			start : binaryToIp(maskBinarIp.start),
			end : binaryToIp(maskBinarIp.end)
		}
	} else {
		ipRange = {
			type : 1,
			start : ip
		}
	}
	return ipRange;
}

export const isInRange = function(input, ips) {
	return ipRangeCheck(input, ips);
}

function getIpType(ip) {
	return (ip.indexOf(':') > -1 || ip.length == 128) ? 'IPv6' : 'IPv4';
}

function calcMask(binaryIp, mask) {
	let ipType = getIpType(binaryIp);
	let fillNum = (ipType == 'IPv4') ? 32 : 128;
	let maskIp = binaryIp.substr(0, mask);
	let maskIpIpRange = {
		start : maskIp.padEnd(fillNum, '0'),
		end : maskIp.padEnd(fillNum, '1')
	}; // 補位
	return maskIpIpRange;
}

function ipToBinary(ip) {
	let binaryValue = '';
	
	let ipType = getIpType(ip);
	ip = (ipType == 'IPv4') ? ip : ipv6Full(ip);
	
	let splitIp = (ipType == 'IPv4') ? ip.split('.') : ip.replace(/:/g, '').split('');
	for (let i in splitIp) {
		let intIp = (ipType == 'IPv4') ? parseInt(splitIp[i]) : parseInt(splitIp[i], 16); // 轉數值
		let binaryIp = intIp.toString(2); // 轉二進制
		let fillNum = (ipType == 'IPv4') ? 8 : 4;
		let binaryIpFull = binaryIp.padStart(fillNum, '0'); // 補位
		binaryValue += binaryIpFull;
	}
	return binaryValue;
}

function binaryToIp(binaryIp) {
	let ipType = getIpType(binaryIp);
	let ip = [];
	if (ipType == 'IPv4') {
		for (let i = 0; i < 32; i += 8) {
			let splitBinaryIp = binaryIp.substr(i, 8);
			let splitIp = parseInt(splitBinaryIp, 2);
			ip.push(splitIp);
		}
		return ip.join('.');
	} else {
		let concatHexIp = '';
		for (let i = 0; i < 128; i += 4) {
			let splitBinaryIp = binaryIp.substr(i, 4);
			let splitIp = parseInt(splitBinaryIp, 2);
			let toHexIp = splitIp.toString(16).toUpperCase();
			concatHexIp += toHexIp;
			if (concatHexIp.length == 4) {
				ip.push(concatHexIp);
				concatHexIp = '';
			}
		}
		return ip.join(':');
	}
}

function ipv6Full(ip) {
	compressIp = ip.split('::');
	
	for (let i in compressIp) {
		compressIp[i] = compressIp[i].split(':');
	}

	let compressIpLength = [].concat.apply([], compressIp).length;
	let padLine = 8 - compressIpLength;

	if (padLine > 0) {
		let padArray = Array(padLine).fill('0');
		compressIp.splice(1, 0, padArray);
	}

	let hexIp = [];
	compressIp = [].concat.apply([], compressIp);
	for (let i in compressIp) {
		hexIp.push(compressIp[i].padStart(4, '0'));
	}
	return hexIp.join(':');
}