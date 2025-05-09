import { Injectable } from '@nestjs/common';
import puppeteer from 'puppeteer';

@Injectable()
export class AppService {
  //////////////////////////////////////////////////here the logic for pdf generate/.////////////////////////////////////////
  async generatePdf(htmlContent: string) {
    // Define the dynamic <head> content (you can add styles or meta tags)
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

    // Define the full HTML structure with <html>, <head>, and <body>
    const fullHtmlContent = `
      <html>
        ${headContent}
        <body>
          ${htmlContent}
        </body>
      </html>
    `;
    // Launch Puppeteer and create the PDF
    const browser = await puppeteer.launch({
      defaultViewport: null,
    });
    
    const page = await browser.newPage();

    // Set the page content
    await page.setContent(fullHtmlContent, { waitUntil: 'domcontentloaded' });

    // Generate PDF from the HTML content
    const pdfBuffer = await page.pdf({
      format: 'A4',                  // A4 paper size
      printBackground: true,          // Include background graphics
      margin: {
        top: '2mm',
        bottom: '2mm',
        left: '2mm',
        right: '2mm',
      }
    });
    

    // Close the browser after generating the PDF
    await browser.close();

    return pdfBuffer;
  }
}
