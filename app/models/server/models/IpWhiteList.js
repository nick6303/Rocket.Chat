import { Base } from './_Base';

export class IpWhiteList extends Base{
	constructor() {
		super('white_list');
	}

	create(data) {
		return this.insert(data);
	}

	findOneById(_id, options) {
		return this.findOne(_id, options);
	}

	save(_id, data) {
		const query = {
			_id: _id,
		};
		const update = {
			$set: {
				ip : data.ip,
				content : data.content,
			},
		};
		return this.update(query, update);
	}

	delete(_id) {
		const query = {
			_id: _id,
		};
		return this.remove(query);
	}

}

export default new IpWhiteList();