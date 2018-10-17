$(function() {

    $(document).on('change', 'input[type=checkbox]', function() {
        let permissionsScore = calcuatePermissionsScore();
        let umaskValue = calculateUMaskValue(permissionsScore);
        let umaskValueFolder = umaskValue[0];
        let umaskValueFile = umaskValue[1];

        let permissionsValue1 = calculatePermissions(umaskValueFolder);
        let permissionsFromFolderToFile =  permissionsValue1[1];

        let permissionsValue2 = calculatePermissions(umaskValueFile);
        let permissionsFromFileToFolder = permissionsValue2[0];
        
        let folder1text = `Then use umask: ${umaskValueFolder.join('')}`;
        let folder2text = `BE AWARE, files will then have ${permissionsNames(permissionsFromFolderToFile).join('')} permissions.`;

        let file1text;
        let file2text;
        if (umaskValueFile == -1){
            file1text = `Cant set umask with these values for files.`
            file2text = ``;
        }
        else{
            file1text = `Then use umask: ${umaskValueFile.join('')}`
            file2text = `BE AWARE, folders will then have ${permissionsNames(permissionsFromFileToFolder).join('')} permissions.`;
        }

        $('#umaskValueFolder').val(`${folder1text}`);
        $('#collapseFolder').text(`${folder2text}`);

        $('#umaskValueFile').val(`${file1text}`);
        $('#collapseFile').text(`${file2text}`);
        
    })
})


function calcuatePermissionsScore() {
    let checkBoxesLength = $('input[type=checkbox]').length;
    let permissionsScore = [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0]
    ];

    for (let i = 0; i < checkBoxesLength; i++) {
        let item = $('input[type=checkbox]').eq(i);
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
                        permissionsScore[0][0] = checked;
                        break;
                    case 'write':
                        permissionsScore[0][1] = checked;
                        break;
                    case 'execute':
                        permissionsScore[0][2] = checked;
                        break;
                    default:
                        break;
                }
                break;
            case 'group':
                switch (permission) {
                    case 'read':
                        permissionsScore[1][0] = checked;
                        break;
                    case 'write':
                        permissionsScore[1][1] = checked;
                        break;
                    case 'execute':
                        permissionsScore[1][2] = checked;
                        break;
                    default:
                        break;
                }
                break;
            case 'others':
                switch (permission) {
                    case 'read':
                        permissionsScore[2][0] = checked;
                        break;
                    case 'write':
                        permissionsScore[2][1] = checked;
                        break;
                    case 'execute':
                        permissionsScore[2][2] = checked;
                        break;
                    default:
                        break;
                }
                break;
            default:
                break;
        }
    }
    return permissionsScore;
}

function calculateUMaskValue(score) {
    let val = [0, 0, 0];
    for (let i = 0; i < score.length; i++) {
        if (score[i][0] == 1) {
            val[i] += 4;
        }

        if (score[i][1] == 1) {
            val[i] += 2;
        }

        if (score[i][2] == 1) {
            val[i] += 1;
        }
    }
    let full1 = [7, 7, 7];
    let full2 = [6, 6, 6];
    for (let i = 0; i < full1.length; i++) {
        full1[i] -= val[i]
        full2[i] -= val[i];
        if (val[i] % 2 == 1) {
            full2[i] = -1;
        }
    }
    for (let i = 0; i < full2.length; i++) {
        if (full2[i] < 0) {
            full2 = -1;
            break;
        }
    }

    return [full1, full2];
}

function calculatePermissions(umask) {
    let full1 = [7, 7, 7];
    let full2 = [6, 6, 6];

    for (let i = 0; i < umask.length; i++) {
        full1[i] -= umask[i];
        full2[i] -= umask[i];
        if (full2[i] < 0){
            full2[i] = 0;
        }
    }
    return [full1,full2];
}

function permissionsNames(permissions){
    let retval = [];

    for (let permission of permissions){
        retval.push('|')
        switch(permission){
            case 7:
                retval.push('r');
                retval.push('w');
                retval.push('x');
                break;
            case 6:
                retval.push('r');
                retval.push('w');
                retval.push('-');
                break;
            case 5:
                retval.push('r');
                retval.push('-');
                retval.push('x');
                break;
            case 4:
                retval.push('r');
                retval.push('-');
                retval.push('-');
                break;
            case 3:
                retval.push('-');
                retval.push('w');
                retval.push('x');
                break;
            case 2:
                retval.push('-');
                retval.push('w');
                retval.push('-');
                break;
            case 1:
                retval.push('-');
                retval.push('-');
                retval.push('x');
                break;
            case 0:
                retval.push('-');
                retval.push('-');
                retval.push('-');
                break;
        }
    }
    retval.push('|');
    return retval;
}