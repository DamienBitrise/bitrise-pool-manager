let USE_DEMO_DATA = false;

async function get(path){
    const url = new URL(BASE_URL + path);
    try {
        let params = {
            method: 'GET',
            headers: {
                'accept': 'application/json',
                'Authorization': api_key,
            }
        };
        const response = await fetch(url, params);
        const data = await response.json();
        return data;
    } catch (error) {
        console.log('error:', error);
        return error;
    }
}

async function getChunks(path, processChunkedResponse, onChunkedResponseError, onComplete){
    const url = new URL(BASE_URL + path);
    try {
        let params = {
            method: 'GET',
            headers: {
                'accept': 'text/event-stream',
                'Authorization': api_key,
            }
        };
        fetch(url, params)
            .then((res)=>{processChunkedResponse(res, onComplete);})
            .catch(onChunkedResponseError);
    } catch (error) {
        console.log('error:', error);
        return error;
    }
}



async function del(path){
    const url = new URL(BASE_URL + path);
    try {
        let params = {
            method: 'DELETE',
            headers: {
                'accept': 'application/json',
                'Authorization': api_key,
            }
        };
        const response = await fetch(url, params);
        const data = await response.json();
        return data;
    } catch (error) {
        console.log('error:', error);
        return error;
    }
}

async function post(path, pool){
    const url = new URL(BASE_URL + path);

    try {
        let params = {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'Authorization': api_key,
            },
            body: JSON.stringify(pool)
        };
        const response = await fetch(url, params);
        const data = await response.json();
        return data;
    } catch (error) {
        console.log('error:', error);
        return error;
    }
}

async function patch(path, poll){
    const url = new URL(BASE_URL + path);

    try {
        let params = {
            method: 'PATCH',
            headers: {
                'accept': 'application/json',
                'Authorization': api_key,
            },
            body: JSON.stringify(poll)
        };
        const response = await fetch(url, params);
        const data = await response.json();
        return data;
    } catch (error) {
        console.log('error:', error);
        return error;
    }
}

async function loadImages(){
    // Images
    let images_path = `/platform/organization/${orgSlug}/images`;
    let images = await get(images_path);

    if(images && images.message){
        let red = 'rgb(128, 0, 0)';

        document.getElementById("polling1").style.color = red;
    
        let text = document.getElementById("polling2");
        text.innerHTML = 'Disconnected';
        text.style.color = red;

        let root = document.getElementById('tree_root');
        root.innerHTML = '';

        if(pollingTimeout){
            clearTimeout(pollingTimeout);
        }

        clearUI();

        connected = false;

        setTimeout(()=>{alert('Error: ' + images.message);}, 0)
    } else {
        connected = true;
        runAgain();
    }
    // console.log('GET Images: ', images);
    if(USE_DEMO_DATA){
        images = demo_images;
    }
    buildTable('images', images.images);
    return images;
}

async function loadMachineTypes(){
    // Machine Types
    let machine_types_path = `/platform/organization/${orgSlug}/machine_types`;
    let machine_types = await get(machine_types_path);
    // console.log('GET machine_types: ', machine_types);
    if(USE_DEMO_DATA){
        machine_types = demo_machine_types;
    }
    buildTable('machine_types', machine_types.machineTypes);
    return machine_types;
}

async function loadMachines(){
    // Machines
    let machines_path = `/platform/organization/${orgSlug}/machines?includeTerminated=false&includeRemoteAccess=true`;
    let machines = await get(machines_path);
    // console.log('GET Machines: ', machines);
    if(USE_DEMO_DATA){
        machines = demo_machines;
    }
    buildTable('machines', machines.machines, 'machine');
    return machines;
}

async function deleteMachine(machineId){
    // Pools DELETE
    let machines_edit_path = `/platform/organization/${orgSlug}/machines/${machineId}`;
    let machine_deleted = await del(machines_edit_path);
    // console.log('DELETE Machines: ', machine_deleted);
    machines = await loadMachines();
    buildTree({
        images: images.images,
        machine_types: machine_types.machineTypes,
        machines: machines.machines,
        pools: pools.pools
    })
    return machine_deleted;
}

async function deleteRemoteAccess(machineId){
    // Remote Access DELETE
    let remove_access_path = `/platform/organization/${orgSlug}/machines/${machineId}/remote_access`;
    let remote_access_deleted = await del(remove_access_path);
    machines = await loadMachines();
    showMachine(machineId);
    return remote_access_deleted;
}

