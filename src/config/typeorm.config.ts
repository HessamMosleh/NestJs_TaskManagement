import { ConfigService } from '@nestjs/config';

export class TypeormConfig {
  configDb = {
    type: this.configService.get('DATABASE_TYPE'),
    host: 'localhost',
    port: this.configService.get('DATABASE_PORT'),
    username: this.configService.get('DATABASE_USERNAME'),
    password: this.configService.get('DATABASE_PASSWORD'),
    database: this.configService.get('DATABASE_NAME'),
    autoLoadEntities: true,
    synchronize: true,
  };

  constructor(private configService: ConfigService) {}
}
