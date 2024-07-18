import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PdfWatcherService } from './pdf-watcher/pdf-watcher.service';

@Module({
  imports: [ConfigModule.forRoot()],
  providers: [PdfWatcherService],
})
export class AppModule {}