async function remoteAccess(machineId){
    // Remote Access POST
    let remote_access_path = `/platform/organization/${orgSlug}/machines/${machineId}/remote_access`;
    let remote_access_created = await post(remote_access_path);
    machines = await loadMachines();
    showMachine(machineId);
    // console.log('POST Pool: ', remote_access_created);
    return remote_access_created;
}

async function loadLogs(log_path, processChunkedResponse, onChunkedResponseError, onComplete){
    let logs = await getChunks(log_path, processChunkedResponse, onChunkedResponseError, onComplete);
    return logs;
}

async function createPool(pool){
    // Pools POST
    let pools_path = `/platform/organization/${orgSlug}/pools`;
    let pool_created = await post(pools_path, pool);
    // console.log('POST Pool: ', pool_created);
    setTimeout(()=>{loadData()}, 1000);
    return pool_created;
}

async function loadPools(){
    // Pools GET
    let pools_path = `/platform/organization/${orgSlug}/pools?includeMachines=true&includeDeleted=false&includeScripts=true&includeTerminatedMachines=false&includeRemoteAccess=false`;
    let pools = await get(pools_path);
    // console.log('GET Pools: ', pools);
    if(USE_DEMO_DATA){
        pools = demo_pools;
    }
    buildTable('pools', pools.pools, 'pool');
    return pools;
}

async function patchPool(poolId, poll){
    // Pools PATCH
    let pools_edit_path = `/platform/organization/${orgSlug}/pools/${poolId}`;
    let pool_patched = patch(pools_edit_path, poll);
    console.log('PATCH Pools: ', pool_patched);
    return pool_patched;
}

async function deletePool(poolId){
    // Pools DELETE
    let pools_edit_path = `/platform/organization/${orgSlug}/pools/${poolId}`;
    let pool_deleted = await del(pools_edit_path);
    // console.log('DELETE Pools: ', pool_deleted);
    pools = await loadPools();
    buildTree({
        images: images.images,
        machine_types: machine_types.machineTypes,
        machines: machines.machines,
        pools: pools.pools
    })
    showPools();
    return pool_deleted;
}

