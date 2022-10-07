# @dxos/lexical-editor

Lexical text editor.

## Dependency Graph

```mermaid
%%{ init: {'flowchart':{'curve':'basis'}} }%%

flowchart LR

%% Classes
classDef def fill:#fff,stroke:#333,stroke-width:1px
classDef root fill:#fff,stroke:#333,stroke-width:4px

%% Nodes

subgraph experimental [experimental]
  style experimental fill:#ecfaeb,stroke:#333
  dxos/lexical-editor("@dxos/lexical-editor"):::root
  click dxos/lexical-editor "dxos/dxos/tree/main/packages/experimental/lexical-editor/docs"
end

subgraph common [common]
  style common fill:#faebee,stroke:#333
  dxos/codec-protobuf("@dxos/codec-protobuf"):::def
  click dxos/codec-protobuf "dxos/dxos/tree/main/packages/common/codec-protobuf/docs"
  dxos/crypto("@dxos/crypto"):::def
  click dxos/crypto "dxos/dxos/tree/main/packages/common/crypto/docs"
  dxos/feed-store("@dxos/feed-store"):::def
  click dxos/feed-store "dxos/dxos/tree/main/packages/common/feed-store/docs"
  dxos/random-access-storage("@dxos/random-access-storage"):::def
  click dxos/random-access-storage "dxos/dxos/tree/main/packages/common/random-access-storage/docs"
  dxos/react-async("@dxos/react-async"):::def
  click dxos/react-async "dxos/dxos/tree/main/packages/common/react-async/docs"

  subgraph _ [ ]
    style _ fill:#faebee,stroke:#333,stroke-dasharray:5 5
    dxos/async("@dxos/async"):::def
    click dxos/async "dxos/dxos/tree/main/packages/common/async/docs"
    dxos/debug("@dxos/debug"):::def
    click dxos/debug "dxos/dxos/tree/main/packages/common/debug/docs"
    dxos/keys("@dxos/keys"):::def
    click dxos/keys "dxos/dxos/tree/main/packages/common/keys/docs"
    dxos/util("@dxos/util"):::def
    click dxos/util "dxos/dxos/tree/main/packages/common/util/docs"
    dxos/log("@dxos/log"):::def
    click dxos/log "dxos/dxos/tree/main/packages/common/log/docs"
    dxos/testutils("@dxos/testutils"):::def
    click dxos/testutils "dxos/dxos/tree/main/packages/common/testutils/docs"
  end
end

subgraph sdk [sdk]
  style sdk fill:#f9faeb,stroke:#333
  dxos/client("@dxos/client"):::def
  click dxos/client "dxos/dxos/tree/main/packages/sdk/client/docs"
  dxos/client-services("@dxos/client-services"):::def
  click dxos/client-services "dxos/dxos/tree/main/packages/sdk/client-services/docs"
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

subgraph core [core]
  style core fill:#faebec,stroke:#333
  dxos/protocols("@dxos/protocols"):::def
  click dxos/protocols "dxos/dxos/tree/main/packages/core/protocols/docs"

  subgraph halo [halo]
    style halo fill:#f1ebfa,stroke:#333
    dxos/credentials("@dxos/credentials"):::def
    click dxos/credentials "dxos/dxos/tree/main/packages/core/halo/credentials/docs"
    dxos/halo-protocol("@dxos/halo-protocol"):::def
    click dxos/halo-protocol "dxos/dxos/tree/main/packages/core/halo/halo-protocol/docs"
    dxos/keyring("@dxos/keyring"):::def
    click dxos/keyring "dxos/dxos/tree/main/packages/core/halo/keyring/docs"
  end

  subgraph mesh [mesh]
    style mesh fill:#ebfaef,stroke:#333
    dxos/mesh-protocol("@dxos/mesh-protocol"):::def
    click dxos/mesh-protocol "dxos/dxos/tree/main/packages/core/mesh/mesh-protocol/docs"
    dxos/messaging("@dxos/messaging"):::def
    click dxos/messaging "dxos/dxos/tree/main/packages/core/mesh/messaging/docs"
    dxos/rpc("@dxos/rpc"):::def
    click dxos/rpc "dxos/dxos/tree/main/packages/core/mesh/rpc/docs"
    dxos/network-manager("@dxos/network-manager"):::def
    click dxos/network-manager "dxos/dxos/tree/main/packages/core/mesh/network-manager/docs"
    dxos/protocol-plugin-presence("@dxos/protocol-plugin-presence"):::def
    click dxos/protocol-plugin-presence "dxos/dxos/tree/main/packages/core/mesh/protocol-plugin-presence/docs"
    dxos/broadcast("@dxos/broadcast"):::def
    click dxos/broadcast "dxos/dxos/tree/main/packages/core/mesh/broadcast/docs"
    dxos/protocol-plugin-replicator("@dxos/protocol-plugin-replicator"):::def
    click dxos/protocol-plugin-replicator "dxos/dxos/tree/main/packages/core/mesh/protocol-plugin-replicator/docs"
    dxos/protocol-plugin-rpc("@dxos/protocol-plugin-rpc"):::def
    click dxos/protocol-plugin-rpc "dxos/dxos/tree/main/packages/core/mesh/protocol-plugin-rpc/docs"
    dxos/rpc-tunnel("@dxos/rpc-tunnel"):::def
    click dxos/rpc-tunnel "dxos/dxos/tree/main/packages/core/mesh/rpc-tunnel/docs"
  end

  subgraph echo [echo]
    style echo fill:#ebf2fa,stroke:#333
    dxos/echo-db("@dxos/echo-db"):::def
    click dxos/echo-db "dxos/dxos/tree/main/packages/core/echo/echo-db/docs"
    dxos/model-factory("@dxos/model-factory"):::def
    click dxos/model-factory "dxos/dxos/tree/main/packages/core/echo/model-factory/docs"
    dxos/object-model("@dxos/object-model"):::def
    click dxos/object-model "dxos/dxos/tree/main/packages/core/echo/object-model/docs"
    dxos/text-model("@dxos/text-model"):::def
    click dxos/text-model "dxos/dxos/tree/main/packages/core/echo/text-model/docs"
  end
end

subgraph bots [bots]
  style bots fill:#ebecfa,stroke:#333
  dxos/bot-factory-client("@dxos/bot-factory-client"):::def
  click dxos/bot-factory-client "dxos/dxos/tree/main/packages/bots/bot-factory-client/docs"
end

%% Links
linkStyle default stroke:#333,stroke-width:1px
dxos/client --> dxos/client-services
dxos/client-services --> dxos/config
dxos/config --> dxos/protocols
dxos/protocols --> dxos/codec-protobuf
dxos/credentials --> dxos/crypto
dxos/credentials --> dxos/feed-store
dxos/credentials --> dxos/mesh-protocol
dxos/mesh-protocol --> dxos/codec-protobuf
dxos/credentials --> dxos/protocols
dxos/client-services --> dxos/echo-db
dxos/echo-db --> dxos/halo-protocol
dxos/halo-protocol --> dxos/keyring
dxos/keyring --> dxos/crypto
dxos/keyring --> dxos/protocols
dxos/keyring --> dxos/random-access-storage
dxos/messaging --> dxos/rpc
dxos/rpc --> dxos/protocols
dxos/model-factory --> dxos/feed-store
dxos/model-factory --> dxos/protocols
dxos/echo-db --> dxos/network-manager
dxos/network-manager --> dxos/credentials
dxos/network-manager --> dxos/messaging
dxos/network-manager --> dxos/protocol-plugin-presence
dxos/protocol-plugin-presence --> dxos/broadcast
dxos/broadcast --> dxos/crypto
dxos/broadcast --> dxos/protocols
dxos/protocol-plugin-presence --> dxos/mesh-protocol
dxos/echo-db --> dxos/object-model
dxos/object-model --> dxos/model-factory
dxos/echo-db --> dxos/protocol-plugin-replicator
dxos/protocol-plugin-replicator --> dxos/keyring
dxos/protocol-plugin-replicator --> dxos/mesh-protocol
dxos/echo-db --> dxos/protocol-plugin-rpc
dxos/protocol-plugin-rpc --> dxos/mesh-protocol
dxos/protocol-plugin-rpc --> dxos/messaging
dxos/client --> dxos/rpc-tunnel
dxos/rpc-tunnel --> dxos/rpc
dxos/lexical-editor --> dxos/react-client
dxos/react-client --> dxos/bot-factory-client
dxos/bot-factory-client --> dxos/protocol-plugin-rpc
dxos/react-client --> dxos/client
dxos/react-client --> dxos/react-async
dxos/lexical-editor --> dxos/react-components
dxos/react-components --> dxos/react-async
dxos/lexical-editor --> dxos/react-toolkit
dxos/react-toolkit --> dxos/react-async
dxos/react-toolkit --> dxos/react-registry-client
dxos/react-registry-client --> dxos/registry-client
dxos/registry-client --> dxos/client
dxos/lexical-editor --> dxos/text-model
dxos/text-model --> dxos/echo-db
```

