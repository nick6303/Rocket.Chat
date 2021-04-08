import { Base } from './_Base';

export class UserDeviceInfo extends Base{
	constructor() {
		super('user_device_info');
	}

	save(userId,deviceInfo) {
		const fileData = {
			_id: userId,
			os: deviceInfo.OS,
			version: deviceInfo.Version,
			platform: deviceInfo
		};
		return this.insertOrUpsert(fileData);
	}
}

export default new UserDeviceInfo();