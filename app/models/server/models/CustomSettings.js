import { Base } from './_Base';

export class CustomSettings extends Base{
	constructor() {
		super('CustomSettings');
	}

	findOneById(_id, options) {
		return this.findOne(_id, options);
	}

	create(name, isEnable) {
		const exists = this.findOneById(name, { fields: { _id: 1 } });

		if (exists) {
			return exists._id;
		}

		this.upsert({ _id: name }, { $set: { isEnable } });
	}

	save(_id, data) {
		const query = {
			_id: _id,
		};
		const update = {
			$set: {
				isEnable : data,
			},
		};

		return  this.update(query, update); 
	}
}

export default new CustomSettings();