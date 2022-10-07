# @dxos/hello-template

DXOS 'hello world' application template.

## Dependency Graph

```mermaid
%%{ init: {'flowchart':{'curve':'basis'}} }%%

flowchart LR

%% Classes
classDef def fill:#fff,stroke:#333,stroke-width:1px
classDef root fill:#fff,stroke:#333,stroke-width:4px

%% Nodes

subgraph templates [templates]
  style templates fill:#ded1ba,stroke:#fff
  dxos/hello-template("@dxos/hello-template"):::root
  click dxos/hello-template "dxos/dxos/tree/main/apps/templates/hello/docs"
end

subgraph sdk [sdk]
  style sdk fill:#dddeba,stroke:#fff
  dxos/client("@dxos/client"):::def
  click dxos/client "dxos/dxos/tree/main/packages/sdk/client/docs"
  dxos/config("@dxos/config"):::def
  click dxos/config "dxos/dxos/tree/main/packages/sdk/config/docs"
  dxos/react-client("@dxos/react-client"):::def
  click dxos/react-client "dxos/dxos/tree/main/packages/sdk/react-client/docs"
  dxos/react-components("@dxos/react-components"):::def
  click dxos/react-components "dxos/dxos/tree/main/packages/sdk/react-components/docs"
  dxos/react-toolkit("@dxos/react-toolkit"):::def
  click dxos/react-toolkit "dxos/dxos/tree/main/packages/sdk/react-toolkit/docs"
  dxos/react-registry-client("@dxos/react-registry-client"):::def
  click dxos/react-registry-client "dxos/dxos/tree/main/packages/sdk/react-registry-client/docs"
  dxos/registry-client("@dxos/registry-client"):::def
  click dxos/registry-client "dxos/dxos/tree/main/packages/sdk/registry-client/docs"
end

subgraph common [common]
  style common fill:#debac2,stroke:#fff
  dxos/codec-protobuf("@dxos/codec-protobuf"):::def
  click dxos/codec-protobuf "dxos/dxos/tree/main/packages/common/codec-protobuf/docs"
  dxos/protocols("@dxos/protocols"):::def
  click dxos/protocols "dxos/dxos/tree/main/packages/common/protocols/docs"
  dxos/crypto("@dxos/crypto"):::def
  click dxos/crypto "dxos/dxos/tree/main/packages/common/crypto/docs"
  dxos/rpc("@dxos/rpc"):::def
  click dxos/rpc "dxos/dxos/tree/main/packages/core/mesh/rpc/docs"
  dxos/random-access-storage("@dxos/random-access-storage"):::def
  click dxos/random-access-storage "dxos/dxos/tree/main/packages/common/random-access-storage/docs"
  dxos/rpc-tunnel("@dxos/rpc-tunnel"):::def
  click dxos/rpc-tunnel "dxos/dxos/tree/main/packages/core/mesh/rpc-tunnel/docs"
  dxos/react-async("@dxos/react-async"):::def
  click dxos/react-async "dxos/dxos/tree/main/packages/common/react-async/docs"

  subgraph common-excluded [ ]
    style common-excluded fill:#debac2,stroke:#333,stroke-dasharray:5 5
    dxos/async("@dxos/async"):::def
    click dxos/async "dxos/dxos/tree/main/packages/common/async/docs"
    dxos/debug("@dxos/debug"):::def
    click dxos/debug "dxos/dxos/tree/main/packages/common/debug/docs"
    dxos/util("@dxos/util"):::def
    click dxos/util "dxos/dxos/tree/main/packages/common/util/docs"
    dxos/log("@dxos/log"):::def
    click dxos/log "dxos/dxos/tree/main/packages/common/log/docs"
  end
end

subgraph echo [echo]
  style echo fill:#b3cae6,stroke:#fff
  dxos/echo-db("@dxos/echo-db"):::def
  click dxos/echo-db "dxos/dxos/tree/main/packages/echo/echo-db/docs"
  dxos/feed-store("@dxos/feed-store"):::def
  click dxos/feed-store "dxos/dxos/tree/main/packages/echo/feed-store/docs"
  dxos/echo-protocol("@dxos/echo-protocol"):::def
  click dxos/echo-protocol "dxos/dxos/tree/main/packages/echo/echo-protocol/docs"
  dxos/model-factory("@dxos/model-factory"):::def
  click dxos/model-factory "dxos/dxos/tree/main/packages/echo/model-factory/docs"
  dxos/object-model("@dxos/object-model"):::def
  click dxos/object-model "dxos/dxos/tree/main/packages/echo/object-model/docs"
end

subgraph halo [halo]
  style halo fill:#cabade,stroke:#fff
  dxos/credentials("@dxos/credentials"):::def
  click dxos/credentials "dxos/dxos/tree/main/packages/halo/credentials/docs"
end

subgraph mesh [mesh]
  style mesh fill:#b3e6c0,stroke:#fff
  dxos/mesh-protocol("@dxos/mesh-protocol"):::def
  click dxos/mesh-protocol "dxos/dxos/tree/main/packages/mesh/mesh-protocol/docs"
  dxos/messaging("@dxos/messaging"):::def
  click dxos/messaging "dxos/dxos/tree/main/packages/mesh/messaging/docs"
  dxos/network-manager("@dxos/network-manager"):::def
  click dxos/network-manager "dxos/dxos/tree/main/packages/mesh/network-manager/docs"
  dxos/protocol-plugin-presence("@dxos/protocol-plugin-presence"):::def
  click dxos/protocol-plugin-presence "dxos/dxos/tree/main/packages/mesh/protocol-plugin-presence/docs"
  dxos/broadcast("@dxos/broadcast"):::def
  click dxos/broadcast "dxos/dxos/tree/main/packages/mesh/broadcast/docs"
  dxos/protocol-plugin-replicator("@dxos/protocol-plugin-replicator"):::def
  click dxos/protocol-plugin-replicator "dxos/dxos/tree/main/packages/mesh/protocol-plugin-replicator/docs"
  dxos/protocol-plugin-rpc("@dxos/protocol-plugin-rpc"):::def
  click dxos/protocol-plugin-rpc "dxos/dxos/tree/main/packages/mesh/protocol-plugin-rpc/docs"
end

subgraph bot [bot]
  style bot fill:#c2b3e6,stroke:#fff
  dxos/bot-factory-client("@dxos/bot-factory-client"):::def
  click dxos/bot-factory-client "dxos/dxos/tree/main/packages/bot/bot-factory-client/docs"
end

%% Links
linkStyle default stroke:#333,stroke-width:1px
dxos/client --> dxos/config
dxos/protocols --> dxos/codec-protobuf
dxos/util --> dxos/protocols
dxos/client --> dxos/echo-db
dxos/credentials --> dxos/crypto
dxos/crypto --> dxos/protocols
dxos/credentials --> dxos/feed-store
dxos/credentials --> dxos/mesh-protocol
dxos/echo-protocol --> dxos/credentials
dxos/messaging --> dxos/rpc
dxos/echo-db --> dxos/network-manager
dxos/network-manager --> dxos/credentials
dxos/network-manager --> dxos/messaging
dxos/network-manager --> dxos/protocol-plugin-presence
dxos/protocol-plugin-presence --> dxos/broadcast
dxos/broadcast --> dxos/crypto
dxos/protocol-plugin-presence --> dxos/mesh-protocol
dxos/echo-db --> dxos/object-model
dxos/object-model --> dxos/echo-protocol
dxos/object-model --> dxos/model-factory
dxos/echo-db --> dxos/protocol-plugin-replicator
dxos/protocol-plugin-replicator --> dxos/mesh-protocol
dxos/echo-db --> dxos/random-access-storage
dxos/client --> dxos/rpc-tunnel
dxos/rpc-tunnel --> dxos/rpc
dxos/hello-template --> dxos/react-client
dxos/react-client --> dxos/bot-factory-client
dxos/bot-factory-client --> dxos/protocol-plugin-rpc
dxos/protocol-plugin-rpc --> dxos/messaging
dxos/protocol-plugin-rpc --> dxos/mesh-protocol
dxos/react-client --> dxos/client
dxos/react-client --> dxos/react-async
dxos/hello-template --> dxos/react-components
dxos/react-components --> dxos/react-async
dxos/hello-template --> dxos/react-toolkit
dxos/react-toolkit --> dxos/react-async
dxos/react-toolkit --> dxos/react-registry-client
dxos/react-registry-client --> dxos/registry-client
dxos/registry-client --> dxos/config
```