## Dependencies

| Module | Direct |
|---|---|
| [`@dxos/async`](../../../common/async/docs/README.md) | &check; |
| [`@dxos/bot-factory-client`](../../../bots/bot-factory-client/docs/README.md) |  |
| [`@dxos/broadcast`](../../../core/mesh/broadcast/docs/README.md) |  |
| [`@dxos/client`](../../../sdk/client/docs/README.md) | &check; |
| [`@dxos/client-services`](../../../sdk/client-services/docs/README.md) |  |
| [`@dxos/codec-protobuf`](../../../common/codec-protobuf/docs/README.md) |  |
| [`@dxos/config`](../../../sdk/config/docs/README.md) | &check; |
| [`@dxos/credentials`](../../../core/halo/credentials/docs/README.md) |  |
| [`@dxos/crypto`](../../../common/crypto/docs/README.md) |  |
| [`@dxos/debug`](../../../common/debug/docs/README.md) | &check; |
| [`@dxos/echo-db`](../../../core/echo/echo-db/docs/README.md) |  |
| [`@dxos/feed-store`](../../../common/feed-store/docs/README.md) |  |
| [`@dxos/halo-protocol`](../../../core/halo/halo-protocol/docs/README.md) |  |
| [`@dxos/keyring`](../../../core/halo/keyring/docs/README.md) |  |
| [`@dxos/keys`](../../../common/keys/docs/README.md) |  |
| [`@dxos/log`](../../../common/log/docs/README.md) |  |
| [`@dxos/mesh-protocol`](../../../core/mesh/mesh-protocol/docs/README.md) |  |
| [`@dxos/messaging`](../../../core/mesh/messaging/docs/README.md) |  |
| [`@dxos/model-factory`](../../../core/echo/model-factory/docs/README.md) |  |
| [`@dxos/network-manager`](../../../core/mesh/network-manager/docs/README.md) |  |
| [`@dxos/object-model`](../../../core/echo/object-model/docs/README.md) | &check; |
| [`@dxos/protocol-plugin-presence`](../../../core/mesh/protocol-plugin-presence/docs/README.md) |  |
| [`@dxos/protocol-plugin-replicator`](../../../core/mesh/protocol-plugin-replicator/docs/README.md) |  |
| [`@dxos/protocol-plugin-rpc`](../../../core/mesh/protocol-plugin-rpc/docs/README.md) |  |
| [`@dxos/protocols`](../../../core/protocols/docs/README.md) |  |
| [`@dxos/random-access-storage`](../../../common/random-access-storage/docs/README.md) |  |
| [`@dxos/react-async`](../../../common/react-async/docs/README.md) |  |
| [`@dxos/react-client`](../../../sdk/react-client/docs/README.md) | &check; |
| [`@dxos/react-components`](../../../sdk/react-components/docs/README.md) | &check; |
| [`@dxos/react-registry-client`](../../../sdk/react-registry-client/docs/README.md) |  |
| [`@dxos/react-toolkit`](../../../sdk/react-toolkit/docs/README.md) | &check; |
| [`@dxos/registry-client`](../../../sdk/registry-client/docs/README.md) |  |
| [`@dxos/rpc`](../../../core/mesh/rpc/docs/README.md) |  |
| [`@dxos/rpc-tunnel`](../../../core/mesh/rpc-tunnel/docs/README.md) |  |
| [`@dxos/testutils`](../../../common/testutils/docs/README.md) |  |
| [`@dxos/text-model`](../../../core/echo/text-model/docs/README.md) | &check; |
| [`@dxos/util`](../../../common/util/docs/README.md) |  |