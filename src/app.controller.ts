import { Body, Controller, Post, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'express';

@Controller('user-resume')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('generate-pdf')
  async generatePdf(@Body() body : { html: string }, @Res() res: Response) {

    // Check if the HTML is a valid string
    if (typeof body.html !== 'string') {
      return res.status(400).send('Invalid HTML content');
    }
    const pdfBuffer = await this.appService.generatePdf(body.html);
    // Set the response headers for PDF download
// Set the response headers for PDF download
res.setHeader('Content-Type', 'application/pdf');
res.setHeader('Content-Disposition', 'attachment; filename="generated.pdf"');
res.end(pdfBuffer);  // Use res.end() to send binary data

  }
}
