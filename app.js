let api_key = document.getElementById("api_key").value;
let orgSlug = document.getElementById("org_slug").value;
let connectedMainStdOutLogs = false;
let connectedMainStdErrLogs = false;
let json_buffer_main_stdout = "";
let json_buffer_main_stderr = "";
let json_buffer_warmup_stdout = "";
let json_buffer_warmup_stderr = "";
if(!orgSlug){
    let localStorageSlug = window.localStorage.getItem('orgSlug');
    if(localStorageSlug){
        orgSlug = localStorageSlug;
        document.getElementById("org_slug").value = orgSlug;
    }
} else {
    window.localStorage.setItem('orgSlug', orgSlug)
}
const BASE_URL = 'https://api.bitrise.io/v0.1';
let pools = null;
let images = null;
let machine_types = null;
let machines = null;
let is_edit_pool = false;
let connected = false;

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
    root.innerHTML = '';
    buildNestedNode('Pools', 4, root, data.pools, 'showMachine');
    buildNode('Virtual Machines', 3, root, data.machines, 'id', '', 'showVirtualMachines', 'showMachine');
    buildNode('Images', 1, root, data.images, 'stack', '', 'showImages');
    buildNode('Machine Types', 2, root, data.machine_types, 'name', '', 'showMachines');

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
    if(!connected){
        alert('You are not connected to the API');
        return;
    }
    is_edit_pool = false;
    hideAll();

    document.getElementById('pool_save').onclick = async function() { 
        let success = await savePool(); 
        if(success){
            pools = await loadPools();
            showPools();
        }
    };

    document.getElementById('desiredReplicas').value = 1;
    document.getElementById('rollingUpdateMaxUnavailablePercentage').value = 50;
    document.getElementById('rebootIntervalMinutes').value = 60;
    document.getElementById('useLocalCacheDisk').value = 'false';
    document.getElementById('metalEnabled').value = 'true';

    //loadGitHubActionsScripts();
    // loadGitLabRunnerScripts();
    loadBuildKiteScripts();

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

function loadGitLabRunnerScripts(){
    document.getElementById('warmupScript').value = 
`echo "Warm Up Script"

echo "cd /Users/vagrant/git"
cd /Users/vagrant/git

sudo curl --output /usr/local/bin/gitlab-runner "https://gitlab-runner-downloads.s3.amazonaws.com/latest/binaries/gitlab-runner-darwin-arm64"

sudo chmod +x /usr/local/bin/gitlab-runner

echo "ls -la"
ls -la

echo "gitlab-runner install"

/usr/local/bin/gitlab-runner install`;

    document.getElementById('startupScript').value = 
`echo "Start Up Script"

echo "cd /Users/vagrant/git"
cd /Users/vagrant/git

echo "ls -la"
ls -la

echo "gitlab-runner start"

/usr/local/bin/gitlab-runner start

echo "Running... Sleep 999"

sleep 9999`;
}

function loadGitHubActionsScripts(){
    document.getElementById('warmupScript').value = 
`echo "Warm Up Script"

echo "cd /Users/vagrant/git"
cd /Users/vagrant/git

echo "Downloading from https://github.com/actions/runner/releases/download/v2.303.0/actions-runner-osx-arm64-2.303.0.tar.gz"
curl -o actions-runner-osx-arm64-2.303.0.tar.gz -L https://github.com/actions/runner/releases/download/v2.303.0/actions-runner-osx-arm64-2.303.0.tar.gz

echo "ls -la"
ls -la

echo "chmod 777 ./actions-runner-osx-arm64-2.303.0.tar.gz"
chmod 777 ./actions-runner-osx-arm64-2.303.0.tar.gz

echo "ls -la"
ls -la

echo "Extract the installer"
sudo tar xzf ./actions-runner-osx-arm64-2.303.0.tar.gz

echo "ls -la"
ls -la
`;

    document.getElementById('startupScript').value = 
`echo "Start Up Script"

echo "cd /Users/vagrant/git"
cd /Users/vagrant/git

echo "ls -la"
ls -la

echo "chmod 777 ./config.sh"
chmod 777 ./config.sh

echo "ls -la"
ls -la

echo "Initialize GitHub Actions Runner"
./config.sh --url <REPO URL> --token <TOKEN>

echo "Last step, run it!"
./run.sh
`;
}

