let api_key = document.getElementById("api_key").value;
let orgSlug = document.getElementById("org_slug").value;
const BASE_URL = 'https://api.bitrise.io/v0.1';
let pools = null;
let images = null;
let machine_types = null;
let machines = null;
let is_edit_pool = false;

const STAGES = {
    STAGE_TYPE_WARMUP: 'STAGE_TYPE_WARMUP',
    STAGE_TYPE_MAIN: 'STAGE_TYPE_MAIN'
}

const TYPES = {
    LOG_TYPE_STDOUT: 'LOG_TYPE_STDOUT',
    LOG_TYPE_STDERR: 'LOG_TYPE_STDERR'
}

function buildTree(data){
    let root = document.getElementById('tree_root');
    buildNode('Images', 1, root, data.images, 'stack', '', 'showImages');
    buildNode('Machine Types', 2, root, data.machine_types, 'name', '', 'showMachines');
    buildNode('Virtual Machines', 3, root, data.machines, 'id', 'createdAt', 'showVirtualMachines');
    buildNestedNode('Pools', 4, root, data.pools, 'id', 'machineTypeId', 'showPools');

    // Set up all list trees on the page.
    var listTreeToggles = document.querySelectorAll('.p-list-tree__toggle');
    for (var i = 0, l = listTreeToggles.length; i < l; i++) {
        setupListTreeToggle(listTreeToggles[i]);
    }
}

function hideAll(){
    document.getElementById('images_div').style.display = 'none';
    document.getElementById('machine_types_div').style.display = 'none';
    document.getElementById('machines_div').style.display = 'none';
    document.getElementById('pools_div').style.display = 'none';
    document.getElementById('pool_div').style.display = 'none';
    document.getElementById('edit_pool_div').style.display = 'none';
    document.getElementById('api_div').style.display = 'none';
    document.getElementById('machine_div').style.display = 'none';
}

function newPool(){
    is_edit_pool = false;
    hideAll();

    document.getElementById('pool_save').onclick = async function() { 
        await savePool(); 
        await loadPools();
        showPools();
    };

    document.getElementById('desiredReplicas').value = 1;
    document.getElementById('rollingUpdateMaxUnavailablePercentage').value = 50;
    document.getElementById('rebootIntervalMinutes').value = 60;
    document.getElementById('warmupScript').value = '';
    document.getElementById('startupScript').value = '';
    document.getElementById('useLocalCacheDisk').value = 'false';
    document.getElementById('metalEnabled').value = 'true';

    let html = '';
    images.images.forEach((image)=>{
        html += '<option value="'+image.id+'" '+(pool["imageId"] == image.stack ? 'selected' : '')+'>'+image.stack+'</option>';
    })
    document.getElementById('imageId').innerHTML = html;

    html = '';
    machine_types.machineTypes.forEach((machine_type)=>{
        html += '<option value="'+machine_type.id+'" '+(pool["machineTypeId"] == machine_type.name ? 'selected' : '')+'>'+machine_type.name+'</option>';
    })
    document.getElementById('machineTypeId').innerHTML = html;

    document.getElementById('edit_pool_div').style.display = '';
}

function showImages(){
    hideAll();
    document.getElementById('images_div').style.display = '';
}

function showMachines(){
    hideAll();
    document.getElementById('machine_types_div').style.display = '';
}

function showVirtualMachines(){
    hideAll();
    document.getElementById('machines_div').style.display = '';
}

function showPools(){
    hideAll();
    document.getElementById('pools_div').style.display = '';
}

function editPool(id){
    is_edit_pool = true;
    hideAll();
    document.getElementById('pool_id').innerHTML = id;
    document.getElementById('pool_save').onclick = async function() { 
        await savePool(id); 
        await loadPools();
        showPools();
    };
    let pool = pools.pools.find((pool)=>pool.id==id);
    document.getElementById('desiredReplicas').value = pool["desiredReplicas"];
    document.getElementById('rollingUpdateMaxUnavailablePercentage').value = pool["rollingUpdateMaxUnavailablePercentage"];
    document.getElementById('rebootIntervalMinutes').value = pool["rebootIntervalMinutes"];
    document.getElementById('warmupScript').value = pool["warmupScript"];
    document.getElementById('startupScript').value = pool["startupScript"];
    document.getElementById('useLocalCacheDisk').value = pool["useLocalCacheDisk"];
    document.getElementById('metalEnabled').value = pool["metalEnabled"];

    let html = '';
    images.images.forEach((image)=>{
        html += '<option value="'+image.id+'" '+(pool["imageId"] == image.stack ? 'selected' : '')+'>'+image.stack+'</option>';
    })
    document.getElementById('imageId').innerHTML = html;

    html = '';
    machine_types.machineTypes.forEach((machine_type)=>{
        html += '<option value="'+machine_type.id+'" '+(pool["machineTypeId"] == machine_type.name ? 'selected' : '')+'>'+machine_type.name+'</option>';
    })
    document.getElementById('machineTypeId').innerHTML = html;

    document.getElementById('edit_pool_div').style.display = '';
}