## Dependencies

| Module | Direct |
|---|---|
| [`@dxos/async`](../../../../packages/common/async/docs/README.md) |  |
| [`@dxos/bot-factory-client`](../../../../packages/bot/bot-factory-client/docs/README.md) |  |
| [`@dxos/broadcast`](../../../../packages/mesh/broadcast/docs/README.md) |  |
| [`@dxos/client`](../../../../packages/sdk/client/docs/README.md) | &check; |
| [`@dxos/codec-protobuf`](../../../../packages/common/codec-protobuf/docs/README.md) |  |
| [`@dxos/config`](../../../../packages/sdk/config/docs/README.md) | &check; |
| [`@dxos/credentials`](../../../../packages/halo/credentials/docs/README.md) |  |
| [`@dxos/crypto`](../../../../packages/common/crypto/docs/README.md) |  |
| [`@dxos/debug`](../../../../packages/common/debug/docs/README.md) |  |
| [`@dxos/echo-db`](../../../../packages/echo/echo-db/docs/README.md) |  |
| [`@dxos/echo-protocol`](../../../../packages/echo/echo-protocol/docs/README.md) |  |
| [`@dxos/feed-store`](../../../../packages/echo/feed-store/docs/README.md) |  |
| [`@dxos/log`](../../../../packages/common/log/docs/README.md) |  |
| [`@dxos/mesh-protocol`](../../../../packages/mesh/mesh-protocol/docs/README.md) |  |
| [`@dxos/messaging`](../../../../packages/mesh/messaging/docs/README.md) |  |
| [`@dxos/model-factory`](../../../../packages/echo/model-factory/docs/README.md) |  |
| [`@dxos/network-manager`](../../../../packages/mesh/network-manager/docs/README.md) |  |
| [`@dxos/object-model`](../../../../packages/echo/object-model/docs/README.md) |  |
| [`@dxos/protocol-plugin-presence`](../../../../packages/mesh/protocol-plugin-presence/docs/README.md) |  |
| [`@dxos/protocol-plugin-replicator`](../../../../packages/mesh/protocol-plugin-replicator/docs/README.md) |  |
| [`@dxos/protocol-plugin-rpc`](../../../../packages/mesh/protocol-plugin-rpc/docs/README.md) |  |
| [`@dxos/protocols`](../../../../packages/common/protocols/docs/README.md) |  |
| [`@dxos/random-access-storage`](../../../../packages/common/random-access-storage/docs/README.md) |  |
| [`@dxos/react-async`](../../../../packages/common/react-async/docs/README.md) |  |
| [`@dxos/react-client`](../../../../packages/sdk/react-client/docs/README.md) | &check; |
| [`@dxos/react-components`](../../../../packages/sdk/react-components/docs/README.md) | &check; |
| [`@dxos/react-registry-client`](../../../../packages/sdk/react-registry-client/docs/README.md) |  |
| [`@dxos/react-toolkit`](../../../../packages/sdk/react-toolkit/docs/README.md) | &check; |
| [`@dxos/registry-client`](../../../../packages/sdk/registry-client/docs/README.md) |  |
| [`@dxos/rpc`](../../../../packages/core/mesh/rpc/docs/README.md) |  |
| [`@dxos/rpc-tunnel`](../../../../packages/core/mesh/rpc-tunnel/docs/README.md) |  |
| [`@dxos/util`](../../../../packages/common/util/docs/README.md) |  |