function loadBuildKiteScripts(){
    document.getElementById('warmupScript').value = 
`echo "Warm Up Script"

echo "cd /Users/vagrant/git"
cd /Users/vagrant/git

echo "ls -la"
ls -la

echo "Installing Homebrew"
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

echo "Adding brew to PATH"
export PATH=/opt/homebrew/bin:$PATH

echo "brew tap buildkite/buildkite && brew install buildkite-agent"
brew tap buildkite/buildkite && brew install buildkite-agent
`;

    document.getElementById('startupScript').value = 
`echo "Start Up Script"

echo "cd /Users/vagrant/git"
cd /Users/vagrant/git

echo "ls -la"
ls -la

echo "Adding brew to PATH"
export PATH=/opt/homebrew/bin:$PATH

echo "Starting BuildKite Agent"
buildkite-agent start --token <TOKEN>
`;
}

function updateTemplate(){
    let type = document.getElementById('template').value;
    if(type == 'buildkite'){
        loadBuildKiteScripts();
    } else if(type == 'github'){
        loadGitHubActionsScripts();
    } else if(type == 'gitlab'){
        loadGitLabRunnerScripts();
    }
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
        let success = await savePool(id); 
        if(success){
            pools = await loadPools();
            showPools();
        }
    };
    let pool = pools.pools.find((pool)=>pool.id==id);
    document.getElementById('desiredReplicas').value = pool["desiredReplicas"];
    document.getElementById('rollingUpdateMaxUnavailablePercentage').value = pool["rollingUpdateMaxUnavailablePercentage"];
    document.getElementById('rebootIntervalMinutes').value = pool["rebootIntervalMinutes"];
    document.getElementById('warmupScript').value = atob(pool["warmupScript"]);
    document.getElementById('startupScript').value = atob(pool["startupScript"]);
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

function clearUI(){
    // Pool Details
    document.getElementById('pool_name').innerHTML = '';
    document.getElementById('pool_thead').innerHTML = '<tr></tr>';
    document.getElementById('pool_tbody').innerHTML = '';
    document.getElementById('pool_details').innerHTML = '';

    // Machine Details
    document.getElementById('machine_logs_main_stdout').innerHTML = '';
    document.getElementById('machine_logs_main_stderr').innerHTML = '';
    document.getElementById('machine_logs_warmup_stdout').innerHTML = '';
    document.getElementById('machine_logs_warmup_stderr').innerHTML = '';
    document.getElementById('machine_name').innerHTML = '';
    document.getElementById('machine_details').innerHTML = '';

    // Pools
    var table1 = document.getElementById('pools');
    var tbody1 = table1.getElementsByTagName('tbody')[0];
    table1.getElementsByTagName('tr')[0].innerHTML = '';
    tbody1.innerHTML = '';
    var thead1 = table1.getElementsByTagName('thead')[0];
    thead1.innerHTML = '<tr></tr>';

    // Images
    var table2 = document.getElementById('images');
    var tbody2 = table2.getElementsByTagName('tbody')[0];
    table2.getElementsByTagName('tr')[0].innerHTML = '';
    tbody2.innerHTML = '';
    var thead2 = table2.getElementsByTagName('thead')[0];
    thead2.innerHTML = '<tr></tr>';

    // Machines
    var table3 = document.getElementById('machine_types');
    var tbody3 = table3.getElementsByTagName('tbody')[0];
    table3.getElementsByTagName('tr')[0].innerHTML = '';
    tbody3.innerHTML = '';
    var thead3 = table3.getElementsByTagName('thead')[0];
    thead3.innerHTML = '<tr></tr>';

    // Virtual Machines
    var table4 = document.getElementById('machines');
    var tbody4 = table4.getElementsByTagName('tbody')[0];
    table4.getElementsByTagName('tr')[0].innerHTML = '';
    tbody4.innerHTML = '';
    var thead4 = table4.getElementsByTagName('thead')[0];
    thead4.innerHTML = '<tr></tr>';
}
async function showPool(id){
    hideAll();
    document.getElementById('pool_edit').onclick = function() { editPool(id); };
    document.getElementById('pool_save').onclick = async function() { 
        let success = await savePool(id); 
        if(success){
            pools = await loadPools();
            showPools();
        }
    };
    let pool = pools.pools.find((pool)=>pool.id==id);
    let image = images.images.find((image)=>image.id==pool.imageId)
    let machineType = machine_types.machineTypes.find((machine_type)=>machine_type.id==pool.machineTypeId)
    document.getElementById('pool_name').innerHTML = '(' + image.stack + ' - ' + machineType.name + ')';
    document.getElementById('pool_thead').innerHTML = '<tr></tr>';
    document.getElementById('pool_tbody').innerHTML = '';
    document.getElementById('pool_details').innerHTML = JSON.stringify(pool, null, 2);
    buildTable('pool', pool.machines);

    document.getElementById('pool_div').style.display = '';
}

