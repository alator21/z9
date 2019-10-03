import $ = require("jquery");
import {FolderPermissions} from "./FolderPermissions";
import {UMask} from "./UMask";
import {FilePermissions} from "./FilePermissions";


$(function () {
	$(document).on('click','[data-type-file]', function () {
		if ($(this).is("[data-disabled]")){
			return;
		}
		if ($(this).hasClass('btn-default')){
			$(this).removeClass('btn-default').addClass('btn-primary');
		}
		else{
			$(this).removeClass('btn-primary').addClass('btn-default');
		}
		let fileExpandedPermissions: number[][] = calculateFileOrFolderExpandedPermissionByTheUserOptions('[data-type-file]');
		let filePermissions: FilePermissions = FilePermissions.fromExpandedPermissions(fileExpandedPermissions);
		let uMask: UMask = UMask.fromFilePermissions(filePermissions);
		changeUserOptionsToReflectUMask(uMask);
		$('#results').text(uMask.value.join(''));
	});

	$(document).on('click','[data-type-folder]', function () {
		if ($(this).is("[data-disabled]")){
			return;
		}
		if ($(this).hasClass('btn-default')){
			$(this).removeClass('btn-default').addClass('btn-primary');
		}
		else{
			$(this).removeClass('btn-primary').addClass('btn-default');
		}
		let folderExpandedPermissions: number[][] = calculateFileOrFolderExpandedPermissionByTheUserOptions('[data-type-folder]');
		let folderPermissions: FolderPermissions = FolderPermissions.fromExpandedPermissions(folderExpandedPermissions);
		let uMask: UMask = UMask.fromFolderPermissions(folderPermissions);
		changeUserOptionsToReflectUMask(uMask);
		$('#results').text(uMask.value.join(''));
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
		const checked: number = (item.hasClass('btn-primary') && 1) || 0;
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
	const fileExpandedPermissions:number[][] = umask.filePermissions.getExpandedPermissions();
	for (let i = 0; i < fileExpandedPermissions.length; i++) {
		let permission = fileExpandedPermissions[i];
		for (let j = 0; j < permission.length; j++) {
			let p = permission[j];
			let index: number = fileExpandedPermissions.length * i + j;
			if (p === 1) {
				$('[data-type-file]').eq(index).removeClass('btn-default').addClass('btn-primary');
			} else {
				$('[data-type-file]').eq(index).removeClass('btn-primary').addClass('btn-default');
			}
		}
	}
	const folderExpandedPermissions:number[][] = umask.folderPermissions.getExpandedPermissions();
	for (let i = 0; i < folderExpandedPermissions.length; i++) {
		let permission = folderExpandedPermissions[i];
		for (let j = 0; j < permission.length; j++) {
			let p = permission[j];
			let index: number = folderExpandedPermissions.length * i + j;
			if (p === 1) {
				$('[data-type-folder]').eq(index).removeClass('btn-default').addClass('btn-primary');
			} else {
				$('[data-type-folder]').eq(index).removeClass('btn-primary').addClass('btn-default');
			}
		}
	}
}
