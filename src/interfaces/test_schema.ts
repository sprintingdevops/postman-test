import {StadiusRequest, StadiusResponse} from '..';

export interface TestSchema {
  name: string;
  url: string;
  request: StadiusRequest;
  response: StadiusResponse;
}