async function showPool(id){
    hideAll();
    document.getElementById('pool_edit').onclick = function() { editPool(id); };
    document.getElementById('pool_save').onclick = async function() { 
        await savePool(id); 
        await loadPools();
        showPools();
    };
    let pool = pools.pools.find((pool)=>pool.id==id);
    let image = images.images.find((image)=>image.id==pool.imageId)
    let machineType = machine_types.machineTypes.find((machine_type)=>machine_type.id==pool.machineTypeId)
    document.getElementById('pool_name').innerHTML = '(' + image.stack + ' - ' + machineType.name + ')';
    document.getElementById('pool_thead').innerHTML = '<tr></tr>';
    document.getElementById('pool_tbody').innerHTML = '';
    buildTable('pool', pool.machines);

    await loadLogs();


    document.getElementById('pool_div').style.display = '';
}

async function showMachine(id){
    hideAll();
    let machine = machines.machines.find((machine_type)=>machine_type.id==id)
    document.getElementById('machine_name').innerHTML = '(' + machine.id + ')';

    let machine_logs_main_stdout = await loadLogs(machine.id, STAGES.STAGE_TYPE_MAIN, TYPES.LOG_TYPE_STDOUT);
    let machine_logs_main_stderr = await loadLogs(machine.id, STAGES.STAGE_TYPE_MAIN, TYPES.LOG_TYPE_STDERR);
    let machine_logs_warmup_stdout = await loadLogs(machine.id, STAGES.STAGE_TYPE_WARMUP, TYPES.LOG_TYPE_STDOUT);
    let machine_logs_warmup_stderr = await loadLogs(machine.id, STAGES.STAGE_TYPE_WARMUP, TYPES.LOG_TYPE_STDERR);

    document.getElementById('machine_logs_main_stdout').innerHTML = machine_logs_main_stdout.message;
    document.getElementById('machine_logs_main_stderr').innerHTML = machine_logs_main_stderr.message;
    document.getElementById('machine_logs_warmup_stdout').innerHTML = machine_logs_warmup_stdout.message;
    document.getElementById('machine_logs_warmup_stderr').innerHTML = machine_logs_warmup_stderr.message;

    document.getElementById('machine_div').style.display = '';
}

function showAPI(){
    hideAll();
    document.getElementById('api_div').style.display = '';
}

async function savePool(id){
    let desiredReplicas = document.getElementById('desiredReplicas').value;
    let rollingUpdateMaxUnavailablePercentage = document.getElementById('rollingUpdateMaxUnavailablePercentage').value;
    let rebootIntervalMinutes = document.getElementById('rebootIntervalMinutes').value;
    let warmupScript = document.getElementById('warmupScript').value;
    let startupScript = document.getElementById('startupScript').value;
    let useLocalCacheDisk = document.getElementById('useLocalCacheDisk').value;
    let metalEnabled = document.getElementById('metalEnabled').value;

    let imageId = document.getElementById('imageId').value;
    let machineTypeId = document.getElementById('machineTypeId').value;

    if(is_edit_pool){
        let pool = pools.pools.find((pool)=>pool.id == id);
        let pool_patched = await patchPool(pool.id, {
            "desiredReplicas": parseInt(desiredReplicas),
            "rollingUpdateMaxUnavailablePercentage": parseInt(rollingUpdateMaxUnavailablePercentage),
            // "parallelReplicasUpdatePercentage": rebootIntervalMinutes,
            "rebootIntervalMinutes": parseInt(rebootIntervalMinutes),
            "warmupScript": btoa(warmupScript),
            "startupScript": btoa(startupScript),
            "imageId": imageId,
            "machineTypeId": machineTypeId,
            "useLocalCacheDisk": useLocalCacheDisk == 'true' ? true : false,
            "metalEnabled": metalEnabled == 'true' ? true : false
        });
        pools = await loadPools();
    } else {
        let pool_created = await createPool({
            "desiredReplicas": parseInt(desiredReplicas),
            "rollingUpdateMaxUnavailablePercentage": parseInt(rollingUpdateMaxUnavailablePercentage),
            // "parallelReplicasUpdatePercentage": rebootIntervalMinutes,
            "rebootIntervalMinutes": parseInt(rebootIntervalMinutes),
            "warmupScript": btoa(warmupScript),
            "startupScript": btoa(startupScript),
            "imageId": imageId,
            "machineTypeId": machineTypeId,
            "useLocalCacheDisk": useLocalCacheDisk == 'true' ? true : false,
            "metalEnabled": metalEnabled == 'true' ? true : false
        });
        pools = await loadPools();
    }
}
async function loadData(){
    images = await loadImages();
    machine_types = await loadMachineTypes();
    machines = await loadMachines();
    
    // let logs = loadLogs(machines);

    // let pool_created = createPool();

    pools = await loadPools();

    
    buildTree({
        images: images.images,
        machine_types: machine_types.machineTypes,
        machines: machines.machines,
        pools: pools.pools
    })

    // if(pools.length > 0){
    //     let pool_patched = patchPool(pools[0].id, {
    //     "desiredReplicas": 1,
    //     "rollingUpdateMaxUnavailablePercentage": 0,
    //     "parallelReplicasUpdatePercentage": 1,
    //     "rebootIntervalMinutes": 0,
    //     "warmupScript": "echo \"Hello World! warmupScript\"",
    //     "startupScript": "echo \"Hello World! startupScript\"",
    //     "imageId": "osx-xcode-14.0.x",
    //     "machineTypeId": "g2-m1-max.5core",
    //     "useLocalCacheDisk": true,
    //     "metalEnabled": true
    // });
    //     let pool_deleted = deletePool(pools[0].id);
    // }
}

