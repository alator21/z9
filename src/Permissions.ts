export abstract class Permissions {
	public abstract getExpandedPermissions():number[][];

	static calculateCombinedPermissionsFromExpandedPermissions(expandedPermissions:number[][]):number[]{
		const combinedPermissions: number[] = [0, 0, 0];
		for (let i = 0; i < expandedPermissions.length; i++) {
			if (expandedPermissions[i][0] == 1) {
				combinedPermissions[i] += 4;
			}

			if (expandedPermissions[i][1] == 1) {
				combinedPermissions[i] += 2;
			}

			if (expandedPermissions[i][2] == 1) {
				combinedPermissions[i] += 1;
			}
		}
		return combinedPermissions;
	}

	static calculateExpandedPermissionsFromCombinedPermissions(combinedPermissions:number[]):number[][]{
		let expandedPermissions:number[][] = [];

		for (let i = 0; i < combinedPermissions.length; i++) {
			let permission =  combinedPermissions[i];
			expandedPermissions.push([]);
			switch (permission) {
				case 7:
					expandedPermissions[i].push(1);
					expandedPermissions[i].push(1);
					expandedPermissions[i].push(1);
					break;
				case 6:
					expandedPermissions[i].push(1);
					expandedPermissions[i].push(1);
					expandedPermissions[i].push(0);
					break;
				case 5:
					expandedPermissions[i].push(1);
					expandedPermissions[i].push(0);
					expandedPermissions[i].push(1);
					break;
				case 4:
					expandedPermissions[i].push(1);
					expandedPermissions[i].push(0);
					expandedPermissions[i].push(0);
					break;
				case 3:
					expandedPermissions[i].push(0);
					expandedPermissions[i].push(1);
					expandedPermissions[i].push(1);
					break;
				case 2:
					expandedPermissions[i].push(0);
					expandedPermissions[i].push(1);
					expandedPermissions[i].push(0);
					break;
				case 1:
					expandedPermissions[i].push(0);
					expandedPermissions[i].push(0);
					expandedPermissions[i].push(1);
					break;
				case 0:
					expandedPermissions[i].push(0);
					expandedPermissions[i].push(0);
					expandedPermissions[i].push(0);
					break;
			}
		}
		return expandedPermissions;
	}
}
