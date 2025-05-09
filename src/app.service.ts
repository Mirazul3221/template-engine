import { Injectable } from '@nestjs/common';
import chromium from 'chrome-aws-lambda';
import * as puppeteer from 'puppeteer-core';
@Injectable()
export class AppService {
  //////////////////////////////////////////////////here the logic for pdf generate/.////////////////////////////////////////
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
        <body>
          ${htmlContent}
        </body>
      </html>
    `;

    const browser = await puppeteer.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath,
      headless: chromium.headless,
      defaultViewport: chromium.defaultViewport,
    });

    const page = await browser.newPage();
    await page.setContent(fullHtmlContent, { waitUntil: 'domcontentloaded' });

    const pdfBuffer = await page.pdf({
      format: 'a4',
      printBackground: true,
      margin: {
        top: '2mm',
        bottom: '2mm',
        left: '2mm',
        right: '2mm',
      },
    });

    await browser.close();
    return pdfBuffer;
  }
}
