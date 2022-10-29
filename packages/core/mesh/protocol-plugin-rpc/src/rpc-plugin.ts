//
// Copyright 2021 DXOS.org
//

import assert from 'node:assert';

import { Event } from '@dxos/async';
import { log } from '@dxos/log';
import { Extension, Protocol } from '@dxos/mesh-protocol';
import { createProtoRpcPeer, ProtoRpcPeer, ProtoRpcPeerOptions, RpcPort } from '@dxos/rpc';
import { MaybePromise } from '@dxos/util';

type OnConnect = (port: RpcPort, peerId: string) => MaybePromise<(() => MaybePromise<void>) | void>;

type SerializedObject = {
  data: Buffer;
};

type Connection = {
  peer: Protocol;
  cleanup?: () => Promise<void> | void;
  receive: Event<SerializedObject>;
};

/**
 * Protocol plug-in to handle direct RPC connections.
 */
export class RpcPlugin {
  static readonly EXTENSION = 'dxos.mesh.protocol.rpc';

  private readonly _peers: Map<string, Connection> = new Map();

  // prettier-ignore
  constructor(
    private readonly _onConnect: OnConnect
  ) {}

  createExtension(): Extension {
    return new Extension(RpcPlugin.EXTENSION)
      .setHandshakeHandler(this._onPeerConnect.bind(this))
      .setMessageHandler(this._onMessage.bind(this))
      .setCloseHandler(this._onPeerDisconnect.bind(this));
  }

  private async _onPeerConnect(peer: Protocol) {
    const peerId = getPeerId(peer);
    const receive = new Event<SerializedObject>();

    this._peers.set(peerId, { peer, receive });
    const port = await createPort(peer, receive);
    const cleanup = await this._onConnect(port, peerId);

    if (typeof cleanup === 'function') {
      const connection = this._peers.get(peerId);
      connection && (connection.cleanup = cleanup);
    }
  }

  private async _onPeerDisconnect(peer: Protocol) {
    const peerId = getPeerId(peer);
    const connection = this._peers.get(peerId);
    if (connection) {
      await connection.cleanup?.();
      this._peers.delete(peerId);
    }
  }

  private _onMessage(peer: Protocol, data: any) {
    const peerId = getPeerId(peer);
    const connection = this._peers.get(peerId);
    if (connection) {
      connection.receive.emit(data);
    }
  }

  async close() {
    for (const connection of this._peers.values()) {
      await connection.cleanup?.();
      await connection.peer.close();
    }
  }
}

export const getPeerId = (peer: Protocol) => {
  const { peerId } = peer.getSession() ?? {};
  return peerId as string;
};

export const createPort = async (peer: Protocol, receive: Event<SerializedObject>): Promise<RpcPort> => ({
  send: async (msg) => {
    const extension = peer.getExtension(RpcPlugin.EXTENSION);
    assert(extension, 'Extension is not set.');
    await extension.send(msg);
  },

  subscribe: (cb) => {
    const adapterCallback = (obj: SerializedObject) => {
      cb(obj.data);
    };
    receive.on(adapterCallback);
    return () => receive.off(adapterCallback);
  }
});

type CreateRpcPluginOptions<Client> = {
  onOpen?: (peer: ProtoRpcPeer<Client>) => Promise<void>;
  onClose?: () => Promise<void>;
  onError?: (err: Error) => void;
};

/**
 * Creates an RPC plugin with the given handlers.
 * Calls the callback once the connection is established?
 */
// prettier-ignore
export const createRpcPlugin = <Client, Server>(
  rpcOptions: Omit<ProtoRpcPeerOptions<Client, Server>, 'port'>,
  pluginOptions?: CreateRpcPluginOptions<Client>
) => {
  const { onOpen, onClose, onError } = pluginOptions ?? {};
  return new RpcPlugin(async (port) => {
    // TODO(burdon): What does connection mean? Just one peer?
    //  See original comment re handling multiple connections.
    const peer = createProtoRpcPeer({ ...rpcOptions, port });

    try {
      log('opening peer');
      await peer.open();
      await onOpen?.(peer);
    } catch (err: any) {
      if (onError) {
        onError(err);
      } else {
        log.error('RPC failed', err);
      }
    } finally {
      log('closing peer');
      await peer.close();
      await onClose?.();
    }
  });
};
