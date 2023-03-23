const api_key = document.getElementById("api_key").value;
const orgSlug = document.getElementById("org_slug").value;
const BASE_URL = 'https://api.bitrise.io/v0.1';
let pools = null;
let images = null;
let machine_types = null;
let machines = null;

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
    hideAll();
    document.getElementById('pool_id').innerHTML = id;
    document.getElementById('pool_save').onclick = function() { savePool(id); };
    let pool = pools.find((pool)=>pool.id==id);
    document.getElementById('desiredReplicas').value = pool["desiredReplicas"];
    document.getElementById('rollingUpdateMaxUnavailablePercentage').value = pool["rollingUpdateMaxUnavailablePercentage"];
    document.getElementById('rebootIntervalMinutes').value = pool["rebootIntervalMinutes"];
    document.getElementById('warmupScript').value = pool["warmupScript"];
    document.getElementById('startupScript').value = pool["startupScript"];
    document.getElementById('useLocalCacheDisk').value = pool["useLocalCacheDisk"];
    document.getElementById('metalEnabled').value = pool["metalEnabled"];

    let html = '';
    images.forEach((image)=>{
        html += '<option value="'+image.id+'" '+(pool["imageId"] == image.stack ? 'selected' : '')+'>'+image.stack+'</option>';
    })
    document.getElementById('imageId').innerHTML = html;

    html = '';
    machine_types.forEach((machine_type)=>{
        html += '<option value="'+machine_type.id+'" '+(pool["machineTypeId"] == machine_type.name ? 'selected' : '')+'>'+machine_type.name+'</option>';
    })
    document.getElementById('machineTypeId').innerHTML = html;

    document.getElementById('edit_pool_div').style.display = '';
}

function showPool(id){
    hideAll();
    document.getElementById('pool_edit').onclick = function() { editPool(id); };
    document.getElementById('pool_save').onclick = function() { savePool(id); };
    let pool = pools.find((pool)=>pool.id==id);
    document.getElementById('pool_thead').innerHTML = '<tr></tr>';
    document.getElementById('pool_tbody').innerHTML = '';
    buildTable('pool', pool.machines);


    document.getElementById('pool_div').style.display = '';
}

function showAPI(){
    hideAll();
    document.getElementById('api_div').style.display = '';
}

function savePool(id){
    let desiredReplicas = document.getElementById('desiredReplicas').value;
    let rollingUpdateMaxUnavailablePercentage = document.getElementById('rollingUpdateMaxUnavailablePercentage').value;
    let rebootIntervalMinutes = document.getElementById('rebootIntervalMinutes').value;
    let warmupScript = document.getElementById('warmupScript').value;
    let startupScript = document.getElementById('startupScript').value;
    let useLocalCacheDisk = document.getElementById('useLocalCacheDisk').value;
    let metalEnabled = document.getElementById('metalEnabled').value;

    let pool_patched = patchPool(pools.find((pool)=>pool.id == id).id, {
        "desiredReplicas": desiredReplicas,
        "rollingUpdateMaxUnavailablePercentage": rollingUpdateMaxUnavailablePercentage,
        "parallelReplicasUpdatePercentage": rebootIntervalMinutes,
        "rebootIntervalMinutes": 0,
        "warmupScript": warmupScript
            .replace(/\\n/g, "\\n")
            .replace(/\\'/g, "\\'")
            .replace(/\\"/g, '\\"')
            .replace(/\\&/g, "\\&")
            .replace(/\\r/g, "\\r")
            .replace(/\\t/g, "\\t")
            .replace(/\\b/g, "\\b")
            .replace(/\\f/g, "\\f"),
        "startupScript": startupScript
            .replace(/\\n/g, "\\n")
            .replace(/\\'/g, "\\'")
            .replace(/\\"/g, '\\"')
            .replace(/\\&/g, "\\&")
            .replace(/\\r/g, "\\r")
            .replace(/\\t/g, "\\t")
            .replace(/\\b/g, "\\b")
            .replace(/\\f/g, "\\f"),
        "imageId": "osx-xcode-14.0.x",
        "machineTypeId": "g2-m1-max.5core",
        "useLocalCacheDisk": useLocalCacheDisk == 'true' ? true : false,
        "metalEnabled": metalEnabled == 'true' ? true : false
    });
}
function loadData(){
    images = loadImages();
    machine_types = loadMachineTypes();
    machines = loadMachines();
    
    // let logs = loadLogs(machines);

    // let pool_created = createPool();

    pools = loadPools();

    
    buildTree({
        images,
        machine_types,
        machines,
        pools
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

function buildTable(tableElm, array, edit){
    // Get the table element and tbody
    var table = document.getElementById(tableElm);
    var tbody = table.getElementsByTagName('tbody')[0];

    // Loop through the array of JSON objects and create table rows and headers
    for (var i = 0; i < array.length; i++) {
      var element = array[i];
      var row = document.createElement('tr');

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
        } else {
            cell.innerText = element[prop];
        }
        row.appendChild(cell);
      }

      if(edit){
        var cell = document.createElement('td');
        cell.innerHTML = '<input class="small_input" type="button" onclick="editPool('+element.id+')" value="Edit"></input>';
        row.appendChild(cell);
      }

      // Add the row to the tbody
      tbody.appendChild(row);
    }
}

generateUI();
loadData();