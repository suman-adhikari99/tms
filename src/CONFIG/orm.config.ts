import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export default registerAs('orm.config', (): TypeOrmModuleOptions => {
  return {
    type: 'mongodb',
    // url: 'mongodb+srv://uat:anjan7777@cluster0.xtrr1el.mongodb.net/?retryWrites=true&w=majority', uat ko
    url: process.env.MONGO_URL,
    autoLoadEntities: true,
    synchronize: true,
    ssl: true,
    useUnifiedTopology: true,
    useNewUrlParser: true,
    database: process.env.MONGO_DB,
  };
});
