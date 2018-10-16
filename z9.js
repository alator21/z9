$(function() {

    $(document).on('change', 'input[type=checkbox]', function() {
        let permissionsScore = calcuatePermissionsScore();
        let umaskValue = calcuateUMaskValue(permissionsScore);
        $('#umaskValue').val(umaskValue);
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

function calcuateUMaskValue(score) {
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
    let full = [7,7,7];
    for (let i=0;i<full.length;i++){
    	val[i] = full[i] - val[i]
    }
    return val;
}