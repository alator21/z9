import $ = require("jquery");
import {FolderPermissions} from "./FolderPermissions";
import {UMask} from "./UMask";
import {FilePermissions} from "./FilePermissions";

const filePermissionsSelector: string = `[data-type-file]`;
const folderPermissionsSelector: string = `[data-type-folder]`;
const turnedOnClass: string = `turnedOn`;
const resultsId: string = `resultsUMask`;

$(function () {
	$(document).on('click', filePermissionsSelector, function () {
		if (isDisabled($(this))) {
			return;
		}
		if (isTurnedOn($(this))) {
			turnOff($(this));
		} else {
			turnOn($(this));
		}
		let fileExpandedPermissions: number[][] = calculateFileOrFolderExpandedPermissionByTheUserOptions(filePermissionsSelector);
		let filePermissions: FilePermissions = FilePermissions.fromExpandedPermissions(fileExpandedPermissions);
		let uMask: UMask = UMask.fromFilePermissions(filePermissions);
		changeUserOptionsToReflectUMask(uMask);
		$(`#${resultsId}`).text(uMask.prettyPrint());
	});

	$(document).on('click', folderPermissionsSelector, function () {
		if (isDisabled($(this))) {
			return;
		}
		if (isTurnedOn($(this))) {
			turnOff($(this));
		} else {
			turnOn($(this));
		}
		let folderExpandedPermissions: number[][] = calculateFileOrFolderExpandedPermissionByTheUserOptions(folderPermissionsSelector);
		let folderPermissions: FolderPermissions = FolderPermissions.fromExpandedPermissions(folderExpandedPermissions);
		let uMask: UMask = UMask.fromFolderPermissions(folderPermissions);
		changeUserOptionsToReflectUMask(uMask);
		$(`#${resultsId}`).text(uMask.prettyPrint());
	})
});


function calculateFileOrFolderExpandedPermissionByTheUserOptions(type): number[][] {
	const checkBoxesLength: number = $(type).length;
	const expandedPermissions: number[][] = [
		[0, 0, 0],
		[0, 0, 0],
		[0, 0, 0]
	];

	for (let i = 0; i < checkBoxesLength; i++) {
		const item = $(type).eq(i);
		const checked: number = (isTurnedOn(item) && 1) || 0;
		const group: string = item.attr('data-group');
		const permission: string = item.attr('data-permission');
		switch (group) {
			case 'owner':
				switch (permission) {
					case 'read':
						expandedPermissions[0][0] = checked;
						break;
					case 'write':
						expandedPermissions[0][1] = checked;
						break;
					case 'execute':
						expandedPermissions[0][2] = checked;
						break;
					default:
						break;
				}
				break;
			case 'group':
				switch (permission) {
					case 'read':
						expandedPermissions[1][0] = checked;
						break;
					case 'write':
						expandedPermissions[1][1] = checked;
						break;
					case 'execute':
						expandedPermissions[1][2] = checked;
						break;
					default:
						break;
				}
				break;
			case 'others':
				switch (permission) {
					case 'read':
						expandedPermissions[2][0] = checked;
						break;
					case 'write':
						expandedPermissions[2][1] = checked;
						break;
					case 'execute':
						expandedPermissions[2][2] = checked;
						break;
					default:
						break;
				}
				break;
			default:
				break;
		}
	}
	return expandedPermissions;
}

function changeUserOptionsToReflectUMask(umask: UMask): void {
	const fileExpandedPermissions: number[][] = umask.filePermissions.getExpandedPermissions();
	for (let i = 0; i < fileExpandedPermissions.length; i++) {
		let permission = fileExpandedPermissions[i];
		for (let j = 0; j < permission.length; j++) {
			let p = permission[j];
			let index: number = fileExpandedPermissions.length * i + j;
			if (p === 1) {
				turnOn($(filePermissionsSelector).eq(index));
			} else {
				turnOff($(filePermissionsSelector).eq(index));
			}
		}
	}
	const folderExpandedPermissions: number[][] = umask.folderPermissions.getExpandedPermissions();
	for (let i = 0; i < folderExpandedPermissions.length; i++) {
		let permission = folderExpandedPermissions[i];
		for (let j = 0; j < permission.length; j++) {
			let p = permission[j];
			let index: number = folderExpandedPermissions.length * i + j;
			if (p === 1) {
				turnOn($(folderPermissionsSelector).eq(index));
			} else {
				turnOff($(folderPermissionsSelector).eq(index));
			}
		}
	}
}

function isTurnedOn(element: JQuery<any>): boolean {
	return element.hasClass(turnedOnClass);
}

function isDisabled(element: JQuery<any>): boolean {
	return element.is("[data-disabled]");
}

function turnOn(element: JQuery<any>): void {
	element.addClass(turnedOnClass);
}

function turnOff(element: JQuery<any>): void {
	element.removeClass(turnedOnClass);
}