function generateUI() {

    // Generate the UI for each API endpoint
    for (const path in swaggerSchema.paths) {
        for (const method in swaggerSchema.paths[path]) {
        const operation = swaggerSchema.paths[path][method];
        const uiElement = document.createElement("div");

        // Add a heading for the API endpoint
        const heading = document.createElement("h2");
        heading.innerText = `${method.toUpperCase()} ${path}`;
        uiElement.appendChild(heading);

        // Add a form for the API parameters
        const form = document.createElement("form");
        form.method = method;
        form.action = path;

        // // Add a heading for the API endpoint
        // const api_path = document.createElement("input");
        // api_path.value = path;
        // api_path.hidden = true;
        // form.appendChild(api_path);

        for (const parameter of operation.parameters || []) {
            const label = document.createElement("label");
            label.innerText = parameter.description || parameter.name;
            form.appendChild(label);

            if (parameter.in === "path") {
            // Add an input field for the path parameter
            const input = document.createElement("input");
            input.name = parameter.name;
            input.type = parameter.type;
            input.placeholder = parameter.description;
            if(parameter.name == "orgSlug"){
                input.value = orgSlug;
            }
            form.appendChild(input);
            } else if (parameter.in === "query") {
            if (parameter.type === "object") {
                // If the parameter is an object, add input fields for each attribute
                for (const property in parameter.schema.properties) {
                const label = document.createElement("label");
                label.innerText = parameter.schema.properties[property].description || property;
                form.appendChild(label);

                const input = document.createElement("input");
                input.name = property;
                input.type = parameter.schema.properties[property].type;
                input.placeholder = parameter.schema.properties[property].description;
                form.appendChild(input);
                }
            } else {
                // Add an input field for the query parameter
                const input = document.createElement("input");
                input.name = parameter.name;
                input.type = parameter.type;
                input.placeholder = parameter.description;
                form.appendChild(input);
            }
            } else if(parameter.name === "body"){
            // Add an input field for the request body (if applicable)
            const label = document.createElement("label");
            label.innerText = "Request Body";
            form.appendChild(label);

            const textarea = document.createElement("textarea");
            textarea.name = "requestBody";
            textarea.placeholder = "Enter request body here";
            form.appendChild(textarea);
            }
        }

        

        // Add a submit button to the form
        const submitButton = document.createElement("input");
        submitButton.type = "submit";
        submitButton.value = "Submit";

        const br = document.createElement("br");
        form.appendChild(br);

        form.appendChild(submitButton);

        // Add the form to the UI element
        uiElement.appendChild(form);

        // Add a response output textarea for the API call
        const responseOutput = document.createElement("textarea");
        responseOutput.readOnly = true;
        responseOutput.placeholder = "API response will be displayed here";
        uiElement.appendChild(responseOutput);

        // Add an event listener to the form to handle the submit button click
        form.addEventListener("submit", async (event) => {
            event.preventDefault();
            // const formData = new FormData(event.target);
            let api_url = event.target.action.replace('%7BorgSlug%7D', orgSlug).replace(event.target.baseURI, "https://" + swaggerSchema.host + '/');
            const url = new URL(api_url);
            // for (const [name, value] of formData) {
            //   url.searchParams.set(name, value);
            // }
            try {
                let params = {
                    method: event.target.method == 'post' ? 'POST' : 'GET',
                    headers: {
                    'accept': 'application/json',
                    'Authorization': api_key,
                    }
                };
                if(event.target.method == 'post'){
                    params.body = JSON.stringify({
                    "desiredReplicas": 1,
                    "rollingUpdateMaxUnavailablePercentage": 0,
                    "rebootIntervalMinutes": 0,
                    "warmupScript": "echo \"Hello World! warmupScript\"",
                    "startupScript": "echo \"Hello World! startupScript\"",
                    "imageId": "osx-xcode-14.0.x",
                    "machineTypeId": "g2-m1-max.5core",
                    "useLocalCacheDisk": true,
                    "metalEnabled": true
                    });
                }
                const response = await fetch(url, params);
                const data = await response.json();
                responseOutput.value = JSON.stringify(data, null, 2);
            } catch (error) {
                responseOutput.value = error.message;
            }
        });

        // Add the UI element to the page
        document.getElementById("apiUI").appendChild(uiElement);
        }
    }
}

let pollingInterval = 1000;
async function pollAPI(){
    // console.log('Polling for updates');
    let green1 = 'rgb(128, 204, 128)';
    let green2 = 'rgb(0, 128, 0)';
    let dot = document.getElementById("polling1");
    let color = dot.style.color;

    let text = document.getElementById("polling2");
    text.innerHTML = 'Connected';

    // flash the status when polling
    if(color == green1){
        dot.style.color = green2;
        text.style.color = green2;
    } else {
        dot.style.color = green1;
        text.style.color = green1;
    }
    // let poolLength = pools.pools.length;
    // let machineLength = machines.machineslength;
    pools = await loadPools();
    machines = await loadMachines();
    // if(poolLength != pools.pools.length || machineLength != machines.machines.length){
    //     buildTree({
    //         images: images.images,
    //         machine_types: machine_types.machineTypes,
    //         machines: machines.machines,
    //         pools: pools.pools
    //     })
    // }
}
let pollingTimeout = null;
async function runAgain(){
    clearTimeout(pollingTimeout);
    pollingTimeout = setTimeout(async ()=>{
        await pollAPI();
        runAgain()
    }, pollingInterval)
}

