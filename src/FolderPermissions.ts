import {Permissions} from "./Permissions";

export class FolderPermissions extends Permissions{
	private readonly _value: number[];
	private constructor(value: number[]) {
		super();
		if (value.length !== 3){
			throw new Error("Folder Permissions value should have length equal to 3.");
		}
		this._value = value;
	}

	public static fromExpandedPermissions(expandedPermissions: number[][]): FolderPermissions {
		if (expandedPermissions.length !== 3) {
			throw new Error("Expanded Permissions should have length 3");
		}
		for (let m of expandedPermissions) {
			if (m.length !== 3) {
				throw new Error("all of expanded permissions arrays should have length 3");
			}
		}
		return new FolderPermissions(Permissions.calculateCombinedPermissionsFromExpandedPermissions(expandedPermissions));
	}

	public static fromCombinedPermissions(combinedPermissions: number[]): FolderPermissions {
		if (combinedPermissions.length !== 3) {
			throw new Error("Combined Permissions should have length 3");
		}
		return new FolderPermissions(combinedPermissions);
	}

	get value(): number[] {
		return this._value;
	}

	getExpandedPermissions(): number[][] {
		return Permissions.calculateExpandedPermissionsFromCombinedPermissions(this.value);
	}
}
