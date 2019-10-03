import {FilePermissions} from "./FilePermissions";
import {FolderPermissions} from "./FolderPermissions";

export class UMask {
	private readonly _filePermissions: FilePermissions;
	private readonly _folderPermissions: FolderPermissions;
	private readonly _value: number[];


	private constructor(filePermissions: FilePermissions | null, folderPermissions: FolderPermissions | null) {
		if (filePermissions != null) {
			this._filePermissions = filePermissions;
			this._value = UMask.calculateUMaskFromFilePermissions(filePermissions);
			this._folderPermissions = UMask.calculateFolderPermissionsFromUMask(this._value);
			return;
		}
		if (folderPermissions != null) {
			this._folderPermissions = folderPermissions;
			this._value = UMask.calculateUMaskFromFolderPermissions(folderPermissions);
			this._filePermissions = UMask.calculateFilePermissionsFromUMask(this._value);
			return;
		}
	}

	public static fromFilePermissions(filePermissions: FilePermissions): UMask {
		return new UMask(filePermissions, null);

	}

	public static fromFolderPermissions(folderPermissions: FolderPermissions): UMask {
		return new UMask(null, folderPermissions);
	}


	get filePermissions(): FilePermissions {
		return this._filePermissions;
	}

	get folderPermissions(): FolderPermissions {
		return this._folderPermissions;
	}

	get value(): number[] {
		return this._value;
	}

	private static calculateUMaskFromFilePermissions(filePermissions: FilePermissions): number[] {
		const umask: number[] = [6, 6, 6];
		for (let i = 0; i < umask.length; i++) {
			umask[i] -= filePermissions.value[i];
			if (filePermissions.value[i] % 2 == 1) {
				umask[i] = -1;
			}
		}
		for (let i = 0; i < umask.length; i++) {
			if (umask[i] < 0) {
				throw new Error("");
			}
		}
		return umask;
	}

	private static calculateUMaskFromFolderPermissions(folderPermissions: FolderPermissions): number[] {
		const umask: number[] = [7, 7, 7];
		for (let i = 0; i < umask.length; i++) {
			umask[i] -= folderPermissions.value[i];
		}
		return umask;
	}

	private static calculateFilePermissionsFromUMask(umask: number[]): FilePermissions {
		let fileCombinedPermissions: number[] = [6, 6, 6];

		for (let i = 0; i < umask.length; i++) {
			fileCombinedPermissions[i] -= umask[i];
			switch (fileCombinedPermissions[i]) {
				case -1:
					fileCombinedPermissions[i] = 0;
					break;
				case 1:
					fileCombinedPermissions[i] = 2;
					break;
				case 3:
					fileCombinedPermissions[i] = 4;
					break;
				case 5:
					fileCombinedPermissions[i] = 6;
					break;
				default:
					break;
			}
		}
		return FilePermissions.fromCombinedPermissions(fileCombinedPermissions);
	}

	private static calculateFolderPermissionsFromUMask(umask: number[]): FolderPermissions {
		let folderCombinedPermissions: number[] = [7, 7, 7];

		for (let i = 0; i < umask.length; i++) {
			folderCombinedPermissions[i] -= umask[i];
		}
		return FolderPermissions.fromCombinedPermissions(folderCombinedPermissions);
	}
}
