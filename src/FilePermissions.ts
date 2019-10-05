import {Permissions} from "./Permissions";

export class FilePermissions extends Permissions {
	private readonly _value: number[];

	private constructor(value: number[]) {
		super();
		if (value.length !== 3){
			throw new Error("File Permissions value should have length equal to 3.");
		}
		this._value = value;
	}

	public static fromExpandedPermissions(expandedPermissions: number[][]): FilePermissions {
		if (expandedPermissions.length !== 3) {
			throw new Error("Expanded Permissions should have length 3");
		}
		for (let m of expandedPermissions) {
			if (m.length !== 3) {
				throw new Error("all of expanded permissions arrays should have length 3");
			}
		}
		return new FilePermissions(Permissions.calculateCombinedPermissionsFromExpandedPermissions(expandedPermissions));
	}

	public static fromCombinedPermissions(combinedPermissions: number[]): FilePermissions {
		if (combinedPermissions.length !== 3) {
			throw new Error("Combined Permissions should have length 3");
		}
		return new FilePermissions(combinedPermissions);
	}

	public getExpandedPermissions():number[][]{
		return Permissions.calculateExpandedPermissionsFromCombinedPermissions(this.value);
	}


	get value(): number[] {
		return this._value;
	}
}