function onChunkedResponseComplete(result) {
    console.log('all done!', result)
  }
  
  function onChunkedResponseError(err) {
    console.error(err)
  }
  
  function processChunkedResponseWarmupSTDOUT(response, callback) {
    var text = '';
    var reader = response.body.getReader()
    var decoder = new TextDecoder();
    
    return readChunk();
  
    function readChunk() {
      return reader.read().then(appendChunks);
    }
  
    function appendChunks(result) {
      var chunk = decoder.decode(result.value || new Uint8Array, {stream: !result.done});
      text += chunk;
      let parts = text.split('{"result":');
      let remainingIndecies = parts.map((part, index)=>index);
      parts.forEach((part, index) => {
        if(part != ''){
            try{
                let parsed = '{"result":' + part;
                JSON.parse(parsed);
                callback(parsed);
                var index = remainingIndecies.indexOf(index);
                if (index !== -1) {
                    remainingIndecies.splice(index, 1);
                }
            } catch (err) {
                json = null;
            }
        } else {
            var index = remainingIndecies.indexOf(index);
            if (index !== -1) {
                remainingIndecies.splice(index, 1);
            }
        }
      });
      text = '';
      remainingIndecies.forEach((element)=>{
        text += '{"result":' + parts[element];
        // console.log('Adding back remaining index', text);
      })
      if (result.done) {
        callback(text);
        return text;
      } else {
        return readChunk();
      }
    }
  }

  function processChunkedResponseWarmupSTDERR(response, callback) {
    var text = '';
    var reader = response.body.getReader()
    var decoder = new TextDecoder();
    
    return readChunk();
  
    function readChunk() {
      return reader.read().then(appendChunks);
    }
  
    function appendChunks(result) {
      var chunk = decoder.decode(result.value || new Uint8Array, {stream: !result.done});
      text += chunk;
      let parts = text.split('{"result":');
      let remainingIndecies = parts.map((part, index)=>index);
      parts.forEach((part, index) => {
        if(part != ''){
            try{
                let parsed = '{"result":' + part;
                JSON.parse(parsed);
                callback(parsed);
                var index = remainingIndecies.indexOf(index);
                if (index !== -1) {
                    remainingIndecies.splice(index, 1);
                }
            } catch (err) {
                json = null;
            }
        } else {
            var index = remainingIndecies.indexOf(index);
            if (index !== -1) {
                remainingIndecies.splice(index, 1);
            }
        }
      });
      text = '';
      remainingIndecies.forEach((element)=>{
        text += '{"result":' + parts[element];
        // console.log('Adding back remaining index', text);
      })
      if (result.done) {
        callback(text);
        return text;
      } else {
        return readChunk();
      }
    }
  }

  function processChunkedResponseMainSTDOUT(response, callback) {
    var text = '';
    var reader = response.body.getReader()
    var decoder = new TextDecoder();
    
    return readChunk();
  
    function readChunk() {
      return reader.read().then(appendChunks);
    }
  
    function appendChunks(result) {
      var chunk = decoder.decode(result.value || new Uint8Array, {stream: !result.done});
      text += chunk;
      let parts = text.split('{"result":');
      let remainingIndecies = parts.map((part, index)=>index);
      parts.forEach((part, index) => {
        if(part != ''){
            try{
                let parsed = '{"result":' + part;
                JSON.parse(parsed);
                callback(parsed);
                var index = remainingIndecies.indexOf(index);
                if (index !== -1) {
                    remainingIndecies.splice(index, 1);
                }
            } catch (err) {
                json = null;
            }
        } else {
            var index = remainingIndecies.indexOf(index);
            if (index !== -1) {
                remainingIndecies.splice(index, 1);
            }
        }
      });
      text = '';
      remainingIndecies.forEach((element)=>{
        text += '{"result":' + parts[element];
        // console.log('Adding back remaining index', text);
      })
      if (result.done) {
        callback(text);
        return text;
      } else {
        return readChunk();
      }
    }
  }

  function processChunkedResponseMainSTDERR(response, callback) {
    var text = '';
    var reader = response.body.getReader()
    var decoder = new TextDecoder();
    
    return readChunk();
  
    function readChunk() {
      return reader.read().then(appendChunks);
    }
  
    function appendChunks(result) {
        var chunk = decoder.decode(result.value || new Uint8Array, {stream: !result.done});
        text += chunk;
        let parts = text.split('{"result":');
        let remainingIndecies = parts.map((part, index)=>index);
        parts.forEach((part, index) => {
          if(part != ''){
              try{
                  let parsed = '{"result":' + part;
                  JSON.parse(parsed);
                  callback(parsed);
                  var index = remainingIndecies.indexOf(index);
                  if (index !== -1) {
                      remainingIndecies.splice(index, 1);
                  }
              } catch (err) {
                  json = null;
              }
          } else {
              var index = remainingIndecies.indexOf(index);
              if (index !== -1) {
                  remainingIndecies.splice(index, 1);
              }
          }
        });
        text = '';
        remainingIndecies.forEach((element)=>{
          text += '{"result":' + parts[element];
        //   console.log('Adding back remaining index', text);
        })
        if (result.done) {
            callback(text);
            return text;
        } else {
            return readChunk();
        }
    }
  }