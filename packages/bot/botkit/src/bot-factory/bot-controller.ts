//
// Copyright 2021 DXOS.org
//

import { ServiceDescriptor } from '@dxos/codec-protobuf';
import { PublicKey } from '@dxos/crypto';
import { createProtocolFactory, NetworkManager, StarTopology } from '@dxos/network-manager';
import { PluginRpc } from '@dxos/protocol-plugin-rpc';
import { createRpcServer, RpcPeer, RpcPort } from '@dxos/rpc';

import { schema } from '../proto/gen';
import { BotFactoryService } from '../proto/gen/dxos/bot';

/**
 * Exposes BotFactoryService for external agents.
 */
export class BotController {
  private readonly _service: ServiceDescriptor<BotFactoryService> = schema.getService('dxos.bot.BotFactoryService');
  private readonly _peers: Map<string, RpcPeer> = new Map();

  constructor (private _botFactory: BotFactoryService, private _networkManager: NetworkManager) {}

  async start (topic: PublicKey): Promise<void> {
    const plugin = new PluginRpc(this._onPeerConnect.bind(this));
    this._networkManager.joinProtocolSwarm({
      topic,
      peerId: topic,
      protocol: createProtocolFactory(
        topic,
        topic,
        [plugin]
      ),
      topology: new StarTopology(topic)
    });
  }

  private async _onPeerConnect (port: RpcPort, peerId: string) {
    const peer = createRpcServer({
      service: this._service,
      handlers: this._botFactory,
      port
    });
    await peer.open();
    this._peers.set(peerId, peer);
    return () => {
      this._peers.delete(peerId);
      peer.close();
    };
  }
}