import { Injectable } from '@nestjs/common';
import {normalize} from "@repo/services/string/string";

@Injectable()
export class AppService {
  getHello(): {name: string, normalize: string } {
    const name = 'João';
    return {
      name,
      normalize: normalize(name),
    }
  }
}