async function showMachine(id){
    hideAll();
    let machine = machines.machines.find((machine_type)=>machine_type.id==id)
    if(!machine){
        alert('Machine no longer exists reloading...');
        pools = await loadPools();
        buildTree({
            images: images.images,
            machine_types: machine_types.machineTypes,
            machines: machines.machines,
            pools: pools.pools
        })
        return;
    }
    document.getElementById('machine_name').innerHTML = '(' + machine.id + ')';

    document.getElementById('machine_details').innerHTML = JSON.stringify(machine, null, 2);

    document.getElementById('machine_div').style.display = '';
    
    let warmup_stdout = document.getElementById('machine_logs_warmup_stdout');
    let warmup_stderr = document.getElementById('machine_logs_warmup_stderr');

    warmup_stdout.innerHTML = 'Loading...';
    warmup_stderr.innerHTML = 'Loading...';

    let log_path = `/platform/organization/${orgSlug}/machines/${machine.id}/logs/${STAGES.STAGE_TYPE_WARMUP}/${TYPES.LOG_TYPE_STDOUT}`;

    warmup_stdout.innerHTML = '';
    loadLogs(log_path, (res)=>{ 
            processChunkedResponseWarmupSTDOUT(res, 
                (response)=>{
                    warmup_stdout.innerHTML = '';
                    let json = JSON.parse(response);
                    let formatted = json.result.logContent.replace('\n', '<br>').replace('\r', '<br>')
                    warmup_stdout.innerHTML += formatted;
                }
            );
        }, 
      (err) => {
        console.error(err)
      },
      (response)=>{
        let json = JSON.parse(response);
        let formatted = json.result.logContent.replace('\n', '<br>').replace('\r', '<br>')
        warmup_stdout.innerHTML += formatted;
    });

    let log_path2 = `/platform/organization/${orgSlug}/machines/${machine.id}/logs/${STAGES.STAGE_TYPE_WARMUP}/${TYPES.LOG_TYPE_STDERR}`;

    warmup_stderr.innerHTML = '';
    loadLogs(log_path2, (res)=>{
            processChunkedResponseWarmupSTDERR(res, 
                (response)=>{
                    warmup_stderr.innerHTML = '';
                    let json = JSON.parse(response);
                    let formatted = json.result.logContent.replace('\n', '<br>').replace('\r', '<br>')
                    warmup_stderr.innerHTML += formatted;
                }
            );
        }, 
        (err) => {
            console.error(err)
          },
          (response)=>{
        let json = JSON.parse(response);
        let formatted = json.result.logContent.replace('\n', '<br>').replace('\r', '<br>')
        warmup_stderr.innerHTML += formatted;
    })
    
    setInterval(()=>{
        if(!connectedMainStdErrLogs){
            loadMainStdErr(machine);
        }

        if(!connectedMainStdOutLogs){
            loadMainStdOut(machine);
        }
    }, 1000)

}

function loadMainStdErr(machine){
    let main_stderr = document.getElementById('machine_logs_main_stderr');
    main_stderr.innerHTML = 'Loading...';

    let log_path2 = `/platform/organization/${orgSlug}/machines/${machine.id}/logs/${STAGES.STAGE_TYPE_MAIN}/${TYPES.LOG_TYPE_STDERR}`;

    main_stderr.innerHTML = '';
    loadLogs(log_path2, (res)=>{ 
        processChunkedResponseMainSTDERR(res, 
            (response)=>{
                json = JSON.parse(response);
                connectedMainStdErrLogs = true;
                let formatted = json.result.logContent.replace('\n', '<br>').replace('\r', '<br>')
                main_stderr.innerHTML += formatted;
            })
        }, 
        (err) => {
            console.error(err)
          },
        (response)=>{
        main_stderr.innerHTML = '';

        json = JSON.parse(response);
        connectedMainStdErrLogs = true;
        let formatted = json.result.logContent.replace('\n', '<br>').replace('\r', '<br>')

        main_stderr.innerHTML += formatted;
    })
}


function loadMainStdOut(machine){
    let main_stdout = document.getElementById('machine_logs_main_stdout');
    main_stdout.innerHTML = 'Loading...';

    let log_path2 = `/platform/organization/${orgSlug}/machines/${machine.id}/logs/${STAGES.STAGE_TYPE_MAIN}/${TYPES.LOG_TYPE_STDOUT}`;

    main_stdout.innerHTML = '';
    loadLogs(log_path2, (res)=>{
        processChunkedResponseMainSTDOUT(res, (response)=>{
                json = JSON.parse(response);
                connectedMainStdOutLogs = true;
                let formatted = json.result.logContent.replace('\n', '<br>').replace('\r', '<br>')
                main_stdout.innerHTML += formatted;
            })
        }, 
        (err) => {
            console.error(err)
          },
        (response)=>{
        main_stdout.innerHTML = '';

        json = JSON.parse(response);
        connectedMainStdOutLogs = true;
        let formatted = json.result.logContent.replace('\n', '<br>').replace('\r', '<br>')
        main_stdout.innerHTML += formatted;
    })
}

