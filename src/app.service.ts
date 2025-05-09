import { Injectable, Logger } from '@nestjs/common';

const chromium = require('chrome-aws-lambda').default || require('chrome-aws-lambda');
const puppeteer = require('puppeteer-core').default || require('puppeteer-core');

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  async generatePdf(htmlContent: string): Promise<Buffer> {
    const headContent = `
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            font-family: Arial, sans-serif;
            color: gray;
            width: 794px;
            min-height: 1123px;
            margin: 0;
            padding: 0;
          }
          h1, h2, h3, h4, h5, h6, p, div {
            margin: 0;
            padding: 0;
          }
        </style>
      </head>
    `;

    const fullHtmlContent = `
      <html>
        ${headContent}
        <body>${htmlContent}</body>
      </html>
    `;

    let browser = null;

    try {
      // Launching browser (either locally or Lambda/Render)
      browser = await puppeteer.launch({
        args: chromium.args,
        executablePath: await chromium.executablePath || undefined,
        headless: chromium.headless,
        defaultViewport: chromium.defaultViewport,
      });

      const page = await browser.newPage();
      await page.setContent(fullHtmlContent, { waitUntil: 'domcontentloaded' });

      // Generating PDF
      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: {
          top: '2mm',
          bottom: '2mm',
          left: '2mm',
          right: '2mm',
        },
      });

      return pdfBuffer;
    } catch (error) {
      this.logger.error('PDF generation error:', error);
      throw new Error('Failed to generate PDF');
    } finally {
      if (browser) await browser.close();
    }
  }
}
