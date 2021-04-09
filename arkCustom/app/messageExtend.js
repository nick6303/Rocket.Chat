export const nameReplaceUserName = (text, matchData) => {
	let res = text;
	const regExp = new RegExp(/@([\u4e00-\u9fa5A-Za-z0-9_\-\.])+/g);
	const replaceExp = /@([\u4e00-\u9fa5A-Za-z0-9_\-\.])+ /g;
	if ( !text.match(replaceExp) || !matchData ) { return res; }
	const dynamicRegExp = new RegExp(Object.values(text.match(regExp)).join('|'), 'gi');
	res = text.replace(dynamicRegExp, (matched) => {
		const mapIndex = matchData.findIndex((matchItem) => {
			return matchItem.name === matched.replace('@', '')
		});
		return mapIndex > -1 ? `@${ matchData[mapIndex].username } `: matched
	});
	return res;
};

export const userNameReplaceName = (text, matchData) => {
	let res = text;
	const regExp = new RegExp(/@([\u4e00-\u9fa5A-Za-z0-9_\-\.])+/g);
	if ( !text.match(regExp) || !matchData ) { return res; }
	const dynamicRegExp = new RegExp(Object.values(text.match(regExp)).join('|'), 'gi');
	res = text.replace(dynamicRegExp, (matched) => {
		const mapIndex = matchData.findIndex((matchItem) => {
			return matchItem.username === matched.replace('@', '')
		});
		return mapIndex > -1 ? `@${ matchData[mapIndex].name } ` : matched;
	});
	return res;
};
