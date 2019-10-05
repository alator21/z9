# z9

UMASK graphical editor + WIKI using Javascript.

Contributors are welcome!


UMASK Calculation Algorithm:

```
function calculateUMASKFolder(permissions){  //permissions = [x,x,x,x,x,x,x,x,x] where x = 0 or 1
	let fullFolderPermissions = [7,7,7];

	let permissionsCombined = combinePermissions(permissions); //permissionsCombined = [x,x,x] where 0<x<7
	
	for (let i=0; i<3; i++){
		fullFolderPermissions[i] -= permissionsCombined[i];
	}

	const umask = fullFolderPermissions;

	return umask; //  umask[x,x,x] where  0<x<7
}
```

```
function calculateUMASKFile(permissions){
	let fullFilePermissions = [6,6,6];

	let permissionsCombined = combinePermissions(permissions); //permissionsCombined = [x,x,x] where 0<x<7
	
	for (let i=0; i<3; i++){
		fullFilePermissions[i] -= permissionsCombined[i];
		if (permissionsCombined[i] % 2 == 1){
			return -1;
		}
	}

	const umask = fullFolderPermissions;

	return umask; //  umask[x,x,x] where  0<x<7
}
```

```
function combinePermissions(permissions){
	
	let combPermissions = [0,0,0];
	for (let i=0; i<permissions.length; i++){
		if (permissions[i][0])
			combPermissions += 4;
		if (permissions[i][1])
			combPermissions += 2;
		if (permissions[i][2])
			combPermissions += 1;
	}
}
```