function buildTable(tableElm, array, type){
    // Get the table element and tbody
    var table = document.getElementById(tableElm);
    var tbody = table.getElementsByTagName('tbody')[0];
    tbody.innerHTML = '';
    table.getElementsByTagName('tr')[0].innerHTML = '';

    // Loop through the array of JSON objects and create table rows and headers
    for (var i = 0; i < array.length; i++) {
      var element = array[i];
      var row = document.createElement('tr');
      if(type == 'pool'){
        row.onclick = ()=>{showPool(element.id)}
        row.classList.add('clickable');
      } else if (type == 'machine') {
        row.onclick = ()=>{showMachine(element.id)}
        row.classList.add('clickable');
      }

      // Loop through the properties of the JSON object and create table cells
      for (var prop in element) {
        if(prop == 'warmupScript' || prop == 'startupScript' || prop == 'machines'
        || prop == 'rollingUpdateMaxUnavailablePercentage'
        || prop == 'rebootIntervalMinutes'
        || prop == 'metalEnabled'
        || prop == 'isDeleted'
        || prop == 'useLocalCacheDisk'){
            continue;
        }
        if (i === 0) {
          // This is the first row, so create the headers
          var header = document.createElement('th');
          header.title=prop;
          header.innerText = prop;
          table.getElementsByTagName('tr')[0].appendChild(header);
        }
        
        var cell = document.createElement('td');
        if(prop == "mainStage" || prop == "warmupStage"){
            cell.innerText = element[prop].status.replace('MACHINE_STATUS_', '').replace('STAGE_STATUS_', '').replace('POOL_STATUS_', '');
        } else if(prop == "status"){
            cell.innerText = element[prop].replace('MACHINE_STATUS_', '').replace('STAGE_STATUS_', '').replace('POOL_STATUS_', '');
        } else if(prop == "createdAt" || prop == "updatedAt"){
            let date = element[prop].substring(0,10) + ' ' + element[prop].substring(11,19);
            cell.innerText = date;
        } else if(prop == "imageId"){
            let image = images.images.find((image)=>image.id==element[prop]);
            cell.innerText = image.stack;
        } else if(prop == "machineTypeId"){
            let machineType = machine_types.machineTypes.find((machine_type)=>machine_type.id==element[prop]);
            cell.innerText = machineType.name;
        } else {
            cell.innerText = element[prop];
        }
        row.appendChild(cell);
      }

      if(type == 'pool'){
        var header = document.createElement('th');
        header.title= 'Edit';
        header.innerText = 'Edit';
        table.getElementsByTagName('tr')[0].appendChild(header);

        var header2 = document.createElement('th');
        header2.title= 'Delete';
        header2.innerText = 'Delete';
        table.getElementsByTagName('tr')[0].appendChild(header2);

        var cell = document.createElement('td');
        cell.innerHTML = '<input style="cursor: pointer;" class="small_input" type="button" onclick="editPool(\''+element.id+'\')" value="Edit"></input>';
        row.appendChild(cell);

        var cell = document.createElement('td');
        cell.innerHTML = '<input style="cursor: pointer;background-color: #e12e2e; color: #fff;" class="small_input" type="button" onclick="deletePool(\''+element.id+'\')" value="Delete"></input>';
        row.appendChild(cell);
      }

      // Add the row to the tbody
      tbody.appendChild(row);
    }
}


function connect(hideError){
    api_key = document.getElementById("api_key").value;
    orgSlug = document.getElementById("org_slug").value;
    if(api_key && orgSlug){
        loadData();
    } else if(!hideError) {
        alert('Cannot connect without an Org Slug and Bitrise API Key!');
    }
}

generateUI();
connect(true);