function showAPI(){
    if(!connected){
        alert('You are not connected to the API');
        return;
    }
    hideAll();
    document.getElementById('api_div').style.display = '';
}

async function savePool(id){
    let warmupScript = document.getElementById('warmupScript').value;
    let startupScript = document.getElementById('startupScript').value;
    if(!warmupScript || !startupScript){
        alert('You must specify both a Warm Up & Start Up Script');
        return false;
    }
    let desiredReplicas = document.getElementById('desiredReplicas').value;
    let rollingUpdateMaxUnavailablePercentage = document.getElementById('rollingUpdateMaxUnavailablePercentage').value;
    let rebootIntervalMinutes = document.getElementById('rebootIntervalMinutes').value;
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

        loadData();
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
        loadData();
    }
    buildTree({
        images: images.images,
        machine_types: machine_types.machineTypes,
        machines: machines.machines,
        pools: pools.pools
    })
    return true;
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
    var thead = table.getElementsByTagName('thead')[0];
    tbody.innerHTML = '';
    thead.getElementsByTagName('tr')[0].innerHTML = '';

    if(array.length == 0){
        var row = document.createElement('tr');
        var cell = document.createElement('td');
        cell.innerHTML = 'No machines in pool';
        row.appendChild(cell);
        tbody.appendChild(row);
    }
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
        || prop == 'useLocalCacheDisk' 
        || prop == 'poolId'
        || prop == 'remoteAccess'
        || prop == 'id'){
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

        var cell1 = document.createElement('td');
        cell1.innerHTML = '<input style="cursor: pointer;" class="small_input" type="button" onclick="editPool(\''+element.id+'\')" value="Edit"></input>';
        row.appendChild(cell1);

        var cell2 = document.createElement('td');
        cell2.innerHTML = '<input style="cursor: pointer;background-color: #e12e2e; color: #ddd;" class="small_input" type="button" onclick="deletePool(\''+element.id+'\')" value="Delete"></input>';
        row.appendChild(cell2);
      } else if (type == 'machine'){
        if(element.remoteAccess && element.remoteAccess.sshCommand != ''){
            var cell2 = document.createElement('td');
            cell2.innerHTML = '<input style="cursor: pointer;background-color: #e12e2e; color: #ddd;" class="small_input" type="button" onclick="deleteRemoteAccess(\''+element.id+'\')" value="Disable"></input>';
            row.appendChild(cell2);
        } else {
            var cell2 = document.createElement('td');
            cell2.innerHTML = '<input style="cursor: pointer;" class="small_input" type="button" onclick="remoteAccess(\''+element.id+'\')" value="Enable"></input>';
            row.appendChild(cell2);
        }

        var cell1 = document.createElement('td');
        cell1.innerHTML = '<input style="cursor: pointer;background-color: #e12e2e; color: #ddd;" class="small_input" type="button" onclick="deleteMachine(\''+element.id+'\')" value="Delete"></input>';
        row.appendChild(cell1);
        
      }

      // Add the row to the tbody
      tbody.appendChild(row);
    }

    if(type == 'pool'){
        var header = document.createElement('th');
        header.title= 'Edit';
        header.innerText = 'Edit';
        thead.getElementsByTagName('tr')[0].appendChild(header);

        var header2 = document.createElement('th');
        header2.title= 'Delete';
        header2.innerText = 'Delete';
        thead.getElementsByTagName('tr')[0].appendChild(header2);
    } else if (type == 'machine'){
        var header = document.createElement('th');
        header.title= 'Remote Access';
        header.innerText = 'Remote Access';
        thead.getElementsByTagName('tr')[0].appendChild(header);

        var header2 = document.createElement('th');
        header2.title= 'Delete';
        header2.innerText = 'Delete';
        thead.getElementsByTagName('tr')[0].appendChild(header2);
    }
}


function connect(hideError){
    api_key = document.getElementById("api_key").value;
    orgSlug = document.getElementById("org_slug").value;
    
    if(api_key && orgSlug){
        loadData();
        window.localStorage.setItem('orgSlug', orgSlug)
    } else if(!hideError) {
        alert('Cannot connect without an Org Slug and Bitrise API Key!');
    }
}

generateUI();
// connect(true);