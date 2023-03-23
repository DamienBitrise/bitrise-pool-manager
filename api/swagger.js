const swaggerSchema = {
    "swagger":"2.0",
    "info":{
       "title":"Bitrise Platform API",
       "version":"1.0.0"
    },
    "tags":[
       {
          "name":"PlatformService"
       }
    ],
    "host":"api.bitrise.io/v0.1",
    "schemes":[
       "https"
    ],
    "consumes":[
       "application/json"
    ],
    "produces":[
       "application/json"
    ],
    "paths":{
       "/platform/organization/{orgSlug}/images":{
          "get":{
             "summary":"List all of the available images to create machines from.",
             "operationId":"PlatformService_ListImages",
             "responses":{
                "200":{
                   "description":"A successful response.",
                   "schema":{
                      "$ref":"#/definitions/v1ListImagesResponse"
                   }
                },
                "default":{
                   "description":"An unexpected error response.",
                   "schema":{
                      "$ref":"#/definitions/rpcStatus"
                   }
                }
             },
             "parameters":[
                {
                   "name":"orgSlug",
                   "description":"Identifier (slug) of the organization to list available images for.",
                   "in":"path",
                   "required":true,
                   "type":"string"
                }
             ],
             "tags":[
                "PlatformService"
             ]
          }
       },
       "/platform/organization/{orgSlug}/machine_types":{
          "get":{
             "summary":"List all of the available machine types to create machines from.",
             "operationId":"PlatformService_ListMachineTypes",
             "responses":{
                "200":{
                   "description":"A successful response.",
                   "schema":{
                      "$ref":"#/definitions/v1ListMachineTypesResponse"
                   }
                },
                "default":{
                   "description":"An unexpected error response.",
                   "schema":{
                      "$ref":"#/definitions/rpcStatus"
                   }
                }
             },
             "parameters":[
                {
                   "name":"orgSlug",
                   "description":"Identifier (slug) of the organization to list available machine types for.",
                   "in":"path",
                   "required":true,
                   "type":"string"
                }
             ],
             "tags":[
                "PlatformService"
             ]
          }
       },
       "/platform/organization/{orgSlug}/machines":{
          "get":{
             "summary":"List all machines created.",
             "operationId":"PlatformService_ListMachines",
             "responses":{
                "200":{
                   "description":"A successful response.",
                   "schema":{
                      "$ref":"#/definitions/v1ListMachinesResponse"
                   }
                },
                "default":{
                   "description":"An unexpected error response.",
                   "schema":{
                      "$ref":"#/definitions/rpcStatus"
                   }
                }
             },
             "parameters":[
                {
                   "name":"orgSlug",
                   "description":"Identifier (slug) of the organization to list existing machines for.",
                   "in":"path",
                   "required":true,
                   "type":"string"
                },
                {
                   "name":"includeTerminated",
                   "description":"Also include machines that are already terminated|failed.",
                   "in":"query",
                   "required":false,
                   "type":"boolean"
                }
             ],
             "tags":[
                "PlatformService"
             ]
          }
       },
       "/platform/organization/{orgSlug}/machines/{machineId}":{
          "delete":{
             "summary":"Delete a machine.",
             "operationId":"PlatformService_DeleteMachine",
             "responses":{
                "200":{
                   "description":"A successful response.",
                   "schema":{
                      "$ref":"#/definitions/v1DeleteMachineResponse"
                   }
                },
                "default":{
                   "description":"An unexpected error response.",
                   "schema":{
                      "$ref":"#/definitions/rpcStatus"
                   }
                }
             },
             "parameters":[
                {
                   "name":"orgSlug",
                   "description":"Identifier (slug) of the organization to delete a machine for.",
                   "in":"path",
                   "required":true,
                   "type":"string"
                },
                {
                   "name":"machineId",
                   "description":"Identified (UUID) of the machine to delete.",
                   "in":"path",
                   "required":true,
                   "type":"string"
                }
             ],
             "tags":[
                "PlatformService"
             ]
          }
       },
       "/platform/organization/{orgSlug}/machines/{machineId}/{stage}/{type}":{
          "get":{
             "summary":"Get logs of a machine.\nHint: `unbuffer curl ... | jq -r .result.logContent` for human readable logs.",
             "operationId":"PlatformService_GetMachineLogs",
             "responses":{
                "200":{
                   "description":"A successful response.(streaming responses)",
                   "schema":{
                      "type":"object",
                      "properties":{
                         "result":{
                            "$ref":"#/definitions/v1GetMachineLogsResponse"
                         },
                         "error":{
                            "$ref":"#/definitions/rpcStatus"
                         }
                      },
                      "title":"Stream result of v1GetMachineLogsResponse"
                   }
                },
                "default":{
                   "description":"An unexpected error response.",
                   "schema":{
                      "$ref":"#/definitions/rpcStatus"
                   }
                }
             },
             "parameters":[
                {
                   "name":"orgSlug",
                   "description":"Identifier (slug) of the organization to get machine logs for.",
                   "in":"path",
                   "required":true,
                   "type":"string"
                },
                {
                   "name":"machineId",
                   "description":"Identified (UUID) of the machine to get the logs of.",
                   "in":"path",
                   "required":true,
                   "type":"string"
                },
                {
                   "name":"stage",
                   "description":"Stage of the machine to get the logs of (warmup/main).",
                   "in":"path",
                   "required":true,
                   "type":"string",
                   "enum":[
                      "STAGE_TYPE_WARMUP",
                      "STAGE_TYPE_MAIN"
                   ]
                },
                {
                   "name":"type",
                   "description":"Type of the log to get (stdout/stderr).",
                   "in":"path",
                   "required":true,
                   "type":"string",
                   "enum":[
                      "LOG_TYPE_STDOUT",
                      "LOG_TYPE_STDERR"
                   ]
                }
             ],
             "tags":[
                "PlatformService"
             ]
          }
       },
       "/platform/organization/{orgSlug}/pools":{
          "get":{
             "summary":"List all of the existing pools.",
             "operationId":"PlatformService_ListPools",
             "responses":{
                "200":{
                   "description":"A successful response.",
                   "schema":{
                      "$ref":"#/definitions/v1ListPoolsResponse"
                   }
                },
                "default":{
                   "description":"An unexpected error response.",
                   "schema":{
                      "$ref":"#/definitions/rpcStatus"
                   }
                }
             },
             "parameters":[
                {
                   "name":"orgSlug",
                   "description":"Identifier (slug) of the organization to list existing pools for.",
                   "in":"path",
                   "required":true,
                   "type":"string"
                },
                {
                   "name":"includeMachines",
                   "description":"Also include machines created by the pool in the response.",
                   "in":"query",
                   "required":false,
                   "type":"boolean"
                },
                {
                   "name":"includeDeleted",
                   "description":"Also include deleted pools (not just active ones) in the response.",
                   "in":"query",
                   "required":false,
                   "type":"boolean"
                },
                {
                   "name":"includeScripts",
                   "description":"Also include scripts in the response (they might contain sensitive data).",
                   "in":"query",
                   "required":false,
                   "type":"boolean"
                },
                {
                   "name":"includeTerminatedMachines",
                   "description":"Also include machines that are already terminated|failed affects only when include_machines = true.",
                   "in":"query",
                   "required":false,
                   "type":"boolean"
                }
             ],
             "tags":[
                "PlatformService"
             ]
          },
          "post":{
             "summary":"Create a new pool.",
             "operationId":"PlatformService_CreatePool",
             "responses":{
                "200":{
                   "description":"A successful response.",
                   "schema":{
                      "$ref":"#/definitions/v1CreatePoolResponse"
                   }
                },
                "default":{
                   "description":"An unexpected error response.",
                   "schema":{
                      "$ref":"#/definitions/rpcStatus"
                   }
                }
             },
             "parameters":[
                {
                   "name":"orgSlug",
                   "description":"Identifier (slug) of the organization to create a new pool for.",
                   "in":"path",
                   "required":true,
                   "type":"string"
                },
                {
                   "name":"body",
                   "description":"Details of the pool to be created.",
                   "in":"body",
                   "required":true,
                   "schema":{
                      "$ref":"#/definitions/v1PoolRequest"
                   }
                }
             ],
             "tags":[
                "PlatformService"
             ]
          }
       },
       "/platform/organization/{orgSlug}/pools/{poolId}":{
          "delete":{
             "summary":"Delete an existing pool.",
             "operationId":"PlatformService_DeletePool",
             "responses":{
                "200":{
                   "description":"A successful response.",
                   "schema":{
                      "$ref":"#/definitions/v1DeletePoolResponse"
                   }
                },
                "default":{
                   "description":"An unexpected error response.",
                   "schema":{
                      "$ref":"#/definitions/rpcStatus"
                   }
                }
             },
             "parameters":[
                {
                   "name":"orgSlug",
                   "description":"Identifier (slug) of the organization to delete a pool for.",
                   "in":"path",
                   "required":true,
                   "type":"string"
                },
                {
                   "name":"poolId",
                   "description":"Identified (UUID) of the pool to delete.",
                   "in":"path",
                   "required":true,
                   "type":"string"
                }
             ],
             "tags":[
                "PlatformService"
             ]
          },
          "patch":{
             "summary":"Update an existing pool.",
             "operationId":"PlatformService_UpdatePool",
             "responses":{
                "200":{
                   "description":"A successful response.",
                   "schema":{
                      "$ref":"#/definitions/v1UpdatePoolResponse"
                   }
                },
                "default":{
                   "description":"An unexpected error response.",
                   "schema":{
                      "$ref":"#/definitions/rpcStatus"
                   }
                }
             },
             "parameters":[
                {
                   "name":"orgSlug",
                   "description":"Identifier (slug) of the organization to update an existing pool for.",
                   "in":"path",
                   "required":true,
                   "type":"string"
                },
                {
                   "name":"poolId",
                   "description":"Identified (UUID) of the pool to update.",
                   "in":"path",
                   "required":true,
                   "type":"string"
                },
                {
                   "name":"body",
                   "description":"The pool fields to be updated.",
                   "in":"body",
                   "required":true,
                   "schema":{
                      "$ref":"#/definitions/v1PoolRequestUpdate"
                   }
                }
             ],
             "tags":[
                "PlatformService"
             ]
          }
       }
    },
    "definitions":{
       "protobufAny":{
          "type":"object",
          "properties":{
             "@type":{
                "type":"string"
             }
          },
          "additionalProperties":{
             
          }
       },
       "rpcStatus":{
          "type":"object",
          "properties":{
             "code":{
                "type":"integer",
                "format":"int32"
             },
             "message":{
                "type":"string"
             },
             "details":{
                "type":"array",
                "items":{
                   "$ref":"#/definitions/protobufAny"
                }
             }
          }
       },
       "v1CreatePoolResponse":{
          "type":"object",
          "properties":{
             "pool":{
                "$ref":"#/definitions/v1Pool",
                "description":"Details of the created pool."
             }
          },
          "description":"Response of CreatePool remote procedure call."
       },
       "v1DeleteMachineResponse":{
          "type":"object",
          "description":"Response of DeleteMachine remote procedure call."
       },
       "v1DeletePoolResponse":{
          "type":"object",
          "properties":{
             "pool":{
                "$ref":"#/definitions/v1Pool",
                "description":"Details of the deleted pool."
             }
          },
          "description":"Response of DeletePool remote procedure call."
       },
       "v1GetMachineLogsResponse":{
          "type":"object",
          "properties":{
             "logContent":{
                "type":"string",
                "description":"Contents of the log message."
             }
          },
          "description":"Response of GetMachineLogs remote procedure call."
       },
       "v1Image":{
          "type":"object",
          "properties":{
             "id":{
                "type":"string",
                "description":"Unique identifier (UUID) of the image."
             },
             "clusterName":{
                "type":"string",
                "description":"The cluster where this image is available in."
             },
             "stack":{
                "type":"string",
                "description":"Human-readable name of the image."
             }
          },
          "description":"Machines are created from images.\nAn image is a pre-built environment, having tools installed, configured."
       },
       "v1ListImagesResponse":{
          "type":"object",
          "properties":{
             "images":{
                "type":"array",
                "items":{
                   "$ref":"#/definitions/v1Image"
                },
                "description":"List of avalable images."
             }
          },
          "description":"Response of ListImages remote procedure call."
       },
       "v1ListMachineTypesResponse":{
          "type":"object",
          "properties":{
             "machineTypes":{
                "type":"array",
                "items":{
                   "$ref":"#/definitions/v1MachineType"
                },
                "description":"List of available machine types."
             }
          },
          "description":"Response of ListMachineTypes remote procedure call."
       },
       "v1ListMachinesResponse":{
          "type":"object",
          "properties":{
             "machines":{
                "type":"array",
                "items":{
                   "$ref":"#/definitions/v1Machine"
                },
                "description":"List of existing machines."
             }
          },
          "description":"Response of ListMachines remote procedure call."
       },
       "v1ListPoolsResponse":{
          "type":"object",
          "properties":{
             "pools":{
                "type":"array",
                "items":{
                   "$ref":"#/definitions/v1Pool"
                },
                "description":"List of existing pools."
             }
          },
          "description":"Response of ListPools remote procedure call."
       },
       "v1LogType":{
          "type":"string",
          "enum":[
             "LOG_TYPE_STDOUT",
             "LOG_TYPE_STDERR"
          ],
          "default":"LOG_TYPE_STDOUT",
          "description":"Type of the log stream.\n\n - LOG_TYPE_STDOUT: Standard output.\n - LOG_TYPE_STDERR: Standard error."
       },
       "v1Machine":{
          "type":"object",
          "properties":{
             "id":{
                "type":"string",
                "description":"Identified (UUID) of the machine."
             },
             "poolId":{
                "type":"string",
                "description":"Identified (UUID) of the pool this machine belongs to."
             },
             "status":{
                "$ref":"#/definitions/v1MachineStatus",
                "description":"Current status of the machine."
             },
             "warmupStage":{
                "$ref":"#/definitions/v1Stage",
                "description":"State of the warmup stage."
             },
             "mainStage":{
                "$ref":"#/definitions/v1Stage",
                "description":"State of the main stage."
             },
             "createdAt":{
                "type":"string",
                "format":"date-time",
                "description":"The time when this machine was created at."
             },
             "updatedAt":{
                "type":"string",
                "format":"date-time",
                "description":"The time when this machine was last updated at."
             }
          },
          "description":"Current state of a machine."
       },
       "v1MachineStatus":{
          "type":"string",
          "enum":[
             "MACHINE_STATUS_UNKNOWN",
             "MACHINE_STATUS_PENDING",
             "MACHINE_STATUS_RUNNING",
             "MACHINE_STATUS_OUT_OF_DATE",
             "MACHINE_STATUS_TERMINATED",
             "MACHINE_STATUS_FAILED"
          ],
          "default":"MACHINE_STATUS_UNKNOWN",
          "description":"Represents the current status of a machine.\n\n - MACHINE_STATUS_UNKNOWN: We don't know what the status of the machine is\n(probably due to it's node not responding).\n - MACHINE_STATUS_PENDING: Waiting to be scheduled/started.\n - MACHINE_STATUS_RUNNING: Running, up to date.\n - MACHINE_STATUS_OUT_OF_DATE: Running, but with an out of date configuration.\n - MACHINE_STATUS_TERMINATED: Terminated succesfully.\n - MACHINE_STATUS_FAILED: Terminated with failure."
       },
       "v1MachineType":{
          "type":"object",
          "properties":{
             "id":{
                "type":"string",
                "description":"Unique identifier (UUID) of the machine type."
             },
             "clusterName":{
                "type":"string",
                "description":"The cluster where this machine type is available in."
             },
             "name":{
                "type":"string",
                "description":"Human-readable name of the machine type."
             },
             "cpuCores":{
                "type":"integer",
                "format":"int32",
                "description":"The number of CPU cores to allocate for the machine."
             },
             "memoryGb":{
                "type":"integer",
                "format":"int32",
                "description":"The amount of memory to allocate for the machine in gigabytes."
             }
          },
          "description":"Possible hardware resources of machines are pre-defined via machine types."
       },
       "v1Pool":{
          "type":"object",
          "properties":{
             "id":{
                "type":"string",
                "description":"Unique identifier (UUID) of the pool."
             },
             "desiredReplicas":{
                "type":"integer",
                "format":"int32",
                "description":"The desired number of machines to keep running at all times from this\npool configuration."
             },
             "rollingUpdateMaxUnavailablePercentage":{
                "type":"integer",
                "format":"int32",
                "description":"Configurable rollout % for cases when machines need to be rebooted or recreated.\nLower setting enables slower rollout and more machines available where higher setting enables more aggressive rollout.\nIf nothing is provided, the default rollout setting (equal to 1 machine) will be used making sure there is zero downtime for the pool."
             },
             "rebootIntervalMinutes":{
                "type":"integer",
                "format":"int32",
                "description":"Reboot machines after this interval elapses (to keep macOS stable).\nThis operation will be executed in a rolling update-like manner, making\nsure there is zero downtime for the pool."
             },
             "warmupScript":{
                "type":"string",
                "description":"RFC 4648 Base64 encoded warmup script.\nInstallation of missing dependencies should happen here.\nThe script should exit with a non-zero exit code in case of failures not\nto kick off the startup script in a malformed environment."
             },
             "startupScript":{
                "type":"string",
                "description":"RFC 4648 Base64 encoded startup script.\nThe actual work to be done (eg. running build agent) should happen here."
             },
             "imageId":{
                "type":"string",
                "description":"Unique identifier (UUID) of the image to create machines from."
             },
             "machineTypeId":{
                "type":"string",
                "description":"Unique identifier (UUID) of the machine type to create machines from."
             },
             "status":{
                "$ref":"#/definitions/v1PoolStatus",
                "description":"The current status of the pool."
             },
             "useLocalCacheDisk":{
                "type":"boolean",
                "description":"If local cache disk should be used or not.\nWhen enabled, the machine state after the warmup stage is persisted.\nThis enables a faster warmup stage on the next machine creation (if the\nnext machine is created on a host where a local cache disk is present for\nthe given pool configuration).\nThe warmup script must be idempotent to support this feature."
             },
             "metalEnabled":{
                "type":"boolean",
                "description":"If the Metal API should be enabled or not. Must be enabled for M1 machines."
             },
             "isDeleted":{
                "type":"boolean",
                "description":"Flags if the pool got deleted."
             },
             "machines":{
                "type":"array",
                "items":{
                   "$ref":"#/definitions/v1Machine"
                },
                "description":"List of machines created from this pool configuration."
             },
             "createdAt":{
                "type":"string",
                "format":"date-time",
                "description":"The time when this pool was created."
             },
             "updatedAt":{
                "type":"string",
                "format":"date-time",
                "description":"The time when this pool configuration was last modified."
             }
          },
          "description":"A pool of machines to keep running at all times.\nA desired state should be declared using this configuration.\nThe system will make sure the current state matches this desired state at all\ntimes (continuously recovering from failures, handling periodic reboots, etc)."
       },
       "v1PoolRequest":{
          "type":"object",
          "properties":{
             "desiredReplicas":{
                "type":"integer",
                "format":"int32",
                "description":"The desired number of machines to keep running at all times from this\npool configuration."
             },
             "rollingUpdateMaxUnavailablePercentage":{
                "type":"integer",
                "format":"int32",
                "description":"Configurable rollout % for cases when machines need to be rebooted or recreated.\nLower setting enables slower rollout and more machines available where higher setting enables more aggressive rollout.\nIf nothing is provided, the default rollout setting (equal to 1 machine) will be used making sure there is zero downtime for the pool."
             },
             "rebootIntervalMinutes":{
                "type":"integer",
                "format":"int32",
                "description":"Reboot machines after this interval elapses (to keep macOS stable).\nThis operation will be executed in a rolling update-like manner, making\nsure there is zero downtime for the pool.\n0 value means the machines are not automatically rebooted by the system."
             },
             "warmupScript":{
                "type":"string",
                "description":"RFC 4648 Base64 encoded warmup script.\nInstallation of missing dependencies should happen here."
             },
             "startupScript":{
                "type":"string",
                "description":"RFC 4648 Base64 encoded startup script.\nThe actual work to be done (eg. running build agent) should happen here."
             },
             "imageId":{
                "type":"string",
                "description":"Unique identifier (UUID) of the image to create machines from."
             },
             "machineTypeId":{
                "type":"string",
                "description":"Unique identifier (UUID) of the machine type to create machines from."
             },
             "useLocalCacheDisk":{
                "type":"boolean",
                "description":"If local cache disk should be used or not.\nWhen enabled, the machine state after the warmup stage is persisted.\nThis enables a faster warmup stage on the next machine creation (if the\nnext machine is created on a host where a local cache disk is present for\nthe given pool configuration).\nThe warmup script must be idempotent to support this feature."
             },
             "metalEnabled":{
                "type":"boolean",
                "description":"If the Metal API should be enabled or not. Must be enabled for M1 machines."
             }
          },
          "description":"Configuration of the pool on the CreatePool remote procedure call."
       },
       "v1PoolRequestUpdate":{
          "type":"object",
          "properties":{
             "desiredReplicas":{
                "type":"integer",
                "format":"int32",
                "description":"The desired number of machines to keep running at all times from this\npool configuration."
             },
             "rollingUpdateMaxUnavailablePercentage":{
                "type":"integer",
                "format":"int32",
                "description":"Configurable rollout % for cases when machines need to be rebooted or recreated.\nLower setting enables slower rollout and more machines available where higher setting enables more aggressive rollout."
             },
             "rebootIntervalMinutes":{
                "type":"integer",
                "format":"int32",
                "description":"Reboot machines after this interval elapses (to keep macOS stable).\nThis operation will be executed in a rolling update-like manner, making\nsure there is zero downtime for the pool."
             },
             "warmupScript":{
                "type":"string",
                "description":"RFC 4648 Base64 encoded warmup script.\nInstallation of missing dependencies should happen here."
             },
             "startupScript":{
                "type":"string",
                "description":"RFC 4648 Base64 encoded startup script.\nThe actual work to be done (eg. running build agent) should happen here."
             },
             "imageId":{
                "type":"string",
                "description":"Unique identifier (UUID) of the image to create machines from."
             },
             "machineTypeId":{
                "type":"string",
                "description":"Unique identifier (UUID) of the machine type to create machines from."
             },
             "useLocalCacheDisk":{
                "type":"boolean",
                "description":"If local cache disk should be used or not.\nWhen enabled, the machine state after the warmup stage is persisted.\nThis enables a faster warmup stage on the next machine creation (if the\nnext machine is created on a host where a local cache disk is present for\nthe given pool configuration).\nThe warmup script must be idempotent to support this feature."
             },
             "metalEnabled":{
                "type":"boolean",
                "description":"If the Metal API should be enabled or not. Must be enabled for M1 machines."
             }
          },
          "description":"Fields of the pool to update on the UpdatePool remote procedure call.\nThis is an incremental update, therefore fields not provided will be kept\non their current value and fiels provided will be set accordingly."
       },
       "v1PoolStatus":{
          "type":"string",
          "enum":[
             "POOL_STATUS_UNKNOWN",
             "POOL_STATUS_UPDATING",
             "POOL_STATUS_UP_TO_DATE"
          ],
          "default":"POOL_STATUS_UNKNOWN",
          "description":"Represents the current status of a pool.\n\n - POOL_STATUS_UNKNOWN: The pool status in unknown.\n - POOL_STATUS_UPDATING: The pool is not up to date, it's being updated\n(reconciled to the desired state) now.\n - POOL_STATUS_UP_TO_DATE: The pool is up to date (its current state matches the desired state)."
       },
       "v1Stage":{
          "type":"object",
          "properties":{
             "status":{
                "$ref":"#/definitions/v1StageStatus",
                "description":"The status of this stage."
             },
             "startedAt":{
                "type":"string",
                "format":"date-time",
                "description":"The time when this stage was started at."
             },
             "finishedAt":{
                "type":"string",
                "format":"date-time",
                "description":"The time when this stage was finished at."
             }
          },
          "description":"Current state of a stage of a machine."
       },
       "v1StageStatus":{
          "type":"string",
          "enum":[
             "STAGE_STATUS_PENDING",
             "STAGE_STATUS_RUNNING",
             "STAGE_STATUS_FAILED",
             "STAGE_STATUS_SKIPPED",
             "STAGE_STATUS_COMPLETE"
          ],
          "default":"STAGE_STATUS_PENDING",
          "description":"Represents the current status of a stage.\n\n - STAGE_STATUS_PENDING: Waiting to be scheduled/started.\n - STAGE_STATUS_RUNNING: Running.\n - STAGE_STATUS_FAILED: Finished with failure.\n - STAGE_STATUS_SKIPPED: Skipped (probably due to the machine being terminated in a previous stage).\n - STAGE_STATUS_COMPLETE: Finished succesfully."
       },
       "v1StageType":{
          "type":"string",
          "enum":[
             "STAGE_TYPE_WARMUP",
             "STAGE_TYPE_MAIN"
          ],
          "default":"STAGE_TYPE_WARMUP",
          "description":"Identifies the stage the machine is currently in.\n\n - STAGE_TYPE_WARMUP: The machine is warming up (typically installing dependencies).\n - STAGE_TYPE_MAIN: The machine is already warmed up, doing work (typically running a build agent)."
       },
       "v1UpdatePoolResponse":{
          "type":"object",
          "properties":{
             "pool":{
                "$ref":"#/definitions/v1Pool",
                "description":"Details of the updated pool."
             }
          },
          "description":"Response of UpdatePool remote procedure call."
       }
    },
    "securityDefinitions":{
       "bearer":{
          "type":"apiKey",
          "description":"Bitrise PAT token without prefix (no Bearer): \u003ctoken\u003e",
          "name":"Authorization",
          "in":"header"
       }
    },
    "security":[
       {
          "bearer":[
             
          ]
       }
    ]
 };