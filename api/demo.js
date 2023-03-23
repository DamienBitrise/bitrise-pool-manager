const demo_images = [{
    "id": "1",
    "clusterName": "ClusterA",
    "stack": "osx-xcode-14.0.x"
  },{
    "id": "2",
    "clusterName": "ClusterA",
    "stack": "osx-xcode-14.1.x"
  }];

const demo_machine_types = [{
    "id": "1",
    "clusterName": "ClusterA",
    "name": "g2-m1-max.5core",
    "cpuCores": 5,
    "memoryGb": 27
  },{
    "id": "2",
    "clusterName": "ClusterA",
    "name": "g2-m1-max.10core",
    "cpuCores": 10,
    "memoryGb": 54
  }];

const demo_machines = [{
    "id": "1",
    "poolId": "1",
    "status": "MACHINE_STATUS_UNKNOWN",
    "warmupStage": {
      "status": "STAGE_STATUS_PENDING",
      "startedAt": "2023-03-23T02:29:49.793Z",
      "finishedAt": "2023-03-23T02:29:49.793Z"
    },
    "mainStage": {
      "status": "STAGE_STATUS_PENDING",
      "startedAt": "2023-03-23T02:29:49.794Z",
      "finishedAt": "2023-03-23T02:29:49.794Z"
    },
    "createdAt": "2023-03-23T02:29:49.794Z",
    "updatedAt": "2023-03-23T02:29:49.794Z"
  },{
    "id": "2",
    "poolId": "1",
    "status": "MACHINE_STATUS_UNKNOWN",
    "warmupStage": {
      "status": "STAGE_STATUS_PENDING",
      "startedAt": "2023-03-23T02:29:49.793Z",
      "finishedAt": "2023-03-23T02:29:49.793Z"
    },
    "mainStage": {
      "status": "STAGE_STATUS_PENDING",
      "startedAt": "2023-03-23T02:29:49.794Z",
      "finishedAt": "2023-03-23T02:29:49.794Z"
    },
    "createdAt": "2023-03-23T02:29:49.794Z",
    "updatedAt": "2023-03-23T02:29:49.794Z"
  }];

