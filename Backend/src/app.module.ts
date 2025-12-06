import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

// Project Modules
import { AdminModule } from './admin/admin.module';
import { AuthModule } from './auth/auth.module';
import { AuthenticationModule } from './authentication/authentication.module';
import { CustomerModule } from './customer/customer.module';
import { CustomerProfileModule } from './customer_profile/customer_profile.module';
import { EmailModule } from './email/email.module';
import { ManagerModule } from './manager/manager.module';
import { OrdersModule } from './orders/orders.module';

@Module({
  imports: [
    // 1️⃣ ConfigModule globally load .env
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env', // fallback চাইলে ['.env.local', '.env']
    }),

    // 2️⃣ TypeOrmModule configure (Postgres)
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('DB_HOST') || 'localhost',
        port: Number(config.get('DB_PORT') ?? 5432),
        username: config.get('DB_USER') || 'postgres',
        password: config.get('DB_PASS') || 'Shahed',
        database: config.get('DB_NAME') || 'laundry',
        autoLoadEntities: true,
        synchronize: true,
        extra: {
          options: '-c timezone=Asia/Dhaka',
        },
      }),
    }),

    // 3️⃣ MailerModule configure (Gmail SMTP or custom)
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        transport: {
          host: config.get('SMTP_HOST') || 'smtp.gmail.com',
          port: Number(config.get('SMTP_PORT') ?? 465),
          secure: config.get('SMTP_SECURE') === 'true', // SSL
          ignoreTLS: config.get('SMTP_IGNORE_TLS') === 'true',
          auth: {
            user: config.get('SMTP_USER') || 'your_email@gmail.com',
            pass: config.get('SMTP_PASS') || 'your_app_password',
          },
        },
        defaults: {
          from: `"${config.get('APP_NAME') || 'Laundry App'}" <${config.get('SMTP_USER')}>`,
        },
      }),
    }),

    // 4️⃣ All feature modules
    CustomerModule,
    CustomerProfileModule,
    AuthenticationModule,
    EmailModule,
    OrdersModule,
    AdminModule,
    ManagerModule,
    AuthModule,
  ],
})
export class AppModule {}
