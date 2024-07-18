import { Injectable, OnModuleInit } from '@nestjs/common';
import * as path from 'path';
import * as chokidar from 'chokidar';
import * as poppler from 'pdf-poppler';
import * as fs from 'fs';

@Injectable()
export class PdfWatcherService implements OnModuleInit {
  private readonly pdfDirectoryPath: string;
  private readonly imagesDirectoryPath: string;

  constructor() {
    const isDevelopment = process.env.NODE_ENV !== 'production';

    this.pdfDirectoryPath = isDevelopment
      ? path.join(__dirname, '..', '..', 'public', 'pdf')
      : path.join(__dirname, '..', '..', '..', 'public', 'pdf');

    this.imagesDirectoryPath = isDevelopment
      ? path.join(__dirname, '..', '..', 'public', 'images')
      : path.join(__dirname, '..', '..', '..', 'public', 'images');
  }

  onModuleInit() {
    this.ensureImagesDirectoryExists();
    this.startWatching();
  }

  ensureImagesDirectoryExists() {
    if (!fs.existsSync(this.imagesDirectoryPath)) {
      fs.mkdirSync(this.imagesDirectoryPath, { recursive: true });
    }
  }

  startWatching() {
    const watcher = chokidar.watch(this.pdfDirectoryPath, { persistent: true });

    watcher.on('add', (filePath) => {
      console.log(`Nuevo archivo detectado: ${filePath}`);
      this.processFile(filePath);
    });

    console.log(`Vigilando el directorio: ${this.pdfDirectoryPath}`);
  }

  async processFile(filePath: string) {
    try {
      const baseFileName = path.basename(filePath, path.extname(filePath));
      const outputDir = this.imagesDirectoryPath;

      const options = {
        format: 'jpeg',
        out_dir: outputDir,
        out_prefix: baseFileName,
        page: null,
      };

      await poppler.convert(filePath, options);

      console.log(`Archivo procesado y convertido: ${filePath}`);
    } catch (error) {
      console.error(`Error al procesar el archivo: ${filePath}`, error);
    }
  }
}