const demo_pools = [{
    "id": "1",
    "desiredReplicas": 1,
    "rollingUpdateMaxUnavailablePercentage": 1,
    "rebootIntervalMinutes": 0,
    "warmupScript": "echo \"Hello World! warmupScript\"",
    "startupScript": "echo \"Hello World! startupScript\"",
    "imageId": "osx-xcode-14.0.x",
    "machineTypeId": "g2-m1-max.10core",
    "status": "POOL_STATUS_UNKNOWN",
    "useLocalCacheDisk": true,
    "metalEnabled": true,
    "isDeleted": false,
    "machines": [
        {
          "id": "1",
          "poolId": "1",
          "status": "MACHINE_STATUS_RUNNING",
          "warmupStage": {
            "status": "STAGE_STATUS_COMPLETED",
            "startedAt": "2023-03-23T04:29:01.293Z",
            "finishedAt": "2023-03-23T04:29:01.293Z"
          },
          "mainStage": {
            "status": "STAGE_STATUS_COMPLETED",
            "startedAt": "2023-03-23T04:29:01.293Z",
            "finishedAt": "2023-03-23T04:29:01.293Z"
          },
          "createdAt": "2023-03-23T04:29:01.293Z",
          "updatedAt": "2023-03-23T04:29:01.293Z"
        },
        {
          "id": "2",
          "poolId": "1",
          "status": "MACHINE_STATUS_UNKNOWN",
          "warmupStage": {
            "status": "STAGE_STATUS_PENDING",
            "startedAt": "2023-03-23T04:29:01.293Z",
            "finishedAt": "2023-03-23T04:29:01.293Z"
          },
          "mainStage": {
            "status": "STAGE_STATUS_PENDING",
            "startedAt": "2023-03-23T04:29:01.293Z",
            "finishedAt": "2023-03-23T04:29:01.293Z"
          },
          "createdAt": "2023-03-23T04:29:01.293Z",
          "updatedAt": "2023-03-23T04:29:01.293Z"
        }
    ],
    "createdAt": "2023-03-23T04:29:01.293Z",
    "updatedAt": "2023-03-23T04:29:01.293Z"
  },{
    "id": "2",
    "desiredReplicas": 1,
    "rollingUpdateMaxUnavailablePercentage": 1,
    "rebootIntervalMinutes": 0,
    "warmupScript": "echo \"Hello World! warmupScript\"",
    "startupScript": "echo \"Hello World! startupScript\"",
    "imageId": "osx-xcode-14.1.x",
    "machineTypeId": "g2-m1-max.10core",
    "status": "POOL_STATUS_UNKNOWN",
    "useLocalCacheDisk": true,
    "metalEnabled": true,
    "isDeleted": false,
    "machines": [
        {
          "id": "3",
          "poolId": "2",
          "status": "MACHINE_STATUS_RUNNING",
          "warmupStage": {
            "status": "STAGE_STATUS_COMPLETED",
            "startedAt": "2023-03-23T04:29:01.293Z",
            "finishedAt": "2023-03-23T04:29:01.293Z"
          },
          "mainStage": {
            "status": "STAGE_STATUS_COMPLETED",
            "startedAt": "2023-03-23T04:29:01.293Z",
            "finishedAt": "2023-03-23T04:29:01.293Z"
          },
          "createdAt": "2023-03-23T04:29:01.293Z",
          "updatedAt": "2023-03-23T04:29:01.293Z"
        },
        {
          "id": "4",
          "poolId": "2",
          "status": "MACHINE_STATUS_UNKNOWN",
          "warmupStage": {
            "status": "STAGE_STATUS_PENDING",
            "startedAt": "2023-03-23T04:29:01.293Z",
            "finishedAt": "2023-03-23T04:29:01.293Z"
          },
          "mainStage": {
            "status": "STAGE_STATUS_PENDING",
            "startedAt": "2023-03-23T04:29:01.293Z",
            "finishedAt": "2023-03-23T04:29:01.293Z"
          },
          "createdAt": "2023-03-23T04:29:01.293Z",
          "updatedAt": "2023-03-23T04:29:01.293Z"
        }
    ],
    "createdAt": "2023-03-23T04:29:01.293Z",
    "updatedAt": "2023-03-23T04:29:01.293Z"
  },{
    "id": "3",
    "desiredReplicas": 1,
    "rollingUpdateMaxUnavailablePercentage": 1,
    "rebootIntervalMinutes": 0,
    "warmupScript": "echo \"Hello World! warmupScript\"",
    "startupScript": "echo \"Hello World! startupScript\"",
    "imageId": "osx-xcode-14.0.x",
    "machineTypeId": "g2-m1-max.5core",
    "status": "POOL_STATUS_UNKNOWN",
    "useLocalCacheDisk": true,
    "metalEnabled": true,
    "isDeleted": false,
    "machines": [
      {
        "id": "5",
        "poolId": "3",
        "status": "MACHINE_STATUS_RUNNING",
        "warmupStage": {
          "status": "STAGE_STATUS_COMPLETED",
          "startedAt": "2023-03-23T04:29:01.293Z",
          "finishedAt": "2023-03-23T04:29:01.293Z"
        },
        "mainStage": {
          "status": "STAGE_STATUS_COMPLETED",
          "startedAt": "2023-03-23T04:29:01.293Z",
          "finishedAt": "2023-03-23T04:29:01.293Z"
        },
        "createdAt": "2023-03-23T04:29:01.293Z",
        "updatedAt": "2023-03-23T04:29:01.293Z"
      }
    ],
    "createdAt": "2023-03-23T04:29:01.293Z",
    "updatedAt": "2023-03-23T04:29:01.293Z"
  },{
    "id": "4",
    "desiredReplicas": 1,
    "rollingUpdateMaxUnavailablePercentage": 1,
    "rebootIntervalMinutes": 0,
    "warmupScript": "echo \"Hello World! warmupScript\"",
    "startupScript": "echo \"Hello World! startupScript\"",
    "imageId": "osx-xcode-14.1.x",
    "machineTypeId": "g2-m1-max.5core",
    "status": "POOL_STATUS_UNKNOWN",
    "useLocalCacheDisk": true,
    "metalEnabled": true,
    "isDeleted": false,
    "machines": [
      {
        "id": "6",
        "poolId": "4",
        "status": "MACHINE_STATUS_RUNNING",
        "warmupStage": {
          "status": "STAGE_STATUS_COMPLETED",
          "startedAt": "2023-03-23T04:29:01.293Z",
          "finishedAt": "2023-03-23T04:29:01.293Z"
        },
        "mainStage": {
          "status": "STAGE_STATUS_COMPLETED",
          "startedAt": "2023-03-23T04:29:01.293Z",
          "finishedAt": "2023-03-23T04:29:01.293Z"
        },
        "createdAt": "2023-03-23T04:29:01.293Z",
        "updatedAt": "2023-03-23T04:29:01.293Z"
      },
      {
        "id": "7",
        "poolId": "4",
        "status": "MACHINE_STATUS_STARTING",
        "warmupStage": {
          "status": "STAGE_STATUS_COMPLETED",
          "startedAt": "2023-03-23T04:29:01.293Z",
          "finishedAt": "2023-03-23T04:29:01.293Z"
        },
        "mainStage": {
          "status": "STAGE_STATUS_PENDING",
          "startedAt": "2023-03-23T04:29:01.293Z",
          "finishedAt": "2023-03-23T04:29:01.293Z"
        },
        "createdAt": "2023-03-23T04:29:01.293Z",
        "updatedAt": "2023-03-23T04:29:01.293Z"
      }
    ],
    "createdAt": "2023-03-23T04:29:01.293Z",
    "updatedAt": "2023-03-23T04:29:01.293Z"
  }];