import { Body, Controller, Post, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'express';


@Controller('user-resume')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('generate-pdf')
  async generatePdf(@Body() body: { html: string }, @Res() res: Response) {
    if (typeof body.html !== 'string') {
      return res.status(400).send('Invalid HTML content');
    }

    try {
      const pdfBuffer = await this.appService.generatePdf(body.html);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename="generated.pdf"');
      res.end(pdfBuffer);
    } catch (error) {
      console.error('PDF generation error:', error);
      res.status(500).send('Failed to generate PDF');
    }
  }
}
