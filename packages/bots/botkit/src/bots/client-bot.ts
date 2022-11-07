//
// Copyright 2021 DXOS.org
//

import debug from 'debug';

import { Client, Party } from '@dxos/client';
import { Stream } from '@dxos/codec-protobuf';
import {
  BotReport,
  BotService,
  InitializeRequest,
  SendCommandRequest,
  SendCommandResponse,
  StartRequest
} from '@dxos/protocols/proto/dxos/bot';

const log = debug('dxos:bot:client-bot');

export class Bot implements BotService {
  protected client: Client | undefined;
  protected party: Party | undefined;
  protected id: string | undefined;

  async initialize(request: InitializeRequest) {
    log('Client bot start initializing');

    this.id = request.id;
    this.client = new Client({ config: request.config });
    log('Client config:', JSON.stringify(request.config));

    log('Client bot initialize');
    await this.client.initialize();
    log('Client bot create profile');
    await this.client.halo.createProfile({ displayName: 'Bot' });

    // if (request.invitation) {
    //   assert(request.invitation.secret, 'Secret must be provided with invitation');
    //   const observer = this.client.echo.acceptInvitation(request.invitation);
    //   observer.subscribe({} as any);
    // }

    log('Client bot onInit');
    await this.onStart(request);
  }

  async start(request: StartRequest) {
    log('Client bot start initilizing');
    this.client = new Client({ config: request.config });

    log('Client bot initialize');
    await this.client.initialize();

    const parties = this.client.echo.queryParties().value;
    if (parties.length === 0) {
      throw new Error('Bot is not in any party');
    }
    this.party = parties[0];

    log('Client bot onInit');
    await this.onStart(request);
  }

  async command(request: SendCommandRequest) {
    const response = await this.onCommand(request);
    return response;
  }

  async stop() {
    await this.client?.destroy();
    await this.onStop();
  }

  startReporting(): Stream<BotReport> {
    return new Stream(({ next, close }) => {
      const report = async () => {
        const partyDetails = await this.party?.getDetails();
        next({ partyDetails });
      };
      void report();
      const intervalHandle = setInterval(report, 1000);
      return () => clearInterval(intervalHandle);
    });
  }

  protected async onStart(request: InitializeRequest) {}
  protected async onCommand(request: SendCommandRequest): Promise<SendCommandResponse> {
    return {};
  }

  protected async onStop() {}
}
