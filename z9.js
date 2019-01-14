'use strict';
$(function() {

    $(document).on('change', '[data-type-folder]', function() {
        let folderExpandedPermissions = calculateFileOrFolderExpandedPermissionByTheUserOptions('[data-type-folder]');
        let folderCombinedPermissions = calculateCombinedPermissionsByExpandedPermissions(folderExpandedPermissions);
        let folderUMaskValue = calculateFolderUMaskValueByCombinedPermissions(folderCombinedPermissions);

        let fileCombinedPermissions = calculateFileCombinedPermissionsByUMaskValue(folderUMaskValue);
        let fileExpandedPermissions = calculateExpandedPermissionsByCombinedPermissions(fileCombinedPermissions);
        changeTheUserOptionsBasedOnExpandedPermissions(fileExpandedPermissions, '[data-type-file]');

        let resultText = `Generated UMASK value: ${folderUMaskValue.join('')}.`;

        $('#results').text(resultText);

    });
});

$(document).on('change', '[data-type-file]', function() {
    let fileExpandedPermissions = calculateFileOrFolderExpandedPermissionByTheUserOptions('[data-type-file]');
    let fileCombinedPermissions = calculateCombinedPermissionsByExpandedPermissions(fileExpandedPermissions);
    let fileUMaskValue = calculateFileUMaskValueByCombinedPermissions(fileCombinedPermissions);

    let resultText = ``;

    if (fileUMaskValue !== -1){
    	let folderCombinedPermissions = calculateFolderCombinedPermissionsByUMaskValue(fileUMaskValue);
    	let folderExpandedPermissions = calculateExpandedPermissionsByCombinedPermissions(folderCombinedPermissions);
    	changeTheUserOptionsBasedOnExpandedPermissions(folderExpandedPermissions, '[data-type-folder]');
    	resultText = `Generated UMASK value: ${fileUMaskValue.join('')}.`;
    }
    else{
    	console.log('Something is wrong!');
    	resultText(`Something is wrong!`);
    }
    $('#results').text(resultText);
});

// (FOLDER) | UMASK <-> COMBINED PERMISSIONS
function calculateFolderUMaskValueByCombinedPermissions(combinedPermissions) {
    let folderUMask = [7, 7, 7];
    for (let i = 0; i < folderUMask.length; i++) {
        folderUMask[i] -= combinedPermissions[i];
    }
    return folderUMask;
}

function calculateFolderCombinedPermissionsByUMaskValue(umask) {
    let folderCombinedPermissions = [7, 7, 7];

    for (let i = 0; i < umask.length; i++) {
        folderCombinedPermissions[i] -= umask[i];
    }
    return folderCombinedPermissions;
}
// (FOLDER) | UMASK <-> COMBINED PERMISSIONS



//----------------------------------------------------------



// (FILE) | UMASK <-> COMBINED PERMISSIONS
function calculateFileUMaskValueByCombinedPermissions(combinedPermissions) {
    let fileUMask = [6, 6, 6];
    for (let i = 0; i < fileUMask.length; i++) {
        fileUMask[i] -= combinedPermissions[i];
        if (combinedPermissions[i] % 2 == 1) {
            fileUMask[i] = -1;
        }
    }
    for (let i = 0; i < fileUMask.length; i++) {
        if (fileUMask[i] < 0) {
            fileUMask = -1;
            break;
        }
    }
    return fileUMask;
}

function calculateFileCombinedPermissionsByUMaskValue(umask) {
    let fileCombinedPermissions = [6, 6, 6];

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
    return fileCombinedPermissions;
}
// (FILE) | UMASK <-> COMBINED PERMISSIONS



//----------------------------------------------------------



// EXPANDED PERMISSIONS <-> COMBINED PERMISSIONS
function calculateCombinedPermissionsByExpandedPermissions(expandedPermissions) {
    let combinedPermissions = [0, 0, 0];
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

function calculateExpandedPermissionsByCombinedPermissions(combinedPermissions) {
    let expandedPermissions = [];

    for (let i = 0; i < combinedPermissions.length; i++) {
        let permission = combinedPermissions[i];
        switch (permission) {
            case 7:
                expandedPermissions.push(1);
                expandedPermissions.push(1);
                expandedPermissions.push(1);
                break;
            case 6:
                expandedPermissions.push(1);
                expandedPermissions.push(1);
                expandedPermissions.push(0);
                break;
            case 5:
                expandedPermissions.push(1);
                expandedPermissions.push(0);
                expandedPermissions.push(1);
                break;
            case 4:
                expandedPermissions.push(1);
                expandedPermissions.push(0);
                expandedPermissions.push(0);
                break;
            case 3:
                expandedPermissions.push(0);
                expandedPermissions.push(1);
                expandedPermissions.push(1);
                break;
            case 2:
                expandedPermissions.push(0);
                expandedPermissions.push(1);
                expandedPermissions.push(0);
                break;
            case 1:
                expandedPermissions.push(0);
                expandedPermissions.push(0);
                expandedPermissions.push(1);
                break;
            case 0:
                expandedPermissions.push(0);
                expandedPermissions.push(0);
                expandedPermissions.push(0);
                break;
        }
    }
    return expandedPermissions;
}
// EXPANDED PERMISSIONS <-> COMBINED PERMISSIONS




//----------------------------------------------------------



// EXPANDED PERMISSIONS - UI
function calculateFileOrFolderExpandedPermissionByTheUserOptions(type) {
    let checkBoxesLength = $(type).length;
    let expandedPermissions = [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0]
    ];

    for (let i = 0; i < checkBoxesLength; i++) {
        let item = $(type).eq(i);
        let checked = item.is(':checked');
        let group = item.attr('data-group');
        let permission = item.attr('data-permission');
        if (checked) {
            checked = 1;
        } else {
            checked = 0;
        }

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

function changeTheUserOptionsBasedOnExpandedPermissions(expandedPermissions, type) {
    for (let i = 0; i < expandedPermissions.length; i++) {
        let permission = expandedPermissions[i];
        if (permission) {
            $(type).eq(i).prop('checked', true);
        } else {
            $(type).eq(i).prop('checked', false);
        }
    }
}

// EXPANDED PERMISSIONS - UI